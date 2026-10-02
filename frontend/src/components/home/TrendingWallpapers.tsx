import { Wallpaper } from "../../types/wallpaper";
import { WallpaperGrid } from "../wallpaper/WallpaperGrid";
import { SectionHeading } from "../ui/SectionHeading";

interface TrendingWallpapersProps {
  wallpapers: Wallpaper[];
}

// Masonry trending section for the home page.
export function TrendingWallpapers({ wallpapers }: TrendingWallpapersProps) {
  if (wallpapers.length === 0) return null;

  return (
    <section className="mx-auto max-w-shell px-4 sm:px-6 mt-16 sm:mt-24" aria-label="Trending wallpapers">
      <SectionHeading
        eyebrow="Masonry mix"
        title="Trending across the community"
        description="Different shapes, one flow — wallpapers keep their natural aspect."
        actionHref="/explore?sort=trending"
        actionLabel="Explore more"
      />
      <WallpaperGrid wallpapers={wallpapers} layout="masonry" />
    </section>
  );
}
