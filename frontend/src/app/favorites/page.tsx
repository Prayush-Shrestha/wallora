"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, ArrowRight } from "lucide-react";
import { WallpaperGrid } from "../../components/wallpaper/WallpaperGrid";
import { FadeIn } from "../../components/ui/FadeIn";
import { SkeletonGrid } from "../../components/ui/Skeleton";
import { Wallpaper } from "../../types/wallpaper";
import * as favoriteService from "../../services/favoriteService";
import { useAuth } from "../../hooks/useAuth";

export default function FavoritesPage() {
  const { user, loading: authLoading } = useAuth();
  const [favorites, setFavorites] = useState<Wallpaper[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      // Wait for the session check so a hard refresh doesn't flash the
      // logged-out prompt for users with a valid token.
      if (authLoading) return;
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
  }, [user, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="mx-auto max-w-shell px-4 sm:px-6 py-8">
        <SkeletonGrid message="Loading your favorites..." />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center space-y-4">
        <Heart className="w-12 h-12 text-faint mx-auto" />
        <h1 className="font-display text-2xl font-bold text-strong">Save your favorites</h1>
        <p className="text-sm text-muted">
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
            className="px-5 py-2.5 rounded-full border border-line/15 bg-line/5 text-strong font-semibold text-xs hover:bg-line/10 transition"
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
            <h1 className="font-display text-3xl font-black text-strong tracking-tight">
              My Favorites
            </h1>
            <p className="mt-1 text-sm text-muted">
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
        <SkeletonGrid message="Loading your favorites..." />
      ) : favorites.length === 0 ? (
        <div role="status" className="text-center py-20 border border-dashed border-line/10 rounded-3xl px-6 max-w-lg mx-auto">
          <Heart className="w-10 h-10 text-faint mx-auto" aria-hidden />
          <h2 className="mt-4 font-display text-xl font-bold text-strong tracking-tight">
            Your collection starts here
          </h2>
          <p className="mt-2 text-sm text-muted">
            Save wallpapers you want to come back to — tap the heart on any wallpaper and it will live here.
          </p>
          <Link
            href="/explore"
            className="mt-6 inline-flex items-center gap-1.5 px-6 py-3 rounded-full bg-accent text-accent-ink text-xs font-bold hover:brightness-110 transition"
          >
            <span>Explore wallpapers</span>
            <ArrowRight className="w-3.5 h-3.5" aria-hidden />
          </Link>
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

