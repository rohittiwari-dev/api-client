"use server";

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
): Promise<{ globalAuth: unknown } | null> => {
  try {
    const workspace = await db.organization.findUnique({
      where: { id: workspaceId },
      select: { globalAuth: true },
    });
    return workspace;
  } catch (error) {
    return null;
  }
};
