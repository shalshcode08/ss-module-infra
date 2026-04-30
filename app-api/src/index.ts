import express from "express";
import { config } from "./config";
import { logger } from "./config/logger";
import { loggerMiddleware } from "./middlewares/logger.middleware";

const app = express();

app.use(express.json());
app.use(loggerMiddleware);

app.listen(config.port, () => {
  logger.info(`app-api started on port ${config.port}`);
});
