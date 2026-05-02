import type { Request, Response, NextFunction } from "express";
import { HttpError } from "../../shared/errors/HttpError";
import { AuthService } from "./auth.service";
import { sendSuccess } from "../../shared/utils/response";
import { config } from "../../config";

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax" as const,
  maxAge: 30 * 24 * 60 * 60 * 1000,
};

export const AuthController = {
  redirectToGoogle: (_req: Request, res: Response, next: NextFunction) => {
    try {
      res.redirect(AuthService.getGoogleAuthUrl());
    } catch (err) {
      next(err);
    }
  },

  handleCallback: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const code = req.query.code as string;
      if (!code) throw HttpError.badRequest("Missing authorization code");

      const jwtToken = await AuthService.handleCallback(code);
      res.cookie("auth_token", jwtToken, COOKIE_OPTIONS);
      res.redirect(`${config.clientUrl}/home`);
    } catch (err) {
      next(err);
    }
  },

  me: (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw HttpError.unauthorized("Not authenticated");
      sendSuccess(res, req.user);
    } catch (err) {
      next(err);
    }
  },

  logout: (_req: Request, res: Response, next: NextFunction) => {
    try {
      res.clearCookie("auth_token");
      sendSuccess(res, { message: "Logged out" });
    } catch (err) {
      next(err);
    }
  },
};
