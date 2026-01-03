"use server";
import auth from "@/lib/auth";
import { headers } from "next/headers";
import db from "@/lib/db";

export const listMembers = async (workspaceId: string) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return null;
    }

    const members = await db.member.findMany({
      where: {
        organizationId: workspaceId,
      },
      include: {
        user: true,
      },
    });
    console.log(members);
    return members;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const inviteMember = async ({
  workspaceId,
  email,
  role = "member",
  resend = false,
}: {
  workspaceId: string;
  email: string;
  role?: "member" | "owner";
  resend?: boolean;
}) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return null;
    }

    const member = await auth.api.createInvitation({
      headers: await headers(),
      body: {
        email,
        role,
        organizationId: workspaceId,
        resend,
      },
    });

    return member;
  } catch (error) {
    return null;
  }
};

export const acceptInvitation = async (invitationId: string) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return null;
    }

    const member = await auth.api.acceptInvitation({
      headers: await headers(),
      body: {
        invitationId,
      },
    });

    return member;
  } catch (error) {
    return null;
  }
};

export const getInvitation = async (invitationId: string) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return null;
    }

    const invitation = await auth.api.getInvitation({
      headers: await headers(),
      query: {
        id: invitationId,
      },
    });

    return invitation;
  } catch (error) {
    return null;
  }
};

export const rejectInvitation = async (invitationId: string) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return null;
    }

    const invitation = await auth.api.rejectInvitation({
      headers: await headers(),
      body: {
        invitationId,
      },
    });

    return invitation;
  } catch (error) {
    return null;
  }
};

export const deleteInvitation = async (invitationId: string) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return null;
    }

    const invitation = await auth.api.cancelInvitation({
      headers: await headers(),
      body: {
        invitationId,
      },
    });

    return invitation;
  } catch (error) {
    return null;
  }
};
