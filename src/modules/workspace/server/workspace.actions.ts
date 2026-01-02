"use server";

import { Organization } from "@/generated/prisma/client";
import db from "@/lib/db";

export const getActiveOrganization = async (
  userId: string
): Promise<{
  name: string;
  id: string;
  createdAt: Date;
  slug: string | null;
  logo: string | null;
  metadata: string | null;
} | null> => {
  const lastSession = await db.session.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  if (lastSession?.activeOrganizationId) {
    const organization = await db.organization.findUnique({
      where: { id: lastSession.activeOrganizationId },
    });
    if (organization) {
      return organization;
    }
  }

  const organizations = await db.organization.findFirst({
    where: {
      members: { some: { userId } },
    },
    orderBy: { createdAt: "desc" },
  });
  return organizations;
};

export const updateWorkspaceGlobalAuth = async (
  workspaceId: string,
  globalAuth: { type: string; data?: unknown } | null
): Promise<{ success: boolean; error?: string }> => {
  try {
    await db.organization.update({
      where: { id: workspaceId },
      data: { globalAuth: globalAuth as any },
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to update global auth" };
  }
};

export const getWorkspaceWithGlobalAuth = async (
  workspaceId: string
): Promise<Organization | null> => {
  try {
    const workspace = await db.organization.findUnique({
      where: { id: workspaceId },
    });
    return workspace;
  } catch (error) {
    return null;
  }
};
