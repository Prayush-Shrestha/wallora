import { useMemo } from "react";
import { Wallpaper } from "../../types/wallpaper";
import { WallpaperCard } from "./WallpaperCard";

interface WallpaperGridProps {
  wallpapers: Wallpaper[];
  favoriteIds?: string[];
  emptyMessage?: string;
  /** Editorial masonry flow (spec E) or uniform grid. */
  layout?: "grid" | "masonry";
}

export function WallpaperGrid({
  wallpapers,
  favoriteIds = [],
  emptyMessage = "No wallpapers found.",
  layout = "grid",
}: WallpaperGridProps) {
  const favoriteSet = useMemo(() => new Set(favoriteIds), [favoriteIds]);

  if (wallpapers.length === 0) {
    return (
      <div
        role="status"
        className="text-center py-20 border border-dashed border-line/10 rounded-2xl"
      >
        <p className="text-muted text-sm">{emptyMessage}</p>
      </div>
    );
  }

  if (layout === "masonry") {
    return (
      <div className="columns-2 md:columns-3 gap-4 sm:gap-6 [column-fill:balance]">
        {wallpapers.map((wallpaper) => (
          <div key={wallpaper.id} className="mb-4 sm:mb-6 break-inside-avoid">
            <WallpaperCard
              wallpaper={wallpaper}
              isFavoritedInitially={favoriteSet.has(wallpaper.id)}
              naturalAspect
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {wallpapers.map((wallpaper) => (
        <WallpaperCard
          key={wallpaper.id}
          wallpaper={wallpaper}
          isFavoritedInitially={favoriteSet.has(wallpaper.id)}
        />
      ))}
    </div>
  );
}
