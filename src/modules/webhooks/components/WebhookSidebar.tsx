"use client";

import React, { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter as ShadcnSidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

import useWebhookStore from "../store/webhook.store";
import { useWebhooks, useDeleteWebhook } from "../hooks/queries";
import CreateWebhookDialog from "./CreateWebhookDialog";
import type { Webhook } from "../types/webhook.types";

// Modularized Components
import SidebarHeader from "./sidebar/sidebar-header";
import SidebarSearch from "./sidebar/sidebar-search";
import WebhookList from "./sidebar/webhook-list";
import SidebarEmptyState from "./sidebar/sidebar-empty-state";
import ProTips from "./sidebar/pro-tips";

interface WebhookSidebarProps {
  workspaceId: string;
}

const WebhookSidebar: React.FC<WebhookSidebarProps> = ({ workspaceId }) => {
  const router = useRouter();
  const params = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { state } = useSidebar();

  const { activeWebhook, setActiveWebhook } = useWebhookStore();
  const deleteWebhook = useDeleteWebhook();

  // Data Fetching & Sorting
  const { data: webhooks = [], isLoading } = useWebhooks(workspaceId);

  const sortedWebhooks = useMemo(() => {
    return [...webhooks].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [webhooks]);

  // Filtering
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

  // Handlers
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
        className="border-r border-white/5 bg-background/40 backdrop-blur-2xl transition-all duration-300 shadow-2xl"
      >
        <SidebarHeader onOpenCreate={() => setIsCreateOpen(true)} />

        <SidebarSearch value={searchQuery} onChange={setSearchQuery} />

        <SidebarContent className="px-2 py-2 scroll-smooth">
          {/* List or Empty State */}
          {!isLoading && filteredWebhooks.length === 0 ? (
            <SidebarEmptyState
              searchQuery={searchQuery}
              onOpenCreate={() => setIsCreateOpen(true)}
            />
          ) : (
            <WebhookList
              webhooks={filteredWebhooks}
              isLoading={isLoading}
              activeWebhookId={activeWebhook?.id}
              onSelect={handleSelectWebhook}
              onCopy={handleCopyUrl}
              onDelete={handleDeleteWebhook}
            />
          )}
        </SidebarContent>

        <ShadcnSidebarFooter
          className={cn(
            "p-0 transparent bg-transparent",
            state === "collapsed" && "hidden"
          )}
        >
          <ProTips />
        </ShadcnSidebarFooter>
      </Sidebar>

      <CreateWebhookDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        workspaceId={workspaceId}
      />
    </>
  );
};

export default WebhookSidebar;
