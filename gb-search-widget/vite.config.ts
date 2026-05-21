import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 4100,
    cors: true,
    strictPort: true,
  },
  build: {
    lib: {
      entry: "src/main.tsx",
      name: "GbSearchWidget",
      fileName: "gb-search-widget",
      formats: ["es"],
    },
  },
});
