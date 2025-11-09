import {
  CopilotRuntime,
  copilotRuntimeNextJSAppRouterEndpoint,
  GoogleGenerativeAIAdapter,
  LangGraphAgent
} from "@copilotkit/runtime";
import { NextRequest } from "next/server";
 
// You can use any service adapter here for multi-agent support.
const serviceAdapter = new GoogleGenerativeAIAdapter();
 
const remoteEndpointUrl =
  process.env.NEXT_PUBLIC_LANGGRAPH_URL || "http://localhost:8000/copilotkit";

const supabaseJwt =
  process.env.SUPABASE_EDGE_FUNCTION_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_ANON_KEY;

const runtime = new CopilotRuntime({
  remoteEndpoints: [
    {
      url: remoteEndpointUrl,
      headers: supabaseJwt
        ? {
            Authorization: `Bearer ${supabaseJwt}`,
          }
        : undefined,
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