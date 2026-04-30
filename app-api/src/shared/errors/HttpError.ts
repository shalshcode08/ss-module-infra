import { AppError } from "./AppError";

export class HttpError extends AppError {
  static badRequest(message = "Bad Request", details?: unknown) {
    return new HttpError({
      message,
      statusCode: 400,
      code: "BAD_REQUEST",
      details,
    });
  }

  static unauthorized(message = "Unauthorized") {
    return new HttpError({
      message,
      statusCode: 401,
      code: "UNAUTHORIZED",
    });
  }

  static forbidden(message = "Forbidden") {
    return new HttpError({
      message,
      statusCode: 403,
      code: "FORBIDDEN",
    });
  }

  static notFound(message = "Not Found") {
    return new HttpError({
      message,
      statusCode: 404,
      code: "NOT_FOUND",
    });
  }

  static conflict(message = "Conflict") {
    return new HttpError({
      message,
      statusCode: 409,
      code: "CONFLICT",
    });
  }

  static unprocessable(message = "Unprocessable Entity", details?: unknown) {
    return new HttpError({
      message,
      statusCode: 422,
      code: "UNPROCESSABLE_ENTITY",
      details,
    });
  }

  static tooManyRequests(message = "Too Many Requests") {
    return new HttpError({
      message,
      statusCode: 429,
      code: "TOO_MANY_REQUESTS",
    });
  }

  static internal(message = "Internal Server Error") {
    return new HttpError({
      message,
      statusCode: 500,
      code: "INTERNAL_ERROR",
      isOperational: false,
    });
  }
}
