const required = (key: string): string => {
  const val = process.env[key];
  if (!val) throw new Error(`Missing required env var: ${key}`);
  return val;
};

export const config = {
  port: Number(required("APP_API_PORT")),
} as const;

export type Config = typeof config;
