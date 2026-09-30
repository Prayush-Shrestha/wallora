"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, Heart, Sparkles, Upload, Grid } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { FadeIn } from "../../components/ui/FadeIn";
import { WallpaperGrid } from "../../components/wallpaper/WallpaperGrid";
import { AICreationCard } from "../../components/ai/AICreationCard";
import { Wallpaper } from "../../types/wallpaper";
import { AIWallpaper } from "../../types/ai";
import * as favoriteService from "../../services/favoriteService";
import * as aiService from "../../services/aiService";

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<"favorites" | "creations">("favorites");
  const [favorites, setFavorites] = useState<Wallpaper[]>([]);
  const [creations, setCreations] = useState<AIWallpaper[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    async function loadData() {
      setLoading(true);
      try {
        const [favList, aiList] = await Promise.all([
          favoriteService.fetchFavorites().catch(() => []),
          aiService.fetchUserCreations().catch(() => []),
        ]);
        setFavorites(favList);
        setCreations(aiList);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [user, router]);

  if (!user) return null;

  return (
    <div className="mx-auto max-w-shell px-4 sm:px-6 py-8 space-y-10">
      <FadeIn>
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 pb-8 border-b border-white/10 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={user.profileImage || `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(user.name)}`}
              alt={user.name}
              className="w-20 h-20 rounded-full object-cover border-2 border-white/20 shadow-lg"
            />
            <div>
              <h1 className="font-display text-2xl sm:text-3xl font-black text-white">
                {user.name}
              </h1>
              <p className="text-xs text-neutral-400 mt-1">{user.email}</p>
              <div className="flex items-center justify-center sm:justify-start gap-4 mt-3 text-xs text-neutral-400">
                <span>{favorites.length} Favorites</span>
                <span>•</span>
                <span>{creations.length} AI Creations</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                logout();
                router.push("/");
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-red-500/20 bg-red-500/10 text-red-400 text-xs font-semibold hover:bg-red-500/20 transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 border-b border-white/10 mt-6">
          <button
            onClick={() => setActiveTab("favorites")}
            className={`flex items-center gap-2 px-5 py-3 text-xs font-bold border-b-2 transition -mb-px ${
              activeTab === "favorites"
                ? "border-accent text-accent"
                : "border-transparent text-neutral-400 hover:text-white"
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>Saved Favorites ({favorites.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("creations")}
            className={`flex items-center gap-2 px-5 py-3 text-xs font-bold border-b-2 transition -mb-px ${
              activeTab === "creations"
                ? "border-accent text-accent"
                : "border-transparent text-neutral-400 hover:text-white"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Studio Creations ({creations.length})</span>
          </button>
        </div>
      </FadeIn>

      {/* Tab Content */}
      {loading ? (
        <div className="text-center py-20 text-neutral-500 text-sm">Loading profile data...</div>
      ) : activeTab === "favorites" ? (
        <WallpaperGrid
          wallpapers={favorites}
          favoriteIds={favorites.map((f) => f.id)}
          emptyMessage="You have not saved any wallpapers yet. Browse explore to find art you love!"
        />
      ) : (
        <div>
          {creations.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl space-y-3">
              <Sparkles className="w-8 h-8 text-neutral-600 mx-auto" />
              <p className="text-neutral-400 text-sm">No AI creations generated yet.</p>
              <Link
                href="/ai-studio"
                className="inline-block px-5 py-2 rounded-full bg-accent text-accent-ink text-xs font-bold hover:brightness-110 transition"
              >
                Go to AI Studio
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {creations.map((c) => (
                <AICreationCard key={c.id} creation={c} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

