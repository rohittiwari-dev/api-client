"use client";

import React from "react";
import {
  Copy,
  Trash2,
  MoreHorizontal,
  Activity,
  Webhook as WebhookIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useWebhookEventCount } from "../../hooks/queries";
import type { Webhook } from "../../types/webhook.types";

interface WebhookItemProps {
  webhook: Webhook;
  isActive: boolean;
  isCollapsed: boolean;
  onSelect: () => void;
  onCopy: () => void;
  onDelete: () => void;
}

const WebhookItem: React.FC<WebhookItemProps> = ({
  webhook,
  isActive,
  isCollapsed,
  onSelect,
  onCopy,
  onDelete,
}) => {
  const { data: eventCount } = useWebhookEventCount(webhook.id);

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        isActive={isActive}
        onClick={onSelect}
        tooltip={isCollapsed ? webhook.name : undefined}
        className={cn(
          "group/item h-auto py-3 px-3 rounded-xl transition-all duration-300 relative overflow-hidden ring-offset-0 outline-none",
          isActive
            ? "bg-linear-to-r from-violet-500/10 to-fuchsia-500/10 text-foreground shadow-sm border border-violet-500/10"
            : "hover:bg-white/5 hover:text-foreground text-muted-foreground border border-transparent"
        )}
      >
        {/* Active Indicator Glow - Left */}
        {isActive && !isCollapsed && (
          <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-linear-to-b from-violet-500 to-fuchsia-500 shadow-[0_0_12px_rgba(139,92,246,0.8)]" />
        )}

        {/* Icon Container */}
        <div
          className={cn(
            "relative flex size-9 shrink-0 items-center justify-center rounded-lg transition-all duration-300 z-10",
            isActive
              ? "bg-linear-to-br from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-500/25 scale-105"
              : "bg-white/5 border border-white/5 group-hover/item:border-white/10 group-hover/item:bg-white/10 group-hover/item:scale-105 group-hover/item:shadow-sm"
          )}
        >
          <Activity
            className={cn(
              "size-4 transition-transform duration-500",
              isActive && "animate-pulse"
            )}
          />
        </div>

        {/* Text Content */}
        {!isCollapsed && (
          <div className="flex-1 min-w-0 flex flex-col gap-1 z-10 pl-2">
            <div className="flex items-center justify-between gap-2">
              <span
                className={cn(
                  "font-medium truncate text-[13px] tracking-tight transition-colors",
                  isActive
                    ? "text-foreground font-semibold"
                    : "text-muted-foreground group-hover/item:text-foreground"
                )}
              >
                {webhook.name}
              </span>

              {/* Badge */}
              {eventCount !== undefined && eventCount > 0 && (
                <Badge
                  variant="secondary"
                  className={cn(
                    "h-5 min-w-5 px-1.5 text-[9px] justify-center transition-all duration-300 border-0",
                    isActive
                      ? "bg-linear-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/30"
                      : "bg-white/10 text-muted-foreground group-hover/item:bg-white/20 group-hover/item:text-foreground border border-white/5"
                  )}
                >
                  {eventCount > 99 ? "99+" : eventCount}
                </Badge>
              )}
            </div>

            {webhook.description && (
              <span className="text-[10px] text-muted-foreground/50 truncate group-hover/item:text-muted-foreground/80 transition-colors">
                {webhook.description}
              </span>
            )}
          </div>
        )}
      </SidebarMenuButton>

      {/* Hover Actions (Floating) */}
      {!isCollapsed && (
        <div
          className={cn(
            "absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover/item:opacity-100 transition-all duration-200 translate-x-2 group-hover/item:translate-x-0 z-20 pointer-events-none group-hover/item:pointer-events-auto"
          )}
        >
          <div className="flex items-center bg-background/90 backdrop-blur-xl rounded-lg border border-white/10 p-1 shadow-xl gap-0.5">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7 hover:bg-violet-500/20 hover:text-violet-400 rounded-md transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCopy();
                  }}
                >
                  <Copy className="size-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent
                side="top"
                className="text-[10px] bg-foreground text-background font-semibold"
              >
                Copy URL
              </TooltipContent>
            </Tooltip>

            <div className="w-px h-3.5 bg-white/10 mx-0.5" />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7 hover:bg-white/10 rounded-md transition-colors text-muted-foreground hover:text-foreground"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="size-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-40 bg-background/90 backdrop-blur-xl border-white/10 shadow-2xl p-1.5"
              >
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    onCopy();
                  }}
                  className="text-xs font-medium cursor-pointer focus:bg-violet-500/10 focus:text-violet-400 rounded-sm"
                >
                  <Copy className="size-3.5 mr-2" />
                  Copy URL
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/10 my-1" />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive focus:bg-destructive/10 text-xs font-medium cursor-pointer rounded-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                  }}
                >
                  <Trash2 className="size-3.5 mr-2" />
                  Delete Webhook
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      )}
    </SidebarMenuItem>
  );
};

export default WebhookItem;
