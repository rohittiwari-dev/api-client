"use server";

import { headers } from "next/headers";
import auth from "@/lib/auth";
import db from "@/lib/db";
import { createId } from "@paralleldrive/cuid2";

export const currentUser = async () => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return null;
    }

    const user = await db.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        createdAt: true,
        updatedAt: true,
        emailVerified: true,
      },
    });

    return { user, session: session.session };
  } catch (error) {
    console.error("Error fetching current user:", error);
    return null;
  }
};

export const addCredentialsAccount = async (password: string) => {
  try {
    const result = await auth.api.setPassword({
      body: {
        newPassword: password,
      },
      headers: await headers(),
    });

    return {
      data: result,
      message: "Password added successfully",
      error: null,
    };
  } catch (error) {
    console.error("Error adding credentials account:", error);
    return { data: null, message: "Failed to add password", error: error };
  }
};
