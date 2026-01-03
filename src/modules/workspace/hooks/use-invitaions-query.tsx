import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  acceptInvitation,
  deleteInvitation,
  inviteMember,
  listMembers,
  rejectInvitation,
  removeMember,
  updateMemberRole,
} from "../server/invitation.actions";
import useWorkspaceState from "../store";

export const useListMembersQuery = () => {
  const { activeWorkspace } = useWorkspaceState();
  console.log(activeWorkspace);
  return useQuery({
    queryKey: ["members", activeWorkspace?.id],
    queryFn: async () => {
      const members = await listMembers(activeWorkspace?.id || "").catch(() => {
        return [];
      });
      return { members, total: members?.length || 0 };
    },
    enabled: !!activeWorkspace?.id,
  });
};

export const useInviteMemberMutation = () => {
  const queryClient = useQueryClient();
  const { activeWorkspace } = useWorkspaceState();
  return useMutation({
    mutationFn: async ({
      email,
      role = "member",
      resend = false,
    }: {
      email: string;
      role?: "member" | "admin" | "owner";
      resend?: boolean;
    }) => {
      const member = await inviteMember({
        workspaceId: activeWorkspace?.id || "",
        email,
        role,
        resend,
      });
      return member;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["members", activeWorkspace?.id],
      });
    },
  });
};

export const useAcceptInvitationMutation = () => {
  const queryClient = useQueryClient();
  const { activeWorkspace } = useWorkspaceState();
  return useMutation({
    mutationFn: async (invitationId: string) => {
      const member = await acceptInvitation(invitationId);
      return member;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["members", activeWorkspace?.id],
      });
    },
  });
};

export const useRejectInvitationMutation = () => {
  const queryClient = useQueryClient();
  const { activeWorkspace } = useWorkspaceState();
  return useMutation({
    mutationFn: async (invitationId: string) => {
      const member = await rejectInvitation(invitationId);
      return member;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["members", activeWorkspace?.id],
      });
    },
  });
};

export const useCancelInvitationMutation = () => {
  const queryClient = useQueryClient();
  const { activeWorkspace } = useWorkspaceState();
  return useMutation({
    mutationFn: async (invitationId: string) => {
      const member = await deleteInvitation(invitationId);
      return member;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["members", activeWorkspace?.id],
      });
    },
  });
};

export const useUpdateMemberRoleMutation = () => {
  const queryClient = useQueryClient();
  const { activeWorkspace } = useWorkspaceState();
  return useMutation({
    mutationFn: async ({
      memberId,
      role,
    }: {
      memberId: string;
      role: "member" | "admin" | "owner";
    }) => {
      const member = await updateMemberRole(memberId, role);
      return member;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["members", activeWorkspace?.id],
      });
    },
  });
};

export const useRemoveMemberMutation = () => {
  const queryClient = useQueryClient();
  const { activeWorkspace } = useWorkspaceState();
  return useMutation({
    mutationFn: async (memberId: string) => {
      const member = await removeMember(memberId, activeWorkspace?.id || "");
      return member;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["members", activeWorkspace?.id],
      });
    },
  });
};
