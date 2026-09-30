export interface PromptProcessingInput {
  prompt: string;
  style?: string;
  category?: string;
  orientation?: "landscape" | "portrait" | "square" | "ultrawide" | "tablet";
  resolution?: "standard" | "4k";
  negativePrompt?: string;
}

export interface ProcessedPromptResult {
  originalPrompt: string;
  enhancedPrompt: string;
  negativePrompt: string;
  aspectRatio: "16:9" | "9:16" | "1:1" | "21:9" | "3:4";
  dimensions: { width: number; height: number };
  detectedStyle?: string;
  extractedNegatives: string[];
}

// Patterns that indicate negative clauses in user prompt text
const NEGATIVE_CLAUSE_PATTERNS = [
  /(?:,\s*|\s+and\s+|\s+with\s+)?\b(?:no|without|free of|exclude|remove)\s+([a-zA-Z0-9\s,]+?)(?=[.,;]|(?:\s+and\s+(?:with|make|suitable))|$)/gi,
];

// Explicit artistic styles user might specify in prompt
const EXPLICIT_STYLES: Record<string, RegExp> = {
  photorealistic: /\b(photorealistic|hyperrealistic|realistic photography|dslr photo|raw photo|real life)\b/i,
  anime: /\b(anime|manga|studio ghibli|makoto shinkai|cel shaded|shonen)\b/i,
  minimalist: /\b(minimalist|minimal|clean lines|simple composition|flat design)\b/i,
  watercolor: /\b(watercolor|watercolour|aquarelle|gouache)\b/i,
  oil_painting: /\b(oil painting|impasto|canvas painting|fine art)\b/i,
  cyberpunk: /\b(cyberpunk|synthwave|neon glow|futuristic city|retrowave)\b/i,
  "3d_render": /\b(3d render|unreal engine|octane render|cinema 4d|blender render)\b/i,
  pixel_art: /\b(pixel art|8-bit|16-bit|retro pixel)\b/i,
  vector: /\b(vector art|flat illustration|svg style|graphic illustration)\b/i,
};

