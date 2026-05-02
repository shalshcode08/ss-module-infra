import { Router } from "express";
import { configController } from "./config.controller";
import { AuthMiddleware } from "../../middlewares/auth.middleware";

const configRouter = Router();

configRouter.get("/", AuthMiddleware.requireAuth, configController.getUserConfig);

export default configRouter;
