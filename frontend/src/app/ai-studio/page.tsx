"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  Sparkles,
  Download,
  History,
  Wand2,
  RotateCcw,
  Edit3,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { AIGeneratorForm } from "../../components/ai/AIGeneratorForm";
import { AICreationCard } from "../../components/ai/AICreationCard";
import { FadeIn } from "../../components/ui/FadeIn";
import { showToast } from "../../components/ui/Toast";
import { AIWallpaper, GenerateAIRequest } from "../../types/ai";
import * as aiService from "../../services/aiService";
import { useAuth } from "../../hooks/useAuth";

export default function AIStudioPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [currentCreation, setCurrentCreation] = useState<AIWallpaper | null>(null);
  const [lastRequest, setLastRequest] = useState<GenerateAIRequest | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [creations, setCreations] = useState<AIWallpaper[]>([]);
  const [showPromptDetails, setShowPromptDetails] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadCreations() {
      if (user) {
        try {
          const list = await aiService.fetchUserCreations();
          setCreations(list);
        } catch {}
      }
    }
    loadCreations();
  }, [user]);

  const handleGenerate = async (data: GenerateAIRequest) => {
    setLoading(true);
    setErrorMessage(null);
    setLastRequest(data);
    try {
      const res = await aiService.generateAIWallpaper(data);
      setCurrentCreation(res);
      setCreations((prev) => [res, ...prev.filter((c) => c.id !== res.id)]);
      showToast("Wallpaper generated successfully!");
    } catch (err) {
      const msg = err instanceof Error && err.message ? err.message : "Failed to generate wallpaper.";
      setErrorMessage(msg);
      showToast(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = () => {
    if (lastRequest) {
      handleGenerate(lastRequest);
    }
  };

  const handleEditPrompt = () => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Map aspect ratio for preview container
  const getAspectClass = (orientation?: string, aspectRatio?: string) => {
    if (aspectRatio === "9:16" || orientation === "portrait") return "aspect-[9/16] max-w-sm mx-auto";
    if (aspectRatio === "21:9" || orientation === "ultrawide") return "aspect-[21/9] w-full";
    if (aspectRatio === "3:4" || orientation === "tablet") return "aspect-[3/4] max-w-md mx-auto";
    if (aspectRatio === "1:1" || orientation === "square") return "aspect-square max-w-md mx-auto";
    return "aspect-[16/9] w-full";
  };

  return (
    <div className="mx-auto max-w-shell px-4 sm:px-6 py-8 space-y-12">
      {/* Page Header */}
      <FadeIn className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-xs font-bold text-accent">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Generative AI Engine</span>
        </div>
        <h1 className="font-display text-3xl sm:text-5xl font-black text-strong tracking-tight">
          Wallora AI Studio
        </h1>
        <p className="text-sm text-muted">
          Transform your descriptions into custom, prompt-accurate 4K wallpapers. Tailor subjects, lighting, styles, and aspect ratios.
        </p>
      </FadeIn>

      {/* Generator Form */}
      <div ref={formRef} className="max-w-3xl mx-auto">
        <AIGeneratorForm
          onGenerate={handleGenerate}
          loading={loading}
          initialPrompt={lastRequest?.prompt || ""}
        />
      </div>

      {/* Error State */}
      {errorMessage && (
        <div className="max-w-3xl mx-auto p-4 rounded-2xl border border-red-500/20 bg-red-500/5 text-red-400 space-y-3">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="flex-1 space-y-1">
              <h3 className="text-sm font-bold text-red-300">Generation Unsuccessful</h3>
              <p className="text-xs text-red-400/90">{errorMessage}</p>
            </div>
            {lastRequest && (
              <button
                onClick={handleRegenerate}
                disabled={loading}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-xs font-semibold text-red-200 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retry</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Real-time Generated Output */}
      {currentCreation && (
        <FadeIn className="max-w-3xl mx-auto space-y-5 pt-6 border-t border-line/10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Wand2 className="w-4 h-4 text-accent" />
              <h2 className="font-display text-lg font-bold text-strong">
                Generated Wallpaper
              </h2>
              {currentCreation.provider && (
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-line/10 text-muted border border-line/10">
                  {currentCreation.provider}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleRegenerate}
                disabled={loading}
                aria-label="Regenerate with same prompt"
                title="Regenerate with same prompt"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-line/10 bg-raised hover:bg-line/10 text-xs font-semibold text-strong transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Regenerate</span>
              </button>

              <button
                onClick={handleEditPrompt}
                aria-label="Edit prompt and re-run"
                title="Edit prompt and re-run"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-line/10 bg-raised hover:bg-line/10 text-xs font-semibold text-strong transition"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Prompt</span>
              </button>

              <a
                href={currentCreation.imageUrl}
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

          {/* Image Container with Dynamic Aspect Ratio */}
          <div className={`relative rounded-2xl overflow-hidden border border-line/10 bg-raised shadow-xl ${getAspectClass(currentCreation.orientation, currentCreation.aspectRatio)}`}>
            <Image
              src={currentCreation.imageUrl}
              alt={currentCreation.prompt}
              fill
              unoptimized
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
            />
          </div>

          {/* Prompt Information & Inspection */}
          <div className="p-4 rounded-xl border border-line/10 bg-raised/50 space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-accent tracking-wider">User Prompt</span>
                <p className="text-xs text-strong mt-0.5 leading-relaxed">&ldquo;{currentCreation.prompt}&rdquo;</p>
              </div>
              <button
                onClick={() => setShowPromptDetails(!showPromptDetails)}
                className="inline-flex items-center gap-1 text-[11px] text-faint hover:text-strong transition shrink-0"
              >
                <span>Pipeline Details</span>
                {showPromptDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            </div>

            {showPromptDetails && (
              <div className="pt-3 border-t border-line/10 space-y-2 text-[11px]">
                {currentCreation.enhancedPrompt && (
                  <div>
                    <span className="font-semibold text-muted">Enhanced Model Prompt:</span>
                    <p className="text-faint font-mono mt-0.5">{currentCreation.enhancedPrompt}</p>
                  </div>
                )}
                {currentCreation.negativePrompt && (
                  <div>
                    <span className="font-semibold text-muted">Negative Prompt Filters:</span>
                    <p className="text-faint font-mono mt-0.5">{currentCreation.negativePrompt}</p>
                  </div>
                )}
                <div className="flex flex-wrap gap-4 text-faint pt-1">
                  <span>Aspect Ratio: <strong className="text-strong">{currentCreation.aspectRatio || "16:9"}</strong></span>
                  <span>Orientation: <strong className="text-strong">{currentCreation.orientation || "landscape"}</strong></span>
                  <span>Resolution: <strong className="text-strong">{currentCreation.resolution || "4K"}</strong></span>
                </div>
              </div>
            )}
          </div>
        </FadeIn>
      )}

      {/* History / Previous Creations */}
      {creations.length > 0 && (
        <section className="space-y-6 pt-10 border-t border-line/10">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-accent" />
            <h2 className="font-display text-xl font-bold text-strong tracking-tight">
              Recent AI Creations
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {creations.map((c) => (
              <AICreationCard key={c.id} creation={c} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
