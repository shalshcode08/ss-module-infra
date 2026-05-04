import { Router } from "express";
import { AuthMiddleware } from "../../middlewares/auth.middleware";
import conversationsController from "./conversations.controller";

const conversationsRouter = Router();

conversationsRouter.use(AuthMiddleware.requireAuth);

conversationsRouter.post("/create", conversationsController.create);
conversationsRouter.get("/stream/:questionId", conversationsController.stream);
conversationsRouter.get("/question/:questionId", conversationsController.getQuestion);
conversationsRouter.get("/history", conversationsController.getHistory);
conversationsRouter.get("/home", conversationsController.getRecent);

export default conversationsRouter;
