import "./shared/types";
import express from "express";
import { config } from "./config";
import { logger } from "./config/logger";
import { loggerMiddleware } from "./middlewares/logger.middleware";
import { errorMiddleware } from "./middlewares/error.middleware";
import appRouter from "./routes";

const app = express();

app.use(express.json());
app.use(loggerMiddleware);

app.use("/api/v1", appRouter);
app.use(errorMiddleware);

app.listen(config.port, () => {
  logger.info(`app-api started on port ${config.port}`);
});
