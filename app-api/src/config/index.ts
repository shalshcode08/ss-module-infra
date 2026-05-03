const required = (key: string): string => {
  const val = process.env[key];
  if (!val) throw new Error(`Missing required env var: ${key}`);
  return val;
};

export const config = {
  port: Number(required("APP_API_PORT")),
  clientUrl: required("APP_CLIENT_URL"),
  jwtSecret: required("JWT_SECRET"),
  google: {
    clientId: required("CLIENT_ID"),
    clientSecret: required("CLIENT_SECRET"),
    redirectUri: required("GOOGLE_REDIRECT_URI"),
  },
  openRouter: {
    apiKey: required("OPENROUTER_API_KEY"),
  },
} as const;

export type Config = typeof config;
