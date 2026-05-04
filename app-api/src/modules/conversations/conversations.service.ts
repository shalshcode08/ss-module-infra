import type { EventEmitter } from "events";
import type { Request, Response } from "express";
import { prisma } from "../../db";
import { QuestionStatus, StreamStatus } from "../../generated/prisma/enums";
import { streamManager, type StreamEvent } from "../../shared/services/stream-manager";
import { streamFromOpenRouter } from "../../shared/services/openrouter.service";
import { initSSE, sendSSEEvent } from "../../shared/utils/sse";

const createQuestion = async (userId: string, plainText: string, contentJson?: string) => {
  const slug = crypto.randomUUID().replace(/-/g, "").slice(0, 12);

  const question = await prisma.question.create({
    data: {
      userId,
      plainText,
      contentJson,
      slug,
      status: QuestionStatus.PENDING,
    },
  });

  const soution = await prisma.solution.create({
    data: {
      questionId: question.id,
      content: "",
      streamStatus: StreamStatus.STREAMING,
    },
  });

  const emmiter = streamManager.create(question.id);
  runStream(question.id, soution.id, plainText, emmiter);

  return {
    questionId: question.id,
    slug,
  };
};

const runStream = async (
  questionId: string,
  solutionId: string,
  prompt: string,
  emitter: EventEmitter,
) => {
  let accumulated = "";

  const flushInterval = setInterval(async () => {
    if (accumulated) {
      await prisma.solution.update({
        where: {
          id: solutionId,
        },
        data: {
          content: accumulated,
        },
      });
    }
  }, 500);

  try {
    const { iter, model, fallbackUsed } = await streamFromOpenRouter(prompt);

    for await (const chunk of iter) {
      const text = chunk.choices[0]?.delta.content ?? "";
      if (!text) {
        continue;
      }
      accumulated += text;
      emitter.emit("event", {
        type: "chunk",
        text: text,
      } satisfies StreamEvent);
    }

    clearInterval(flushInterval);

    await prisma.solution.update({
      where: {
        id: solutionId,
      },
      data: {
        content: accumulated,
        streamStatus: StreamStatus.COMPLETED,
        model,
        fallBackUsed: fallbackUsed,
        completedAt: new Date(),
      },
    });

    await prisma.question.update({
      where: { id: questionId },
      data: { status: QuestionStatus.PUBLISHED },
    });

    emitter.emit("event", { type: "done", model, fallbackUsed } satisfies StreamEvent);
  } catch (err) {
    clearInterval(flushInterval);
    const message = err instanceof Error ? err.message : "Stream failed";

    await prisma.solution.update({
      where: { id: solutionId },
      data: { streamStatus: StreamStatus.FAILED },
    });
    await prisma.question.update({
      where: { id: questionId },
      data: { status: QuestionStatus.FAILED },
    });

    emitter.emit("event", { type: "error", message } satisfies StreamEvent);
  } finally {
    streamManager.delete(questionId);
  }
};

const streamSolution = async (questionId: string, req: Request, res: Response) => {
  initSSE(res);

  const solution = await prisma.solution.findFirst({
    where: { questionId, isActive: true },
    orderBy: { createdAt: "desc" },
  });

  if (!solution) {
    sendSSEEvent(res, "error", { message: "Solution not found" });
    res.end();
    return;
  }

  if (solution.streamStatus === StreamStatus.COMPLETED) {
    sendSSEEvent(res, "catchup", { content: solution.content });
    sendSSEEvent(res, "done", {});
    res.end();
    return;
  }

  if (solution.streamStatus === StreamStatus.FAILED) {
    sendSSEEvent(res, "error", { message: "Generation failed" });
    res.end();
    return;
  }

  if (solution.content) {
    sendSSEEvent(res, "catchup", { content: solution.content });
  }

  const emitter = streamManager.get(questionId);

  if (!emitter) {
    sendSSEEvent(res, "error", { message: "Stream interrupted, please try again" });
    res.end();
    return;
  }

  const onEvent = (e: StreamEvent) => {
    if (e.type === "chunk") {
      sendSSEEvent(res, "chunk", { text: e.text });
    } else if (e.type === "done") {
      sendSSEEvent(res, "done", {});
      res.end();
    } else if (e.type === "error") {
      sendSSEEvent(res, "error", { message: e.message });
      res.end();
    }
  };

  emitter.on("event", onEvent);
  req.on("close", () => emitter.off("event", onEvent));
};

const getQuestion = async (questionId: string) => {
  return prisma.question.findFirst({
    where: {
      id: questionId,
    },
    include: {
      solutions: {
        where: {
          isActive: true,
        },
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });
};

const getHistory = async (userId: string, limit = 20, offset = 0) => {
  return prisma.question.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: limit,
    skip: offset,
    include: {
      solutions: {
        where: { isActive: true },
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { streamStatus: true, createdAt: true },
      },
    },
  });
};

const getRecentQuestions = async (userId: string) => {
  return prisma.question.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 3,
    select: { id: true, plainText: true, createdAt: true },
  });
};

const conversationsService = {
  createQuestion,
  streamSolution,
  getQuestion,
  getHistory,
  getRecentQuestions,
};

export default conversationsService;
