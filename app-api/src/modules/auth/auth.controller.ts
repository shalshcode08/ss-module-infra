import type { Request, Response, NextFunction } from "express";
import { HttpError } from "../../shared/errors/HttpError";
import { AuthService } from "./auth.service";
import { sendSuccess } from "../../shared/utils/response";

/**
 * authController handles the authentication and authorization of users.
 * routes it handles:
 * GET /auth/me
 * POST /auth/login
 */

export const AuthController = {
  me: async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw HttpError.unauthorized("User not found");
      }
      sendSuccess(res, req.user);
    } catch (error) {
      next(error);
    }
  },

  login: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.replace("Bearer ", "");
      if (!token) {
        throw HttpError.unauthorized("Token not found");
      }

      const user = await AuthService.login(token);
      sendSuccess(res, user);
    } catch (error) {
      next(error);
    }
  },
};
