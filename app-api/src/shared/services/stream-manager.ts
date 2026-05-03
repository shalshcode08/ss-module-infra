import EventEmitter from "events";

export type StreamEvent =
  | { type: "chunk"; text: string }
  | { type: "done"; model: string; fallbackUsed: boolean }
  | { type: "error"; message: string };

class SteamManger {
  private streams = new Map<string, EventEmitter>();

  has(questionId: string): boolean {
    return this.streams.has(questionId);
  }

  create(questionId: string): EventEmitter {
    const emmiter = new EventEmitter();

    emmiter.setMaxListeners(20);
    this.streams.set(questionId, emmiter);
    return emmiter;
  }

  get(questionId: string): EventEmitter | undefined {
    return this.streams.get(questionId);
  }

  delete(questionId: string): void {
    this.streams.delete(questionId);
  }
}

export const streamManager = new SteamManger();
