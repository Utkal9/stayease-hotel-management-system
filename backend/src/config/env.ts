import path from "node:path";
import dotenv from "dotenv";
import { z } from "zod";

// The single .env file lives in the repository root and is shared by the
// backend, the frontend (Vite) and Docker Compose. This path resolves to the
// repo root from both src/config (dev) and dist/config (production build).
dotenv.config({ path: path.resolve(__dirname, "../../../.env"), quiet: true });

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().min(1).max(65535).default(4000),
  CLIENT_URL: z.url().default("http://localhost:5173"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  // Fail fast: a misconfigured server should never start half-working.
  throw new Error(`Invalid environment configuration:\n${z.prettifyError(parsed.error)}`);
}

export const env = parsed.data;
