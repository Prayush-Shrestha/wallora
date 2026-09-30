"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Download, Heart, Sparkles } from "lucide-react";
import { Wallpaper } from "../../types/wallpaper";
import { formatNumber } from "../../utils/format";
import * as favoriteService from "../../services/favoriteService";
import { useAuth } from "../../hooks/useAuth";

interface WallpaperCardProps {
  wallpaper: Wallpaper;
  isFavoritedInitially?: boolean;
}

export function WallpaperCard({ wallpaper, isFavoritedInitially = false }: WallpaperCardProps) {
  const { user } = useAuth();
  const [favorited, setFavorited] = useState(isFavoritedInitially);
  const [loadingFav, setLoadingFav] = useState(false);

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      window.location.href = "/login";
      return;
    }

    setLoadingFav(true);
    try {
      const res = await favoriteService.toggleFavorite(wallpaper.id);
      setFavorited(res.isFavorite);
    } catch {
      setFavorited(!favorited);
    } finally {
      setLoadingFav(false);
    }
  };

  const isPortrait = wallpaper.orientation === "portrait";

  return (
    <div className="group relative rounded-2xl overflow-hidden bg-ink-900 border border-white/10 hover:border-white/20 transition-all duration-300">
      <Link href={`/wallpaper/${wallpaper.id}`} className="block relative overflow-hidden">
        <div
          className={`relative w-full ${
            isPortrait ? "aspect-[9/16]" : "aspect-[16/10]"
          }`}
        >
          <Image
            src={wallpaper.thumbnailUrl || wallpaper.imageUrl}
            alt={wallpaper.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
          />

          {/* AI Badge */}
          {wallpaper.isAI && (
            <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[10px] font-bold text-accent uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-accent" />
              <span>AI</span>
            </div>
          )}

          {/* Favorite Button */}
          <button
            onClick={handleFavoriteClick}
            disabled={loadingFav}
            aria-label="Save to favorites"
            className="absolute top-3 right-3 p-2 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white hover:text-red-400 hover:scale-110 active:scale-95 transition-all opacity-0 group-hover:opacity-100 sm:opacity-90"
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                favorited ? "fill-red-500 text-red-500" : "text-white"
              }`}
            />
          </button>

          {/* Bottom Hover Overlay */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 flex items-end justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="truncate mr-2">
              <h3 className="text-sm font-bold text-white truncate drop-shadow-sm">
                {wallpaper.title}
              </h3>
              <p className="text-xs text-neutral-300 truncate">
                {wallpaper.author?.name || "Community Artist"}
              </p>
            </div>

            <div className="flex items-center gap-1 text-xs text-neutral-300 shrink-0 bg-white/10 px-2 py-1 rounded-md backdrop-blur-sm">
              <Download className="w-3.5 h-3.5" />
              <span>{formatNumber(wallpaper.downloads || 0)}</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

