import { Router } from "express";
import { AuthMiddleware } from "../../middlewares/auth.middleware";
import { AuthController } from "./auth.controller";

const router = Router();

router.get("/google", AuthController.redirectToGoogle);
router.get("/callback", AuthController.handleCallback);
router.get("/me", AuthMiddleware.requireAuth, AuthController.me);
router.post("/logout", AuthMiddleware.requireAuth, AuthController.logout);

export default router;
