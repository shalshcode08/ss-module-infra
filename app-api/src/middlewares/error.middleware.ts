import type { Request, Response, NextFunction } from "express";
import { AppError } from "../shared/errors/AppError";
import { logger } from "../config/logger";

export function errorMiddleware(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (err instanceof AppError && err.isOperational) {
    res.status(err.statusCode).json({
      code: err.code,
      message: err.message,
      details: err.details,
    });
    return;
  }

  logger.error(
    { err, method: req.method, url: req.originalUrl },
    "unexpected error",
  );

  res.status(500).json({
    code: "INTERNAL_ERROR",
    message: "Internal Server Error",
  });
}
