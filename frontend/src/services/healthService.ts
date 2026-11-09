import type { HealthData } from "../types/api";
import { apiGet, getApiBaseUrl } from "./apiClient";

export function fetchHealth(signal?: AbortSignal): Promise<HealthData> {
  return apiGet<HealthData>("/health", signal);
}

export function getHealthUrl(): string {
  try {
    return `${getApiBaseUrl()}/health`;
  } catch {
    return "VITE_API_BASE_URL is not set";
  }
}
