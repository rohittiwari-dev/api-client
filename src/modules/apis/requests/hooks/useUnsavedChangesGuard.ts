"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import { RequestStateInterface } from "../types/request.types";
import { upsertRequestAction } from "../actions";
import { getRequestById } from "../server/request";
import useRequestStore from "../store/request.store";
import useWorkspaceState from "@/modules/workspace/store";
import {
  UnsavedChangesAction,
  UnsavedChangesDialogProps,
} from "../components/UnsavedChangesDialog";

interface PendingAction {
  type: UnsavedChangesAction;
  unsavedRequests: RequestStateInterface[];
  onConfirm: () => void;
  tabIdsToClose?: string[];
}

export function useUnsavedChangesGuard() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(
    null
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isDiscarding, setIsDiscarding] = useState(false);

  const { activeWorkspace } = useWorkspaceState();
  const { requests, tabIds, updateRequest } = useRequestStore();

  // Get all tabs for current workspace
  const getWorkspaceTabs = useCallback(() => {
    return requests.filter(
      (r) => tabIds.includes(r.id) && r.workspaceId === activeWorkspace?.id
    );
  }, [requests, tabIds, activeWorkspace?.id]);

  // Get unsaved requests from given tab IDs
  const getUnsavedRequests = useCallback(
    (tabIdsToCheck: string[]): RequestStateInterface[] => {
      return requests.filter(
        (r) =>
          tabIdsToCheck.includes(r.id) &&
          r.unsaved &&
          r.type != "NEW" &&
          r.workspaceId === activeWorkspace?.id
      );
    },
    [requests, activeWorkspace?.id]
  );

  // Check if any of the given tabs have unsaved changes
  const hasUnsavedChanges = useCallback(
    (tabIdsToCheck: string[]): boolean => {
      return (
        getUnsavedRequests(tabIdsToCheck).filter((req) => req.type != "NEW")
          .length > 0
      );
    },
    [getUnsavedRequests]
  );

  // Save all unsaved requests
  const saveAllRequests = async (requestsToSave: RequestStateInterface[]) => {
    const savePromises = requestsToSave
      .filter((req) => req.type !== "NEW")
      .map(async (request) => {
        await upsertRequestAction(request.id, {
          name: request.name,
          url: request.url || "",
          workspaceId: request.workspaceId,
          collectionId: request.collectionId,
          type: (request.type || "API") as any,
          method: request.method,
          headers: request.headers,
          parameters: request.parameters,
          body: request.body,
          auth: request.auth,
          bodyType: request.bodyType,
          savedMessages: request.savedMessages ?? [],
        });

        // Mark as saved in store
        updateRequest(request.id, { unsaved: false });
      });

    await Promise.all(savePromises);
  };

  // Revert request to database state
  const revertRequest = async (request: RequestStateInterface) => {
    // Fetch original from database
    if (request.type === "NEW") {
      return;
    }
    try {
      const dbRequest = await getRequestById(
        request.id,
        activeWorkspace?.id || ""
      );
      if (dbRequest) {
        updateRequest(request.id, {
          name: dbRequest.name,
          url: dbRequest.url || "",
          method: dbRequest.method,
          headers: dbRequest.headers as any[],
          parameters: dbRequest.parameters as any[],
          body: dbRequest.body as any,
          auth: dbRequest.auth as any,
          bodyType: dbRequest.bodyType,
          savedMessages: dbRequest.savedMessages as any[],
          unsaved: false,
        });
      } else {
        // Request doesn't exist in DB (new request), just mark as not unsaved
        updateRequest(request.id, { unsaved: false });
      }
    } catch (error) {
      console.error("Failed to revert request:", error);
      // On error, still mark as not unsaved so close can proceed
      updateRequest(request.id, { unsaved: false });
    }
  };

  // Handle save action
  const handleSave = async () => {
    if (!pendingAction) return;

    setIsSaving(true);
    try {
      await saveAllRequests(
        pendingAction.unsavedRequests.filter((req) => req.type !== "NEW")
      );
      toast.success(
        pendingAction.unsavedRequests.length === 1
          ? "Request saved"
          : `${pendingAction.unsavedRequests.length} requests saved`
      );
      setDialogOpen(false);
      pendingAction.onConfirm();
    } catch (error) {
      console.error("Failed to save requests:", error);
      toast.error("Failed to save requests");
    } finally {
      setIsSaving(false);
      setPendingAction(null);
    }
  };

  // Handle discard action
  const handleDiscard = async () => {
    if (!pendingAction) return;

    setIsDiscarding(true);
    try {
      // Revert all unsaved requests from database
      const revertPromises = pendingAction.unsavedRequests
        .filter((req) => req.type !== "NEW")
        .map((r) => revertRequest(r));

      await Promise.all(revertPromises);

      setDialogOpen(false);
      pendingAction.onConfirm();
    } catch (error) {
      console.error("Failed to discard changes:", error);
      toast.error("Failed to discard changes");
    } finally {
      setIsDiscarding(false);
      setPendingAction(null);
    }
  };

  // Handle cancel action
  const handleCancel = () => {
    setDialogOpen(false);
    setPendingAction(null);
  };

  // Confirm close single tab
  const confirmClose = useCallback(
    (tabId: string, onConfirm: () => void) => {
      const unsavedRequests = getUnsavedRequests([tabId]);

      if (unsavedRequests.length === 0) {
        // No unsaved changes, proceed directly
        onConfirm();
        return;
      }

      setPendingAction({
        type: "close",
        unsavedRequests,
        onConfirm,
        tabIdsToClose: [tabId],
      });
      setDialogOpen(true);
    },
    [getUnsavedRequests]
  );

  // Confirm close all tabs
  const confirmCloseAll = useCallback(
    (onConfirm: () => void) => {
      const workspaceTabs = getWorkspaceTabs();
      const allTabIds = workspaceTabs.map((t) => t.id);
      const unsavedRequests = getUnsavedRequests(allTabIds);

      if (unsavedRequests.length === 0) {
        onConfirm();
        return;
      }

      setPendingAction({
        type: "close-all",
        unsavedRequests,
        onConfirm,
        tabIdsToClose: allTabIds,
      });
      setDialogOpen(true);
    },
    [getWorkspaceTabs, getUnsavedRequests]
  );

  // Confirm close other tabs (keep one)
  const confirmCloseOthers = useCallback(
    (keepTabId: string, onConfirm: () => void) => {
      const workspaceTabs = getWorkspaceTabs();
      const otherTabIds = workspaceTabs
        .filter((t) => t.id !== keepTabId)
        .map((t) => t.id);
      const unsavedRequests = getUnsavedRequests(otherTabIds);

      if (unsavedRequests.length === 0) {
        onConfirm();
        return;
      }

      setPendingAction({
        type: "close-others",
        unsavedRequests,
        onConfirm,
        tabIdsToClose: otherTabIds,
      });
      setDialogOpen(true);
    },
    [getWorkspaceTabs, getUnsavedRequests]
  );

  // Confirm workspace switch
  const confirmWorkspaceSwitch = useCallback(
    (onConfirm: () => void) => {
      const workspaceTabs = getWorkspaceTabs();
      const allTabIds = workspaceTabs.map((t) => t.id);
      const unsavedRequests = getUnsavedRequests(allTabIds);

      if (unsavedRequests.length === 0) {
        onConfirm();
        return;
      }

      setPendingAction({
        type: "switch-workspace",
        unsavedRequests,
        onConfirm,
        tabIdsToClose: allTabIds,
      });
      setDialogOpen(true);
    },
    [getWorkspaceTabs, getUnsavedRequests]
  );

  return {
    // State
    dialogOpen,
    isSaving,
    isDiscarding,
    pendingAction,

    // Dialog props
    dialogProps: pendingAction
      ? ({
          open: dialogOpen,
          onOpenChange: setDialogOpen,
          unsavedRequests: pendingAction.unsavedRequests,
          onSave: handleSave,
          onDiscard: handleDiscard,
          onCancel: handleCancel,
          isSaving,
          isDiscarding,
          actionType: pendingAction.type,
        } as UnsavedChangesDialogProps)
      : null,

    // Actions
    hasUnsavedChanges,
    getUnsavedRequests,
    confirmClose,
    confirmCloseAll,
    confirmCloseOthers,
    confirmWorkspaceSwitch,
  };
}

export default useUnsavedChangesGuard;
