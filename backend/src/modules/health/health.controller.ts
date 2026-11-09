import type { RequestHandler } from "express";
import { sendSuccess } from "../../utils/apiResponse";
import { getHealthStatus } from "./health.service";

export const getHealth: RequestHandler = (_req, res) => {
  sendSuccess(res, "StayEase API is running", getHealthStatus());
};
