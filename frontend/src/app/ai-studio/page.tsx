"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Sparkles, Download, History, Wand2 } from "lucide-react";
import { AIGeneratorForm } from "../../components/ai/AIGeneratorForm";
import { AICreationCard } from "../../components/ai/AICreationCard";
import { FadeIn } from "../../components/ui/FadeIn";
import { AIWallpaper, GenerateAIRequest } from "../../types/ai";
import * as aiService from "../../services/aiService";
import { useAuth } from "../../hooks/useAuth";

export default function AIStudioPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [currentCreation, setCurrentCreation] = useState<AIWallpaper | null>(null);
  const [creations, setCreations] = useState<AIWallpaper[]>([]);

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
    try {
      const res = await aiService.generateAIWallpaper(data);
      setCurrentCreation(res);
      setCreations((prev) => [res, ...prev]);
    } catch (err: any) {
      alert(err.message || "Failed to generate wallpaper. Please check backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-shell px-4 sm:px-6 py-8 space-y-12">
      <FadeIn className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-xs font-bold text-accent">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Generative AI Engine</span>
        </div>
        <h1 className="font-display text-3xl sm:text-5xl font-black text-white tracking-tight">
          Wallora AI Studio
        </h1>
        <p className="text-sm text-neutral-400">
          Turn your imagination into high-resolution 4K wallpapers. Choose styles, lighting, and aspect ratios.
        </p>
      </FadeIn>

      <div className="max-w-3xl mx-auto">
        <AIGeneratorForm onGenerate={handleGenerate} loading={loading} />
      </div>

      {/* Real-time Generated Output */}
      {currentCreation && (
        <FadeIn className="max-w-3xl mx-auto space-y-4 pt-6 border-t border-white/10">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-white flex items-center gap-2">
              <Wand2 className="w-4 h-4 text-accent" />
              <span>Generated Creation</span>
            </h2>
            <a
              href={currentCreation.imageUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-accent text-accent-ink text-xs font-bold hover:brightness-110 transition shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download 4K Wallpaper</span>
            </a>
          </div>

          <div className="relative rounded-2xl overflow-hidden border border-white/10 aspect-[16/10] bg-ink-900">
            <Image
              src={currentCreation.imageUrl}
              alt={currentCreation.prompt}
              fill
              className="object-cover"
            />
          </div>
          <p className="text-xs text-neutral-400 italic">“{currentCreation.prompt}”</p>
        </FadeIn>
      )}

      {/* History / Previous Creations */}
      {creations.length > 0 && (
        <section className="space-y-6 pt-10 border-t border-white/10">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-accent" />
            <h2 className="font-display text-xl font-bold text-white tracking-tight">
              Recent Creations
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

