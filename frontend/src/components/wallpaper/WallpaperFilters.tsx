"use client";

import { Monitor, Smartphone, Tablet, SlidersHorizontal, Sparkles, X, Search } from "lucide-react";
import { WallpaperFilterParams } from "../../types/wallpaper";

interface WallpaperFiltersProps {
  filters: WallpaperFilterParams;
  onChange: (updated: Partial<WallpaperFilterParams>) => void;
  categories?: { id: string; name: string; slug: string }[];
}

// Canonical filter bar for Explore: search + category + device + sort.
// WallpaperFilter.tsx re-exports this so old imports keep working.
export function WallpaperFilters({ filters, onChange, categories = [] }: WallpaperFiltersProps) {
  const devices = [
    { id: "all", label: "All Devices", icon: SlidersHorizontal },
    { id: "desktop", label: "Desktop", icon: Monitor },
    { id: "phone", label: "Phone", icon: Smartphone },
    { id: "tablet", label: "Tablet", icon: Tablet },
  ];

  const orientations = [
    { id: "all", label: "All Layouts" },
    { id: "landscape", label: "Landscape" },
    { id: "portrait", label: "Portrait" },
    { id: "ultrawide", label: "Ultrawide" },
  ];

  const sorts = [
    { id: "trending", label: "Trending" },
    { id: "recent", label: "Newest" },
    { id: "downloads", label: "Most downloaded" },
  ] as const;

  const activeChips: { key: keyof WallpaperFilterParams; label: string }[] = [];
  if (filters.category && filters.category !== "all") {
    const cat = categories.find((c) => c.slug === filters.category);
    activeChips.push({ key: "category", label: cat?.name ?? filters.category });
  }
  if (filters.deviceType && filters.deviceType !== "all") {
    activeChips.push({ key: "deviceType", label: filters.deviceType });
  }
  if (filters.orientation && filters.orientation !== "all") {
    activeChips.push({ key: "orientation", label: filters.orientation });
  }
  if (filters.isAI) activeChips.push({ key: "isAI", label: "AI only" });
  if (filters.q) activeChips.push({ key: "q", label: `“${filters.q}”` });

  const clearChip = (key: keyof WallpaperFilterParams) => {
    if (key === "isAI") onChange({ isAI: undefined, page: 1 });
    else if (key === "q") onChange({ q: "", page: 1 });
    else if (key === "category") onChange({ category: "all", page: 1 });
    else if (key === "deviceType") onChange({ deviceType: "all", page: 1 });
    else if (key === "orientation") onChange({ orientation: "all", page: 1 });
  };

  return (
    <div className="space-y-4">
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-faint pointer-events-none" aria-hidden />
        <label htmlFor="explore-search" className="sr-only">
          Search wallpapers
        </label>
        <input
          id="explore-search"
          type="search"
          value={filters.q ?? ""}
          onChange={(e) => onChange({ q: e.target.value, page: 1 })}
          placeholder="Search by title, tag, or style..."
          autoComplete="off"
          className="w-full rounded-full bg-line/5 border border-line/10 pl-10 pr-4 py-2.5 text-sm text-strong placeholder:text-faint focus:outline-none focus:border-accent transition"
        />
      </div>

      {categories.length > 0 && (
        <div
          role="group"
          aria-label="Filter by category"
          className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap"
        >
          <button
            onClick={() => onChange({ category: "all", page: 1 })}
            aria-pressed={(filters.category || "all") === "all"}
            className={`px-3.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
              (filters.category || "all") === "all"
                ? "bg-strong text-white"
                : "bg-line/5 text-muted hover:bg-line/10 hover:text-strong"
            }`}
          >
            All
          </button>
          {categories.map((c) => {
            const active = filters.category === c.slug;
            return (
              <button
                key={c.id}
                onClick={() => onChange({ category: active ? "all" : c.slug, page: 1 })}
                aria-pressed={active}
                className={`px-3.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                  active
                    ? "bg-strong text-white"
                    : "bg-line/5 text-muted hover:bg-line/10 hover:text-strong"
                }`}
              >
                {c.name}
              </button>
            );
          })}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-line/10">
        <fieldset className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <legend className="sr-only">Filter by device</legend>
          {devices.map((d) => {
            const Icon = d.icon;
            const active = (filters.deviceType || "all") === d.id;
            return (
              <button
                key={d.id}
                onClick={() => onChange({ deviceType: d.id, page: 1 })}
                aria-pressed={active}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                  active
                    ? "bg-accent text-accent-ink"
                    : "bg-line/5 text-muted hover:bg-line/10 hover:text-strong"
                }`}
              >
                <Icon className="w-3.5 h-3.5" aria-hidden />
                <span>{d.label}</span>
              </button>
            );
          })}
        </fieldset>

        <div className="flex flex-wrap items-center gap-3">
          <div
            role="group"
            aria-label="Filter by orientation"
            className="hidden sm:flex items-center bg-line/5 rounded-full p-1 border border-line/10"
          >
            {orientations.map((o) => {
              const active = (filters.orientation || "all") === o.id;
              return (
                <button
                  key={o.id}
                  onClick={() => onChange({ orientation: o.id, page: 1 })}
                  aria-pressed={active}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    active ? "bg-line/20 text-strong font-semibold" : "text-muted hover:text-strong"
                  }`}
                >
                  {o.label}
                </button>
              );
            })}
          </div>

          <label className="sr-only" htmlFor="wallpaper-sort">
            Sort wallpapers
          </label>
          <select
            id="wallpaper-sort"
            value={filters.sort || "trending"}
            onChange={(e) =>
              onChange({ sort: e.target.value as WallpaperFilterParams["sort"], page: 1 })
            }
            className="px-3 py-1.5 rounded-full text-xs font-semibold bg-line/5 border border-line/10 text-muted hover:text-strong focus:text-strong transition"
          >
            {sorts.map((s) => (
              <option key={s.id} value={s.id} className="bg-base">
                {s.label}
              </option>
            ))}
          </select>

          <button
            onClick={() => onChange({ isAI: filters.isAI ? undefined : true, page: 1 })}
            aria-pressed={!!filters.isAI}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
              filters.isAI
                ? "bg-accent/10 border-accent text-accent"
                : "border-line/10 text-muted hover:text-strong hover:border-line/20"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" aria-hidden />
            <span>AI Only</span>
          </button>
        </div>
      </div>

      {activeChips.length > 0 && (
        <div className="flex flex-wrap items-center gap-2" aria-label="Active filters">
          {activeChips.map((chip) => (
            <button
              key={chip.key}
              onClick={() => clearChip(chip.key)}
              aria-label={`Remove ${chip.label} filter`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-line/5 border border-line/15 text-xs font-semibold text-strong hover:border-line/30 transition capitalize"
            >
              <span>{chip.label}</span>
              <X className="w-3 h-3 text-muted" aria-hidden />
            </button>
          ))}
          <button
            onClick={() =>
              onChange({ category: "all", deviceType: "all", orientation: "all", isAI: undefined, q: "", page: 1 })
            }
            className="text-xs font-semibold text-muted hover:text-accent transition px-1"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}
