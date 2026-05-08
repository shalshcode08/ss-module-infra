import type { CookieOptions, Request, Response, NextFunction } from "express";
import { HttpError } from "../../shared/errors/HttpError";
import { AuthService } from "./auth.service";
import { sendSuccess } from "../../shared/utils/response";
import { config } from "../../config";

const getCookieOptions = (req: Request): CookieOptions => {
  const forwardedProto = req.get("x-forwarded-proto")?.split(",")[0]?.trim();
  const isHttps = req.secure || forwardedProto === "https";
  return {
    httpOnly: true,
    sameSite: isHttps ? "none" : "lax",
    secure: isHttps,
    path: "/",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  };
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
      res.clearCookie("auth_token", { path: "/api/v1/auth" });
      res.cookie("auth_token", jwtToken, getCookieOptions(req));
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
      res.clearCookie("auth_token", { path: "/api/v1/auth" });
      res.clearCookie("auth_token", { path: "/" });
      sendSuccess(res, { message: "Logged out" });
    } catch (err) {
      next(err);
    }
  },
};
