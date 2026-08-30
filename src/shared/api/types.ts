// Pagination metadata as returned by the backend list endpoints.
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  unreadCount?: number;
}

// The standard success envelope returned by the backend. Services return this
// whole envelope (not just `data`) so callers get `message` (for toasts) and
// `meta` (for pagination) alongside the payload.
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: PaginationMeta;
}

// Error envelope: { success: false, error: { message, stack? } }.
export interface ApiError {
  success: false;
  error: {
    message: string;
    stack?: string;
  };
}

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface CommonQueryOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: "asc" | "desc";
  search?: string;
}

export interface MessageResponse {
  success: boolean;
  message: string;
}
