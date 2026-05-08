import { tavily } from "@tavily/core";
import { config } from "../../config";

const client = tavily({ apiKey: config.tavily.apiKey });

export interface TavilyImage {
  id: string;
  url: string;
  position: number;
}

export const fetchImages = async (query: string): Promise<TavilyImage[]> => {
  try {
    const result = await client.search(query, {
      searchDepth: "basic",
      includeImages: true,
      maxResults: 3,
    });

    const images = result.images ?? [];

    return images.slice(0, 3).map((img, i) => ({
      id: crypto.randomUUID().replace(/-/g, "").slice(0, 12),
      url: img.url,
      position: i,
    }));
  } catch {
    return [];
  }
};
