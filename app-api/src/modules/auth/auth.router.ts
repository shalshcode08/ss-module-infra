import { Router } from "express";
import { AuthMiddleware } from "../../middlewares/auth.middleware";
import { AuthController } from "./auth.controller";

const authRouter = Router();

authRouter.get("/google", AuthController.redirectToGoogle);
authRouter.get("/callback", AuthController.handleCallback);
authRouter.get("/me", AuthMiddleware.requireAuth, AuthController.me);
authRouter.post("/logout", AuthMiddleware.requireAuth, AuthController.logout);

export default authRouter;
