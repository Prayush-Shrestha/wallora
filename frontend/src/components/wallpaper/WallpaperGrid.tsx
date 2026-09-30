import { Wallpaper } from "../../types/wallpaper";
import { WallpaperCard } from "./WallpaperCard";

interface WallpaperGridProps {
  wallpapers: Wallpaper[];
  favoriteIds?: string[];
  emptyMessage?: string;
}

export function WallpaperGrid({
  wallpapers,
  favoriteIds = [],
  emptyMessage = "No wallpapers found.",
}: WallpaperGridProps) {
  if (wallpapers.length === 0) {
    return (
      <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl">
        <p className="text-neutral-400 text-sm">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {wallpapers.map((wallpaper) => (
        <WallpaperCard
          key={wallpaper.id}
          wallpaper={wallpaper}
          isFavoritedInitially={favoriteIds.includes(wallpaper.id)}
        />
      ))}
    </div>
  );
}

