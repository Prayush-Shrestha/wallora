import { Wallpaper } from "../../types/wallpaper";
import { WallpaperGrid } from "../wallpaper/WallpaperGrid";
import { SectionHeading } from "../ui/SectionHeading";

interface FreshWallpapersProps {
  wallpapers: Wallpaper[];
}

// Latest drops section for the home page.
export function FreshWallpapers({ wallpapers }: FreshWallpapersProps) {
  if (wallpapers.length === 0) return null;

  return (
    <section className="mx-auto max-w-shell px-4 sm:px-6 mt-16 sm:mt-24" aria-label="Latest wallpapers">
      <SectionHeading
        eyebrow="Fresh"
        title="Latest drops"
        actionHref="/explore?sort=recent"
        actionLabel="See newest"
      />
      <WallpaperGrid wallpapers={wallpapers} />
    </section>
  );
}
