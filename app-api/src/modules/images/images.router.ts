import { Router } from "express";
import imagesController from "./images.controller";

const imagesRouter = Router();

imagesRouter.get("/:imageId", imagesController.getImage);

export default imagesRouter;
