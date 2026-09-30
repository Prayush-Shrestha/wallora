"use client";

import { useState } from "react";
import { Sparkles, Wand2, Loader2, Smartphone, Monitor, Square } from "lucide-react";
import { GenerateAIRequest } from "../../types/ai";

interface AIGeneratorFormProps {
  onGenerate: (data: GenerateAIRequest) => Promise<void>;
  loading: boolean;
}

const STYLES = ["Cinematic", "Anime", "Cyberpunk", "Minimalist", "Fantasy", "Sci-Fi", "Oil Painting"];

export function AIGeneratorForm({ onGenerate, loading }: AIGeneratorFormProps) {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("Cinematic");
  const [orientation, setOrientation] = useState<"landscape" | "portrait" | "square" | "ultrawide">("landscape");
  const [resolution, setResolution] = useState<"standard" | "4k">("4k");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || loading) return;
    onGenerate({ prompt: prompt.trim(), style, orientation, resolution });
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-white/10 bg-ink-900/80 backdrop-blur-xl p-6 sm:p-8 space-y-6">
      {/* Prompt Input */}
      <div>
        <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-accent" />
          <span>Describe your dream wallpaper</span>
        </label>
        <textarea
          rows={3}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g. A serene neon cyberpunk floating pagoda overlooking a star nebula, bioluminescent water reflections..."
          className="w-full rounded-xl bg-ink-950 border border-white/10 p-4 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-accent transition-colors resize-none"
        />
      </div>

      {/* Style Chips */}
      <div>
        <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
          Visual Style
        </label>
        <div className="flex flex-wrap gap-2">
          {STYLES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStyle(s)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition ${
                style === s
                  ? "bg-accent text-accent-ink font-bold shadow-sm"
                  : "bg-white/5 text-neutral-300 border border-white/10 hover:bg-white/10"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Orientation & Resolution */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
            Screen Orientation
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setOrientation("landscape")}
              className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-medium transition ${
                orientation === "landscape"
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-white/10 bg-white/5 text-neutral-400 hover:text-white"
              }`}
            >
              <Monitor className="w-4 h-4 mb-1" />
              <span>Landscape</span>
            </button>
            <button
              type="button"
              onClick={() => setOrientation("portrait")}
              className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-medium transition ${
                orientation === "portrait"
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-white/10 bg-white/5 text-neutral-400 hover:text-white"
              }`}
            >
              <Smartphone className="w-4 h-4 mb-1" />
              <span>Portrait</span>
            </button>
            <button
              type="button"
              onClick={() => setOrientation("square")}
              className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-medium transition ${
                orientation === "square"
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-white/10 bg-white/5 text-neutral-400 hover:text-white"
              }`}
            >
              <Square className="w-4 h-4 mb-1" />
              <span>Square</span>
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
            Quality & Resolution
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setResolution("standard")}
              className={`flex items-center justify-center p-3.5 rounded-xl border text-xs font-medium transition ${
                resolution === "standard"
                  ? "border-accent bg-accent/10 text-accent font-semibold"
                  : "border-white/10 bg-white/5 text-neutral-400 hover:text-white"
              }`}
            >
              Full HD (1080p)
            </button>
            <button
              type="button"
              onClick={() => setResolution("4k")}
              className={`flex items-center justify-center p-3.5 rounded-xl border text-xs font-medium transition ${
                resolution === "4k"
                  ? "border-accent bg-accent/10 text-accent font-bold"
                  : "border-white/10 bg-white/5 text-neutral-400 hover:text-white"
              }`}
            >
              Ultra HD (4K)
            </button>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading || !prompt.trim()}
        className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-accent text-accent-ink font-bold text-sm hover:brightness-110 active:scale-[0.99] transition disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Generating wallpaper with AI...</span>
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

