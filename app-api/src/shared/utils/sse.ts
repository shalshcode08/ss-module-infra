import type { Response } from "express";

export const initSSE = (res: Response): void => {
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");
  res.flushHeaders();
};

export const sendSSEEvent = (
  res: Response,
  event: string,
  data: Record<string, unknown> | string,
): void => {
  const payload = typeof data === "string" ? data : JSON.stringify(data);
  res.write(`event: ${event}\ndata: ${payload}\n\n`);
};

// export const sendSSEError = (res: Response, error: string): void => {
//   sendSSEEvent(res, "error", error);
// };

// export const sendSSEResponse = (res: Response, data: Record<string, unknown>): void => {
//   sendSSEEvent(res, "response", data);
// };

// export const endSSE = (res: Response): void => {
//   res.end();
// };
