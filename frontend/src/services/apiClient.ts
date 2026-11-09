import type { ApiResponse } from "../types/api";

export class ApiClientError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ApiClientError";
  }
}

export function getApiBaseUrl(): string {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  if (!baseUrl) {
    throw new ApiClientError("VITE_API_BASE_URL is not set. Copy .env.example to .env in the repository root.");
  }
  return baseUrl.replace(/\/+$/, "");
}

export async function apiGet<T>(path: string, signal?: AbortSignal): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${getApiBaseUrl()}${path}`, { signal });
  } catch (error) {
    if (error instanceof ApiClientError) throw error;
    // fetch only rejects on network failure or abort; keep abort errors recognisable.
    if (error instanceof DOMException && error.name === "AbortError") throw error;
    throw new ApiClientError("Could not reach the API");
  }

  let body: ApiResponse<T>;
  try {
    body = (await response.json()) as ApiResponse<T>;
  } catch {
    throw new ApiClientError(`The API returned an unreadable response (HTTP ${response.status})`);
  }

  if (!response.ok || !body.success) {
    throw new ApiClientError(body.message || `Request failed (HTTP ${response.status})`);
  }
  return body.data;
}
