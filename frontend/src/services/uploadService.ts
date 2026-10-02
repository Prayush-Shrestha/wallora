import { apiClient } from "./api";
import { Wallpaper } from "../types/wallpaper";

// Upload service — keeps FormData / fetch logic out of pages.
// Pages call uploadWallpaper() instead of writing fetch() inline.

export interface UploadWallpaperInput {
  file: File;
  title: string;
  description?: string;
  category?: string;
  tags?: string[];
  deviceType?: string;
  resolution?: string;
}

export async function uploadWallpaper(input: UploadWallpaperInput): Promise<Wallpaper> {
  const formData = new FormData();
  formData.append("image", input.file);
  formData.append("title", input.title);
  if (input.description) formData.append("description", input.description);
  if (input.category) formData.append("category", input.category);
  if (input.tags && input.tags.length > 0) formData.append("tags", input.tags.join(","));
  if (input.deviceType) formData.append("deviceType", input.deviceType);
  if (input.resolution) formData.append("resolution", input.resolution);

  const res = await apiClient<{
    success: boolean;
    message: string;
    data: { wallpaper: Wallpaper };
  }>("/wallpapers", { method: "POST", body: formData });

  return res.data.wallpaper;
}
