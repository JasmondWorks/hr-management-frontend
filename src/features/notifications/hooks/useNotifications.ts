"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CommonQueryOptions } from "@/shared/api";
import { notificationService } from "../api/notification.service";

const KEY = ["notifications"] as const;

export function useNotifications(options?: CommonQueryOptions) {
  return useQuery({
    queryKey: [...KEY, options],
    queryFn: () => notificationService.getNotifications(options),
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notificationService.markAsRead(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KEY }),
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KEY }),
  });
}
