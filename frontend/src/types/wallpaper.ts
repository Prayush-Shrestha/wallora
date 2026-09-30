export type Orientation = "portrait" | "landscape" | "square" | "ultrawide";
export type DeviceKind = "phone" | "tablet" | "laptop" | "desktop" | "ultrawide";

export interface Wallpaper {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  thumbnailUrl: string;
  width: number;
  height: number;
  orientation: Orientation;
  deviceType: DeviceKind;
  categoryId?: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  authorId?: string;
  author?: {
    id: string;
    name: string;
    profileImage?: string;
  };
  isAI: boolean;
  downloads: number;
  createdAt: string;
  updatedAt?: string;
  _count?: {
    favorites: number;
    downloadRecords: number;
  };
}

export interface WallpaperFilterParams {
  category?: string;
  orientation?: string;
  deviceType?: string;
  isAI?: boolean;
  q?: string;
  sort?: "trending" | "recent" | "downloads";
  page?: number;
  limit?: number;
}
