import "./shared/types";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { config } from "./config";
import { logger } from "./config/logger";
import { loggerMiddleware } from "./middlewares/logger.middleware";
import { errorMiddleware } from "./middlewares/error.middleware";
import appRouter from "./routes";

const app = express();

const isAllowedVercelOrigin = (origin: string) => {
  try {
    const hostname = new URL(origin).hostname;
    return /^ss-module-infra-app-(webapp|website)(-.+)?\.vercel\.app$/.test(hostname);
  } catch {
    return false;
  }
};

const corsOrigin = (
  origin: string | undefined,
  callback: (err: Error | null, allow?: boolean) => void,
) => {
  if (!origin) {
    callback(null, true);
    return;
  }

  if (config.allowedOrigins.includes(origin) || isAllowedVercelOrigin(origin)) {
    callback(null, true);
    return;
  }

  callback(null, false);
};

app.set("trust proxy", 1);
app.use(cors({ origin: corsOrigin, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(loggerMiddleware);

app.use("/api/v1", appRouter);
app.use(errorMiddleware);

app.listen(config.port, () => {
  logger.info(`app-api started on port ${config.port}`);
});
