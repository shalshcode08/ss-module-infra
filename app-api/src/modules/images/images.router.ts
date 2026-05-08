import { Router } from "express";
import imagesController from "./images.controller";

const imagesRouter = Router();

imagesRouter.get("/question/:questionId", imagesController.getQuestionImages);

export default imagesRouter;
