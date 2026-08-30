import { AxiosError } from "axios";

interface BackendErrorBody {
  error?: { message?: string };
  message?: string;
}

/** Extracts a human-readable message from an axios/backend error envelope. */
export function getApiErrorMessage(
  err: unknown,
  fallback = "Something went wrong. Please try again.",
): string {
  const axiosErr = err as AxiosError<BackendErrorBody>;
  return (
    axiosErr?.response?.data?.error?.message ??
    axiosErr?.response?.data?.message ??
    axiosErr?.message ??
    fallback
  );
}
