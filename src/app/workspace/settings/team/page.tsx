"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Mail,
  UserPlus,
  Crown,
  MoreHorizontal,
  Trash2,
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
import { toast } from "sonner";
import { useAuthStore } from "@/modules/authentication/store";
import Avatar from "@/modules/authentication/components/avatar";
import { getInitialsFromName } from "@/lib/utils";

// Mock team members data
const mockTeamMembers = [
  { id: "1", name: "You", email: "you@example.com", role: "owner", image: "" },
];

export default function TeamSettingsPage() {
  const { data } = useAuthStore();
  const user = data?.user;

  const [inviteEmail, setInviteEmail] = useState("");
  const [isInviting, setIsInviting] = useState(false);

  const teamMembers = [
    {
      id: user?.id || "1",
      name: user?.name || "You",
      email: user?.email || "",
      role: "owner" as const,
      image: user?.image || "",
    },
    ...mockTeamMembers.slice(1),
  ];

  const handleInvite = async () => {
    if (!inviteEmail.trim()) {
      toast.error("Please enter an email address");
      return;
    }

    setIsInviting(true);
    try {
      // TODO: Implement invite API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success(`Invitation sent to ${inviteEmail}`);
      setInviteEmail("");
    } catch (error) {
      toast.error("Failed to send invitation");
    } finally {
      setIsInviting(false);
    }
  };

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
            onClick={handleInvite}
            disabled={isInviting}
            className="gap-2"
          >
            <UserPlus className="size-4" />
            {isInviting ? "Inviting..." : "Invite"}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Team members will receive an email invitation to join this workspace.
        </p>
      </div>

      <Separator />

      {/* Team Members List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Team Members</h3>
          <span className="text-xs text-muted-foreground">
            {teamMembers.length} member{teamMembers.length > 1 ? "s" : ""}
          </span>
        </div>

        <div className="space-y-2">
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between p-3 rounded-lg border border-border/40 bg-background/40 hover:bg-background/60 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Avatar
                  className="size-10 rounded-lg"
                  fallbackClassName="rounded-lg"
                  href={member.image}
                  alt={member.name}
                  initial={getInitialsFromName(member.name)}
                />
                <div>
                  <p className="text-sm font-medium">{member.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {member.email}
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
    </motion.div>
  );
}
