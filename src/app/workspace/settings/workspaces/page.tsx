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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import useWorkspaceState from "@/modules/workspace/store";
import { useRouter } from "next/navigation";

export default function AllWorkspacesPage() {
  const router = useRouter();
  const { activeWorkspace, workspaces, setActiveWorkspace } =
    useWorkspaceState();

  const [newWorkspaceName, setNewWorkspaceName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const handleCreateWorkspace = async () => {
    if (!newWorkspaceName.trim()) {
      toast.error("Please enter a workspace name");
      return;
    }

    setIsCreating(true);
    try {
      // TODO: Implement workspace creation API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success(`Workspace "${newWorkspaceName}" created`);
      setNewWorkspaceName("");
      setCreateDialogOpen(false);
    } catch (error) {
      toast.error("Failed to create workspace");
    } finally {
      setIsCreating(false);
    }
  };

  const handleSwitchWorkspace = (workspace: typeof activeWorkspace) => {
    if (workspace) {
      setActiveWorkspace(workspace);
      router.push(`/workspace/${workspace.slug}`);
    }
  };

  const handleDeleteWorkspace = async (workspaceId: string) => {
    // TODO: Implement workspace deletion
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

        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="size-4" />
              New Workspace
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Workspace</DialogTitle>
              <DialogDescription>
                Create a new workspace to organize your API requests and
                collections.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="workspace-name">Workspace Name</Label>
                <Input
                  id="workspace-name"
                  value={newWorkspaceName}
                  onChange={(e) => setNewWorkspaceName(e.target.value)}
                  placeholder="My New Workspace"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setCreateDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateWorkspace} disabled={isCreating}>
                {isCreating ? "Creating..." : "Create Workspace"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
    </motion.div>
  );
}
