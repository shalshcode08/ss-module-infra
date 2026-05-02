import type { Request, Response, NextFunction } from "express";
import { logger } from "../config/logger";

export function loggerMiddleware(req: Request, res: Response, next: NextFunction) {
  logger.info({ method: req.method, url: req.originalUrl }, "incoming request");
  res.on("finish", () => {
    logger.info(
      { method: req.method, url: req.originalUrl, status: res.statusCode },
      "request completed",
    );
  });
  next();
}
