/// <reference types="https://deno.land/x/types/index.d.ts" />

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { postGenerationGraph } from "./agents/post-generator.ts";
import { stackAnalysisGraph } from "./agents/stack-analyzer.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    
    // Handle /info endpoint for CopilotKit metadata
    if (url.pathname.endsWith('/info')) {
      return new Response(JSON.stringify({
        agents: [
          {
            name: "post_generation_agent",
            description: "An agent that can help with the generation of LinkedIn posts and X posts."
          },
          {
            name: "stack_analysis_agent",
            description: "Analyze a GitHub repository URL to infer purpose and tech stack (frontend, backend, DB, infra)."
          }
        ]
      }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const { messages, agent } = body;

    // Route to appropriate agent based on request
    let result;
    if (agent === "stack_analysis_agent") {
      result = await stackAnalysisGraph({ messages }, {});
    } else {
      // Default to post generation agent
      result = await postGenerationGraph({ messages }, {});
    }

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
