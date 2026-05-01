import type { NextFunction, Request, Response } from "express";
import { HttpError } from "../shared/errors/HttpError";
import { supabase } from "../config/supabase";
import { prisma } from "../db";

export const AuthMiddleware = {
  requireAuth: async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.replace("Bearer ", "");
      if (!token) {
        throw HttpError.unauthorized("No token provided");
      }

      const { data, error } = await supabase.auth.getUser(token);
      if (error || !data.user) {
        throw HttpError.unauthorized("Invalid token");
      }

      const user = await prisma.user.findUnique({
        where: {
          supabaseId: data.user.id,
        },
      });

      if (!user) {
        throw HttpError.unauthorized("User not found");
      }

      req.user = user;
      next();
    } catch (err) {
      next(err);
    }
  },
};
