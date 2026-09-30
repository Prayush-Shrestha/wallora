export interface AIWallpaper {
  id: string;
  userId?: string;
  prompt: string;
  style?: string;
  orientation?: string;
  resolution?: string;
  imageUrl: string;
  createdAt: string;
}

export interface GenerateAIRequest {
  prompt: string;
  style?: string;
  orientation?: "portrait" | "landscape" | "square" | "ultrawide";
  resolution?: "standard" | "4k";
}
