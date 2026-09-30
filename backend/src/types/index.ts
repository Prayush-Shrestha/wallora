import { Request } from "express";

export interface UserPayload {
  id: string;
  email: string;
  name: string;
  role?: string;
}

export interface AuthRequest extends Request {
  user?: UserPayload;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface WallpaperFilterOptions {
  category?: string;
  orientation?: string;
  deviceType?: string;
  isAI?: boolean;
  q?: string;
  sort?: "trending" | "recent" | "downloads";
  page?: number;
  limit?: number;
}

export type AssetType =
  | "ORIGINAL_AI"
  | "USER_UPLOAD"
  | "THIRD_PARTY_LICENSED"
  | "DEMO_PLACEHOLDER";

export type LicenseType =
  | "AI_PROVIDER_TERMS"
  | "USER_OWNED"
  | "CC0_PUBLIC_DOMAIN"
  | "COMMERCIAL_LICENSED"
  | "DEMO_ONLY";

export type ReferenceImageType =
  | "NONE"
  | "USER_UPLOADED"
  | "LICENSED_STOCK";
