import { redirect } from "next/navigation";
import { headers } from "next/headers";
import auth from "@/lib/auth";
import {
  getWorkspacePublicInfo,
  joinWorkspaceByLink,
} from "@/modules/workspace/server/invitation.actions";
import { Users, Building2, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function WorkspaceInvitePage({ params }: PageProps) {
  const { id } = await params;
  const headersList = await headers();

  // Get session
  const session = await auth.api.getSession({
    headers: headersList,
  });

  // If not signed in, redirect to sign-in with callback
  if (!session?.user) {
    redirect(`/sign-in?callbackUrl=/invite/workspace/${id}`);
  }

  // Get workspace info
  const workspace = await getWorkspacePublicInfo(id);

  if (!workspace) {
    return (
      <div className="w-full bg-background/60 backdrop-blur-xl border border-border/50 rounded-2xl p-8 shadow-2xl">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 mb-4">
            <Building2 className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Workspace Not Found</h1>
          <p className="text-muted-foreground mb-6">
            This workspace doesn&apos;t exist or the invite link is invalid.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Go Home
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  // Handle form submission
  async function handleJoin() {
    "use server";
    const result = await joinWorkspaceByLink(id);

    if (result.alreadyMember || result.data?.success) {
      redirect(`/workspace/${result.data?.slug || workspace?.data?.slug}`);
    }
  }

  return (
    <div className="w-full bg-background/60 backdrop-blur-xl border border-border/50 rounded-2xl p-8 shadow-2xl">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-linear-to-br from-primary/20 to-violet-600/20 border border-primary/30 mb-4">
          {workspace.data?.logo ? (
            <Image
              src={workspace.data?.logo}
              alt={workspace.data?.name}
              width={40}
              height={40}
              className="w-12 h-12 rounded-xl object-cover"
            />
          ) : (
            <Building2 className="w-10 h-10 text-primary" />
          )}
        </div>
        <h1 className="text-2xl font-bold mb-2">Join {workspace.data?.name}</h1>
        <p className="text-muted-foreground">
          You&apos;ve been invited to join this workspace
        </p>
      </div>

      {/* Workspace Info */}
      <div className="bg-muted/30 rounded-xl p-4 mb-6 border border-border/30">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-background border border-border/50">
            <Users className="w-5 h-5 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm font-medium">
              {workspace.data?._count.members} members
            </p>
            <p className="text-xs text-muted-foreground">
              Created{" "}
              {(workspace.data?.createdAt &&
                new Date(workspace.data?.createdAt).toLocaleDateString()) ||
                "N/A"}
            </p>
          </div>
        </div>
      </div>

      {/* Join Button */}
      <form action={handleJoin}>
        <button
          type="submit"
          className="w-full py-3 px-4 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
        >
          <CheckCircle2 className="w-5 h-5" />
          Join Workspace
        </button>
      </form>

      <p className="text-xs text-muted-foreground text-center mt-4">
        Signed in as <span className="font-medium">{session.user.email}</span>
      </p>
    </div>
  );
}
