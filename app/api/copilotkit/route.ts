import {
  CopilotRuntime,
  copilotRuntimeNextJSAppRouterEndpoint,
  GoogleGenerativeAIAdapter,
} from "@copilotkit/runtime";
import { NextRequest } from "next/server";
 
// Custom system message combining both agent instructions
const SYSTEM_INSTRUCTIONS = `You are a versatile AI assistant with two main capabilities:

1. POST GENERATION (for LinkedIn and X/Twitter):
   - Use proper formatting for each platform
   - LinkedIn posts should be fancy with emojis and professional tone
   - X (Twitter) posts should use hashtags and emojis with a casual, cryptic tone
   - If user asks for LinkedIn only, generate only LinkedIn post (leave X empty)
   - If user asks for X only, generate only X post (leave LinkedIn empty)
   - If platform not specified, generate both
   - Always use the generate_post tool to render final posts
   - Be creative and engaging with current knowledge

2. STACK ANALYSIS (for GitHub repositories):
   - Extract repository owner and name from URLs
   - Analyze tech stack based on patterns and naming
   - Provide insights on: purpose, frontend, backend, database, infrastructure, key files, how to run
   - Give concise, actionable insights in structured format
   
Adapt your response based on the user's request type.`;

const serviceAdapter = new GoogleGenerativeAIAdapter({
  model: "gemini-2.0-flash-exp",
  systemMessage: SYSTEM_INSTRUCTIONS,
});
 
const runtime = new CopilotRuntime();
 
export const POST = async (req: NextRequest) => {
  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime,
    serviceAdapter,
    endpoint: "/api/copilotkit",
  });
 
  return handleRequest(req);
};