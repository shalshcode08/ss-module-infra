import type { NextFunction, Request, Response } from "express";
import { prisma } from "../../db";
import { sendSuccess } from "../../shared/utils/response";

const getQuestionImages = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const questionId = req.params.questionId as string;

    const image = await prisma.questionImage.findUnique({
      where: { questionId },
      select: { id: true, urls: true, favicons: true },
    });

    sendSuccess(res, image ?? { id: null, urls: [], favicons: [] });
  } catch (err) {
    next(err);
  }
};

const imagesController = { getQuestionImages };

export default imagesController;
