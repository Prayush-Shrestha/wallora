"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Heart, Download, Eye, BadgeCheck } from "lucide-react";
import type { Wallpaper } from "@/lib/data";
import { useStore } from "./StoreProvider";

function formatCount(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  return `${n}`;
}

export default function WallpaperCard({ w, rounded = true }: { w: Wallpaper; rounded?: boolean }) {
  const { isFavorite, toggleFavorite } = useStore();
  const [loaded, setLoaded] = useState(false);
  const [pop, setPop] = useState(false);
  const fav = isFavorite(w.id);

  const onFav = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(w.id);
    if (!fav) { setPop(true); setTimeout(() => setPop(false), 320); }
  };

  const onDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const res = await fetch(w.image);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `wallora-${w.id}.jpg`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      window.open(w.image, "_blank");
    }
  };

  return (
    <Link
      href={`/wallpaper/${w.id}`}
      className={`wp-card group block relative overflow-hidden bg-ink-800 light:bg-black/[0.04] border border-white/[0.06] light:border-black/10 ${rounded ? "rounded-[10px]" : "rounded-[2px]"}`}
      aria-label={`${w.title} by ${w.author}`}
    >
      <div className="relative w-full" style={{ aspectRatio: `${w.width} / ${w.height}` }}>
        <Image
          src={w.thumbnail}
          alt={w.title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          loading="lazy"
          onLoad={() => setLoaded(true)}
          className={`object-cover img-fade ${loaded ? "is-loaded" : ""}`}
        />
        {/* subtle bottom info always visible on touch, hover on desktop */}
        <div className="wp-actions absolute inset-0 flex flex-col justify-end">
          <div className="absolute inset-x-0 top-0 flex justify-end gap-1.5 p-2">
            <button
              onClick={onFav}
              aria-label={fav ? `Remove ${w.title} from favorites` : `Save ${w.title} to favorites`}
              aria-pressed={fav}
              className={`h-9 w-9 rounded-full flex items-center justify-center backdrop-blur transition-colors ${fav ? "bg-accent text-accent-ink" : "bg-black/55 text-white hover:bg-black/75"}`}
            >
              <Heart className={`h-4 w-4 ${pop ? "heart-pop" : ""}`} fill={fav ? "currentColor" : "none"} />
            </button>
            <button
              onClick={onDownload}
              aria-label={`Download ${w.title}`}
              className="h-9 w-9 rounded-full hidden sm:flex items-center justify-center bg-black/55 text-white hover:bg-black/75 backdrop-blur"
            >
              <Download className="h-4 w-4" />
            </button>
          </div>
          <div className="bg-black/55 backdrop-blur-sm px-3 py-2 flex items-center gap-2 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100 transition-opacity">
            <div className="min-w-0 flex-1">
              <p className="text-white text-[12.5px] font-semibold truncate leading-tight">{w.title}</p>
              <p className="text-white/60 text-[11px] truncate">{w.author} · {formatCount(w.downloads)} downloads</p>
            </div>
            <Eye className="h-3.5 w-3.5 text-white/60 shrink-0" aria-hidden />
          </div>
        </div>
        {w.isAI && (
          <span className="absolute left-2 top-2 inline-flex items-center gap-1 bg-black/60 backdrop-blur text-white text-[10px] font-semibold uppercase tracking-wide px-2 py-1 rounded">
            <BadgeCheck className="h-3 w-3" /> AI
          </span>
        )}
      </div>
    </Link>
  );
}

export function WallpaperMasonry({ items }: { items: Wallpaper[] }) {
  return (
    <div className="masonry columns-2 md:columns-3 xl:columns-4 2xl:columns-5">
      {items.map((w, i) => (
        <WallpaperCard key={w.id} w={w} rounded={i % 3 !== 2} />
      ))}
    </div>
  );
}
