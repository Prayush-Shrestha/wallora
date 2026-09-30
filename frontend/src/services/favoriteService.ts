import { apiClient } from "./api";
import { Wallpaper } from "../types/wallpaper";

export async function fetchFavorites(): Promise<Wallpaper[]> {
  const res = await apiClient<{ success: boolean; data: { favorites: Wallpaper[] } }>("/favorites");
  return res.data.favorites;
}

export async function toggleFavorite(wallpaperId: string): Promise<{ isFavorite: boolean }> {
  const res = await apiClient<{ success: boolean; data: { isFavorite: boolean } }>(
    `/favorites/${wallpaperId}`,
    { method: "POST" }
  );
  return res.data;
}
