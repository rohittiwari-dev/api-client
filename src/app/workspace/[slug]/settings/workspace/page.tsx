"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Building2,
  Globe,
  Trash2,
  Save,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import useWorkspaceState from "@/modules/workspace/store";

export default function WorkspaceSettingsPage() {
  const { activeWorkspace } = useWorkspaceState();

  const [name, setName] = useState(activeWorkspace?.name || "");
  const [slug, setSlug] = useState(activeWorkspace?.slug || "");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // TODO: Implement workspace update API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Workspace settings updated");
    } catch (error) {
      toast.error("Failed to update workspace");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Workspace</h2>
        <p className="text-muted-foreground mt-1">
          Manage your workspace settings and configuration
        </p>
      </div>

      <Separator />

      {/* Workspace Info */}
      <div className="space-y-6">
        <h3 className="text-sm font-medium">Workspace Information</h3>

        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="workspace-name" className="text-sm">
              Workspace Name
            </Label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                id="workspace-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-10"
                placeholder="My Workspace"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="workspace-slug" className="text-sm">
              Workspace URL
            </Label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                id="workspace-slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="pl-10"
                placeholder="my-workspace"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              This will be used in the workspace URL: /workspace/{slug || "..."}
            </p>
          </div>
        </div>
      </div>

      <Separator />

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isSaving} className="gap-2">
          {isSaving ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Save className="size-4" />
          )}
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <Separator />

      {/* Danger Zone */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-red-500">Danger Zone</h3>
        <div className="p-4 rounded-lg border border-red-500/20 bg-red-500/5 space-y-3">
          <div className="flex items-start gap-3">
            <AlertTriangle className="size-5 text-red-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium">Delete Workspace</p>
              <p className="text-xs text-muted-foreground">
                Permanently delete this workspace and all of its data. This
                action cannot be undone.
              </p>
            </div>
          </div>
          <Button variant="destructive" size="sm" className="gap-2">
            <Trash2 className="size-4" />
            Delete Workspace
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
