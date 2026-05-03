import type { NextFunction, Request, Response } from "express";
import conversationsService from "./conversations.service";
import { HttpError } from "../../shared/errors/HttpError";
import { sendCreated, sendSuccess } from "../../shared/utils/response";

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { plainText, contentJson } = req.body;

    if (!plainText?.trim()) throw HttpError.badRequest("plainText is required");

    const result = await conversationsService.createQuestion(userId, plainText, contentJson);
    sendCreated(res, result);
  } catch (err) {
    next(err);
  }
};

const stream = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const questionId = req.params.questionId as string;

    const question = await conversationsService.getQuestion(questionId);
    if (!question) throw HttpError.notFound("Question not found");
    if (question.userId !== userId) throw HttpError.forbidden();

    await conversationsService.streamSolution(questionId, req, res);
  } catch (err) {
    next(err);
  }
};

const getQuestion = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const questionId = req.params.questionId as string;

    const question = await conversationsService.getQuestion(questionId);
    if (!question) throw HttpError.notFound("Question not found");
    if (question.userId !== userId) throw HttpError.forbidden();

    sendSuccess(res, question);
  } catch (err) {
    next(err);
  }
};

const getHistory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const limit = Math.min(Number(req.query.limit) || 20, 50);
    const offset = Number(req.query.offset) || 0;

    const history = await conversationsService.getHistory(userId, limit, offset);
    sendSuccess(res, history);
  } catch (err) {
    next(err);
  }
};

const conversationsController = { create, stream, getQuestion, getHistory };

export default conversationsController;
