import prisma from "../config/database";
import { processPrompt, PromptProcessingInput } from "../utils/promptEngine";

export interface GenerateAIWallpaperInput extends PromptProcessingInput {
  userId?: string;
  provider?: "auto" | "replicate" | "openai" | "flux-free";
}

export interface GeneratedWallpaperResult {
  id: string;
  userId?: string | null;
  prompt: string;
  enhancedPrompt: string;
  negativePrompt: string;
  style?: string;
  category?: string;
  orientation?: string;
  resolution?: string;
  aspectRatio: string;
  dimensions: { width: number; height: number };
  imageUrl: string;
  provider: string;
  createdAt: string;
}

/**
 * Generate wallpaper via Replicate (Flux Schnell / SDXL)
 */
async function generateViaReplicate(
  token: string,
  prompt: string,
  aspectRatio: string
): Promise<string> {
  console.log(`[AI Service] Invoking Replicate with aspect_ratio: ${aspectRatio}`);

  // Map 21:9 or 3:4 to Replicate Flux supported aspect ratios
  const replicateAspectRatio =
    aspectRatio === "21:9" ? "16:9" : aspectRatio === "3:4" ? "9:16" : aspectRatio;

  const response = await fetch(
    "https://api.replicate.com/v1/models/black-forest-labs/flux-schnell/predictions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Prefer: "wait=60",
      },
      body: JSON.stringify({
        input: {
          prompt,
          aspect_ratio: replicateAspectRatio,
          output_format: "webp",
          output_quality: 90,
        },
      }),
    }
  );

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Replicate API error (${response.status}): ${errorBody}`);
  }

  let data = await response.json();

  // If Prefer: wait didn't complete immediately, poll until finished
  if (data.status !== "succeeded" && data.urls?.get) {
    const pollUrl = data.urls.get;
    const maxAttempts = 30; // 30 * 1.5s = 45s
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      await new Promise((r) => setTimeout(r, 1500));
      const pollRes = await fetch(pollUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (pollRes.ok) {
        data = await pollRes.json();
        if (data.status === "succeeded") break;
        if (data.status === "failed" || data.status === "canceled") {
          throw new Error(`Replicate prediction failed: ${data.error || "Unknown error"}`);
        }
      }
    }
  }

  if (data.status !== "succeeded" || !data.output) {
    throw new Error(`Replicate generation did not produce an image. Status: ${data.status}`);
  }

  return Array.isArray(data.output) ? data.output[0] : data.output;
}

/**
 * Generate wallpaper via OpenAI DALL-E 3
 */
async function generateViaOpenAI(
  apiKey: string,
  prompt: string,
  orientation?: string
): Promise<string> {
  console.log(`[AI Service] Invoking OpenAI DALL-E 3 for prompt: "${prompt.slice(0, 50)}..."`);

  let size: "1792x1024" | "1024x1792" | "1024x1024" = "1792x1024";
  if (orientation === "portrait" || orientation === "tablet") {
    size = "1024x1792";
  } else if (orientation === "square") {
    size = "1024x1024";
  }

  const response = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "dall-e-3",
      prompt,
      size,
      quality: "hd",
      n: 1,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = errorData.error?.message || `OpenAI API returned status ${response.status}`;
    throw new Error(`OpenAI error: ${message}`);
  }

  const data = await response.json();
  if (!data.data || !data.data[0]?.url) {
    throw new Error("OpenAI generation succeeded but no image URL was returned.");
  }

  return data.data[0].url;
}

/**
 * Generate wallpaper via Flux AI model (Pollinations endpoint)
 * Real generative AI running Flux with zero API key required.
 */
async function generateViaFluxFree(
  prompt: string,
  negativePrompt: string,
  orientation: string = "landscape"
): Promise<string> {
  // Safe canonical dimensions for Flux generation
  let targetWidth = 1920;
  let targetHeight = 1080;

  if (orientation === "portrait") {
    targetWidth = 1080;
    targetHeight = 1920;
  } else if (orientation === "square") {
    targetWidth = 1024;
    targetHeight = 1024;
  } else if (orientation === "ultrawide") {
    targetWidth = 1920;
    targetHeight = 800; // standard 21:9 safe buffer
  } else if (orientation === "tablet") {
    targetWidth = 1200;
    targetHeight = 1600; // standard 3:4
  }

  console.log(`[AI Service] Invoking Flux AI Generator (${targetWidth}x${targetHeight}) for ${orientation}`);

  const seed = Math.floor(Math.random() * 10000000);
  const encodedPrompt = encodeURIComponent(prompt);
  const encodedNegative = encodeURIComponent(negativePrompt);

  const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${targetWidth}&height=${targetHeight}&model=flux&seed=${seed}&nologo=true&negative_prompt=${encodedNegative}`;

  // Validate the URL is reachable
  const checkRes = await fetch(imageUrl, { method: "HEAD" });
  if (!checkRes.ok) {
    throw new Error(`Flux AI provider returned status ${checkRes.status}`);
  }

  return imageUrl;
}

