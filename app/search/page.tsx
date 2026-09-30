"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { searchWallpapers } from "@/lib/data";
import { WallpaperMasonry } from "@/components/WallpaperCard";
import SearchBar from "@/components/SearchBar";

function SearchInner() {
  const params = useSearchParams();
  const q = params.get("q") ?? "";
  const results = searchWallpapers(q);
  return (
    <div className="mx-auto max-w-[1320px] px-4 sm:px-6 py-8">
      <h1 className="font-display text-[26px] sm:text-[34px] font-bold tracking-tight">
        {q ? <>Results for “{q}”</> : "Search"}
      </h1>
      <p className="text-neutral-400 light:text-neutral-500 text-[14px] mt-1">{q ? `${results.length} matches` : "Try “black sports car”, “anime sunset”, “pink aesthetic”…"} </p>
      <div className="mt-5 max-w-xl"><SearchBar initial={q} autofocus /></div>
      {q && (
        <div className="mt-4 flex flex-wrap gap-2">
          {["black sports car","anime sunset","minimal mountain","pink aesthetic","dark gaming","space","forest","cyberpunk city"].map((s) => (
            <a key={s} href={`/search?q=${encodeURIComponent(s)}`} className="text-[12.5px] border border-white/10 light:border-black/10 rounded-full px-3 py-1.5 text-neutral-300 light:text-neutral-600 hover:border-white/30">{s}</a>
          ))}
        </div>
      )}
      <div className="mt-6">
        {q && results.length === 0 ? (
          <div className="text-center py-14">
            <p className="font-semibold text-[16px]">No wallpapers found for “{q}”.</p>
            <p className="text-neutral-500 text-[14px] mt-1">Try fewer words, or browse trending instead.</p>
          </div>
        ) : (
          <WallpaperMasonry items={q ? results : []} />
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-8 text-neutral-500">Searching…</div>}>
      <SearchInner />
    </Suspense>
  );
}
