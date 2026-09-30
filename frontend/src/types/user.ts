export interface User {
  id: string;
  name: string;
  email: string;
  profileImage?: string;
  role?: string;
  status?: string;
  createdAt: string;
  _count?: {
    favorites: number;
    wallpapers: number;
    aiWallpapers: number;
  };
}

export interface AuthResponse {
  user: User;
  token: string;
}
