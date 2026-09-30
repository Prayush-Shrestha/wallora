import { apiClient } from "./api";
import { Wallpaper, WallpaperFilterParams } from "../types/wallpaper";

export async function fetchWallpapers(params: WallpaperFilterParams = {}) {
  const query = new URLSearchParams();

  if (params.category && params.category !== "all") query.set("category", params.category);
  if (params.orientation && params.orientation !== "all") query.set("orientation", params.orientation);
  if (params.deviceType && params.deviceType !== "all") query.set("deviceType", params.deviceType);
  if (params.isAI !== undefined) query.set("isAI", String(params.isAI));
  if (params.q) query.set("q", params.q);
  if (params.sort) query.set("sort", params.sort);
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));

  const qs = query.toString();
  const res = await apiClient<{
    success: boolean;
    data: {
      wallpapers: Wallpaper[];
      pagination: { total: number; page: number; limit: number; totalPages: number };
    };
  }>(`/wallpapers${qs ? `?${qs}` : ""}`);

  return res.data;
}

export async function fetchWallpaperById(id: string) {
  const res = await apiClient<{
    success: boolean;
    data: {
      wallpaper: Wallpaper;
      similar: Wallpaper[];
    };
  }>(`/wallpapers/${id}`);

  return res.data;
}

export async function downloadWallpaper(id: string) {
  const res = await apiClient<{ success: boolean; data: { downloads: number } }>(
    `/wallpapers/${id}/download`,
    { method: "POST" }
  );
  return res.data;
}

export async function uploadWallpaper(formData: FormData) {
  const res = await apiClient<{ success: boolean; message: string; data: { wallpaper: Wallpaper } }>(
    "/wallpapers",
    {
      method: "POST",
      body: formData,
    }
  );
  return res.data;
}
