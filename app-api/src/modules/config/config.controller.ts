import type { NextFunction, Request, Response } from "express";
import { configService } from "./config.service";
import { sendSuccess } from "../../shared/utils/response";

export const configController = {
  getUserConfig: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const config = await configService.getConfig(req.user!.id);
      sendSuccess(res, config);
    } catch (err) {
      next(err);
    }
  },
};
