const required = (key: string): string => {
  const val = process.env[key];
  if (!val) throw new Error(`Missing required env var: ${key}`);
  return val;
};

export const config = {
  port: Number(required("APP_API_PORT")),
  webappUrl: required("APP_WEB_URL"),
} as const;

export const supabaseConfig = {
  url: required("SUPABASE_URL"),
  key: required("SUPABASE_ANON_KEY"),
  serviceKey: required("SUPABASE_SERVICE_KEY"),
} as const;

export type Config = typeof config;
export type SupabaseConfig = typeof supabaseConfig;