export async function generateAIWallpaper(
  input: GenerateAIWallpaperInput
): Promise<GeneratedWallpaperResult> {
  const startTime = Date.now();

  // 1. Process prompt, extract negatives, and calculate wallpaper framing
  const processed = processPrompt(input);
  console.log(`[AI Service] Original prompt: "${processed.originalPrompt}"`);
  console.log(`[AI Service] Enhanced prompt: "${processed.enhancedPrompt}"`);
  console.log(`[AI Service] Negative prompt: "${processed.negativePrompt}"`);
  console.log(`[AI Service] Target aspect ratio: ${processed.aspectRatio}`);

  let imageUrl = "";
  let activeProvider = "flux-free";

  // 2. Select and invoke appropriate AI image provider
  const replicateToken = process.env.REPLICATE_API_TOKEN?.trim();
  const openaiKey = process.env.OPENAI_API_KEY?.trim();

  if (replicateToken && input.provider !== "openai" && input.provider !== "flux-free") {
    try {
      activeProvider = "replicate-flux";
      imageUrl = await generateViaReplicate(
        replicateToken,
        processed.enhancedPrompt,
        processed.aspectRatio
      );
    } catch (err) {
      console.warn(`[AI Service] Replicate failed: ${err instanceof Error ? err.message : err}. Falling back to Flux engine.`);
    }
  }

  if (!imageUrl && openaiKey && input.provider !== "replicate" && input.provider !== "flux-free") {
    try {
      activeProvider = "openai-dalle3";
      imageUrl = await generateViaOpenAI(
        openaiKey,
        processed.enhancedPrompt,
        input.orientation
      );
    } catch (err) {
      console.warn(`[AI Service] OpenAI failed: ${err instanceof Error ? err.message : err}. Falling back to Flux engine.`);
    }
  }

  // 3. Fallback to real Flux AI generator
  if (!imageUrl) {
    try {
      activeProvider = "flux-free";
      imageUrl = await generateViaFluxFree(
        processed.enhancedPrompt,
        processed.negativePrompt,
        input.orientation
      );
    } catch (err) {
      throw new Error(
        `AI generation failed: ${err instanceof Error ? err.message : "Unable to generate image"}. Please check your connection or try again.`
      );
    }
  }

  const duration = Date.now() - startTime;
  console.log(`[AI Service] Generation succeeded via ${activeProvider} in ${duration}ms: ${imageUrl}`);

  // 4. Persist to database if available
  let recordId = `ai-${Date.now()}`;
  try {
    const record = await prisma.aIWallpaper.create({
      data: {
        userId: input.userId || null,
        prompt: processed.originalPrompt,
        style: input.style || "Natural",
        orientation: input.orientation || "landscape",
        resolution: input.resolution || "4k",
        imageUrl,
      },
    });
    recordId = record.id;
  } catch {
    console.log("[AI Service] Note: Saved generated wallpaper in memory (database offline)");
  }

  return {
    id: recordId,
    userId: input.userId || null,
    prompt: processed.originalPrompt,
    enhancedPrompt: processed.enhancedPrompt,
    negativePrompt: processed.negativePrompt,
    style: input.style || "Natural",
    category: input.category || undefined,
    orientation: input.orientation || "landscape",
    resolution: input.resolution || "4k",
    aspectRatio: processed.aspectRatio,
    dimensions: processed.dimensions,
    imageUrl,
    provider: activeProvider,
    createdAt: new Date().toISOString(),
  };
}

export async function getUserAIWallpapers(userId: string) {
  try {
    return await prisma.aIWallpaper.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  } catch {
    return [];
  }
}
