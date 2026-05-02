import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, "../", "");
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    define: {
      "import.meta.env.VITE_API_URL": JSON.stringify(
        `http://localhost:${env.APP_API_PORT}/api/v1`,
      ),
      "import.meta.env.VITE_SUPABASE_URL": JSON.stringify(env.SUPABASE_URL),
      "import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY": JSON.stringify(
        env.SUPABASE_PUBLISHABLE_KEY,
      ),
    },
    server: {
      port: Number(env.APP_WEBAPP_PORT) || 3000,
    },
  };
});
