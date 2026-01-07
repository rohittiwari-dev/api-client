"use client";

import React, { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Search,
  Plus,
  Webhook as WebhookIcon,
  Copy,
  Trash2,
  MoreHorizontal,
  Activity,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInput,
  useSidebar,
} from "@/components/ui/sidebar";
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
import useWebhookStore from "../store/webhook.store";
import {
  useWebhooks,
  useDeleteWebhook,
  useWebhookEventCount,
} from "../hooks/queries";
import CreateWebhookDialog from "./CreateWebhookDialog";
import type { Webhook } from "../types/webhook.types";

interface WebhookSidebarProps {
  workspaceId: string;
}

const WebhookSidebar: React.FC<WebhookSidebarProps> = ({ workspaceId }) => {
  const router = useRouter();
  const params = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { state } = useSidebar();

  const { activeWebhook, setActiveWebhook, isConnected } = useWebhookStore();

  // Sort by newest first
  const { data: webhooks = [], isLoading } = useWebhooks(workspaceId);
  const sortedWebhooks = useMemo(() => {
    return [...webhooks].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [webhooks]);

  const deleteWebhook = useDeleteWebhook();

  // Filter webhooks based on search
  const filteredWebhooks = useMemo(() => {
    if (!searchQuery.trim()) return sortedWebhooks;
    const query = searchQuery.toLowerCase();
    return sortedWebhooks.filter(
      (w) =>
        w.name.toLowerCase().includes(query) ||
        w.description?.toLowerCase().includes(query) ||
        w.url.toLowerCase().includes(query)
    );
  }, [sortedWebhooks, searchQuery]);

  const handleSelectWebhook = (webhook: Webhook) => {
    setActiveWebhook(webhook);
    router.push(`/workspace/${params.slug}/webhooks/${webhook.url}`);
  };

  const handleCopyUrl = async (webhook: Webhook) => {
    const fullUrl = `${window.location.origin}/api/webhook/${webhook.url}`;
    await navigator.clipboard.writeText(fullUrl);
    toast.success("Webhook URL copied to clipboard");
  };

  const handleDeleteWebhook = async (webhook: Webhook) => {
    if (!confirm(`Delete "${webhook.name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await deleteWebhook.mutateAsync({
        id: webhook.id,
        workspaceId,
      });
      toast.success("Webhook deleted");

      if (activeWebhook?.id === webhook.id) {
        setActiveWebhook(null);
        router.push(`/workspace/${params.slug}/webhooks`);
      }
    } catch {
      toast.error("Failed to delete webhook");
    }
  };

  return (
    <>
      <Sidebar
        collapsible="icon"
        className="border-r border-border bg-background/50 backdrop-blur-3xl"
      >
        <SidebarHeader className="border-b border-border/50 pb-4 pt-3">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-violet-500/10 to-indigo-500/10 border border-violet-500/10 shadow-sm">
                <WebhookIcon className="size-4 text-violet-500" />
              </div>
              <div
                className={cn(
                  "flex flex-col gap-0.5 transition-all duration-300",
                  state === "collapsed" && "opacity-0 w-0 translate-x-[-10px]"
                )}
              >
                <span className="font-semibold text-sm leading-none whitespace-nowrap">
                  Webhooks
                </span>
                <span className="text-[10px] text-muted-foreground font-medium flex items-center gap-1.5">
                  <span
                    className={cn(
                      "size-1.5 rounded-full",
                      isConnected
                        ? "bg-emerald-500 animate-pulse"
                        : "bg-zinc-400"
                    )}
                  />
                  {isConnected ? "Live" : "Connecting..."}
                </span>
              </div>
            </div>

            <div
              className={cn(
                "flex items-center gap-1 transition-opacity duration-300",
                state === "collapsed" && "opacity-0 hidden"
              )}
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-7 hover:bg-violet-500/10 hover:text-violet-500 rounded-lg"
                    onClick={() => setIsCreateOpen(true)}
                  >
                    <Plus className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right" className="text-xs">
                  Create Webhook
                </TooltipContent>
              </Tooltip>
            </div>
          </div>

          {/* Search */}
          <div
            className={cn(
              "mt-3 px-1 transition-all duration-300",
              state === "collapsed" &&
                "opacity-0 h-0 overflow-hidden leading-none"
            )}
          >
            <div className="relative group">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground group-hover:text-violet-500 transition-colors" />
              <SidebarInput
                placeholder="Find webhooks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 pl-8 bg-muted/40 border-transparent hover:bg-muted/60 focus:bg-background focus:border-violet-500/30 transition-all rounded-lg text-xs"
              />
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent className="px-2 py-2">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu className="gap-1">
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="flex flex-col items-center gap-2">
                      <div className="size-5 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
                      {state !== "collapsed" && (
                        <span className="text-xs text-muted-foreground">
                          Loading...
                        </span>
                      )}
                    </div>
                  </div>
                ) : filteredWebhooks.length === 0 ? (
                  <div
                    className={cn(
                      "mx-auto max-w-[200px] py-8 text-center",
                      state === "collapsed" && "hidden"
                    )}
                  >
                    <div className="mx-auto flex size-10 items-center justify-center rounded-full bg-muted/50 mb-3">
                      <Search className="size-5 text-muted-foreground/50" />
                    </div>
                    <p className="text-xs font-medium text-foreground">
                      No webhooks found
                    </p>
                    <p className="mt-1 text-[10px] text-muted-foreground mb-3">
                      {searchQuery
                        ? "Try a different search term"
                        : "Create your first webhook to get started"}
                    </p>
                    {!searchQuery && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs border-dashed w-full hover:border-violet-500/50 hover:bg-violet-500/5 hover:text-violet-600 transition-colors"
                        onClick={() => setIsCreateOpen(true)}
                      >
                        <Plus className="size-3 mr-1.5" />
                        Create New
                      </Button>
                    )}
                  </div>
                ) : (
                  filteredWebhooks.map((webhook) => (
                    <WebhookMenuItem
                      key={webhook.id}
                      webhook={webhook}
                      isActive={activeWebhook?.id === webhook.id}
                      onSelect={() => handleSelectWebhook(webhook)}
                      onCopy={() => handleCopyUrl(webhook)}
                      onDelete={() => handleDeleteWebhook(webhook)}
                    />
                  ))
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter
          className={cn(
            "border-t border-sidebar-border bg-gradient-to-b from-transparent to-background/50",
            state === "collapsed" && "hidden"
          )}
        >
          <div className="p-3">
            <div className="rounded-xl bg-violet-500/5 border border-violet-500/10 p-3 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                <WebhookIcon className="size-12 -rotate-12 transform" />
              </div>
              <p className="text-[10px] font-medium text-violet-600/90 relative z-10 mb-0.5">
                Pro Tip
              </p>
              <p className="text-[10px] text-muted-foreground leading-relaxed relative z-10">
                Use{" "}
                <code className="bg-background/50 px-1 rounded border border-violet-200/20">
                  ?events=true
                </code>{" "}
                on GET requests to fetch history.
              </p>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>

      <CreateWebhookDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        workspaceId={workspaceId}
      />
    </>
  );
};

// Sidebar Item Component
interface WebhookMenuItemProps {
  webhook: Webhook;
  isActive: boolean;
  onSelect: () => void;
  onCopy: () => void;
  onDelete: () => void;
}

const WebhookMenuItem: React.FC<WebhookMenuItemProps> = ({
  webhook,
  isActive,
  onSelect,
  onCopy,
  onDelete,
}) => {
  const { data: eventCount } = useWebhookEventCount(webhook.id);
  const { state } = useSidebar();

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        isActive={isActive}
        onClick={onSelect}
        tooltip={state === "collapsed" ? webhook.name : undefined}
        className={cn(
          "group/item h-auto py-2.5 transition-all duration-200",
          isActive
            ? "bg-violet-500/10 text-violet-600 ring-1 ring-violet-500/20 shadow-sm"
            : "hover:bg-muted/50 hover:text-foreground"
        )}
      >
        <div
          className={cn(
            "flex size-8 shrink-0 items-center justify-center rounded-lg transition-colors",
            isActive
              ? "bg-violet-500 text-white shadow-sm"
              : "bg-muted text-muted-foreground group-hover/item:bg-background group-hover/item:shadow-sm"
          )}
        >
          <WebhookIcon className="size-4" />
        </div>

        <div className="flex-1 min-w-0 flex flex-col gap-0.5">
          <div className="flex items-center justify-between gap-2">
            <span className="font-medium truncate text-xs">{webhook.name}</span>
            {eventCount !== undefined && eventCount > 0 && (
              <Badge
                variant="secondary"
                className={cn(
                  "h-4 min-w-[1.25rem] px-1 text-[9px] justify-center transition-colors",
                  isActive
                    ? "bg-violet-500 text-white shadow-none"
                    : "bg-muted text-muted-foreground group-hover/item:bg-white group-hover/item:shadow-sm dark:group-hover/item:bg-secondary"
                )}
              >
                {eventCount > 99 ? "99+" : eventCount}
              </Badge>
            )}
          </div>
          {webhook.description && (
            <span className="text-[10px] text-muted-foreground truncate opacity-80">
              {webhook.description}
            </span>
          )}
        </div>
      </SidebarMenuButton>

      {/* Actions on hover */}
      <div
        className={cn(
          "absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover/item:opacity-100 transition-all duration-200 flex items-center gap-1",
          state === "collapsed" && "hidden"
        )}
      >
        <div className="flex items-center rounded-lg bg-background shadow-sm border border-border/50 p-0.5 backdrop-blur-sm">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-6 hover:bg-violet-500/10 hover:text-violet-500 rounded-md"
                onClick={(e) => {
                  e.stopPropagation();
                  onCopy();
                }}
              >
                <Copy className="size-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="text-[10px] bg-foreground text-background">
              Copy URL
            </TooltipContent>
          </Tooltip>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-6 hover:bg-muted rounded-md"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="size-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36">
              <DropdownMenuItem
                className="text-destructive focus:text-destructive text-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
              >
                <Trash2 className="size-3.5 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </SidebarMenuItem>
  );
};

export default WebhookSidebar;
