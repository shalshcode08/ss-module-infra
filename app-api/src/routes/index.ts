import type { Request, Response } from "express";
import { Router } from "express";
import authRouter from "../modules/auth/auth.router";
import { sendSuccess } from "../shared/utils/response";
import configRouter from "../modules/config/config.route";

const appRouter = Router();

appRouter.get("/health", (_req: Request, res: Response) => {
  sendSuccess(res, {
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

appRouter.use("/auth", authRouter);
appRouter.use("/config", configRouter);

export default appRouter;
