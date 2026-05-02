import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { HttpError } from "../shared/errors/HttpError";
import { config } from "../config";
import type { JwtUser } from "../shared/types";

export const AuthMiddleware = {
  requireAuth: (req: Request, _res: Response, next: NextFunction) => {
    try {
      const token = req.cookies?.auth_token;
      if (!token) throw HttpError.unauthorized("Not authenticated");

      const user = jwt.verify(token, config.jwtSecret) as JwtUser;
      req.user = user;
      next();
    } catch {
      next(HttpError.unauthorized("Invalid or expired session"));
    }
  },
};
