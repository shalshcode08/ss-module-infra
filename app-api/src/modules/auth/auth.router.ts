import { Router } from "express";
import { AuthMiddleware } from "../../middlewares/auth.middleware";
import { AuthController } from "./auth.controller";

const router = Router();

router.post("/login", AuthController.login);
router.get("/me", AuthMiddleware.requireAuth, AuthController.me);

export default router;
