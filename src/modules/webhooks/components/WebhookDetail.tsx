"use client";

import React from "react";
import { format } from "date-fns";
import {
  Copy,
  Trash2,
  ExternalLink,
  MoreHorizontal,
  RefreshCw,
  Settings,
  Terminal,
  Clock,
  CheckCircle2,
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  useWebhook,
  useDeleteWebhook,
  useClearWebhookEvents,
} from "../hooks/queries";
import { useRouter } from "next/navigation";
import WebhookEventViewer from "./WebhookEventViewer";

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
  const deleteWebhook = useDeleteWebhook();
  const clearEvents = useClearWebhookEvents();

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
    toast.success("Webhook URL copied to clipboard");
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

  return (
    <div className="flex flex-col h-full bg-background/50">
      {/* Header */}
      <div className="border-b border-border/50 bg-background/50 backdrop-blur-xl sticky top-0 z-10">
        <div className="flex flex-col gap-4 p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold tracking-tight">
                  {webhook.name}
                </h1>
                <Badge
                  variant="outline"
                  className="text-[10px] font-mono bg-violet-500/10 text-violet-500 border-violet-500/20 px-2 py-0.5 rounded-full"
                >
                  POST, GET, PUT...
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground truncate max-w-2xl">
                {webhook.description || "No description provided"}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 gap-2"
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
                  <Button variant="outline" size="icon" className="size-9">
                    <MoreHorizontal className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleClearEvents}>
                    <RefreshCw className="size-4 mr-2" />
                    Clear Events
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
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
          <div className="relative group">
            <div className="absolute inset-0 bg-linear-to-r from-violet-500/20 via-fuchsia-500/20 to-transparent rounded-lg blur-sm opacity-50 group-hover:opacity-100 transition-opacity" />
            <div className="relative flex items-center gap-2 bg-background border border-border rounded-lg p-1 pr-2 shadow-sm">
              <div className="flex items-center justify-center size-8 rounded bg-muted/50 border border-white/5 font-mono text-xs text-muted-foreground font-bold shrink-0">
                URL
              </div>
              <code className="flex-1 font-mono text-xs sm:text-sm text-foreground overflow-x-auto whitespace-nowrap px-2 scrollbar-none">
                {fullUrl}
              </code>
              <Button
                size="sm"
                className="h-7 shrink-0 bg-violet-600 hover:bg-violet-500 text-white shadow-md shadow-violet-500/20"
                onClick={handleCopyUrl}
              >
                <Copy className="size-3.5 mr-1.5" />
                Copy
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Tabs */}
        <div className="px-6 pb-0">
          <Tabs defaultValue="events" className="w-full">
            <TabsList className="bg-transparent border-b border-border/50 w-full justify-start rounded-none h-auto p-0 gap-6">
              <TabsTrigger
                value="events"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-violet-500 data-[state=active]:text-violet-500 pb-3 -mb-px px-0 transition-all font-medium"
              >
                Events Log
              </TabsTrigger>
              <TabsTrigger
                value="setup"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-violet-500 data-[state=active]:text-violet-500 pb-3 -mb-px px-0 transition-all font-medium"
              >
                Integration Guide
              </TabsTrigger>
            </TabsList>

            {/* Content for tabs would be handled below, but for now we just show events essentially */}
          </Tabs>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden p-6">
        <Tabs defaultValue="events" className="h-full flex flex-col">
          {/* We reuse the list from above but keep state here implicitly by matching value */}

          <TabsContent
            value="events"
            className="h-full mt-0 data-[state=active]:flex flex-col min-h-0"
          >
            <WebhookEventViewer webhookId={webhook.id} />
          </TabsContent>

          <TabsContent value="setup" className="h-full mt-0 overflow-y-auto">
            <div className="max-w-3xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Terminal className="size-5 text-violet-500" />
                  Quick Start
                </h2>
                <div className="rounded-xl border border-border bg-black/40 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-white/5">
                    <span className="text-xs text-muted-foreground font-mono">
                      cURL Test
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-6 h-6 w-6"
                      onClick={() =>
                        navigator.clipboard.writeText(
                          `curl -X POST ${fullUrl} -H "Content-Type: application/json" -d '{"hello": "world"}'`
                        )
                      }
                    >
                      <Copy className="size-3" />
                    </Button>
                  </div>
                  <pre className="p-4 text-xs font-mono text-muted-foreground overflow-x-auto">
                    <span className="text-violet-400">curl</span> -X POST{" "}
                    {fullUrl} \<br />
                    &nbsp;&nbsp;-H{" "}
                    <span className="text-emerald-400">
                      &quot;Content-Type: application/json&quot;
                    </span>{" "}
                    \<br />
                    &nbsp;&nbsp;-d{" "}
                    <span className="text-amber-400">
                      &apos;{"{"}&quot;hello&quot;: &quot;world&quot;{"}"}&apos;
                    </span>
                  </pre>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Settings className="size-5 text-violet-500" />
                  Implementation Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-muted/20 border border-border">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="size-4 text-emerald-500" />
                      <span className="font-semibold text-sm">
                        Valid Responses
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      The endpoint will always return a <code>200 OK</code>{" "}
                      status code unless there is a system failure. This ensures
                      your webhook sender considers the delivery successful.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/20 border border-border">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="size-4 text-blue-500" />
                      <span className="font-semibold text-sm">
                        Retention Policy
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Events are stored for 7 days. Older events are
                      automatically purged. Realtime events are ephemeral and
                      pushed via WebSocket.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default WebhookDetail;
