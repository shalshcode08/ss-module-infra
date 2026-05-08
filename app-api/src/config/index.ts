const required = (key: string): string => {
  const val = process.env[key];
  if (!val) throw new Error(`Missing required env var: ${key}`);
  return val;
};

const parseAllowedOrigins = (): string[] => {
  const raw = process.env.ALLOWED_ORIGINS ?? "";
  if (raw)
    return raw
      .split(",")
      .map((o) => o.trim())
      .filter(Boolean);
  return [required("APP_CLIENT_URL"), required("APP_WEBSITE_URL")];
};

export const config = {
  port: Number(process.env.PORT ?? required("APP_API_PORT")),
  clientUrl: required("APP_CLIENT_URL"),
  allowedOrigins: parseAllowedOrigins(),
  jwtSecret: required("JWT_SECRET"),
  google: {
    clientId: required("CLIENT_ID"),
    clientSecret: required("CLIENT_SECRET"),
    redirectUri: required("GOOGLE_REDIRECT_URI"),
  },
  openRouter: {
    apiKey: required("OPENROUTER_API_KEY"),
  },
  tavily: {
    apiKey: required("TAVILY_API_KEY"),
  },
} as const;

export type Config = typeof config;
