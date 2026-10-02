"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Wallpaper } from "../../../types/wallpaper";
import { WallpaperGrid } from "../../../components/wallpaper/WallpaperGrid";
import { WallpaperPreview } from "../../../components/wallpaper/WallpaperPreview";
import { WallpaperActions } from "../../../components/wallpaper/WallpaperActions";
import { FadeIn } from "../../../components/ui/FadeIn";
import { SkeletonGrid } from "../../../components/ui/Skeleton";
import { showToast } from "../../../components/ui/Toast";
import * as wallpaperService from "../../../services/wallpaperService";
import * as favoriteService from "../../../services/favoriteService";
import { MOCK_WALLPAPERS } from "../../../lib/data";
import { useAuth } from "../../../hooks/useAuth";

interface WallpaperDetailPageProps {
  params: { id: string };
}

// /wallpaper/[id] — preview + actions sidebar + related grid.
export default function WallpaperDetailPage({ params }: WallpaperDetailPageProps) {
  const { id } = params;
  const { user } = useAuth();
  const router = useRouter();

  const [wallpaper, setWallpaper] = useState<Wallpaper | null>(null);
  const [similar, setSimilar] = useState<Wallpaper[]>([]);
  const [downloads, setDownloads] = useState<number>(0);
  const [favorited, setFavorited] = useState(false);
  const [loading, setLoading] = useState(true);
  const [downloaded, setDownloaded] = useState(false);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await wallpaperService.fetchWallpaperById(id);
        if (data?.wallpaper) {
          setWallpaper(data.wallpaper);
          setSimilar(data.similar || []);
          setDownloads(data.wallpaper.downloads || 0);
        } else {
          setMissing(true);
        }
      } catch {
        // Backend offline — fall back to bundled mock data, but never show
        // the wrong wallpaper for an unknown id.
        const local = MOCK_WALLPAPERS.find((w) => w.id === id);
        if (!local) {
          setMissing(true);
        } else {
          setWallpaper(local);
          setSimilar(MOCK_WALLPAPERS.filter((w) => w.id !== local.id).slice(0, 4));
          setDownloads(local.downloads || 0);
        }
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
    } catch {
      // Count failed — the file still downloads for the user.
    }

    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2600);

    try {
      const res = await fetch(wallpaper.imageUrl);
      if (!res.ok) throw new Error("fetch failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${wallpaper.title.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}-${wallpaper.width}x${wallpaper.height}.jpg`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    } catch {
      const link = document.createElement("a");
      link.href = wallpaper.imageUrl;
      link.download = `${wallpaper.id}.jpg`;
      link.rel = "noreferrer";
      document.body.appendChild(link);
      link.click();
      link.remove();
    }
  };

  const handleToggleFavorite = async () => {
    if (!user) {
      router.push("/login");
      return;
    }
    if (!wallpaper) return;

    try {
      const res = await favoriteService.toggleFavorite(wallpaper.id);
      setFavorited(res.isFavorite);
    } catch {
      setFavorited((prev) => !prev);
    }
  };

  const handleShare = async () => {
    if (!wallpaper) return;
    try {
      if (navigator.share) {
        await navigator.share({ title: wallpaper.title, url: window.location.href });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        showToast("Link copied to clipboard");
      }
    } catch {
      // User dismissed the share sheet — nothing to do.
    }
  };

  if (loading || (!wallpaper && !missing)) {
    return (
      <div className="mx-auto max-w-shell px-4 sm:px-6 py-8">
        <SkeletonGrid count={4} message="Loading wallpaper details..." />
      </div>
    );
  }

  if (missing || !wallpaper) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center space-y-4">
        <h1 className="font-display text-2xl font-black text-strong">Wallpaper not found</h1>
        <p className="text-sm text-muted">
          This wallpaper doesn&apos;t exist or was removed.
        </p>
        <Link
          href="/explore"
          className="inline-block px-6 py-3 rounded-full bg-accent text-accent-ink text-xs font-bold hover:brightness-110 transition"
        >
          Explore wallpapers
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-shell px-4 sm:px-6 py-8 space-y-12">
      <FadeIn>
        <Link
          href="/explore"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-strong mb-6 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to explore</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8">
            <WallpaperPreview wallpaper={wallpaper} />
          </div>
          <div className="lg:col-span-4">
            <WallpaperActions
              wallpaper={wallpaper}
              downloads={downloads}
              favorited={favorited}
              downloaded={downloaded}
              onDownload={handleDownload}
              onToggleFavorite={handleToggleFavorite}
              onShare={handleShare}
            />
          </div>
        </div>
      </FadeIn>

      {similar.length > 0 && (
        <section className="pt-8 border-t border-line/10 space-y-6">
          <h2 className="font-display text-xl sm:text-2xl font-bold text-strong tracking-tight">
            Similar Wallpapers
          </h2>
          <WallpaperGrid wallpapers={similar} />
        </section>
      )}
    </div>
  );
}
