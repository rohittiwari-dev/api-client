"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import {
  Search,
  ChevronDown,
  ChevronRight,
  Clock,
  Download,
  Trash2,
  Copy,
  Code,
  FileJson,
  Filter,
  ArrowDownToLine,
  Pause,
  Play,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import { useWebhookEvents, useClearWebhookEvents } from "../hooks/queries";
import type { WebhookEvent } from "../types/webhook.types";

interface WebhookEventViewerProps {
  webhookId: string;
}

const WebhookEventViewer: React.FC<WebhookEventViewerProps> = ({
  webhookId,
}) => {
  const [filter, setFilter] = useState("");
  const [autoScroll, setAutoScroll] = useState(true);
  const [expandedEvents, setExpandedEvents] = useState<string[]>([]);

  const { data: events = [], isLoading } = useWebhookEvents(webhookId);
  const clearEvents = useClearWebhookEvents();

  // Filter events
  const filteredEvents = events.filter((event) => {
    if (!filter) return true;
    const search = filter.toLowerCase();
    return (
      event.method.toLowerCase().includes(search) ||
      JSON.stringify(event.body).toLowerCase().includes(search) ||
      JSON.stringify(event.headers).toLowerCase().includes(search)
    );
  });

  const toggleExpand = (id: string) => {
    setExpandedEvents((prev) =>
      prev.includes(id) ? prev.filter((prevId) => prevId !== id) : [...prev, id]
    );
  };

  const copyToClipboard = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <div className="size-6 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
        <p className="text-xs text-muted-foreground">Loading events...</p>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center border border-dashed border-border rounded-xl p-10 m-4 bg-muted/20">
        <div className="size-12 rounded-full bg-muted flex items-center justify-center mb-4">
          <Clock className="size-6 text-muted-foreground/50" />
        </div>
        <h3 className="text-sm font-semibold">Waiting for events</h3>
        <p className="text-xs text-muted-foreground mt-1 max-w-xs text-center">
          Send a request to your webhook URL to see it appear here in realtime.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background border border-border/50 rounded-xl overflow-hidden shadow-sm">
      {/* Toolbar */}
      <div className="flex items-center gap-2 p-3 border-b border-border/50 bg-muted/20">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <Input
            placeholder="Filter events..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="h-8 pl-8 bg-background border-border/50 text-xs focus-visible:ring-violet-500/30"
          />
        </div>

        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "size-8",
                  autoScroll
                    ? "text-violet-500 bg-violet-500/10"
                    : "text-muted-foreground"
                )}
                onClick={() => setAutoScroll(!autoScroll)}
              >
                {autoScroll ? (
                  <Pause className="size-3.5" />
                ) : (
                  <Play className="size-3.5" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {autoScroll ? "Pause auto-scroll" : "Resume auto-scroll"}
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                onClick={() => clearEvents.mutate(webhookId)}
                disabled={events.length === 0}
              >
                <Trash2 className="size-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Clear log</TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Events List */}
      <ScrollArea className="flex-1 bg-muted/5">
        <div className="flex flex-col">
          {filteredEvents.length === 0 ? (
            <div className="py-12 text-center text-xs text-muted-foreground">
              No events match your filter
            </div>
          ) : (
            filteredEvents.map((event) => (
              <EventItem
                key={event.id}
                event={event}
                isExpanded={expandedEvents.includes(event.id)}
                onToggle={() => toggleExpand(event.id)}
                onCopy={copyToClipboard}
              />
            ))
          )}
        </div>
      </ScrollArea>

      {/* Footer Status */}
      <div className="border-t border-border/50 bg-muted/20 px-3 py-1.5 flex items-center justify-between text-[10px] text-muted-foreground">
        <span>{filteredEvents.length} events</span>
        <span className="flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Listening for new events...
        </span>
      </div>
    </div>
  );
};

