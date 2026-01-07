"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Zap, HelpCircle, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import ThemeSwitcher from "@/components/app-ui/theme-switcher";
import UserButton from "@/modules/authentication/components/user-button";
import { useAuthStore } from "@/modules/authentication/store";
import useWebhookStore from "../store/webhook.store";

const WebhookHeader: React.FC = () => {
  const params = useParams();
  const { data: authData } = useAuthStore();
  const { isConnected } = useWebhookStore();

  return (
    <header className="sticky top-0 z-50 w-full h-14 shrink-0">
      {/* Glass Background */}
      <div className="absolute inset-0 bg-background/60 backdrop-blur-xl border-b border-white/5 dark:border-white/5" />

      {/* Subtle Gradient Line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-violet-500/30 to-transparent" />

      <div className="relative flex h-full items-center justify-between gap-4 px-4">
        {/* Left Section - Back & Brand */}
        <div className="flex items-center gap-3">
          {/* Back to Workspace */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="size-8" asChild>
                <Link href={`/workspace/${params.slug}`}>
                  <ArrowLeft className="size-4" />
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Back to Workspace</TooltipContent>
          </Tooltip>

          {/* Divider */}
          <div className="h-4 w-px bg-border/40" />

          {/* Logo */}
          <Link
            href={`/workspace/${params.slug}`}
            className="group flex items-center gap-2.5 font-medium text-foreground transition-all duration-200"
          >
            <div className="relative flex items-center justify-center size-7 rounded-lg bg-linear-to-br from-violet-500/10 via-indigo-500/10 to-transparent border border-white/10 shadow-sm">
              <Image
                src="/logo.png"
                alt="Api Studio"
                width={100}
                height={100}
                priority
                className="relative w-4 h-4 object-contain opacity-90"
              />
            </div>
            <span className="hidden sm:inline-block text-sm font-semibold tracking-wide">
              Api Studio
            </span>
          </Link>

          {/* Divider */}
          <div className="h-4 w-px bg-border/40 hidden sm:block" />

          {/* Webhook Mode Indicator */}
          <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-violet-500/10 border border-violet-500/20">
            <Zap className="size-3.5 text-violet-400" />
            <span className="text-xs font-medium text-violet-300">
              Webhooks
            </span>
            <div
              className={cn(
                "size-1.5 rounded-full",
                isConnected ? "bg-emerald-500 animate-pulse" : "bg-muted"
              )}
            />
          </div>
        </div>

        {/* Center - Feature Info */}
        <div className="flex-1 flex justify-center">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 text-muted-foreground hover:text-foreground"
              >
                <HelpCircle className="size-4" />
                <span className="hidden md:inline">How Webhooks Work</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4" align="center">
              <div className="space-y-3">
                <h4 className="font-semibold text-sm">Webhook Endpoints</h4>
                <div className="space-y-2 text-xs text-muted-foreground">
                  <p>
                    <strong className="text-foreground">Create webhooks</strong>{" "}
                    to generate unique URLs for receiving HTTP requests from any
                    service.
                  </p>
                  <p>
                    <strong className="text-foreground">
                      All HTTP methods
                    </strong>{" "}
                    are supported: GET, POST, PUT, PATCH, DELETE, etc.
                  </p>
                  <p>
                    <strong className="text-foreground">
                      Realtime updates
                    </strong>{" "}
                    - See events appear instantly as they arrive.
                  </p>
                  <p>
                    <strong className="text-foreground">7-day history</strong> -
                    Events are stored for 7 days.
                  </p>
                </div>
                <div className="pt-2 border-t">
                  <p className="text-xs text-muted-foreground">
                    <strong>Tip:</strong> Use{" "}
                    <code className="px-1 py-0.5 rounded bg-muted text-[10px]">
                      ?events=true
                    </code>{" "}
                    on GET requests to retrieve stored events instead of
                    recording.
                  </p>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center gap-2">
          {/* Connection Status */}
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className={cn(
                  "flex items-center gap-1.5 px-2 py-1 rounded-md text-xs",
                  isConnected
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "bg-muted text-muted-foreground"
                )}
              >
                <div
                  className={cn(
                    "size-1.5 rounded-full",
                    isConnected
                      ? "bg-emerald-500 animate-pulse"
                      : "bg-muted-foreground"
                  )}
                />
                <span className="hidden sm:inline">
                  {isConnected ? "Live" : "Offline"}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              {isConnected
                ? "Connected - Events update in realtime"
                : "Disconnected - Reconnecting..."}
            </TooltipContent>
          </Tooltip>

          {/* Divider */}
          <div className="h-4 w-px bg-border/40 mx-1 hidden sm:block" />

          {/* Theme Switcher */}
          <div className="hidden sm:flex items-center">
            <ThemeSwitcher variant="multiple" />
          </div>

          {/* Divider */}
          <div className="h-4 w-px bg-border/40 mx-1 hidden sm:block" />

          {/* User Profile */}
          {authData && (
            <div className="flex items-center">
              <UserButton variant="header" />
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default WebhookHeader;
