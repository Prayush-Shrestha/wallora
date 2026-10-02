"use client";

import { useState, useEffect, useRef } from "react";
import { Sparkles, AlertCircle, RotateCcw, History } from "lucide-react";
import { AIGeneratorForm } from "../../components/ai/AIGeneratorForm";
import { AICreationCard } from "../../components/ai/AICreationCard";
import { AIGenerationResult } from "../../components/ai/AIGenerationResult";
import { FadeIn } from "../../components/ui/FadeIn";
import { showToast } from "../../components/ui/Toast";
import { AIWallpaper, GenerateAIRequest } from "../../types/ai";
import * as aiService from "../../services/aiService";
import { useAuth } from "../../hooks/useAuth";

// /ai-studio — form + result preview + history.
// Heavy UI lives in components/ai/ so this page stays readable.
export default function AIStudioPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [currentCreation, setCurrentCreation] = useState<AIWallpaper | null>(null);
  const [lastRequest, setLastRequest] = useState<GenerateAIRequest | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [creations, setCreations] = useState<AIWallpaper[]>([]);
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
    if (lastRequest) handleGenerate(lastRequest);
  };

  const handleEditPrompt = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="mx-auto max-w-shell px-4 sm:px-6 py-8 space-y-12">
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

      <div ref={formRef} className="max-w-3xl mx-auto">
        <AIGeneratorForm
          onGenerate={handleGenerate}
          loading={loading}
          initialPrompt={lastRequest?.prompt || ""}
        />
      </div>

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

      {currentCreation && (
        <FadeIn className="max-w-3xl mx-auto space-y-5 pt-6 border-t border-line/10">
          <AIGenerationResult
            creation={currentCreation}
            loading={loading}
            onRegenerate={handleRegenerate}
            onEditPrompt={handleEditPrompt}
          />
        </FadeIn>
      )}

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
