import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Read VITE_* variables from the single .env file in the repository root.
  envDir: "..",
  server: {
    port: 5173,
    // The backend only allows CORS from CLIENT_URL (port 5173), so fail loudly
    // instead of silently moving to another port.
    strictPort: true,
  },
});
