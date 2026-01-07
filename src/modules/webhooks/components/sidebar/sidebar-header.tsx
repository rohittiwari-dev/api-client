"use client";

import React from "react";
import { Plus, Webhook as WebhookIcon } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  SidebarHeader as ShadcnSidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import useWebhookStore from "../../store/webhook.store";

interface SidebarHeaderProps {
  onOpenCreate: () => void;
}

const SidebarHeader: React.FC<SidebarHeaderProps> = ({ onOpenCreate }) => {
  const { state } = useSidebar();
  const { isConnected } = useWebhookStore();

  return (
    <ShadcnSidebarHeader className="border-b border-white/5 pb-4 pt-4 px-4 bg-transparent z-10">
      <div className="flex items-center justify-between">
        <motion.div
          className="flex items-center gap-3 overflow-hidden"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="relative flex size-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-violet-600/20 to-fuchsia-600/20 border border-white/10 shadow-lg shadow-violet-500/10 backdrop-blur-md group cursor-pointer overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-tr from-violet-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <motion.div
              whileHover={{ rotate: 15, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <WebhookIcon className="size-5 text-violet-400 group-hover:text-violet-300 transition-colors" />
            </motion.div>
          </div>

          <div
            className={cn(
              "flex flex-col gap-0.5 transition-all duration-300",
              state === "collapsed" && "opacity-0 w-0 translate-x-[-10px]"
            )}
          >
            <span className="font-bold text-sm leading-none tracking-tight text-foreground/90">
              Webhooks
            </span>
            <div className="flex items-center gap-1.5">
              <span
                className={cn(
                  "size-1.5 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.5)] transition-colors duration-500",
                  isConnected
                    ? "bg-emerald-400 shadow-emerald-500/50 animate-pulse"
                    : "bg-zinc-500/50"
                )}
              />
              <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                {isConnected ? "Live" : "Connecting"}
              </span>
            </div>
          </div>
        </motion.div>

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
                className="size-8 rounded-lg hover:bg-violet-500/10 hover:text-violet-400 border border-transparent hover:border-violet-500/20 transition-all duration-300"
                onClick={onOpenCreate}
              >
                <Plus className="size-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent
              side="bottom"
              className="text-xs font-medium bg-background/90 backdrop-blur border-white/10"
            >
              New Endpoint
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </ShadcnSidebarHeader>
  );
};

export default SidebarHeader;
