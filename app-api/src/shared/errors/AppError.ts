export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly isOperational: boolean;
  public readonly details?: unknown;

  constructor({
    message,
    statusCode = 500,
    code = "INTERNAL_ERROR",
    isOperational = true,
    details,
  }: {
    message: string;
    statusCode?: number;
    code?: string;
    isOperational?: boolean;
    details?: unknown;
  }) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = isOperational;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}
