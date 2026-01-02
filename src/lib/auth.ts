import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import {
  haveIBeenPwned,
  lastLoginMethod,
  openAPI,
  organization,
  twoFactor,
} from "better-auth/plugins";
import db from "@/lib/db";
import env from "@/lib/env";
import { getActiveOrganization } from "@/modules/workspace/server/workspace.actions";

const auth = betterAuth({
  appName: "Api-Client",
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      // await sendEmail({
      //     to: user.email,
      //     subject: "Reset Your Password | Plug Point",
      //     text: `Click the link to verify your email: ${url}`,
      // });
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      // await sendEmail({
      //     to: user.email,
      //     subject: "Verify your email address | Plug Point",
      //     text: `Click the link to verify your email: ${url}`,
      // });
    },
  },
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google", "microsoft"],
      allowDifferentEmails: true,
    },
  },
  socialProviders: {
    google: {
      disableImplicitSignUp: true,
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // Cache duration in seconds
    },
  },
  plugins: [
    openAPI({
      theme: "deepSpace",
    }),
    lastLoginMethod(),
    haveIBeenPwned(),
    twoFactor(),
    nextCookies(),
    organization({
      membershipLimit: 3,
      organizationLimit: 5,
      cancelPendingInvitationsOnReInvite: true,
      schema: {
        organization: {
          additionalFields: {
            globalAuth: {
              type: "json",
              defaultValue: null,
            },
          },
        },
      },
    }),
  ],
  databaseHooks: {
    session: {
      create: {
        before: async (session) => {
          if (session?.activeOrganizationId) {
            return { data: session };
          }
          const organization = await getActiveOrganization(session.userId);
          if (!organization) {
            return { data: session };
          }
          return {
            data: {
              ...session,
              activeOrganizationId: organization.id,
            },
          };
        },
      },
    },
  },
  telemetry: {
    enabled: false,
  },
  onAPIError: {
    errorURL: "/sign-in",
  },
});

export default auth;
