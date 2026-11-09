import { Router } from "express";
import { healthRouter } from "./health/health.routes";

// Every feature module registers its router here. Future modules (auth, rooms,
// bookings, ...) will be added to this file only.
export const apiV1Router = Router();

apiV1Router.use("/health", healthRouter);
