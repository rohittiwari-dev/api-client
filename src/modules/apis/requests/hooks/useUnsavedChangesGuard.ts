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
  const { requests, tabIds, updateRequest, removeRequest } = useRequestStore();

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
        // Request doesn't exist in DB - remove it from the store
        removeRequest(request.id);
      }
    } catch (error) {
      console.error("Failed to revert request:", error);
      // On error, remove non-existent requests from store
      removeRequest(request.id);
    }
  };

  // Handle save action (optimistic)
  const handleSave = async () => {
    if (!pendingAction) return;

    const requestsToSave = pendingAction.unsavedRequests.filter(
      (req) => req.type !== "NEW"
    );
    const currentPendingAction = pendingAction;

    setIsSaving(true);
    try {
      // Optimistically mark as saved immediately
      requestsToSave.forEach((req) =>
        updateRequest(req.id, { unsaved: false })
      );

      // Close dialog and proceed immediately (optimistic)
      setDialogOpen(false);
      currentPendingAction.onConfirm();
      setPendingAction(null);

      // Then save to database in background
      await saveAllRequests(requestsToSave);
      toast.success(
        requestsToSave.length === 1
          ? "Request saved"
          : `${requestsToSave.length} requests saved`
      );
    } catch (error) {
      console.error("Failed to save requests:", error);
      toast.error("Failed to save requests");
      // Revert optimistic update on failure
      requestsToSave.forEach((req) => updateRequest(req.id, { unsaved: true }));
    } finally {
      setIsSaving(false);
    }
  };

  // Handle discard action (optimistic)
  const handleDiscard = async () => {
    if (!pendingAction) return;

    const requestsToProcess = pendingAction.unsavedRequests.filter(
      (req) => req.type !== "NEW"
    );
    const currentPendingAction = pendingAction;

    setIsDiscarding(true);
    try {
      // Optimistic: close dialog and proceed immediately
      setDialogOpen(false);
      currentPendingAction.onConfirm();
      setPendingAction(null);

      // Revert all unsaved requests from database in background
      await Promise.all(requestsToProcess.map((r) => revertRequest(r)));
    } catch (error) {
      console.error("Failed to discard changes:", error);
      toast.error("Failed to discard changes");
    } finally {
      setIsDiscarding(false);
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
