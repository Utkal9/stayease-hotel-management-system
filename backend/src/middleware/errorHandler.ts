import type { ErrorRequestHandler } from "express";
import { env } from "../config/env";
import { ApiError } from "../utils/ApiError";
import { sendError } from "../utils/apiResponse";

// Express body-parser errors (malformed JSON, payload too large) carry a numeric `status`.
function getParserStatus(err: unknown): number | undefined {
  if (typeof err === "object" && err !== null && "status" in err) {
    const status = (err as { status: unknown }).status;
    if (typeof status === "number" && status >= 400 && status < 500) return status;
  }
  return undefined;
}

// Express identifies error middleware by its four-argument signature, so `next` must stay.
export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ApiError) {
    sendError(res, err.statusCode, err.code, err.message);
    return;
  }

  const parserStatus = getParserStatus(err);
  if (parserStatus === 413) {
    sendError(res, 413, "PAYLOAD_TOO_LARGE", "Request body is too large");
    return;
  }
  if (parserStatus !== undefined) {
    sendError(res, parserStatus, "BAD_REQUEST", "Malformed request");
    return;
  }

  if (env.NODE_ENV !== "test") console.error(err);
  // Never leak internal error details to clients.
  sendError(res, 500, "INTERNAL_SERVER_ERROR", "Something went wrong on our side");
};
