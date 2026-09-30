"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, ArrowRight } from "lucide-react";
import { WallpaperGrid } from "../../components/wallpaper/WallpaperGrid";
import { FadeIn } from "../../components/ui/FadeIn";
import { Wallpaper } from "../../types/wallpaper";
import * as favoriteService from "../../services/favoriteService";
import { useAuth } from "../../hooks/useAuth";

export default function FavoritesPage() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<Wallpaper[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (user) {
        try {
          const list = await favoriteService.fetchFavorites();
          setFavorites(list);
        } catch {
          setFavorites([]);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    }
    load();
  }, [user]);

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center space-y-4">
        <Heart className="w-12 h-12 text-neutral-600 mx-auto" />
        <h1 className="font-display text-2xl font-bold text-white">Save your favorites</h1>
        <p className="text-sm text-neutral-400">
          Sign in or create an account to curate your personal collection of wallpapers.
        </p>
        <div className="pt-2 flex justify-center gap-3">
          <Link
            href="/login"
            className="px-5 py-2.5 rounded-full bg-accent text-accent-ink font-bold text-xs hover:brightness-110 transition"
          >
            Log in
          </Link>
          <Link
            href="/register"
            className="px-5 py-2.5 rounded-full border border-white/15 bg-white/5 text-white font-semibold text-xs hover:bg-white/10 transition"
          >
            Sign up
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-shell px-4 sm:px-6 py-8 space-y-8">
      <FadeIn>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-black text-white tracking-tight">
              My Favorites
            </h1>
            <p className="mt-1 text-sm text-neutral-400">
              {favorites.length} saved {favorites.length === 1 ? "wallpaper" : "wallpapers"}
            </p>
          </div>
          <Link
            href="/explore"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent hover:underline"
          >
            <span>Explore more</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </FadeIn>

      {loading ? (
        <div className="text-center py-20 text-neutral-500 text-sm">
          Loading your favorites...
        </div>
      ) : (
        <WallpaperGrid
          wallpapers={favorites}
          favoriteIds={favorites.map((f) => f.id)}
          emptyMessage="You haven't added any wallpapers to your favorites yet. Tap the heart on any wallpaper to add it here!"
        />
      )}
    </div>
  );
}

