/** Mirrors the response envelope produced by the backend (backend/src/utils/apiResponse.ts). */
export interface ApiSuccessResponse<T> {
  success: true;
  message: string;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  error: { code: string };
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export interface HealthData {
  service: string;
  status: string;
}
