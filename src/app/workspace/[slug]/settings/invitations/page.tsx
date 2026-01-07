"use client";

import { motion } from "framer-motion";
import { Check, Loader2, Mail, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  useAcceptInvitationMutation,
  useRejectInvitationMutation,
  useUserInvitationsQuery,
} from "@/modules/workspace/hooks/use-invitaions-query";
import { toast } from "sonner";
import Avatar from "@/modules/authentication/components/avatar";
import { getInitialsFromName } from "@/lib/utils";

export default function UserInvitationsPage() {
  const { data: invitations, isPending: isLoading } = useUserInvitationsQuery();
  const { mutate: acceptInvitation, isPending: isAccepting } =
    useAcceptInvitationMutation();
  const { mutate: rejectInvitation, isPending: isRejecting } =
    useRejectInvitationMutation();

  const handleAccept = (invitationId: string) => {
    acceptInvitation(invitationId, {
      onSuccess: () => {
        toast.success("Invitation accepted successfully");
        // Optionally redirect or refresh
      },
      onError: () => {
        toast.error("Failed to accept invitation");
      },
    });
  };

  const handleReject = (invitationId: string) => {
    rejectInvitation(invitationId, {
      onSuccess: () => {
        toast.success("Invitation declined");
      },
      onError: () => {
        toast.error("Failed to decline invitation");
      },
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">
          Your Invitations
        </h2>
        <p className="text-muted-foreground mt-1">
          Manage your pending invitations to join other workspaces
        </p>
      </div>

      <Separator />

      {/* Invitations List */}
      {isLoading ? (
        <div className="flex min-h-[200px] items-center justify-center flex-1">
          <Loader2 className="animate-spin size-7 w-[30px] h-[30px] text-indigo-500/60" />
        </div>
      ) : !invitations || invitations.length === 0 ? (
        <div className="flex flex-col min-h-[200px] items-center justify-center flex-1 text-center">
          <div className="p-3 rounded-full bg-muted mb-3">
            <Mail className="size-6 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium">No pending invitations</p>
          <p className="text-xs text-muted-foreground mt-1">
            You don&apos;t have any pending invitations at the moment
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Pending Requests</h3>
          <div className="space-y-2">
            {invitations.map((invitation: any) => (
              <div
                key={invitation.id}
                className="flex items-center justify-between p-3 rounded-lg border border-border/40 bg-background/40 hover:bg-background/60 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <Avatar
                    className="size-10 rounded-lg opacity-70"
                    fallbackClassName="rounded-lg"
                    href={"https://avatar.iran.liara.run/public"}
                    initial={getInitialsFromName(invitation.organizationName)}
                    alt={invitation.organizationName}
                  />
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {invitation.organizationName || "Unknown Workspace"}
                    </p>
                    <div className="flex items-center -ml-2 gap-2">
                      <Badge
                        variant="secondary"
                        className="text-[10px] h-5 font-normal capitalize bg-muted/50 text-muted-foreground group-hover:bg-muted group-hover:text-foreground transition-colors"
                      >
                        Role: {invitation.role}
                      </Badge>
                      <span className="text-[11px] text-muted-foreground/60">
                        Invited by {invitation.inviterEmail}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleAccept(invitation.id)}
                    disabled={isAccepting || isRejecting}
                    className="h-8 gap-2 bg-emerald-500/10 cursor-pointer text-emerald-600 hover:bg-emerald-500/20 hover:text-emerald-700 border-emerald-500/20 shadow-none"
                    variant="outline"
                  >
                    {isAccepting ? (
                      <Loader2 className="size-3.5 animate-spin" />
                    ) : (
                      <Check className="size-3.5" />
                    )}
                    Accept
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleReject(invitation.id)}
                    disabled={isAccepting || isRejecting}
                    className="h-8 gap-2 text-muted-foreground cursor-pointer hover:text-red-500 hover:bg-red-500/10"
                    variant="ghost"
                  >
                    {isRejecting ? (
                      <Loader2 className="size-3.5 animate-spin" />
                    ) : (
                      <X className="size-3.5" />
                    )}
                    Decline
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
