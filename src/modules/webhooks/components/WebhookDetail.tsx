"use client";

import React, { useState } from "react";
import {
  Copy,
  Check,
  Trash2,
  ExternalLink,
  MoreHorizontal,
  RefreshCw,
  Terminal,
  Download,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  useWebhook,
  useDeleteWebhook,
  useClearWebhookEvents,
  useWebhookEvents,
} from "../hooks/queries";
import { useRouter } from "next/navigation";
import WebhookEventViewer from "./WebhookEventViewer";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

interface WebhookDetailProps {
  webhookId: string;
  workspaceId: string;
}

const WebhookDetail: React.FC<WebhookDetailProps> = ({
  webhookId,
  workspaceId,
}) => {
  const router = useRouter();
  const { data: webhook, isLoading } = useWebhook(webhookId);
  const { data: events = [] } = useWebhookEvents(webhookId);
  const deleteWebhook = useDeleteWebhook();
  const clearEvents = useClearWebhookEvents();
  const [isCopied, setIsCopied] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!webhook) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        Webhook not found
      </div>
    );
  }

  const fullUrl = `${window.location.origin}/api/webhook/${webhook.url}`;

  const handleCopyUrl = async () => {
    await navigator.clipboard.writeText(fullUrl);
    setIsCopied(true);
    toast.success("Webhook URL copied to clipboard");
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this webhook? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await deleteWebhook.mutateAsync({ id: webhook.id, workspaceId });
      toast.success("Webhook deleted");
      router.push(`/workspace/${workspaceId}/webhooks`);
    } catch {
      toast.error("Failed to delete webhook");
    }
  };

  const handleClearEvents = async () => {
    if (!confirm("Clear all events for this webhook?")) return;
    try {
      await clearEvents.mutateAsync(webhook.id);
      toast.success("Events cleared");
    } catch {
      toast.error("Failed to clear events");
    }
  };

  const handleDownloadEvents = () => {
    if (events.length === 0) {
      toast.error("No events to download");
      return;
    }

    const data = {
      webhook: {
        id: webhook.id,
        name: webhook.name,
        url: fullUrl,
      },
      exportedAt: new Date().toISOString(),
      totalEvents: events.length,
      events: events,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${webhook.name.replace(/\s+/g, "-").toLowerCase()}-events-${
      new Date().toISOString().split("T")[0]
    }.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`Downloaded ${events.length} events`);
  };

  return (
    <ResizablePanelGroup
      orientation="vertical"
      className="flex flex-col h-full bg-background/50"
    >
      {/* Header */}
      <ResizablePanel
        minSize={"2%"}
        maxSize={"37%"}
        className="overflow-hidden border-b border-white/5 dark:border-white/5 bg-linear-to-br from-violet-500/5 via-fuchsia-500/5 to-transparent backdrop-blur-xl sticky top-0 z-10"
      >
        {/* Background decoration */}
        <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
          <Terminal className="size-32 -rotate-12" />
        </div>

        <div className="relative z-10 flex flex-col gap-4 p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Active
                </span>
                <Badge
                  variant="outline"
                  className="text-[10px] font-mono bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20 px-2 py-0.5 rounded-full"
                >
                  ALL METHODS
                </Badge>
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
                {webhook.name}
              </h1>
              <p className="text-muted-foreground max-w-2xl">
                {webhook.description || "No description provided"}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 gap-2 bg-background/50 border-white/10 dark:border-white/10 hover:bg-background/80"
                    onClick={() => window.open(fullUrl, "_blank")}
                  >
                    <ExternalLink className="size-3.5" />
                    <span className="hidden sm:inline">Open URL</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Open webhook URL in browser</TooltipContent>
              </Tooltip>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="size-9 bg-background/50 border-white/10 dark:border-white/10 hover:bg-background/80"
                  >
                    <MoreHorizontal className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="bg-background/80 backdrop-blur-xl border-white/10 dark:border-white/10"
                >
                  <DropdownMenuItem
                    onClick={handleDownloadEvents}
                    className="cursor-pointer"
                  >
                    <Download className="size-4 mr-2" />
                    Download Events
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleClearEvents}
                    className="cursor-pointer"
                  >
                    <RefreshCw className="size-4 mr-2" />
                    Clear Events
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive cursor-pointer"
                    onClick={handleDelete}
                  >
                    <Trash2 className="size-4 mr-2" />
                    Delete Webhook
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* URL Bar */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-background/40 backdrop-blur-sm border border-white/5 dark:border-white/5 shadow-sm">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-violet-500/10 border border-violet-500/20">
              <Terminal className="size-5 text-violet-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground font-medium mb-0.5">
                Webhook Endpoint
              </p>
              <code className="font-mono text-sm text-foreground truncate block">
                {fullUrl}
              </code>
            </div>
            <Button
              size="sm"
              className={cn(
                "shrink-0 shadow-lg transition-all min-w-[100px]",
                isCopied
                  ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/20"
                  : "bg-violet-600 hover:bg-violet-500 text-white shadow-violet-500/20 hover:shadow-violet-500/30"
              )}
              onClick={handleCopyUrl}
            >
              {isCopied ? (
                <>
                  <Check className="size-3.5 mr-1.5" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="size-3.5 mr-1.5" />
                  Copy URL
                </>
              )}
            </Button>
          </div>
        </div>
      </ResizablePanel>
      <ResizableHandle />
      {/* Main Content - Events Viewer */}
      <ResizablePanel className="flex-1 overflow-hidden p-3">
        <WebhookEventViewer webhookId={webhook.id} webhookName={webhook.name} />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default WebhookDetail;
