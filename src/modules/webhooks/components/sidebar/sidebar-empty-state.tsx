"use client";

import React from "react";
import { Sparkles, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

interface SidebarEmptyStateProps {
  searchQuery: string;
  onOpenCreate: () => void;
}

const SidebarEmptyState: React.FC<SidebarEmptyStateProps> = ({
  searchQuery,
  onOpenCreate,
}) => {
  const { state } = useSidebar();

  return (
    <div
      className={cn(
        "mx-auto max-w-[200px] py-16 text-center px-4",
        state === "collapsed" && "hidden"
      )}
    >
      <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-linear-to-br from-violet-500/10 via-fuchsia-500/5 to-transparent border border-white/10 mb-5 shadow-lg shadow-violet-500/5 group relative overflow-hidden">
        <div className="absolute inset-0 bg-violet-500/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        <Sparkles className="size-7 text-violet-400/80 group-hover:scale-110 transition-transform duration-500" />
      </div>

      <h3 className="text-sm font-semibold text-foreground/90 mb-1">
        {searchQuery ? "No matches found" : "No webhooks yet"}
      </h3>

      <p className="text-[11px] text-muted-foreground/70 mb-5 leading-relaxed">
        {searchQuery
          ? "Try adjusting your search terms"
          : "Create your first endpoint to start receiving events instantly"}
      </p>

      {!searchQuery && (
        <Button
          variant="secondary"
          size="sm"
          className="h-9 text-xs w-full bg-linear-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-500 hover:to-indigo-500 shadow-lg shadow-violet-500/20 border-0 rounded-lg transition-all hover:scale-[1.02]"
          onClick={onOpenCreate}
        >
          <Plus className="size-3.5 mr-1.5" />
          Create Webhook
        </Button>
      )}
    </div>
  );
};

export default SidebarEmptyState;
