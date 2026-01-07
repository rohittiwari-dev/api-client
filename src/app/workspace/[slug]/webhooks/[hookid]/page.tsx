"use client";

import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import useWebhookStore from "@/modules/webhooks/store/webhook.store";
import { useWebhooks } from "@/modules/webhooks/hooks/queries";
import { WebhookDetail } from "@/modules/webhooks/components";
import useWorkspaceState from "@/modules/workspace/store";

const WebhookDetailPage = () => {
  const params = useParams();
  const hookId = params.hookid as string; // This is the 'url' slug

  const { activeWorkspace } = useWorkspaceState();
  const { setActiveWebhook } = useWebhookStore();

  // Fetch all webhooks to find the one matching the current URL slug
  const { data: webhooks = [], isLoading } = useWebhooks(
    activeWorkspace?.id || ""
  );

  const matchedWebhook = webhooks.find((w) => w.url === hookId);

  // Sync active webhook for sidebar highlighting
  useEffect(() => {
    if (matchedWebhook) {
      setActiveWebhook(matchedWebhook);
    }
  }, [matchedWebhook, setActiveWebhook]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-3">
          <div className="size-8 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
          <p className="text-sm text-muted-foreground animate-pulse">
            Loading webhook...
          </p>
        </div>
      </div>
    );
  }

  if (!matchedWebhook) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center max-w-md mx-auto p-6 bg-muted/20 rounded-2xl border border-white/5">
          <p className="text-lg font-medium text-foreground">
            Webhook not found
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            The webhook with ID{" "}
            <code className="bg-muted px-1 py-0.5 rounded text-xs">
              {hookId}
            </code>{" "}
            could not be found. It may have been deleted or you don't have
            access.
          </p>
        </div>
      </div>
    );
  }

  return (
    <WebhookDetail
      webhookId={matchedWebhook.id}
      workspaceId={activeWorkspace?.id || ""}
    />
  );
};

export default WebhookDetailPage;
