import { app } from "./app";
import { env } from "./config/env";

const SHUTDOWN_TIMEOUT_MS = 10_000;

const server = app.listen(env.PORT, () => {
  console.log(`StayEase API listening on http://localhost:${env.PORT}/api/v1 (${env.NODE_ENV})`);
});

function shutdown(signal: string): void {
  console.log(`${signal} received. Closing HTTP server...`);

  // Force exit if open connections keep the server from closing.
  const forceExit = setTimeout(() => {
    console.error("Graceful shutdown timed out. Forcing exit.");
    process.exit(1);
  }, SHUTDOWN_TIMEOUT_MS);
  forceExit.unref();

  server.close((error) => {
    if (error) {
      console.error("Error while closing the server:", error);
      process.exit(1);
    }
    console.log("Server closed. Goodbye.");
    process.exit(0);
  });
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
