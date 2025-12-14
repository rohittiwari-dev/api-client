"use client";

import React, { useEffect } from "react";
import { Organization, RequestType } from "@/generated/prisma/browser";
import useWorkspaceState from ".";
import useRequestTabsStore from "@/modules/requests/store/tabs.store";
import useRequestStore from "@/modules/requests/store/request.store";
import useCookieStore from "@/modules/cookies/store/cookie.store";
import authClient from "@/lib/authClient";

const WorkspaceProvider = ({
  children,
  activeOrg,
  workspaces,
}: {
  activeOrg: Organization;
  workspaces: Organization[];
  children: React.ReactNode;
}) => {
  const { setWorkspaces, setActiveWorkspace } = useWorkspaceState();
  const { tabs, setActiveTab, activeTab } = useRequestTabsStore();
  const { requests, setActiveRequest, activeRequest } = useRequestStore();
  const { setCurrentWorkspaceId } = useCookieStore();

  const currentWorkspaceTabs = tabs.filter(
    (tab) => tab.workspaceId === activeOrg.id
  );
  const currentWorkspaceRequests = requests.filter(
    (req) => req.workspaceId === activeOrg.id
  );

  const clearActiveRequestTabsStates = React.useEffectEvent(() => {
    const newActiveRequest = currentWorkspaceRequests[0] || null;
    const newActiveTab =
      currentWorkspaceTabs?.find((tab) => tab.id === newActiveRequest.id) ||
        newActiveRequest
        ? {
          id: newActiveRequest?.id,
          title: newActiveRequest?.name,
          workspaceId: newActiveRequest?.workspaceId,
          type: (newActiveRequest?.type as RequestType) || "NEW",
          collectionId: newActiveRequest?.collectionId,
          method: newActiveRequest?.method,
          unsaved: newActiveRequest?.unsaved,
        }
        : null;
    if (activeRequest && activeRequest.workspaceId !== activeOrg.id)
      setActiveRequest(newActiveRequest);
    if (activeTab && activeTab.workspaceId !== activeOrg.id)
      setActiveTab(newActiveTab);
  });

  useEffect(() => {
    if (activeOrg) {
      setCurrentWorkspaceId(activeOrg.id);
      authClient.organization.setActive({
        organizationId: activeOrg.id,
        organizationSlug: activeOrg.slug || ""
      })
    }
  }, [activeOrg]);

  React.useEffect(() => {
    setWorkspaces(workspaces);
    setActiveWorkspace(activeOrg);
    clearActiveRequestTabsStates();
  }, [activeOrg, setActiveWorkspace, setWorkspaces, workspaces]);

  return <div>{children}</div>;
};

export default WorkspaceProvider;

