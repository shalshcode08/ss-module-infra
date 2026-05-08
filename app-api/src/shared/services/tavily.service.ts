import { tavily } from "@tavily/core";
import { config } from "../../config";

const client = tavily({ apiKey: config.tavily.apiKey });

export interface TavilyImageSet {
  id: string;
  urls: string[];
  favicons: string[];
}

export const fetchImages = async (query: string): Promise<TavilyImageSet | null> => {
  try {
    const result = await client.search(query, {
      searchDepth: "basic",
      includeImages: true,
      includeFavicon: true,
      maxResults: 5,
    });

    const urls = (result.images ?? []).slice(0, 5).map((img) => img.url);
    if (urls.length === 0) return null;

    const favicons = (result.results ?? [])
      .map((r) => r.favicon)
      .filter((f): f is string => !!f)
      .slice(0, 5);

    return {
      id: crypto.randomUUID().replace(/-/g, "").slice(0, 12),
      urls,
      favicons,
    };
  } catch {
    return null;
  }
};
