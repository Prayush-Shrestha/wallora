"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Wallpaper, WallpaperFilterParams } from "../../types/wallpaper";
import { WallpaperGrid } from "../../components/wallpaper/WallpaperGrid";
import { WallpaperFilters } from "../../components/wallpaper/WallpaperFilters";
import { FadeIn } from "../../components/ui/FadeIn";
import { SkeletonGrid } from "../../components/ui/Skeleton";
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
      if ((b.downloads || 0) !== (a.downloads || 0)) return (b.downloads || 0) - (a.downloads || 0);
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

  // Debounce the search text so typing doesn't fire a request per keystroke.
  // The input stays instant (filters.q); only fetching waits 350ms.
  const [debouncedQ, setDebouncedQ] = useState(filters.q ?? "");
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(filters.q ?? ""), 350);
    return () => clearTimeout(t);
  }, [filters.q]);

  const loadWallpapers = useCallback(async () => {
    const effective = { ...filters, q: debouncedQ };
    setLoading(true);
    try {
      const data = await wallpaperService.fetchWallpapers(effective);
      if (data?.wallpapers) {
        setWallpapers(data.wallpapers);
      } else {
        setWallpapers(applyMockFilters(effective));
      }
    } catch {
      // Backend offline — filter bundled mock data in-memory.
      setWallpapers(applyMockFilters(effective));
    } finally {
      setLoading(false);
    }
  }, [filters, debouncedQ]);

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
          <h1 className="font-display text-3xl font-black text-strong tracking-tight">
            Explore Wallpapers
          </h1>
          <p className="mt-1 text-sm text-muted">
            Browse our entire collection filtered by device, style, and orientation.
          </p>
        </div>
      </FadeIn>

      <WallpaperFilters filters={filters} onChange={handleFilterChange} categories={CATEGORIES} />

      {!loading && (
        <p className="text-xs text-faint" role="status">
          {wallpapers.length} {wallpapers.length === 1 ? "wallpaper" : "wallpapers"}
          {filters.q && (
            <>
              {" "}for <span className="text-muted">“{filters.q}”</span>
            </>
          )}
        </p>
      )}

      {loading ? (
        <SkeletonGrid />
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
    <Suspense fallback={<SkeletonGrid message="Loading explore page..." />}>
      <ExploreContent />
    </Suspense>
  );
}
