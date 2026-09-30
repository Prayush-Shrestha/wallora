"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Download, Heart, ArrowLeft, Share2, Sparkles, Monitor, Eye } from "lucide-react";
import { Wallpaper } from "../../../types/wallpaper";
import { WallpaperGrid } from "../../../components/wallpaper/WallpaperGrid";
import { FadeIn } from "../../../components/ui/FadeIn";
import { formatNumber } from "../../../utils/format";
import * as wallpaperService from "../../../services/wallpaperService";
import * as favoriteService from "../../../services/favoriteService";
import { MOCK_WALLPAPERS } from "../../../lib/data";
import { useAuth } from "../../../hooks/useAuth";

interface WallpaperDetailPageProps {
  params: { id: string };
}

export default function WallpaperDetailPage({ params }: WallpaperDetailPageProps) {
  const { id } = params;
  const { user } = useAuth();

  const [wallpaper, setWallpaper] = useState<Wallpaper | null>(null);
  const [similar, setSimilar] = useState<Wallpaper[]>([]);
  const [downloads, setDownloads] = useState<number>(0);
  const [favorited, setFavorited] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await wallpaperService.fetchWallpaperById(id);
        if (data?.wallpaper) {
          setWallpaper(data.wallpaper);
          setSimilar(data.similar || []);
          setDownloads(data.wallpaper.downloads || 0);
        }
      } catch {
        // Fallback to local mock data
        const local = MOCK_WALLPAPERS.find((w) => w.id === id) || MOCK_WALLPAPERS[0];
        setWallpaper(local);
        setSimilar(MOCK_WALLPAPERS.filter((w) => w.id !== local.id).slice(0, 4));
        setDownloads(local.downloads || 0);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const handleDownload = async () => {
    if (!wallpaper) return;
    try {
      await wallpaperService.downloadWallpaper(wallpaper.id);
      setDownloads((prev) => prev + 1);
    } catch {}

    // Trigger download in browser
    window.open(wallpaper.imageUrl, "_blank");
  };

  const handleToggleFavorite = async () => {
    if (!user) {
      window.location.href = "/login";
      return;
    }
    if (!wallpaper) return;

    try {
      const res = await favoriteService.toggleFavorite(wallpaper.id);
      setFavorited(res.isFavorite);
    } catch {
      setFavorited(!favorited);
    }
  };

  if (loading || !wallpaper) {
    return (
      <div className="mx-auto max-w-shell px-4 py-24 text-center text-neutral-500">
        Loading wallpaper details...
      </div>
    );
  }

  const isPortrait = wallpaper.orientation === "portrait";

  return (
    <div className="mx-auto max-w-shell px-4 sm:px-6 py-8 space-y-12">
      <FadeIn>
        <Link
          href="/explore"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-400 hover:text-white mb-6 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to explore</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Wallpaper Preview Image */}
          <div className="lg:col-span-8 flex justify-center">
            <div
              className={`relative rounded-3xl overflow-hidden border border-white/10 bg-ink-900 w-full ${
                isPortrait ? "max-w-md aspect-[9/16]" : "aspect-[16/10]"
              }`}
            >
              <Image
                src={wallpaper.imageUrl}
                alt={wallpaper.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 66vw"
                className="object-contain"
              />
            </div>
          </div>

          {/* Details & Actions Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="rounded-3xl border border-white/10 bg-ink-900/60 backdrop-blur-xl p-6 sm:p-8 space-y-6">
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
                      <Sparkles className="w-3 h-3" /> AI Generated
                    </span>
                  )}
                </div>

                <h1 className="font-display text-2xl font-black text-white tracking-tight">
                  {wallpaper.title}
                </h1>
                {wallpaper.description && (
                  <p className="mt-2 text-sm text-neutral-400 leading-relaxed">
                    {wallpaper.description}
                  </p>
                )}
              </div>

              {/* Author Info */}
              <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={
                    wallpaper.author?.profileImage ||
                    `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(
                      wallpaper.author?.name || "Wallora"
                    )}`
                  }
                  alt={wallpaper.author?.name || "Artist"}
                  className="w-10 h-10 rounded-full object-cover border border-white/15"
                />
                <div>
                  <p className="text-xs text-neutral-400">Created by</p>
                  <p className="text-sm font-bold text-white">
                    {wallpaper.author?.name || "Community Artist"}
                  </p>
                </div>
              </div>

              {/* Specifications */}
              <div className="grid grid-cols-2 gap-3 py-4 border-y border-white/10 text-xs">
                <div>
                  <span className="text-neutral-500 block">Resolution</span>
                  <span className="text-white font-semibold">
                    {wallpaper.width} × {wallpaper.height}
                  </span>
                </div>
                <div>
                  <span className="text-neutral-500 block">Orientation</span>
                  <span className="text-white font-semibold capitalize">
                    {wallpaper.orientation}
                  </span>
                </div>
                <div>
                  <span className="text-neutral-500 block">Total Downloads</span>
                  <span className="text-white font-semibold">{formatNumber(downloads)}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block">Device Fit</span>
                  <span className="text-white font-semibold capitalize">
                    {wallpaper.deviceType || "Desktop / Mobile"}
                  </span>
                </div>
              </div>

              {/* Buttons */}
              <div className="space-y-3 pt-2">
                <button
                  onClick={handleDownload}
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-full bg-accent text-accent-ink font-bold text-sm hover:brightness-110 active:scale-98 transition shadow-lg shadow-accent/20"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Ultra HD Wallpaper</span>
                </button>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleToggleFavorite}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-full border text-xs font-semibold transition ${
                      favorited
                        ? "border-red-500/50 bg-red-500/10 text-red-400"
                        : "border-white/15 bg-white/5 text-white hover:bg-white/10"
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${favorited ? "fill-red-400" : ""}`} />
                    <span>{favorited ? "Favorited" : "Save Favorite"}</span>
                  </button>

                  <button
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({ title: wallpaper.title, url: window.location.href });
                      } else {
                        navigator.clipboard.writeText(window.location.href);
                        alert("Link copied to clipboard!");
                      }
                    }}
                    className="p-3 rounded-full border border-white/15 bg-white/5 text-white hover:bg-white/10 transition"
                    title="Share wallpaper"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* Similar Wallpapers */}
      {similar.length > 0 && (
        <section className="pt-8 border-t border-white/10 space-y-6">
          <h2 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight">
            Similar Wallpapers
          </h2>
          <WallpaperGrid wallpapers={similar} />
        </section>
      )}
    </div>
  );
}

