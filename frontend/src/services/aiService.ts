import { apiClient } from "./api";
import { AIWallpaper, GenerateAIRequest } from "../types/ai";

export async function generateAIWallpaper(data: GenerateAIRequest): Promise<AIWallpaper> {
  const res = await apiClient<{ success: boolean; data: { wallpaper: AIWallpaper } }>("/ai/generate", {
    method: "POST",
    body: JSON.stringify(data),
  });

  return res.data.wallpaper;
}

export async function fetchUserCreations(): Promise<AIWallpaper[]> {
  const res = await apiClient<{ success: boolean; data: { creations: AIWallpaper[] } }>("/ai/creations");
  return res.data.creations;
}
