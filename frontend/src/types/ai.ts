export interface AIWallpaper {
  id: string;
  userId?: string | null;
  prompt: string;
  enhancedPrompt?: string;
  negativePrompt?: string;
  style?: string;
  category?: string;
  orientation?: string;
  resolution?: string;
  aspectRatio?: string;
  dimensions?: { width: number; height: number };
  imageUrl: string;
  provider?: string;
  createdAt: string;
}

export interface GenerateAIRequest {
  prompt: string;
  style?: string;
  category?: string;
  orientation?: "portrait" | "landscape" | "square" | "ultrawide" | "tablet";
  resolution?: "standard" | "4k";
  negativePrompt?: string;
  provider?: "auto" | "replicate" | "openai" | "flux-free";
}
