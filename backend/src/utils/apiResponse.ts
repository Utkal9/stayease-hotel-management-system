import type { Response } from "express";

export interface ApiSuccessBody<T> {
  success: true;
  message: string;
  data: T;
}

export interface ApiErrorBody {
  success: false;
  message: string;
  error: {
    code: string;
  };
}

export function sendSuccess<T>(res: Response, message: string, data: T, statusCode = 200): Response {
  const body: ApiSuccessBody<T> = { success: true, message, data };
  return res.status(statusCode).json(body);
}

export function sendError(res: Response, statusCode: number, code: string, message: string): Response {
  const body: ApiErrorBody = { success: false, message, error: { code } };
  return res.status(statusCode).json(body);
}
