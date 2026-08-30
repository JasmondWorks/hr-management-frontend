import api from "@/shared/lib/axios";
import type { CommonQueryOptions, PaginationMeta } from "@/shared/api";

export interface Notification {
  id: string;
  userId: string;
  title: string;
  content: string;
  read: boolean;
  type: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetNotificationsResponse {
  success: boolean;
  message: string;
  data: Notification[];
  meta: PaginationMeta;
}

export const notificationService = {
  getNotifications: async (options?: CommonQueryOptions): Promise<GetNotificationsResponse> => {
    const { data } = await api.get<GetNotificationsResponse>("/notifications", { params: options });
    return data;
  },

  markAsRead: async (id: string): Promise<{ success: boolean; data: Notification }> => {
    const { data } = await api.patch<{ success: boolean; data: Notification }>(`/notifications/${id}/read`);
    return data;
  },

  markAllAsRead: async (): Promise<{ success: boolean }> => {
    const { data } = await api.patch<{ success: boolean }>("/notifications/read-all");
    return data;
  }
};
