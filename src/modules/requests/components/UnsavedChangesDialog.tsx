"use client";

import React from "react";
import { AlertTriangle, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { RequestStateInterface } from "../types/request.types";
import MethodBadge from "@/components/app-ui/method-badge";

export type UnsavedChangesAction =
  | "close"
  | "close-all"
  | "close-others"
  | "switch-workspace";

export interface UnsavedChangesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  unsavedRequests: RequestStateInterface[];
  onSave: () => Promise<void>;
  onDiscard: () => Promise<void>;
  onCancel: () => void;
  isSaving?: boolean;
  isDiscarding?: boolean;
  actionType: UnsavedChangesAction;
}

const actionMessages: Record<
  UnsavedChangesAction,
  { title: string; description: string }
> = {
  close: {
    title: "Unsaved Changes",
    description: "Do you want to save changes before closing?",
  },
  "close-all": {
    title: "Unsaved Changes",
    description:
      "You have unsaved changes in the following requests. Do you want to save them before closing all tabs?",
  },
  "close-others": {
    title: "Unsaved Changes",
    description:
      "You have unsaved changes in the following requests. Do you want to save them before closing?",
  },
  "switch-workspace": {
    title: "Unsaved Changes",
    description:
      "You have unsaved changes in the current workspace. Do you want to save them before switching?",
  },
};

export function UnsavedChangesDialog({
  open,
  onOpenChange,
  unsavedRequests,
  onSave,
  onDiscard,
  onCancel,
  isSaving = false,
  isDiscarding = false,
  actionType,
}: UnsavedChangesDialogProps) {
  const isLoading = isSaving || isDiscarding;
  const isSingleRequest = unsavedRequests.length === 1;
  const messages = actionMessages[actionType];

  const handleSave = async () => {
    await onSave();
  };

  const handleDiscard = async () => {
    await onDiscard();
  };

  const handleCancel = (isOpen: boolean) => {
    onCancel();
    onOpenChange(isOpen);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => !isLoading && handleCancel(isOpen)}
    >
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-amber-500/10">
              <AlertTriangle className="size-5 text-amber-500" />
            </div>
            <div>
              <DialogTitle className="text-lg">{messages.title}</DialogTitle>
              <DialogDescription className="mt-1">
                {isSingleRequest
                  ? `Do you want to save changes to "${unsavedRequests[0]?.name}"?`
                  : messages.description}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Request List for multiple unsaved requests */}
        {!isSingleRequest && unsavedRequests.length > 0 && (
          <div className="py-2">
            <p className="text-xs font-medium text-muted-foreground mb-2">
              {unsavedRequests.length} unsaved request
              {unsavedRequests.length > 1 ? "s" : ""}:
            </p>
            <ScrollArea className="max-h-[200px] rounded-lg border border-border/50 bg-muted/30">
              <div className="p-2 space-y-1">
                {unsavedRequests.map((request) => (
                  <div
                    key={request.id}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-background/50"
                  >
                    {request.type === "API" && (
                      <MethodBadge method={request.method ?? undefined} />
                    )}
                    <span className="text-sm truncate flex-1">
                      {request.name}
                    </span>
                    <div
                      className="size-1.5 rounded-full bg-amber-500"
                      title="Unsaved"
                    />
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}

        <DialogFooter className="flex-row gap-2 sm:justify-end">
          <Button
            type="button"
            variant="destructive"
            onClick={handleDiscard}
            disabled={isLoading}
            className={cn("flex-1 sm:flex-none")}
          >
            {isDiscarding ? (
              <span className="flex items-center gap-2">
                <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Discarding...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Trash2 className="size-4" />
                Don&apos;t Save
              </span>
            )}
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={isLoading}
            className="flex-1 sm:flex-none"
          >
            {isSaving ? (
              <span className="flex items-center gap-2">
                <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Saving...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Save className="size-4" />
                {isSingleRequest ? "Save" : "Save All"}
              </span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default UnsavedChangesDialog;
