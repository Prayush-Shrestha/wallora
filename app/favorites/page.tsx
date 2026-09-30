"use client";
import Link from "next/link";
import { Heart } from "lucide-react";
import { WALLPAPERS } from "@/lib/data";
import { WallpaperMasonry } from "@/components/WallpaperCard";
import { useStore } from "@/components/StoreProvider";

export default function FavoritesPage() {
  const { favorites } = useStore();
  const items = WALLPAPERS.filter((w) => favorites.includes(w.id));

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-[640px] px-4 py-20 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white/10 light:bg-black/5">
          <Heart className="h-6 w-6 text-neutral-400" aria-hidden />
        </span>
        <h1 className="font-display text-[26px] font-bold tracking-tight mt-5">Your collection is empty.</h1>
        <p className="text-neutral-400 light:text-neutral-500 text-[14.5px] mt-2">Save wallpapers you love and they&apos;ll appear here.</p>
        <Link href="/explore" className="mt-6 inline-flex items-center rounded-full bg-accent text-accent-ink font-semibold text-[14px] px-6 py-3 min-h-[48px]">Explore wallpapers</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1320px] px-4 sm:px-6 py-8">
      <h1 className="font-display text-[28px] sm:text-[34px] font-bold tracking-tight">Saved</h1>
      <p className="text-neutral-400 light:text-neutral-500 text-[14px] mt-1">{items.length} wallpaper{items.length === 1 ? "" : "s"} · stored on this device</p>
      <div className="mt-5"><WallpaperMasonry items={items} /></div>
    </div>
  );
}