export function processPrompt(input: PromptProcessingInput): ProcessedPromptResult {
  const originalPrompt = input.prompt.trim();
  let cleanedPrompt = originalPrompt;
  const extractedNegatives: string[] = [];

  // 1. Extract negative instructions embedded in user prompt
  for (const pattern of NEGATIVE_CLAUSE_PATTERNS) {
    let match;
    while ((match = pattern.exec(originalPrompt)) !== null) {
      if (match[1]) {
        // Split compound items like "text or logos", "people, cars and blur"
        const items = match[1]
          .split(/\s+(?:and|or)\s+|,\s*/)
          .map((item) => item.trim().toLowerCase())
          .filter((item) => item.length > 1);
        extractedNegatives.push(...items);
      }
    }
    // Clean up negative phrases cleanly from the positive prompt
    cleanedPrompt = cleanedPrompt
      .replace(pattern, "")
      .replace(/\s{2,}/g, " ")
      .replace(/[,;]\s*[.,;]/g, ".")
      .replace(/[,.\s]+$/, "")
      .trim();
  }

  // Combine with explicit user negative prompt
  const baseNegatives = [
    "watermark",
    "text",
    "logo",
    "signature",
    "blurry",
    "jpeg artifacts",
    "deformed",
    "bad proportions",
    "low quality",
  ];

  if (input.negativePrompt?.trim()) {
    baseNegatives.push(input.negativePrompt.trim());
  }

  extractedNegatives.forEach((neg) => {
    if (!baseNegatives.includes(neg)) {
      baseNegatives.push(neg);
    }
  });

  const finalNegativePrompt = Array.from(new Set(baseNegatives)).join(", ");

  // 2. Detect if user already specified a style in their text
  let detectedStyle: string | undefined;
  for (const [styleName, regex] of Object.entries(EXPLICIT_STYLES)) {
    if (regex.test(originalPrompt)) {
      detectedStyle = styleName;
      break;
    }
  }

  // 3. Aspect Ratio and Dimensions calculation
  const orientation = input.orientation || "landscape";
  let aspectRatio: "16:9" | "9:16" | "1:1" | "21:9" | "3:4" = "16:9";
  let width = 1920;
  let height = 1080;

  if (orientation === "portrait") {
    aspectRatio = "9:16";
    width = input.resolution === "4k" ? 2160 : 1080;
    height = input.resolution === "4k" ? 3840 : 1920;
  } else if (orientation === "square") {
    aspectRatio = "1:1";
    width = input.resolution === "4k" ? 2048 : 1024;
    height = input.resolution === "4k" ? 2048 : 1024;
  } else if (orientation === "ultrawide") {
    aspectRatio = "21:9";
    width = input.resolution === "4k" ? 3440 : 2560;
    height = input.resolution === "4k" ? 1440 : 1080;
  } else if (orientation === "tablet") {
    aspectRatio = "3:4";
    width = input.resolution === "4k" ? 2048 : 1536;
    height = input.resolution === "4k" ? 2732 : 2048;
  } else {
    // Landscape / Desktop
    aspectRatio = "16:9";
    width = input.resolution === "4k" ? 3840 : 1920;
    height = input.resolution === "4k" ? 2160 : 1080;
  }

  // 4. Wallpaper Composition Guidance
  const compositionModifiers: string[] = [];
  if (orientation === "portrait") {
    compositionModifiers.push("vertical mobile wallpaper composition, balanced vertical framing");
  } else if (orientation === "ultrawide") {
    compositionModifiers.push("ultrawide panoramic 21:9 wallpaper composition, expansive field of view");
  } else if (orientation === "tablet") {
    compositionModifiers.push("tablet wallpaper composition, centered balanced perspective");
  } else if (orientation === "square") {
    compositionModifiers.push("square 1:1 wallpaper framing, aesthetic center balance");
  } else {
    compositionModifiers.push("desktop wallpaper composition, wide establishing angle");
  }

  // 5. Style Alignment (do NOT override user explicit style)
  const styleModifiers: string[] = [];
  const requestedStyle = input.style?.toLowerCase();

  // Only apply category or dropdown style if the user hasn't specified an explicit conflicting style
  if (!detectedStyle && requestedStyle && requestedStyle !== "none" && requestedStyle !== "natural") {
    switch (requestedStyle) {
      case "photorealistic":
      case "realistic":
        styleModifiers.push("photorealistic, high detail photography, natural depth of field, 8k resolution");
        break;
      case "cinematic":
        styleModifiers.push("cinematic lighting, film still, atmospheric volumetric lighting, 8k wallpaper");
        break;
      case "anime":
        styleModifiers.push("anime aesthetic, clean lines, expressive lighting, Makoto Shinkai inspired");
        break;
      case "cyberpunk":
        styleModifiers.push("cyberpunk aesthetic, vibrant neon lighting, high contrast, atmospheric reflections");
        break;
      case "minimalist":
        styleModifiers.push("minimalist aesthetic, clean composition, elegant negative space, calm tone");
        break;
      case "aesthetic":
        styleModifiers.push("aesthetic moody lighting, soft pastel color palette, delicate film grain");
        break;
      case "oil painting":
        styleModifiers.push("oil painting texture, visible canvas brushstrokes, artistic fine art");
        break;
      case "3d render":
        styleModifiers.push("3D digital art, Octane render, ray tracing, sharp details");
        break;
      default:
        styleModifiers.push(`${input.style} style`);
        break;
    }
  }

  // 6. Category-specific context if selected and non-conflicting
  const requestedCategory = input.category?.toLowerCase();
  if (requestedCategory && requestedCategory !== "all" && requestedCategory !== "none") {
    if (requestedCategory === "nature" && !cleanedPrompt.toLowerCase().includes("nature")) {
      styleModifiers.push("lush natural environment, realistic outdoor atmosphere");
    } else if (requestedCategory === "cars" && !cleanedPrompt.toLowerCase().includes("car")) {
      styleModifiers.push("automotive photography, sleek reflections");
    } else if (requestedCategory === "space" && !cleanedPrompt.toLowerCase().includes("space")) {
      styleModifiers.push("deep space cosmic atmosphere, stellar nebulae");
    }
  }

  // 7. Assemble the enhanced prompt while ensuring user's core intent leads
  const promptParts = [cleanedPrompt];

  // Append composition guidance
  if (compositionModifiers.length > 0) {
    promptParts.push(compositionModifiers.join(", "));
  }

  // Append non-conflicting style additions
  if (styleModifiers.length > 0) {
    promptParts.push(styleModifiers.join(", "));
  }

  // Quality suffix for wallpaper sharpness
  promptParts.push("crisp high resolution wallpaper, award-winning composition");

  const enhancedPrompt = promptParts.join(", ");

  return {
    originalPrompt,
    enhancedPrompt,
    negativePrompt: finalNegativePrompt,
    aspectRatio,
    dimensions: { width, height },
    detectedStyle,
    extractedNegatives,
  };
}
