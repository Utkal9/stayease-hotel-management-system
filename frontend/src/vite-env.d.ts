/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Public value baked into the bundle at build time. Never put secrets in VITE_ variables.
  readonly VITE_API_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
