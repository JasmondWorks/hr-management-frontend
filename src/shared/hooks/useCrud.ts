import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
  UseMutationOptions,
} from "@tanstack/react-query";
import api from "@/shared/lib/axios";
import type { ApiResponse } from "@/shared/api";

export interface CrudOptions {
  baseQueryKey: string[];
  endpoint: string;
}

export function useCrud<
  TEntity,
  TCreateDto = Partial<TEntity>,
  TUpdateDto = Partial<TEntity>
>(options: CrudOptions) {
  // Find All
  const useFindAll = (
    params?: Record<string, any>,
    queryOptions?: Omit<UseQueryOptions<ApiResponse<TEntity[]>, Error>, "queryKey" | "queryFn">
  ) => {
    return useQuery<ApiResponse<TEntity[]>, Error>({
      queryKey: [...options.baseQueryKey, params],
      queryFn: async () => {
        const { data } = await api.get<ApiResponse<TEntity[]>>(options.endpoint, {
          params,
        });
        return data;
      },
      ...queryOptions,
    });
  };

  // Find One by ID
  const useFindOne = (
    id: string | number,
    params?: Record<string, any>,
    queryOptions?: Omit<UseQueryOptions<ApiResponse<TEntity>, Error>, "queryKey" | "queryFn">
  ) => {
    return useQuery<ApiResponse<TEntity>, Error>({
      queryKey: [...options.baseQueryKey, id, params],
      queryFn: async () => {
        const { data } = await api.get<ApiResponse<TEntity>>(
          `${options.endpoint}/${id}`,
          { params }
        );
        return data;
      },
      ...queryOptions,
    });
  };

  // Create
  const useCreate = (
    mutationOptions?: Omit<
      UseMutationOptions<ApiResponse<TEntity>, Error, TCreateDto>,
      "mutationFn"
    >
  ) => {
    const queryClient = useQueryClient();
    return useMutation<ApiResponse<TEntity>, Error, TCreateDto>({
      mutationFn: async (payload: TCreateDto) => {
        const { data } = await api.post<ApiResponse<TEntity>>(
          options.endpoint,
          payload
        );
        return data;
      },
      onSuccess: (...args) => {
        queryClient.invalidateQueries({ queryKey: options.baseQueryKey });
        mutationOptions?.onSuccess?.(...args);
      },
      ...mutationOptions,
    });
  };

  // Update
  const useUpdate = (
    mutationOptions?: Omit<
      UseMutationOptions<
        ApiResponse<TEntity>,
        Error,
        { id: string | number; payload: TUpdateDto }
      >,
      "mutationFn"
    >
  ) => {
    const queryClient = useQueryClient();
    return useMutation<
      ApiResponse<TEntity>,
      Error,
      { id: string | number; payload: TUpdateDto }
    >({
      mutationFn: async ({ id, payload }) => {
        const { data } = await api.patch<ApiResponse<TEntity>>(
          `${options.endpoint}/${id}`,
          payload
        );
        return data;
      },
      onSuccess: (...args) => {
        queryClient.invalidateQueries({ queryKey: options.baseQueryKey });
        mutationOptions?.onSuccess?.(...args);
      },
      ...mutationOptions,
    });
  };

  // Delete
  const useDelete = (
    mutationOptions?: Omit<
      UseMutationOptions<ApiResponse<void>, Error, string | number>,
      "mutationFn"
    >
  ) => {
    const queryClient = useQueryClient();
    return useMutation<ApiResponse<void>, Error, string | number>({
      mutationFn: async (id: string | number) => {
        const { data } = await api.delete<ApiResponse<void>>(`${options.endpoint}/${id}`);
        return data;
      },
      onSuccess: (...args) => {
        queryClient.invalidateQueries({ queryKey: options.baseQueryKey });
        mutationOptions?.onSuccess?.(...args);
      },
      ...mutationOptions,
    });
  };

  return {
    useFindAll,
    useFindOne,
    useCreate,
    useUpdate,
    useDelete,
  };
}
