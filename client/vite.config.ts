import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 5173,
    host: true, // Listen on all addresses, such that the frontend can be accessed outside the docker container
  },
  plugins: [react()],
});
