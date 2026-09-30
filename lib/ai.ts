import type { DeviceKind, Orientation } from "./data";

export interface AIOptions {
  style: string;
  orientation: Orientation;
  resolution: string;
  mood: string;
  color: string;
}

export interface AIResult {
  id: string;
  image: string;
  prompt: string;
  options: AIOptions;
  seed: string;
  createdAt: string;
}

/**
 * Image-generation abstraction.
 *
 * To connect a real provider (Replicate, Fal, OpenAI Images, etc.):
 *  1. Set WALLORA_IMAGE_API_URL + WALLORA_IMAGE_API_KEY in .env
 *  2. Replace the mock branch inside generateWallpaper() with a fetch()
 *     to your provider. The UI already handles loading / error / retry,
 *     so no UI rewrite is needed.
 */
export async function generateWallpaper(
  prompt: string,
  options: AIOptions,
  onProgress?: (p: number) => void
): Promise<AIResult> {
  const apiUrl = process.env.NEXT_PUBLIC_WALLORA_IMAGE_API_URL;

  if (apiUrl) {
    // Real provider path (kept minimal — wire your endpoint here).
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, ...options }),
    });
    if (!res.ok) throw new Error("Image provider failed. Try again.");
    const data = await res.json();
    return {
      id: `ai-${Date.now()}`,
      image: data.imageUrl,
      prompt,
      options,
      seed: data.seed ?? String(Date.now()),
      createdAt: new Date().toISOString(),
    };
  }

  // ---- Mock provider: deterministic seed from prompt so results feel stable ----
  const seed = `ai-${hashPrompt(prompt + options.style + options.color)}`;
  const dims = dimsFor(options.orientation, options.resolution);

  // Elegant staged progress (UI shows "Creating your wallpaper...")
  const stages = [8, 24, 47, 68, 86, 97];
  for (const p of stages) {
    await wait(380 + Math.random() * 420);
    onProgress?.(p);
  }
  onProgress?.(100);

  return {
    id: `ai-${Date.now()}`,
    image: `https://picsum.photos/seed/${seed}/${dims.w}/${dims.h}`,
    prompt,
    options,
    seed,
    createdAt: new Date().toISOString(),
  };
}

function hashPrompt(s: string): string {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h.toString(36);
}

function dimsFor(o: Orientation, res: string) {
  const scale = res === "4K" ? 1 : res === "Full HD" ? 0.8 : 0.6;
  const base =
    o === "portrait" ? { w: 1080, h: 1920 }
    : o === "ultrawide" ? { w: 1720, h: 720 }
    : o === "square" ? { w: 1080, h: 1080 }
    : { w: 1920, h: 1080 };
  // Picsum caps sensibly — keep preview fast
  const w = Math.min(1600, Math.round(base.w * scale));
  const h = Math.round((w * base.h) / base.w);
  return { w, h };
}

function wait(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export const AI_STYLES = ["Photorealistic","Anime","Illustration","Minimal","3D","Cinematic","Abstract","Fantasy","Pixel Art"];
export const AI_ORIENTATIONS: { label: string; value: Orientation; ratio: string }[] = [
  { label: "Phone", value: "portrait", ratio: "9:19.5" },
  { label: "Desktop", value: "landscape", ratio: "16:9" },
  { label: "Square", value: "square", ratio: "1:1" },
  { label: "Ultrawide", value: "ultrawide", ratio: "21:9" },
];
export const AI_RESOLUTIONS = ["HD","Full HD","4K"];
export const AI_MOODS = ["Dark","Bright","Calm","Energetic","Dreamy","Dramatic"];
export const AI_COLORS = ["Any","Black","White","Blue","Red","Purple","Green","Orange"];
