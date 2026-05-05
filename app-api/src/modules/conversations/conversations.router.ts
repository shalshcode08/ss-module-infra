import { Router } from "express";
import { AuthMiddleware } from "../../middlewares/auth.middleware";
import conversationsController from "./conversations.controller";

const conversationsRouter = Router();
const auth = AuthMiddleware.requireAuth;

conversationsRouter.get("/public/chats", conversationsController.getAllPublicChats);
conversationsRouter.get(
  "/public/chats/:questionSlug",
  conversationsController.getPublicChatByQuestionSlug,
);
conversationsRouter.post("/create", auth, conversationsController.create);
conversationsRouter.get("/stream/:questionId", auth, conversationsController.stream);
conversationsRouter.get("/question/:questionId", auth, conversationsController.getQuestion);
conversationsRouter.get("/history", auth, conversationsController.getHistory);
conversationsRouter.get("/home", auth, conversationsController.getRecent);

export default conversationsRouter;
