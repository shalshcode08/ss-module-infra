import { OpenRouter } from "@openrouter/sdk";
import { config } from "../../config";
import { OPENROUTER_MODEL, type MODEL_ID } from "../constants";

const client = new OpenRouter({
  apiKey: config.openRouter.apiKey,
});

export interface StreamResult {
  iter: AsyncIterable<{ choices: Array<{ delta: { content?: string | null } }> }>;
  model: MODEL_ID;
  fallbackUsed: boolean;
}

export const streamFromOpenRouter = async (prompt: string): Promise<StreamResult> => {
  let lastError: unknown;

  for (const [i, model] of OPENROUTER_MODEL.entries()) {
    try {
      const iter = await client.chat.send({
        chatRequest: {
          stream: true,
          model: model,
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
        },
      });

      return {
        iter,
        model,
        fallbackUsed: i > 0,
      };
    } catch (error) {
      lastError = error;
      console.warn(`[openrouter] ${model} failed, trying next...`, error);
    }
  }
  throw lastError;
};
