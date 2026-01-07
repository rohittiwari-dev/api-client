"use client";

import React from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import useWorkspaceState from "@/modules/workspace/store";
import { WebhookSidebar } from "@/modules/webhooks/components";
import WebhookHeader from "@/modules/webhooks/components/WebhookHeader";
import { useWebhookRealtime } from "@/modules/webhooks/hooks/useWebhookRealtime";

const WebhookLayout = ({ children }: { children: React.ReactNode }) => {
  const { activeWorkspace } = useWorkspaceState();

  // Initialize realtime connection
  useWebhookRealtime({
    workspaceId: activeWorkspace?.id || "",
    enabled: !!activeWorkspace?.id,
  });

  return (
    <TooltipProvider>
      <SidebarProvider defaultOpen={true}>
        <div className="flex h-screen w-full overflow-hidden bg-background">
          {/* Sidebar */}
          <WebhookSidebar workspaceId={activeWorkspace?.id || ""} />

          {/* Main Content Area */}
          <SidebarInset className="flex flex-col h-screen overflow-hidden">
            {/* Header */}
            <WebhookHeader />

            {/* Content */}
            <main className="flex-1 overflow-auto bg-background/50">
              {children}
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </TooltipProvider>
  );
};

export default WebhookLayout;
