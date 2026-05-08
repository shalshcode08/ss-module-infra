import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, "../", "");
  const isVercel = process.env.VERCEL === "1";
  const apiBaseUrl = (
    (isVercel ? "/api/v1" : env.VITE_API_URL) ||
    env.API_URL ||
    `http://localhost:${env.APP_API_PORT || 8080}/api/v1`
  ).replace(/\/+$/, "");

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    define: {
      "import.meta.env.VITE_API_URL": JSON.stringify(apiBaseUrl),
    },
    server: {
      port: Number(env.APP_WEBAPP_PORT) || 3000,
    },
  };
});
