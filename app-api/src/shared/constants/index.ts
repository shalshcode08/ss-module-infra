export const OPENROUTER_MODEL = [
  "meta-llama/llama-3.3-70b-instruct:free",
  "qwen/qwen3-next-80b-a3b-instruct:free",
  "z-ai/glm-4.5-air:free",
] as const;

export type MODEL_ID = (typeof OPENROUTER_MODEL)[number];
