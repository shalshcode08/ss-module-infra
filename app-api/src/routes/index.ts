import type { Request, Response } from "express";
import { Router } from "express";
import authRouter from "../modules/auth/auth.router";
import { sendSuccess } from "../shared/utils/response";

const appRouter = Router();

appRouter.get("/health", (_req: Request, res: Response) => {
  sendSuccess(res, {
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

appRouter.use("/auth", authRouter);

export default appRouter;
