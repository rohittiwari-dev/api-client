"use client";

import React, { use, useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Mail,
  UserPlus,
  Crown,
  MoreHorizontal,
  Trash2,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Avatar from "@/modules/authentication/components/avatar";
import { getInitialsFromName } from "@/lib/utils";
import { useListMembersQuery } from "@/modules/workspace/hooks/use-invitaions-query";

export default function TeamSettingsPage() {
  const { data, isPending, error } = useListMembersQuery();
  const [inviteEmail, setInviteEmail] = useState("");

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "owner":
        return (
          <Badge
            variant="secondary"
            className="gap-1 bg-amber-500/10 text-amber-500 border-amber-500/20"
          >
            <Crown className="size-3" />
            Owner
          </Badge>
        );
      case "admin":
        return (
          <Badge
            variant="secondary"
            className="bg-blue-500/10 text-blue-500 border-blue-500/20"
          >
            Admin
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="bg-muted text-muted-foreground">
            Member
          </Badge>
        );
    }
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
        <h2 className="text-2xl font-semibold tracking-tight">Team</h2>
        <p className="text-muted-foreground mt-1">
          Manage team members and their access to this workspace
        </p>
      </div>

      <Separator />

      {/* Invite Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Invite Team Members</h3>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              className="pl-10"
              placeholder="Enter email address"
              type="email"
            />
          </div>
          <Button
            // onClick={handleInvite}
            // disabled={isInviting}
            className="gap-2"
          >
            <UserPlus className="size-4" />
            {isPending ? "Inviting..." : "Invite"}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Team members will receive an email invitation to join this workspace.
        </p>
      </div>

      <Separator />

      {/* Team Members List */}
      {isPending ? (
        <div className="flex min-h-[200px] items-center justify-center flex-1">
          <Loader2 className="animate-spin size-7 w-[30px] h-[30px] text-indigo-500/60" />
        </div>
      ) : error ? (
        <div className="flex flex-col min-h-[200px] items-center justify-center flex-1 text-center">
          <div className="p-3 rounded-full bg-red-500/10 mb-3">
            <Users className="size-6 text-red-500" />
          </div>
          <p className="text-sm font-medium text-red-500">
            Failed to load team members
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Please try refreshing the page
          </p>
        </div>
      ) : !data?.members || data.members.length === 0 ? (
        <div className="flex flex-col min-h-[200px] items-center justify-center flex-1 text-center">
          <div className="p-3 rounded-full bg-muted mb-3">
            <Users className="size-6 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium">No team members yet</p>
          <p className="text-xs text-muted-foreground mt-1">
            Invite team members using the form above
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Team Members</h3>
            <span className="text-xs text-muted-foreground">
              {data?.total} member
              {(data?.total || 0) > 1 ? "s" : ""}
            </span>
          </div>

          <div className="space-y-2">
            {data?.members?.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-3 rounded-lg border border-border/40 bg-background/40 hover:bg-background/60 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Avatar
                    className="size-10 rounded-lg"
                    fallbackClassName="rounded-lg"
                    href={member.user?.image || ""}
                    alt={member.user?.name}
                    initial={getInitialsFromName(member.user?.name)}
                  />
                  <div>
                    <p className="text-sm font-medium">{member.user?.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {member.user?.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {getRoleBadge(member.role)}

                  {member.role !== "owner" && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8">
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="text-red-500 focus:text-red-500">
                          <Trash2 className="size-4 mr-2" />
                          Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
