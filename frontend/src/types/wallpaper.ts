export type Orientation = "portrait" | "landscape" | "square" | "ultrawide";
export type DeviceKind = "phone" | "tablet" | "laptop" | "desktop" | "ultrawide";
export type AssetProvenance = "ORIGINAL_AI" | "USER_UPLOAD" | "THIRD_PARTY_LICENSED" | "DEMO_PLACEHOLDER";
export type LicenseKind = "AI_PROVIDER_TERMS" | "USER_OWNED" | "CC0_PUBLIC_DOMAIN" | "COMMERCIAL_LICENSED" | "DEMO_ONLY";

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
  assetType?: AssetProvenance;
  licenseType?: LicenseKind;
  attribution?: string;
  originUrl?: string;
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

