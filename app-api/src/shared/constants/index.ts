export const OPENROUTER_MODEL = [
  "z-ai/glm-4.5-air:free",
  "minimax/minimax-m2.5:free",
  "google/gemma-3-12b-it:free",
] as const;

export type MODEL_ID = (typeof OPENROUTER_MODEL)[number];
