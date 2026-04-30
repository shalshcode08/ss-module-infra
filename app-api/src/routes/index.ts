import type { Request, Response } from "express";
import { Router } from "express";

const appRouter = Router();

// Heath Route - initial route
appRouter.get("/health", async (_req: Request, res: Response) => {
  try {
    res.status(200).json({
      status: "ok",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to check health",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default appRouter;
