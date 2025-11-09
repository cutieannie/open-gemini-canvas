import {
  CopilotRuntime,
  copilotRuntimeNextJSAppRouterEndpoint,
  GoogleGenerativeAIAdapter,
  LangGraphAgent,
} from "@copilotkit/runtime";
import { NextRequest } from "next/server";
 
// Use Google Gemini directly with agent definitions
const serviceAdapter = new GoogleGenerativeAIAdapter({
  model: "gemini-2.0-flash-exp",
});
 
const runtime = new CopilotRuntime({
  agents: [
    {
      name: "post_generation_agent",
      description: "An agent that can help with the generation of LinkedIn posts and X posts.",
      instructions: `You are an amazing assistant familiar with LinkedIn and X (Twitter) algorithms. 

RULES:
- Use proper formatting for the post
- LinkedIn posts should be fancy with emojis and professional tone
- X (Twitter) posts should use hashtags and emojis with a casual, cryptic tone
- If user explicitly asks for LinkedIn post only, generate only LinkedIn post (leave X empty)
- If user explicitly asks for X post only, generate only X post (leave LinkedIn empty)
- If user doesn't specify platform, generate both posts
- Always use the generate_post tool to render the final posts
- Be creative and engaging
- Use current knowledge to make posts relevant and timely`,
    },
    {
      name: "stack_analysis_agent",
      description: "Analyze a GitHub repository URL to infer purpose and tech stack (frontend, backend, DB, infra).",
      instructions: `You are a senior software architect analyzing GitHub repositories.

When given a GitHub URL:
1. Extract the repository owner and name from the URL
2. Analyze the tech stack based on file patterns and naming
3. Provide structured insights about:
   - Project purpose
   - Frontend framework (if any)
   - Backend framework (if any)
   - Database type (if mentioned)
   - Infrastructure/deployment approach
   - Key files and their roles
   - How to run the project
   
Provide concise, actionable insights in a structured format.

NOTE: You have limited ability to fetch actual repository contents. Focus on what you can infer from the URL and common patterns.`,
    },
  ],
});
 
export const POST = async (req: NextRequest) => {
  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime,
    serviceAdapter,
    endpoint: "/api/copilotkit",
  });
 
  return handleRequest(req);
};