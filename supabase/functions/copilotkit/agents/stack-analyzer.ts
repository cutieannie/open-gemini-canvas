import { ChatGoogleGenerativeAI } from "npm:@langchain/google-genai@^0.1.0";
import { HumanMessage, SystemMessage } from "npm:@langchain/core@^0.3.0/messages";

interface RepositoryContext {
  owner: string;
  repo: string;
  repoInfo: any;
  languages: Record<string, number>;
  readme: string;
  rootFiles: string[];
  manifests: Record<string, string>;
}

// Parse GitHub URL
function parseGitHubUrl(url: string): { owner: string; repo: string } | null {
  const pattern =
    /https?:\/\/github\.com\/(?<owner>[A-Za-z0-9_.-]+)\/(?<repo>[A-Za-z0-9_.-]+)/;
  const match = url.match(pattern);
  if (!match || !match.groups) return null;
  return { owner: match.groups.owner, repo: match.groups.repo };
}

// Fetch GitHub data
async function fetchGitHubContext(
  owner: string,
  repo: string
): Promise<RepositoryContext | null> {
  const token = Deno.env.get("GITHUB_TOKEN");
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    // Fetch repository info
    const repoResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}`,
      { headers }
    );
    if (!repoResponse.ok) return null;
    const repoInfo = await repoResponse.json();

    // Fetch languages
    const langResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/languages`,
      { headers }
    );
    const languages = langResponse.ok ? await langResponse.json() : {};

    // Fetch README
    let readme = "";
    const readmeResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/readme`,
      { headers }
    );
    if (readmeResponse.ok) {
      const readmeData = await readmeResponse.json();
      if (readmeData.content) {
        readme = atob(readmeData.content);
      }
    }

    // Fetch root files
    const contentsResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/`,
      { headers }
    );
    const contents = contentsResponse.ok ? await contentsResponse.json() : [];
    const rootFiles = contents.map(
      (item: any) => `${item.name} (${item.type})`
    );

    // Fetch key manifest files
    const manifestNames = [
      "package.json",
      "requirements.txt",
      "pyproject.toml",
      "go.mod",
      "Cargo.toml",
    ];
    const manifests: Record<string, string> = {};

    for (const name of manifestNames) {
      const item = contents.find((i: any) => i.name === name);
      if (item?.download_url) {
        try {
          const manifestResponse = await fetch(item.download_url);
          if (manifestResponse.ok) {
            manifests[name] = (await manifestResponse.text()).substring(
              0,
              2000
            );
          }
        } catch {
          // Skip if fetch fails
        }
      }
    }

    return {
      owner,
      repo,
      repoInfo,
      languages,
      readme: readme.substring(0, 8000),
      rootFiles,
      manifests,
    };
  } catch (error) {
    console.error("Error fetching GitHub context:", error);
    return null;
  }
}

// Build analysis prompt
function buildAnalysisPrompt(context: RepositoryContext): string {
  return `You are a senior software architect. Analyze the following GitHub repository at a high level.
Goals: Provide a concise, structured overview of what the project does and the tech stack.

Return JSON with keys: purpose, frontend, backend, database, infrastructure, ci_cd, key_root_files, how_to_run, risks_notes.

Repository metadata:
${JSON.stringify(context.repoInfo, null, 2)}

Languages (bytes of code):
${JSON.stringify(context.languages, null, 2)}

Root items:
${JSON.stringify(context.rootFiles, null, 2)}

Manifests (truncated to first 2000 chars each):
${JSON.stringify(context.manifests, null, 2)}

README content (truncated to first 8000 chars):
${context.readme}

Infer the stack with specific frameworks and libraries when possible (e.g., Next.js, Express, FastAPI, Prisma, Postgres).`;
}

export const stackAnalysisGraph = async (state: any, config: any) => {
  const apiKey = Deno.env.get("GOOGLE_API_KEY");

  if (!apiKey) {
    throw new Error("GOOGLE_API_KEY not configured");
  }

  const messages = state.messages || [];
  const lastMessage = messages[messages.length - 1];
  const userContent = lastMessage?.content || "";

  // Parse GitHub URL
  const parsed = parseGitHubUrl(userContent);
  if (!parsed) {
    return {
      messages: [
        ...messages,
        {
          role: "assistant",
          content: "Please provide a valid GitHub URL to analyze.",
        },
      ],
    };
  }

  // Fetch GitHub context
  const context = await fetchGitHubContext(parsed.owner, parsed.repo);
  if (!context) {
    return {
      messages: [
        ...messages,
        {
          role: "assistant",
          content: "Unable to fetch repository data. Please check the URL and try again.",
        },
      ],
    };
  }

  // Analyze with Gemini
  const model = new ChatGoogleGenerativeAI({
    model: "gemini-2.0-flash-exp",
    temperature: 0.4,
    maxRetries: 2,
    apiKey,
  });

  const prompt = buildAnalysisPrompt(context);
  const systemInstructions = `You are a senior software architect. Analyze the repository context provided by the user. 
Provide a structured JSON response with the following keys: purpose, frontend, backend, database, infrastructure, ci_cd, key_root_files, how_to_run, risks_notes.`;

  const response = await model.invoke([
    new SystemMessage(systemInstructions),
    new HumanMessage(prompt),
  ]);

  return {
    messages: [...messages, response],
  };
};
