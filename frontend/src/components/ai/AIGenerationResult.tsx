"use client";

import { useState } from "react";
import Image from "next/image";
import { Download, Wand2, RotateCcw, Edit3, ChevronDown, ChevronUp } from "lucide-react";
import { AIWallpaper } from "../../types/ai";

interface AIGenerationResultProps {
  creation: AIWallpaper;
  loading: boolean;
  onRegenerate: () => void;
  onEditPrompt: () => void;
}

function getAspectClass(orientation?: string, aspectRatio?: string) {
  if (aspectRatio === "9:16" || orientation === "portrait") return "aspect-[9/16] max-w-sm mx-auto";
  if (aspectRatio === "21:9" || orientation === "ultrawide") return "aspect-[21/9] w-full";
  if (aspectRatio === "3:4" || orientation === "tablet") return "aspect-[3/4] max-w-md mx-auto";
  if (aspectRatio === "1:1" || orientation === "square") return "aspect-square max-w-md mx-auto";
  return "aspect-[16/9] w-full";
}

// Generated wallpaper preview + prompt details + actions.
// Used by /ai-studio after a successful generation.
export function AIGenerationResult({ creation, loading, onRegenerate, onEditPrompt }: AIGenerationResultProps) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Wand2 className="w-4 h-4 text-accent" />
          <h2 className="font-display text-lg font-bold text-strong">Generated Wallpaper</h2>
          {creation.provider && (
            <span className="text-[10px] px-2 py-0.5 rounded-md bg-line/10 text-muted border border-line/10">
              {creation.provider}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onRegenerate}
            disabled={loading}
            aria-label="Regenerate with same prompt"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-line/10 bg-raised hover:bg-line/10 text-xs font-semibold text-strong transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Regenerate</span>
          </button>
          <button
            onClick={onEditPrompt}
            aria-label="Edit prompt and re-run"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-line/10 bg-raised hover:bg-line/10 text-xs font-semibold text-strong transition"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Prompt</span>
          </button>
          <a
            href={creation.imageUrl}
            target="_blank"
            rel="noreferrer"
            download
            aria-label="Download generated wallpaper in full resolution"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-accent text-accent-ink text-xs font-bold hover:brightness-110 transition shadow-sm"
          >
            <Download className="w-3.5 h-3.5" aria-hidden />
            <span>Download Wallpaper</span>
          </a>
        </div>
      </div>

      <div className={`relative rounded-2xl overflow-hidden border border-line/10 bg-raised shadow-xl ${getAspectClass(creation.orientation, creation.aspectRatio)}`}>
        <Image
          src={creation.imageUrl}
          alt={creation.prompt}
          fill
          unoptimized
          sizes="(max-width: 768px) 100vw, 768px"
          className="object-cover"
        />
      </div>

      <div className="p-4 rounded-xl border border-line/10 bg-raised/50 space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase font-bold text-accent tracking-wider">User Prompt</span>
            <p className="text-xs text-strong mt-0.5 leading-relaxed">&ldquo;{creation.prompt}&rdquo;</p>
          </div>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="inline-flex items-center gap-1 text-[11px] text-faint hover:text-strong transition shrink-0"
          >
            <span>Pipeline Details</span>
            {showDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>

        {showDetails && (
          <div className="pt-3 border-t border-line/10 space-y-2 text-[11px]">
            {creation.enhancedPrompt && (
              <div>
                <span className="font-semibold text-muted">Enhanced Model Prompt:</span>
                <p className="text-faint font-mono mt-0.5">{creation.enhancedPrompt}</p>
              </div>
            )}
            {creation.negativePrompt && (
              <div>
                <span className="font-semibold text-muted">Negative Prompt Filters:</span>
                <p className="text-faint font-mono mt-0.5">{creation.negativePrompt}</p>
              </div>
            )}
            <div className="flex flex-wrap gap-4 text-faint pt-1">
              <span>Aspect Ratio: <strong className="text-strong">{creation.aspectRatio || "16:9"}</strong></span>
              <span>Orientation: <strong className="text-strong">{creation.orientation || "landscape"}</strong></span>
              <span>Resolution: <strong className="text-strong">{creation.resolution || "4K"}</strong></span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
