"use client";

import React, { useState, useEffect } from "react";
import {
  Command,
  Activity,
  Search,
  Zap,
  Copy,
  Webhook as WebhookIcon,
  Sparkles,
  Lightbulb,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const PRO_TIPS = [
  {
    icon: Command,
    text: (
      <>
        Append{" "}
        <code className="bg-background/80 backdrop-blur px-1.5 py-0.5 rounded text-[10px] border border-border/50 dark:border-white/10 text-foreground font-mono shadow-sm">
          ?events=true
        </code>{" "}
        to retrieve history.
      </>
    ),
  },
  {
    icon: Activity,
    text: "Webhooks are retained for 7 days. Use specific event IDs to debug complex flows.",
  },
  {
    icon: Search,
    text: "Search events by Method, JSON body, or Headers using the toolbar filter.",
  },
  {
    icon: Zap,
    text: "Click 'Play' in the event viewer to auto-scroll to incoming realtime events.",
  },
  {
    icon: Copy,
    text: "Hover over list items to quickly Copy URL or Delete without opening details.",
  },
  {
    icon: WebhookIcon,
    text: "All HTTP methods (GET, POST, PUT, DELETE, PATCH) are fully supported.",
  },
  {
    icon: Sparkles,
    text: "Realtime updates use WebSocket connections for instant sub-millisecond delivery.",
  },
];

const ProTips = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Defer state update to next tick to avoid synchronous setState warning
    const timer = setTimeout(() => {
      setMounted(true);
      // Randomize on mount
      setCurrentIndex(Math.floor(Math.random() * PRO_TIPS.length));
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return null;

  const currentTip = PRO_TIPS[currentIndex];
  const TipIcon = currentTip.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="p-3 bg-linear-to-t from-background via-background/80 to-transparent"
    >
      <div className="rounded-xl bg-linear-to-br from-violet-50/50 to-fuchsia-50/50 dark:from-violet-500/10 dark:via-fuchsia-500/5 dark:to-transparent border border-violet-200/50 dark:border-white/5 p-4 relative overflow-hidden group hover:border-violet-300/50 dark:hover:border-violet-500/20 transition-all duration-500 backdrop-blur-md shadow-sm dark:shadow-md dark:shadow-black/5">
        {/* Abstract Background Shape */}
        <div className="absolute -top-6 -right-6 size-24 bg-violet-500/5 dark:bg-violet-500/10 rounded-full blur-2xl group-hover:bg-violet-500/10 dark:group-hover:bg-violet-500/20 transition-colors duration-700" />

        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
          <TipIcon className="size-12 -rotate-12 transform text-violet-600 dark:text-violet-500 blur-[1px]" />
        </div>

        <div className="relative z-10 flex flex-col gap-2.5">
          <div className="flex items-center gap-2 text-violet-600 dark:text-violet-400">
            <div className="p-1 rounded bg-violet-100/50 dark:bg-violet-500/10 border border-violet-200/50 dark:border-violet-500/10">
              <Lightbulb className="size-3 fill-violet-500/20" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-violet-600/90 dark:text-violet-300/90">
              Pro Tip
            </span>
          </div>

          <AnimatePresence mode="wait">
            <motion.p
              key={currentIndex}
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 5 }}
              transition={{ duration: 0.3 }}
              className="text-[11px] text-muted-foreground leading-relaxed pr-2 font-medium"
            >
              {currentTip.text}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default ProTips;
