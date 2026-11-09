import type { RequestHandler } from "express";
import { sendError } from "../utils/apiResponse";

export const notFoundHandler: RequestHandler = (req, res) => {
  sendError(res, 404, "NOT_FOUND", `Route not found: ${req.method} ${req.originalUrl}`);
};
