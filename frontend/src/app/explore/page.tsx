"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Wallpaper, WallpaperFilterParams } from "../../types/wallpaper";
import { WallpaperGrid } from "../../components/wallpaper/WallpaperGrid";
import { WallpaperFilter } from "../../components/wallpaper/WallpaperFilter";
import { FadeIn } from "../../components/ui/FadeIn";
import * as wallpaperService from "../../services/wallpaperService";
import { CATEGORIES, MOCK_WALLPAPERS } from "../../lib/data";

type SortOption = NonNullable<WallpaperFilterParams["sort"]>;

function parseSort(value: string | null): SortOption {
  if (value === "recent" || value === "downloads" || value === "trending") return value;
  return "trending";
}

function applyMockFilters(filters: WallpaperFilterParams): Wallpaper[] {
  let filtered = [...MOCK_WALLPAPERS];

  if (filters.category && filters.category !== "all") {
    filtered = filtered.filter((w) => w.category?.slug === filters.category);
  }
  if (filters.orientation && filters.orientation !== "all") {
    filtered = filtered.filter((w) => w.orientation === filters.orientation);
  }
  if (filters.deviceType && filters.deviceType !== "all") {
    filtered = filtered.filter((w) => w.deviceType === filters.deviceType);
  }
  if (typeof filters.isAI === "boolean") {
    filtered = filtered.filter((w) => w.isAI === filters.isAI);
  }
  if (filters.q && filters.q.trim()) {
    const lower = filters.q.trim().toLowerCase();
    filtered = filtered.filter(
      (w) =>
        w.title.toLowerCase().includes(lower) ||
        w.description?.toLowerCase().includes(lower) ||
        w.category?.name.toLowerCase().includes(lower)
    );
  }

  // Mirror backend ordering: trending = downloads desc + recent first,
  // downloads = downloads desc, recent = createdAt desc.
  const sort = filters.sort ?? "trending";
  filtered.sort((a, b) => {
    if (sort === "downloads" || sort === "trending") {
      if (b.downloads !== a.downloads) return b.downloads - a.downloads;
    }
    return +new Date(b.createdAt) - +new Date(a.createdAt);
  });

  return filtered;
}

function ExploreContent() {
  const searchParams = useSearchParams();
  const urlQ = searchParams.get("q") ?? "";
  const urlCategory = searchParams.get("category") ?? "all";
  const urlSort = parseSort(searchParams.get("sort"));

  const [filters, setFilters] = useState<WallpaperFilterParams>({
    q: urlQ,
    category: urlCategory,
    sort: urlSort,
    deviceType: "all",
    orientation: "all",
  });

  // Keep filters in sync when the URL query changes (e.g. navbar search).
  useEffect(() => {
    setFilters((prev) => {
      if (prev.q === urlQ && prev.category === urlCategory && prev.sort === urlSort) {
        return prev;
      }
      return { ...prev, q: urlQ, category: urlCategory, sort: urlSort };
    });
  }, [urlQ, urlCategory, urlSort]);

  const [wallpapers, setWallpapers] = useState<Wallpaper[]>(MOCK_WALLPAPERS);
  const [loading, setLoading] = useState(false);

  const loadWallpapers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await wallpaperService.fetchWallpapers(filters);
      if (data?.wallpapers) {
        setWallpapers(data.wallpapers);
      } else {
        setWallpapers(applyMockFilters(filters));
      }
    } catch {
      // Backend offline — filter bundled mock data in-memory.
      setWallpapers(applyMockFilters(filters));
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadWallpapers();
  }, [loadWallpapers]);

  const handleFilterChange = (updated: Partial<WallpaperFilterParams>) => {
    setFilters((prev) => ({ ...prev, ...updated }));
  };

  return (
    <div className="mx-auto max-w-shell px-4 sm:px-6 py-8 space-y-8">
      <FadeIn>
        <div>
          <h1 className="font-display text-3xl font-black text-white tracking-tight">
            Explore Wallpapers
          </h1>
          <p className="mt-1 text-sm text-neutral-400">
            Browse our entire collection filtered by device, style, and orientation.
          </p>
        </div>
      </FadeIn>

      <WallpaperFilter filters={filters} onChange={handleFilterChange} categories={CATEGORIES} />

      {loading ? (
        <div className="text-center py-24 text-neutral-500 text-sm">
          Loading wallpapers...
        </div>
      ) : (
        <WallpaperGrid
          wallpapers={wallpapers}
          emptyMessage="No wallpapers found matching your filters. Try clearing some selections."
        />
      )}
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-shell px-4 sm:px-6 py-12 text-center text-neutral-500 text-sm">
          Loading explore page...
        </div>
      }
    >
      <ExploreContent />
    </Suspense>
  );
}
