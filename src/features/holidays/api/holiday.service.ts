import api from "@/shared/lib/axios";
import type { CommonQueryOptions, PaginationMeta } from "@/shared/api";

export interface Holiday {
  id: string;
  organizationId: string;
  name: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetHolidaysResponse {
  success: boolean;
  message: string;
  data: Holiday[];
  meta: PaginationMeta;
}

export interface CreateHolidayPayload {
  name: string;
  date: string; // ISO string or YYYY-MM-DD
}

export const holidayService = {
  getHolidays: async (options?: CommonQueryOptions): Promise<GetHolidaysResponse> => {
    const { data } = await api.get<GetHolidaysResponse>("/holidays", { params: options });
    return data;
  },

  createHoliday: async (payload: CreateHolidayPayload): Promise<{ success: boolean; data: Holiday }> => {
    const { data } = await api.post<{ success: boolean; data: Holiday }>("/holidays", payload);
    return data;
  }
};
