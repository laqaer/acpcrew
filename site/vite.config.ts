import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Public-facing landing site. A relative base keeps assets resolving at the
// Pages root and also survives a move to a /acpcrew/ subpath if the GitHub
// slug stays the repo name.
export default defineConfig({
  base: "./",
  plugins: [react(), tailwindcss()],
  server: { port: 3000 },
  build: { outDir: "dist" },
  test: { environment: "jsdom", setupFiles: ["./tests/setup.ts"], globals: true },
});
