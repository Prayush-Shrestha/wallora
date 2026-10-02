"use client";

import { useState, useEffect } from "react";
import {
  Wand2,
  Loader2,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { GenerateAIRequest } from "../../types/ai";
import { AIPromptBox } from "./AIPromptBox";
import { AIPromptSuggestions } from "./AIPromptSuggestions";
import { AIStyleSelector } from "./AIStyleSelector";
import { AIResolutionSelector, AIOrientation, AIResolution } from "./AIResolutionSelector";

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

// AI Studio form — composes small focused components so page.tsx stays thin.
export function AIGeneratorForm({ onGenerate, loading, initialPrompt = "" }: AIGeneratorFormProps) {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [category, setCategory] = useState("none");
  const [style, setStyle] = useState("none");
  const [orientation, setOrientation] = useState<AIOrientation>("landscape");
  const [resolution, setResolution] = useState<AIResolution>("4k");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [provider, setProvider] = useState<"auto" | "flux-free" | "replicate" | "openai">("auto");
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Sync when the parent passes a new prompt (e.g. after "Edit prompt" —
  // without this the textarea keeps the stale pre-generation value).
  useEffect(() => {
    setPrompt(initialPrompt);
  }, [initialPrompt]);

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

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-line/10 bg-raised/80 backdrop-blur-xl p-6 sm:p-8 space-y-6">
      <div>
        <AIPromptBox prompt={prompt} onChange={setPrompt} />
        <AIPromptSuggestions suggestions={SAMPLE_PROMPTS} onSelect={setPrompt} />
      </div>

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

      <AIStyleSelector styles={STYLES} selected={style} onSelect={setStyle} />

      <AIResolutionSelector
        orientation={orientation}
        onOrientationChange={setOrientation}
        resolution={resolution}
        onResolutionChange={setResolution}
      />

      <div className="flex items-center justify-end pt-2">
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
              onChange={(e) => setProvider(e.target.value as typeof provider)}
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
