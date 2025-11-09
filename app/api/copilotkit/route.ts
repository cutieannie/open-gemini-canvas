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
    },
    {
      name: "stack_analysis_agent",
      description: "Analyze a GitHub repository URL to infer purpose and tech stack (frontend, backend, DB, infra).",
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