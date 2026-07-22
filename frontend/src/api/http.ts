import { getToken } from "../utils/tokenStorage";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ??
  "http://127.0.0.1:8000";

type ApiErrorDetail = {
  msg?: string;
};

type ApiErrorBody = {
  detail?: string | ApiErrorDetail[];
};

export const getApiErrorMessage = async (
  response: Response,
  fallback: string,
): Promise<string> => {
  try {
    const data = (await response.json()) as ApiErrorBody;

    if (typeof data.detail === "string") {
      return data.detail;
    }

    if (Array.isArray(data.detail)) {
      const messages = data.detail
        .map((item) => item.msg)
        .filter(
          (message): message is string =>
            typeof message === "string",
        );

      if (messages.length > 0) {
        return messages.join(" / ");
      }
    }
  } catch {
    // JSON形式ではないエラーの場合はfallbackを返す
  }

  return fallback;
};

export const createAuthHeaders = (
  includeJson = false,
): HeadersInit => {
  const headers: Record<string, string> = {};
  const token = getToken();

  if (includeJson) {
    headers["Content-Type"] = "application/json";
  }

  if (token !== null) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};