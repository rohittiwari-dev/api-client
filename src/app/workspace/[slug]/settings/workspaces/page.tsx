"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Layers,
  MoreHorizontal,
  Trash2,
  ExternalLink,
  Users,
  FileText,
  Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import useWorkspaceState from "@/modules/workspace/store";
import { useRouter } from "next/navigation";
import { useUnsavedChangesGuard } from "@/modules/requests/hooks/useUnsavedChangesGuard";
import UnsavedChangesDialog from "@/modules/requests/components/UnsavedChangesDialog";
import WorkspaceSetup from "@/modules/workspace/components/workspace-setup";

export default function AllWorkspacesPage() {
  const router = useRouter();
  const { activeWorkspace, workspaces, setActiveWorkspace } =
    useWorkspaceState();

  const [workspaceSetupModalOpen, setWorkspaceSetupModalOpen] = useState(false);

  const unsavedGuard = useUnsavedChangesGuard();

  const performWorkspaceSwitch = (workspace: typeof activeWorkspace) => {
    if (workspace) {
      setActiveWorkspace(workspace);
      router.push(`/workspace/${workspace.slug}`);
    }
  };

  const handleSwitchWorkspace = (workspace: typeof activeWorkspace) => {
    if (!workspace || workspace.id === activeWorkspace?.id) return;
    unsavedGuard.confirmWorkspaceSwitch(() => {
      performWorkspaceSwitch(workspace);
    });
  };

  const handleDeleteWorkspace = async (workspaceId: string) => {
    toast.info("Workspace deletion coming soon");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">
            All Workspaces
          </h2>
          <p className="text-muted-foreground mt-1">
            Manage all your workspaces and switch between them
          </p>
        </div>

        <Button
          className="gap-2"
          onClick={() => setWorkspaceSetupModalOpen(true)}
        >
          <Plus className="size-4" />
          New Workspace
        </Button>
      </div>

      <Separator />

      {/* Workspaces List */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground">
          {workspaces?.length || 1} Workspace
          {(workspaces?.length || 1) > 1 ? "s" : ""}
        </h3>

        <div className="grid gap-3">
          {/* Current/Active Workspace */}
          {activeWorkspace && (
            <div className="relative p-4 rounded-xl border-2 border-primary/30 bg-primary/5">
              <div className="absolute top-3 right-3">
                <Badge className="bg-primary/20 text-primary border-0">
                  Active
                </Badge>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-primary/20">
                  <Layers className="size-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-lg font-semibold">
                    {activeWorkspace.name}
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    /{activeWorkspace.slug}
                  </p>
                  <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="size-3" />
                      {(activeWorkspace as any).members?.length || 1} member
                      {((activeWorkspace as any).members?.length || 1) > 1
                        ? "s"
                        : ""}
                    </span>
                    <span className="flex items-center gap-1">
                      <FileText className="size-3" />
                      Requests
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Other Workspaces */}
          {workspaces
            ?.filter((w) => w.id !== activeWorkspace?.id)
            .map((workspace) => (
              <div
                key={workspace.id}
                className="p-4 rounded-xl border border-border/40 bg-background/40 hover:bg-background/60 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-muted">
                      <Layers className="size-6 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-lg font-semibold">
                        {workspace.name}
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        /{workspace.slug}
                      </p>
                      <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="size-3" />
                          {(workspace as any).members?.length || 1} member
                          {((workspace as any).members?.length || 1) > 1
                            ? "s"
                            : ""}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={() => handleSwitchWorkspace(workspace as any)}
                    >
                      <ExternalLink className="size-3" />
                      Switch
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8">
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          className="text-red-500 focus:text-red-500"
                          onClick={() => handleDeleteWorkspace(workspace.id)}
                        >
                          <Trash2 className="size-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            ))}

          {/* Empty state if only one workspace */}
          {(!workspaces || workspaces.length <= 1) && (
            <div className="text-center py-8 px-4 rounded-xl border border-dashed border-border/40">
              <Layers className="size-8 mx-auto text-muted-foreground/40 mb-3" />
              <p className="text-sm text-muted-foreground">
                You only have one workspace. Create more to organize your
                projects!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Unsaved Changes Dialog for workspace switching */}
      {unsavedGuard.dialogProps && (
        <UnsavedChangesDialog {...unsavedGuard.dialogProps} />
      )}

      {/* Create Workspace Modal */}
      <Dialog
        onOpenChange={(open) => setWorkspaceSetupModalOpen(open || false)}
        open={workspaceSetupModalOpen}
        modal={true}
      >
        <DialogContent className="!max-w-[700px] !min-w-[800px] p-0 gap-0 overflow-hidden border-0">
          <DialogTitle className="sr-only">Create Workspace</DialogTitle>
          <div className="grid md:grid-cols-2 min-h-[420px]">
            {/* Left side - Decorative */}
            <div className="hidden md:flex relative bg-gradient-to-br from-primary via-primary/90 to-primary/70 p-8 flex-col justify-between overflow-hidden">
              {/* Decorative gradient orbs */}
              <div className="absolute top-1/4 -left-16 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
              <div className="absolute bottom-1/4 -right-16 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white/10 rounded-full blur-2xl" />

              {/* Content */}
              <div className="relative z-10">
                <div className="flex items-center gap-2 text-white/90">
                  <div className="flex justify-center items-center bg-white/20 backdrop-blur-sm rounded-lg size-8">
                    <Briefcase className="size-4 text-white" />
                  </div>
                  <span className="font-semibold text-lg">New Workspace</span>
                </div>
              </div>

              <div className="relative z-10 space-y-4">
                <h2 className="text-2xl font-bold text-white leading-tight">
                  Organize your API testing workflow
                </h2>
                <p className="text-white/80 text-sm leading-relaxed">
                  Create dedicated workspaces for different projects and invite
                  your team to collaborate seamlessly.
                </p>
                <div className="flex gap-3 pt-2">
                  <div className="flex items-center gap-2 text-white/70 text-xs">
                    <div className="size-1.5 rounded-full bg-emerald-400" />
                    Unlimited collections
                  </div>
                  <div className="flex items-center gap-2 text-white/70 text-xs">
                    <div className="size-1.5 rounded-full bg-emerald-400" />
                    Team collaboration
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Form */}
            <div className="flex items-center justify-center p-8 bg-background">
              <WorkspaceSetup type={"workspace-setup-modal"} />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
