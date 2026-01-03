"use client";

import React from "react";
import {
  Plus,
  Import,
  Globe,
  Zap,
  LayoutTemplate,
  ArrowRight,
  Search,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import useRequestSyncStoreState from "@/modules/requests/hooks/requestSyncStore";
import { createId } from "@paralleldrive/cuid2";

const WorkspaceEmptyState = () => {
  const { openRequest, activeWorkspace } = useRequestSyncStoreState();

  const handleCreateRequest = () => {
    const newId = createId();
    openRequest({
      id: newId,
      name: "New Request",
      method: "GET",
      url: "",
      headers: [],
      parameters: [],
      body: {
        raw: "",
        formData: [],
        urlEncoded: [],
        file: null,
        json: {},
      },
      bodyType: "NONE",
      auth: { type: "NONE" },
      type: "API",
      workspaceId: activeWorkspace?.id || "",
      collectionId: null,
      savedMessages: [],
      sortOrder: 0,
      unsaved: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      description: null,
      messageType: null,
    });
  };

  const quickActions = [
    {
      icon: Plus,
      title: "New Request",
      description: "Start a fresh API request",
      onClick: handleCreateRequest,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      border: "group-hover:border-blue-500/30",
    },
    {
      icon: Import,
      title: "Import",
      description: "From cURL, Postman",
      onClick: () => {}, // TODO: Implement import
      color: "text-orange-500",
      bg: "bg-orange-500/10",
      border: "group-hover:border-orange-500/30",
    },
    {
      icon: LayoutTemplate,
      title: "New Collection",
      description: "Organize your requests",
      onClick: () => {}, // TODO
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      border: "group-hover:border-purple-500/30",
    },
  ];

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="flex-1 w-full flex flex-col items-center justify-center relative overflow-hidden bg-muted/5">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[100px]" />
        <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] rounded-full bg-blue-500/5 blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="z-10 w-full max-w-2xl px-8 flex flex-col gap-12"
      >
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
            {getTimeGreeting()}
          </h1>
          <p className="text-muted-foreground text-sm">
            Ready to build something active?
          </p>
        </div>

        {/* Main Search/Action Bar - Mockup for now */}
        <div className="relative group w-full max-w-lg mx-auto">
          <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative flex items-center bg-background/50 backdrop-blur-xl border border-border/40 rounded-full shadow-lg p-1.5 pr-2 transition-all duration-300 group-hover:border-primary/30 group-hover:shadow-primary/5">
            <div className="pl-4 pr-3 text-muted-foreground">
              <Search className="size-5" />
            </div>
            <input
              type="text"
              placeholder="Search requests, collections, or docs..."
              className="flex-1 bg-transparent border-none outline-none text-sm h-9 placeholder:text-muted-foreground/60"
            />
            <kbd className="hidden sm:inline-flex h-6 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <span className="text-xs">⌘</span>K
            </kbd>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action, i) => (
            <motion.button
              key={action.title}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              onClick={action.onClick}
              className={cn(
                "group flex flex-col items-start p-4 rounded-xl border border-border/40 bg-background/40 backdrop-blur-sm",
                "hover:bg-background/60 transition-all duration-300",
                "text-left outline-none focus-visible:ring-2 ring-primary/20",
                action.border
              )}
            >
              <div
                className={cn(
                  "p-2.5 rounded-lg mb-3 transition-colors",
                  action.bg,
                  action.color
                )}
              >
                <action.icon className="size-5" />
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-sm">{action.title}</h3>
                <p className="text-xs text-muted-foreground">
                  {action.description}
                </p>
              </div>

              <div className="mt-4 w-full flex justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <ArrowRight className="size-3.5 text-muted-foreground group-hover:text-foreground" />
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Footer Info */}
      <div className="absolute bottom-6 flex items-center gap-6 text-xs text-muted-foreground/40">
        <div className="flex items-center gap-1.5">
          <Globe className="size-3" />
          <span>Connected</span>
        </div>
        <div className="w-1 h-1 rounded-full bg-border" />
        <div>v1.0.0</div>
      </div>
    </div>
  );
};

export default WorkspaceEmptyState;
