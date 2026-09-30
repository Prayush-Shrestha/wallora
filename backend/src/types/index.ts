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
