import { ChatGoogleGenerativeAI } from "npm:@langchain/google-genai@^0.1.0";
import { HumanMessage, SystemMessage, AIMessage } from "npm:@langchain/core@^0.3.0/messages";

const SYSTEM_PROMPT = `You have access to a google_search tool that can help you find current and accurate information. 
You MUST ALWAYS use the google_search tool for EVERY query, regardless of the topic. This is a requirement.

For ANY question you receive, you should:
1. ALWAYS perform a Google Search first
2. Use the search results to provide accurate and up-to-date information
3. Never rely solely on your training data
4. Always search for the most current information available

This applies to ALL types of queries including:
- Technical questions
- Current events
- How-to guides
- Definitions
- Best practices
- Recent developments
- Any information that might have changed

You are REQUIRED to use the google_search tool for every single response. Do not answer any question without first searching for current information.`;

const POST_GENERATION_PROMPT = `
You are an amazing assistant. You are familiar with the LinkedIn and X (Twitter) algorithms. So, you will use generate_post tool to generate the post.

RULES :
- Use proper formatting for the post. 
   - For example, LinkedIn post should be very fancy with emojis
   - For X (Twitter) post, you can use hashtags and emojis. The tone should be little bit casual and crptic.
- If user explicitly asks to generate LinkedIn post, then you should generate only LinkedIn post leaving the X (Twitter) as empty string.
- If user explicitly asks to generate X (Twitter) post, then you should generate only X (Twitter) post leaving the LinkedIn as empty string.
- If user does not specify the platform, then you should generate both the posts.
- Always use the generate_post tool to generate the post.
- While generating the post, you should use the below context to generate the post.

{context}
`;

export const postGenerationGraph = async (state: any, config: any) => {
  const apiKey = Deno.env.get("GOOGLE_API_KEY");
  
  if (!apiKey) {
    throw new Error("GOOGLE_API_KEY not configured");
  }

  const model = new ChatGoogleGenerativeAI({
    model: "gemini-2.0-flash-exp",
    temperature: 1.0,
    maxRetries: 2,
    apiKey,
  });

  const messages = state.messages || [];
  const lastMessage = messages[messages.length - 1];

  // Simple implementation: Generate response with Gemini
  const response = await model.invoke([
    new SystemMessage(SYSTEM_PROMPT),
    new AIMessage("I understand. I will use the google_search tool when needed to provide current and accurate information."),
    ...messages,
  ]);

  return {
    messages: [...messages, response],
  };
};
