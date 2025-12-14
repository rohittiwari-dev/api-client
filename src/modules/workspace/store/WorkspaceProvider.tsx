"use client";

import React, { useEffect } from "react";
import { Organization, Request } from "@/generated/prisma/browser";
import useWorkspaceState from ".";
import useRequestStore from "@/modules/requests/store/request.store";
import useCookieStore from "@/modules/cookies/store/cookie.store";
import authClient from "@/lib/authClient";
import { useFetchAllRequests } from "@/modules/requests/hooks/queries";
import { RequestStateInterface } from "@/modules/requests/types/request.types";

const WorkspaceProvider = ({
  children,
  activeOrg,
  workspaces,
  requests: initialRequests,
}: {
  activeOrg: Organization;
  workspaces: Organization[];
  children: React.ReactNode;
  requests: Request[];
}) => {
  const { setWorkspaces, setActiveWorkspace } = useWorkspaceState();
  const { data: requests } = useFetchAllRequests(activeOrg.id, initialRequests);
  const { setRequestsState } = useRequestStore();
  const { setCurrentWorkspaceId } = useCookieStore();

  useEffect(() => {
    if (activeOrg) {
      setCurrentWorkspaceId(activeOrg.id);
    }
  }, [activeOrg]);

  useEffect(() => {
    if (requests) {
      setRequestsState({
        requests: requests?.map((request) => ({
          ...request,
          unsaved: false,
          body: request.body as RequestStateInterface["body"],
          headers: request.headers as RequestStateInterface["headers"],
          parameters: request.parameters as RequestStateInterface["parameters"],
          auth: request.auth as RequestStateInterface["auth"],
          savedMessages:
            request.savedMessages as RequestStateInterface["savedMessages"],
        })),
      });
    }
  }, [requests]);

  React.useEffect(() => {
    setWorkspaces(workspaces);
    setActiveWorkspace(activeOrg);
    authClient.organization.setActive({
      organizationId: activeOrg.id,
      organizationSlug: activeOrg.slug || "",
    });
  }, [activeOrg, setActiveWorkspace, setWorkspaces, workspaces]);

  return <>{children}</>;
};

export default WorkspaceProvider;
