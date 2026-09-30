"use client";
import { useMemo, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";
import { WALLPAPERS, CATEGORIES } from "@/lib/data";
import { WallpaperMasonry } from "@/components/WallpaperCard";
import DeviceFilter from "@/components/DeviceFilter";
import SearchBar from "@/components/SearchBar";

const ORIENTATIONS = ["all", "portrait", "landscape", "square", "ultrawide"];
const COLORS = ["all", "black", "white", "blue", "red", "purple", "green", "orange", "pink", "beige"];
const SORTS = [
  { v: "popular", l: "Popular" },
  { v: "newest", l: "Newest" },
];

function ExploreInner() {
  const params = useSearchParams();
  const initialDevice = params.get("device") ?? "all";
  const initialSort = params.get("sort") ?? "popular";

  const [device, setDevice] = useState(initialDevice);
  const [category, setCategory] = useState("all");
  const [orientation, setOrientation] = useState("all");
  const [color, setColor] = useState("all");
  const [sort, setSort] = useState(initialSort);
  const [aiOnly, setAiOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const items = useMemo(() => {
    let list = [...WALLPAPERS];
    if (device !== "all") list = list.filter((w) => w.device.includes(device as any));
    if (category !== "all") list = list.filter((w) => w.category === category);
    if (orientation !== "all") list = list.filter((w) => w.orientation === orientation);
    if (color !== "all") list = list.filter((w) => `${w.tags.join(" ")} ${w.colors.join(" ")} ${w.title}`.toLowerCase().includes(color));
    if (aiOnly) list = list.filter((w) => w.isAI);
    if (sort === "popular") list.sort((a, b) => b.downloads - a.downloads);
    else list.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    return list;
  }, [device, category, orientation, color, sort, aiOnly]);

  return (
    <div className="mx-auto max-w-[1320px] px-4 sm:px-6 py-8">
      <h1 className="font-display text-[28px] sm:text-[36px] font-bold tracking-tight">Explore</h1>
      <p className="text-neutral-400 light:text-neutral-500 text-[14px] mt-1">{items.length} wallpapers · filtered for real screens</p>

      <div className="mt-5 max-w-xl"><SearchBar /></div>

      <div className="mt-5">
        <DeviceFilter value={device} onChange={setDevice} />
      </div>

      <div className="mt-4 flex items-center gap-2">
        <button onClick={() => setShowFilters((v) => !v)} aria-expanded={showFilters} className="inline-flex items-center gap-2 text-[13.5px] font-semibold border border-white/10 light:border-black/10 rounded-full px-4 py-2.5 min-h-[44px]">
          <SlidersHorizontal className="h-4 w-4" /> Filters {category !== "all" || orientation !== "all" || color !== "all" ? "· active" : ""}
        </button>
        <div className="flex gap-1.5 ml-auto">
          {SORTS.map((s) => (
            <button key={s.v} onClick={() => setSort(s.v)} aria-pressed={sort === s.v} className={`text-[13px] font-semibold rounded-full px-4 py-2 min-h-[40px] ${sort === s.v ? "bg-accent text-accent-ink" : "border border-white/10 light:border-black/10"}`}>
              {s.l}
            </button>
          ))}
        </div>
      </div>

      {(showFilters || true) && (
        <div className={`${showFilters ? "grid" : "hidden sm:grid"} mt-4 gap-4 rounded-2xl border border-white/10 light:border-black/10 bg-ink-900 light:bg-white p-4 sm:grid-cols-4`}>
          <label className="grid gap-1.5 text-[13px] font-semibold">
            Category
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="bg-ink-950 light:bg-neutral-100 border border-white/10 light:border-black/10 rounded-lg px-3 py-2.5 text-[14px] font-normal min-h-[44px]" aria-label="Filter by category">
              <option value="all">All categories</option>
              {CATEGORIES.map((c) => <option key={c.slug} value={c.slug}>{c.label}</option>)}
            </select>
          </label>
          <label className="grid gap-1.5 text-[13px] font-semibold">
            Orientation
            <select value={orientation} onChange={(e) => setOrientation(e.target.value)} className="bg-ink-950 light:bg-neutral-100 border border-white/10 light:border-black/10 rounded-lg px-3 py-2.5 text-[14px] font-normal min-h-[44px]" aria-label="Filter by orientation">
              {ORIENTATIONS.map((o) => <option key={o} value={o}>{o === "all" ? "All orientations" : o}</option>)}
            </select>
          </label>
          <label className="grid gap-1.5 text-[13px] font-semibold">
            Color
            <select value={color} onChange={(e) => setColor(e.target.value)} className="bg-ink-950 light:bg-neutral-100 border border-white/10 light:border-black/10 rounded-lg px-3 py-2.5 text-[14px] font-normal min-h-[44px]" aria-label="Filter by color">
              {COLORS.map((c) => <option key={c} value={c}>{c === "all" ? "All colors" : c}</option>)}
            </select>
          </label>
          <label className="flex items-center gap-2.5 text-[14px] pt-6 cursor-pointer">
            <input type="checkbox" checked={aiOnly} onChange={(e) => setAiOnly(e.target.checked)} className="h-5 w-5 accent-[#D8FF3E]" />
            AI creations only
          </label>
        </div>
      )}

      <div className="mt-6">
        {items.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-[17px] font-semibold">Nothing matches those filters.</p>
            <p className="text-neutral-500 text-[14px] mt-1">Try widening the device or category.</p>
            <button onClick={() => { setDevice("all"); setCategory("all"); setOrientation("all"); setColor("all"); setAiOnly(false); }} className="mt-4 rounded-full bg-white text-black text-[14px] font-semibold px-5 py-2.5">Reset filters</button>
          </div>
        ) : (
          <WallpaperMasonry items={items} />
        )}
      </div>
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={<div className="p-8 text-neutral-500">Loading…</div>}>
      <ExploreInner />
    </Suspense>
  );
}
