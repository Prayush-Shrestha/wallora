"use client";

import Link from "next/link";
import { Download, Heart, Share2, Sparkles, Check } from "lucide-react";
import { Wallpaper } from "../../types/wallpaper";
import { formatNumber } from "../../utils/format";

interface WallpaperActionsProps {
  wallpaper: Wallpaper;
  downloads: number;
  favorited: boolean;
  downloaded: boolean;
  onDownload: () => void;
  onToggleFavorite: () => void;
  onShare: () => void;
}

// Details sidebar: title, author, specs, download / favorite / share.
export function WallpaperActions({
  wallpaper,
  downloads,
  favorited,
  downloaded,
  onDownload,
  onToggleFavorite,
  onShare,
}: WallpaperActionsProps) {
  const is4K = wallpaper.width >= 3000;

  return (
    <div className="rounded-3xl border border-line/10 bg-raised/60 backdrop-blur-xl p-6 sm:p-8 space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-2">
          {wallpaper.category && (
            <Link
              href={`/category/${wallpaper.category.slug}`}
              className="text-xs font-bold text-accent uppercase tracking-wider hover:underline"
            >
              {wallpaper.category.name}
            </Link>
          )}
          {wallpaper.isAI && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent/10 border border-accent/30 text-[10px] font-bold text-accent">
              <Sparkles className="w-3 h-3" aria-hidden /> AI Generated
            </span>
          )}
          {is4K && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[10px] font-bold text-white tracking-wider">
              4K
            </span>
          )}
        </div>

        <h1 className="font-display text-2xl font-black text-strong tracking-tight">
          {wallpaper.title}
        </h1>
        {wallpaper.description && (
          <p className="mt-2 text-sm text-muted leading-relaxed">{wallpaper.description}</p>
        )}
      </div>

      <div className="flex items-center gap-3 pt-4 border-t border-line/10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={
            wallpaper.author?.profileImage ||
            `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(
              wallpaper.author?.name || "Wallora"
            )}`
          }
          alt={wallpaper.author?.name || "Artist"}
          className="w-10 h-10 rounded-full object-cover border border-line/15"
        />
        <div>
          <p className="text-xs text-muted">Created by</p>
          <p className="text-sm font-bold text-strong">
            {wallpaper.author?.name || "Community Artist"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 py-4 border-y border-line/10 text-xs">
        <div>
          <span className="text-faint block">Resolution</span>
          <span className="text-strong font-semibold">
            {wallpaper.width} × {wallpaper.height}
          </span>
        </div>
        <div>
          <span className="text-faint block">Orientation</span>
          <span className="text-strong font-semibold capitalize">{wallpaper.orientation}</span>
        </div>
        <div>
          <span className="text-faint block">Total Downloads</span>
          <span className="text-strong font-semibold">{formatNumber(downloads)}</span>
        </div>
        <div>
          <span className="text-faint block">Device Fit</span>
          <span className="text-strong font-semibold capitalize">
            {wallpaper.deviceType || "Desktop / Mobile"}
          </span>
        </div>
      </div>

      <div className="space-y-3 pt-2">
        <button
          onClick={onDownload}
          aria-live="polite"
          className="w-full flex items-center justify-center gap-2 py-4 rounded-full bg-accent text-accent-ink font-bold text-sm hover:brightness-110 active:scale-[0.98] transition shadow-lg shadow-accent/20"
        >
          {downloaded ? (
            <>
              <Check className="w-4 h-4" aria-hidden />
              <span>Downloaded — enjoy!</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4" aria-hidden />
              <span>Download Ultra HD Wallpaper</span>
            </>
          )}
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={onToggleFavorite}
            aria-pressed={favorited}
            aria-label={favorited ? "Remove from favorites" : "Save to favorites"}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-full border text-xs font-semibold transition ${
              favorited
                ? "border-red-500/50 bg-red-500/10 text-red-400"
                : "border-line/15 bg-line/5 text-strong hover:bg-line/10"
            }`}
          >
            <Heart className={`w-4 h-4 ${favorited ? "fill-red-400" : ""}`} aria-hidden />
            <span>{favorited ? "Favorited" : "Save Favorite"}</span>
          </button>

          <button
            onClick={onShare}
            aria-label="Share wallpaper"
            className="p-3 rounded-full border border-line/15 bg-line/5 text-strong hover:bg-line/10 transition"
          >
            <Share2 className="w-4 h-4" aria-hidden />
          </button>
        </div>
      </div>
    </div>
  );
}