// Event Item Component
const EventItem = ({
  event,
  isExpanded,
  onToggle,
  onCopy,
}: {
  event: WebhookEvent;
  isExpanded: boolean;
  onToggle: () => void;
  onCopy: (text: string, label: string) => void;
}) => {
  const methodColors: Record<string, string> = {
    GET: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    POST: "text-violet-500 bg-violet-500/10 border-violet-500/20",
    PUT: "text-orange-500 bg-orange-500/10 border-orange-500/20",
    DELETE: "text-red-500 bg-red-500/10 border-red-500/20",
    PATCH: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
  };

  const methodColor =
    methodColors[event.method.toUpperCase()] ||
    "text-zinc-500 bg-zinc-500/10 border-zinc-500/20";

  return (
    <div className="border-b border-border/40 last:border-0 bg-background hover:bg-muted/30 transition-colors">
      <div
        className="flex items-center gap-3 p-3 cursor-pointer select-none group"
        onClick={onToggle}
      >
        <div className="flex items-center justify-center size-5 text-muted-foreground/50 group-hover:text-foreground transition-colors">
          {isExpanded ? (
            <ChevronDown className="size-4" />
          ) : (
            <ChevronRight className="size-4" />
          )}
        </div>

        <Badge
          variant="secondary"
          className={cn(
            "h-5 px-1.5 font-mono text-[10px] border shadow-none",
            methodColor
          )}
        >
          {event.method}
        </Badge>

        <div className="flex-1 min-w-0 flex items-center gap-2">
          <span className="text-xs font-mono text-muted-foreground truncate opacity-70">
            {event.id.slice(0, 8)}...
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="hidden sm:flex items-center gap-1.5 text-muted-foreground/70">
            <ArrowDownToLine className="size-3" />
            <span>{event.size}B</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Clock className="size-3" />
            <span>{format(new Date(event.createdAt), "HH:mm:ss")}</span>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="px-3 pb-3 pt-0 animate-in slide-in-from-top-2 duration-200">
          <div className="ml-8 border-l border-border/50 pl-4 space-y-4">
            {/* Headers */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Filter className="size-3" /> Headers
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-5 h-5 w-5"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCopy(JSON.stringify(event.headers, null, 2), "Headers");
                  }}
                >
                  <Copy className="size-3" />
                </Button>
              </div>
              <div className="rounded-md border border-border bg-muted/30 p-2 overflow-x-auto">
                <div className="grid grid-cols-[auto,1fr] gap-x-4 gap-y-1 text-xs font-mono">
                  {Object.entries(event.headers || {}).map(([key, value]) => (
                    <React.Fragment key={key}>
                      <span className="text-muted-foreground text-right">
                        {key}:
                      </span>
                      <span className="text-foreground break-all">
                        {String(value)}
                      </span>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>

            {/* Query Params */}
            {event.searchParams &&
              Object.keys(event.searchParams).length > 0 && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <Search className="size-3" /> Query Params
                    </span>
                  </div>
                  <div className="rounded-md border border-border bg-muted/30 p-2 overflow-x-auto">
                    <div className="grid grid-cols-[auto,1fr] gap-x-4 gap-y-1 text-xs font-mono">
                      {Object.entries(event.searchParams).map(
                        ([key, value]) => (
                          <React.Fragment key={key}>
                            <span className="text-muted-foreground text-right">
                              {key}:
                            </span>
                            <span className="text-foreground break-all">
                              {String(value)}
                            </span>
                          </React.Fragment>
                        )
                      )}
                    </div>
                  </div>
                </div>
              )}

            {/* Body */}
            {event.body && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <FileJson className="size-3" /> Body
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-5 h-5 w-5"
                    onClick={(e) => {
                      e.stopPropagation();
                      onCopy(
                        typeof event.body === "string"
                          ? event.body
                          : JSON.stringify(event.body, null, 2),
                        "Body"
                      );
                    }}
                  >
                    <Copy className="size-3" />
                  </Button>
                </div>
                <div className="rounded-md border border-border bg-muted/30 p-0 overflow-hidden">
                  <div className="max-h-[300px] overflow-auto custom-scrollbar p-3">
                    <pre className="text-xs font-mono leading-relaxed">
                      {/* Extremely basic JSON highlighting */}
                      {(() => {
                        const content =
                          typeof event.body === "string"
                            ? event.body
                            : JSON.stringify(event.body, null, 2);
                        return (
                          <span className="text-foreground/90">{content}</span>
                        );
                      })()}
                    </pre>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WebhookEventViewer;
