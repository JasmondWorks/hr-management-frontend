"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { CommonQueryOptions } from "@/shared/api";
import {
  invitationService,
  type InvitationStatus,
} from "../api/invitation.service";

const KEY = ["invitations"] as const;

export function useInvitations(
  options?: CommonQueryOptions & { status?: InvitationStatus },
) {
  return useQuery({
    queryKey: [...KEY, options],
    queryFn: () => invitationService.getInvitations(options),
  });
}

export function useCreateInvitation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: invitationService.createInvitation,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KEY }),
  });
}

export function useCreateInvitationsBulk() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: invitationService.createInvitationsBulk,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KEY }),
  });
}

export function useCheckInvitationEmail() {
  return useMutation({
    mutationFn: (email: string) => invitationService.checkInvitationEmail(email),
  });
}

export function useResendInvitation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: invitationService.resendInvitation,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KEY }),
  });
}

export function useRevokeInvitation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: invitationService.revokeInvitation,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KEY }),
  });
}
