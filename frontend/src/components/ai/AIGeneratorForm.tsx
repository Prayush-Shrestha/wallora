"use client";

import { useState } from "react";
import {
  Sparkles,
  Wand2,
  Loader2,
  Smartphone,
  Monitor,
  Square,
  Tablet,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { GenerateAIRequest } from "../../types/ai";

interface AIGeneratorFormProps {
  onGenerate: (data: GenerateAIRequest) => Promise<void>;
  loading: boolean;
  initialPrompt?: string;
}

const CATEGORIES = [
  { id: "none", label: "Prompt Decides" },
  { id: "nature", label: "Nature" },
  { id: "cars", label: "Cars" },
  { id: "anime", label: "Anime" },
  { id: "aesthetic", label: "Aesthetic" },
  { id: "gaming", label: "Gaming" },
  { id: "space", label: "Space" },
  { id: "abstract", label: "Abstract" },
  { id: "men", label: "Men / Dark" },
  { id: "women", label: "Women / Fashion" },
  { id: "kids", label: "Kids / Animals" },
];

const STYLES = [
  { id: "none", label: "Natural / None" },
  { id: "Photorealistic", label: "Photorealistic" },
  { id: "Cinematic", label: "Cinematic" },
  { id: "Anime", label: "Anime" },
  { id: "Cyberpunk", label: "Cyberpunk" },
  { id: "Minimalist", label: "Minimalist" },
  { id: "Aesthetic", label: "Aesthetic" },
  { id: "Oil Painting", label: "Oil Painting" },
  { id: "3D Render", label: "3D Render" },
];

const SAMPLE_PROMPTS = [
  "A realistic mountain landscape at sunrise with a small wooden cabin beside a lake, soft natural lighting, mist in the distance, peaceful atmosphere.",
  "A minimalist black sports car parked on a wet city street at night, with realistic reflections, cinematic lighting, and no text or logos.",
  "Pastel aesthetic sunset over calm lavender ocean dunes with gentle waves and warm twilight horizon.",
  "Anime girl in a straw hat standing in a golden sunflower field under vast summer cumulus clouds, Studio Ghibli inspired.",
];

export function AIGeneratorForm({ onGenerate, loading, initialPrompt = "" }: AIGeneratorFormProps) {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [category, setCategory] = useState("none");
  const [style, setStyle] = useState("none");
  const [orientation, setOrientation] = useState<"landscape" | "portrait" | "square" | "ultrawide" | "tablet">("landscape");
  const [resolution, setResolution] = useState<"standard" | "4k">("4k");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [provider, setProvider] = useState<"auto" | "flux-free" | "replicate" | "openai">("auto");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || loading) return;
    onGenerate({
      prompt: prompt.trim(),
      category: category !== "none" ? category : undefined,
      style: style !== "none" ? style : undefined,
      orientation,
      resolution,
      negativePrompt: negativePrompt.trim() || undefined,
      provider,
    });
  };

  const applySample = (sample: string) => {
    setPrompt(sample);
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-line/10 bg-raised/80 backdrop-blur-xl p-6 sm:p-8 space-y-6">
    
      <div>
        <div className="flex items-center justify-between mb-2">
          <label htmlFor="ai-prompt" className="text-xs font-semibold text-muted uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-accent" aria-hidden />
            <span>Describe your wallpaper</span>
          </label>
          {prompt && (
            <button
              type="button"
              onClick={() => setPrompt("")}
              className="text-xs text-faint hover:text-strong transition"
            >
              Clear
            </button>
          )}
        </div>

        <textarea
          id="ai-prompt"
          rows={3}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g. A realistic mountain landscape at sunrise with a small wooden cabin beside a lake, soft natural lighting, mist in distance, no text or logos..."
          className="w-full rounded-xl bg-base border border-line/10 p-4 text-sm text-strong placeholder:text-faint focus:outline-none focus:border-accent transition-colors resize-none leading-relaxed"
        />

        {/* Sample Prompts */}
        <div className="mt-2.5 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] text-faint shrink-0">Try:</span>
          {SAMPLE_PROMPTS.map((sample, i) => (
            <button
              key={i}
              type="button"
              onClick={() => applySample(sample)}
              className="text-[11px] px-2.5 py-1 rounded-full bg-line/5 hover:bg-line/10 text-muted hover:text-strong border border-line/5 whitespace-nowrap transition"
            >
              {sample.slice(0, 32)}...
            </button>
          ))}
        </div>
      </div>

      {/* Theme Category Chips */}
      <div>
        <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">
          Category / Theme
        </label>
        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setCategory(c.id)}
              aria-pressed={category === c.id}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                category === c.id
                  ? "bg-accent text-accent-ink font-bold shadow-sm"
                  : "bg-line/5 text-muted border border-line/10 hover:bg-line/10 hover:text-strong"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Visual Style Chips */}
      <div>
        <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">
          Visual Style
        </label>
        <div className="flex flex-wrap gap-1.5">
          {STYLES.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setStyle(s.id)}
              aria-pressed={style === s.id}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                style === s.id
                  ? "bg-white text-black font-bold shadow-sm"
                  : "bg-line/5 text-muted border border-line/10 hover:bg-line/10 hover:text-strong"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Device & Aspect Ratio */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold text-muted uppercase tracking-wider">
          Target Device & Aspect Ratio
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          <button
            type="button"
            onClick={() => setOrientation("landscape")}
            aria-pressed={orientation === "landscape"}
            className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-medium transition ${
              orientation === "landscape"
                ? "border-accent bg-accent/10 text-accent font-semibold"
                : "border-line/10 bg-line/5 text-muted hover:text-strong"
            }`}
          >
            <Monitor className="w-4 h-4 mb-1" aria-hidden />
            <span>Desktop</span>
            <span className="text-[10px] text-faint">16:9</span>
          </button>

          <button
            type="button"
            onClick={() => setOrientation("portrait")}
            aria-pressed={orientation === "portrait"}
            className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-medium transition ${
              orientation === "portrait"
                ? "border-accent bg-accent/10 text-accent font-semibold"
                : "border-line/10 bg-line/5 text-muted hover:text-strong"
            }`}
          >
            <Smartphone className="w-4 h-4 mb-1" aria-hidden />
            <span>Mobile</span>
            <span className="text-[10px] text-faint">9:16</span>
          </button>

          <button
            type="button"
            onClick={() => setOrientation("tablet")}
            aria-pressed={orientation === "tablet"}
            className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-medium transition ${
              orientation === "tablet"
                ? "border-accent bg-accent/10 text-accent font-semibold"
                : "border-line/10 bg-line/5 text-muted hover:text-strong"
            }`}
          >
            <Tablet className="w-4 h-4 mb-1" aria-hidden />
            <span>Tablet</span>
            <span className="text-[10px] text-faint">3:4</span>
          </button>

          <button
            type="button"
            onClick={() => setOrientation("ultrawide")}
            aria-pressed={orientation === "ultrawide"}
            className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-medium transition ${
              orientation === "ultrawide"
                ? "border-accent bg-accent/10 text-accent font-semibold"
                : "border-line/10 bg-line/5 text-muted hover:text-strong"
            }`}
          >
            <Monitor className="w-4 h-4 mb-1" aria-hidden />
            <span>Ultrawide</span>
            <span className="text-[10px] text-faint">21:9</span>
          </button>

          <button
            type="button"
            onClick={() => setOrientation("square")}
            aria-pressed={orientation === "square"}
            className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-medium transition col-span-2 sm:col-span-1 ${
              orientation === "square"
                ? "border-accent bg-accent/10 text-accent font-semibold"
                : "border-line/10 bg-line/5 text-muted hover:text-strong"
            }`}
          >
            <Square className="w-4 h-4 mb-1" aria-hidden />
            <span>Square</span>
            <span className="text-[10px] text-faint">1:1</span>
          </button>
        </div>
      </div>

      {/* Resolution & Advanced Settings Toggle */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setResolution("standard")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
              resolution === "standard"
                ? "bg-line/20 border-line/30 text-strong"
                : "border-line/10 text-faint hover:text-muted"
            }`}
          >
            FHD (1080p)
          </button>
          <button
            type="button"
            onClick={() => setResolution("4k")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
              resolution === "4k"
                ? "bg-accent/10 border-accent/30 text-accent font-bold"
                : "border-line/10 text-faint hover:text-muted"
            }`}
          >
            Ultra HD (4K)
          </button>
        </div>

        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="inline-flex items-center gap-1 text-xs text-muted hover:text-strong transition"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Advanced Controls</span>
          {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Advanced Settings: Negative Prompt & Provider */}
      {showAdvanced && (
        <div className="p-4 rounded-xl border border-line/10 bg-base/50 space-y-4">
          <div>
            <label htmlFor="ai-negative" className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1">
              Negative Prompt (Things to exclude)
            </label>
            <input
              id="ai-negative"
              type="text"
              value={negativePrompt}
              onChange={(e) => setNegativePrompt(e.target.value)}
              placeholder="e.g. text, watermark, logos, distorted, blurry, cars, crowd"
              className="w-full rounded-lg bg-base border border-line/10 px-3.5 py-2 text-xs text-strong placeholder:text-faint focus:outline-none focus:border-accent"
            />
            <p className="text-[11px] text-faint mt-1">
              Tip: You can also write &ldquo;no text&rdquo; or &ldquo;without people&rdquo; directly in your prompt.
            </p>
          </div>

          <div>
            <label htmlFor="ai-provider" className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1">
              AI Generation Engine
            </label>
            <select
              id="ai-provider"
              value={provider}
              onChange={(e) => setProvider(e.target.value as any)}
              className="w-full rounded-lg bg-base border border-line/10 px-3.5 py-2 text-xs text-strong focus:outline-none focus:border-accent"
            >
              <option value="auto">Auto (Best Available Engine)</option>
              <option value="flux-free">Flux Generative AI (Direct Engine)</option>
              <option value="replicate">Replicate Flux Schnell (Requires REPLICATE_API_TOKEN)</option>
              <option value="openai">OpenAI DALL-E 3 (Requires OPENAI_API_KEY)</option>
            </select>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading || !prompt.trim()}
        className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-accent text-accent-ink font-bold text-sm hover:brightness-110 active:scale-[0.99] transition disabled:opacity-50 shadow-md"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Synthesizing custom wallpaper...</span>
          </>
        ) : (
          <>
            <Wand2 className="w-4 h-4" />
            <span>Generate Wallpaper</span>
          </>
        )}
      </button>
    </form>
  );
}
