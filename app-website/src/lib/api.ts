const API_BASE =
  process.env.API_URL ?? `http://localhost:${process.env.APP_API_PORT ?? 8080}/api/v1`;

type ApiResponse<T> = { success: true; data: T };

export type Solution = {
  id: string;
  content: string;
  streamStatus: string;
  model: string | null;
  createdAt: string;
};

export type Question = {
  id: string;
  plainText: string;
  slug: string;
  createdAt: string;
  solutions: Solution[];
};

export type PublicChatsPage = {
  data: Question[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export async function fetchPublicChats(page = 1, limit = 10): Promise<PublicChatsPage> {
  const res = await fetch(`${API_BASE}/conversations/public/chats?page=${page}&limit=${limit}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch chats");
  const json: ApiResponse<PublicChatsPage> = await res.json();
  return json.data;
}

export async function fetchPublicChatBySlug(slug: string): Promise<Question | null> {
  const res = await fetch(`${API_BASE}/conversations/public/chats/${slug}`, {
    cache: "no-store",
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Failed to fetch chat");
  const json: ApiResponse<Question> = await res.json();
  return json.data;
}
