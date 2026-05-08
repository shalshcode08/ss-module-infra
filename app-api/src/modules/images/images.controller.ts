import type { NextFunction, Request, Response } from "express";
import { prisma } from "../../db";
import { HttpError } from "../../shared/errors/HttpError";
import { sendSuccess } from "../../shared/utils/response";

const getImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const imageId = req.params.imageId as string;

    const image = await prisma.questionImage.findUnique({
      where: { id: imageId },
      select: { url: true },
    });

    if (!image) throw HttpError.notFound("Image not found");

    sendSuccess(res, { url: image.url });
  } catch (err) {
    next(err);
  }
};

const imagesController = { getImage };

export default imagesController;
