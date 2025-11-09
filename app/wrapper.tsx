"use client"
import { CopilotKit } from "@copilotkit/react-core";
import { useLayout } from "./contexts/LayoutContext";

export default function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <CopilotKit runtimeUrl="/api/copilotkit">
      {children}
    </CopilotKit>
  )
}