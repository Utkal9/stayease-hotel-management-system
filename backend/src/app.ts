import cors from "cors";
import express from "express";
import helmet from "helmet";
import { env } from "./config/env";
import { errorHandler } from "./middleware/errorHandler";
import { notFoundHandler } from "./middleware/notFoundHandler";
import { apiV1Router } from "./modules";

export function createApp() {
  const app = express();

  app.disable("x-powered-by");
  app.use(helmet());
  app.use(cors({ origin: env.CLIENT_URL }));
  app.use(express.json({ limit: "100kb" }));

  app.use("/api/v1", apiV1Router);

  // Order matters: 404 after all routes, error handler last.
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

export const app = createApp();
