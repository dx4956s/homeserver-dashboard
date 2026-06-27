import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { probeApiPlugin } from "./src/server/probeApiPlugin.js";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), probeApiPlugin()],
});
