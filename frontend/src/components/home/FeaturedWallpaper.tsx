import { Wallpaper } from "../../types/wallpaper";
import { WallpaperCard } from "../wallpaper/WallpaperCard";
import { SectionHeading } from "../ui/SectionHeading";

interface FeaturedWallpaperProps {
  large?: Wallpaper;
  small: Wallpaper[];
}

// Asymmetric editorial feature — one large + up to two small cards.
export function FeaturedWallpaper({ large, small }: FeaturedWallpaperProps) {
  if (!large) return null;

  return (
    <section className="mx-auto max-w-shell px-4 sm:px-6 mt-4 sm:mt-8" aria-label="Featured wallpapers">
      <SectionHeading
        eyebrow="Curated"
        title="Featured this week"
        actionHref="/explore?sort=trending"
        actionLabel="View all"
      />
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 sm:gap-6">
        <div className="md:col-span-3">
          <WallpaperCard wallpaper={large} naturalAspect />
        </div>
        <div className="md:col-span-2 grid grid-cols-2 md:grid-cols-1 gap-4 sm:gap-6">
          {small.map((w) => (
            <WallpaperCard key={w.id} wallpaper={w} />
          ))}
        </div>
      </div>
    </section>
  );
}
