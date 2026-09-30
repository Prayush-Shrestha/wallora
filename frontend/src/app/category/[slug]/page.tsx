import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { WallpaperGrid } from "../../../components/wallpaper/WallpaperGrid";
import { FadeIn } from "../../../components/ui/FadeIn";
import { CATEGORIES, MOCK_WALLPAPERS } from "../../../lib/data";
import * as wallpaperService from "../../../services/wallpaperService";

interface CategoryPageProps {
  params: { slug: string };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = params;
  const category = CATEGORIES.find((c) => c.slug === slug);
  const categoryName = category?.name || slug.charAt(0).toUpperCase() + slug.slice(1);

  let wallpapers = MOCK_WALLPAPERS.filter((w) => w.category?.slug === slug);

  try {
    const data = await wallpaperService.fetchWallpapers({ category: slug, limit: 30 });
    if (data?.wallpapers?.length > 0) {
      wallpapers = data.wallpapers;
    }
  } catch {
    // Fallback to filtered mock wallpapers
  }

  return (
    <div className="mx-auto max-w-shell px-4 sm:px-6 py-8 space-y-8">
      <FadeIn>
        <div>
          <Link
            href="/explore"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-400 hover:text-white mb-4 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to explore</span>
          </Link>
          <h1 className="font-display text-3xl font-black text-white tracking-tight">
            {categoryName} Wallpapers
          </h1>
          {category?.description && (
            <p className="mt-1 text-sm text-neutral-400 max-w-xl">{category.description}</p>
          )}
        </div>
      </FadeIn>

      <WallpaperGrid
        wallpapers={wallpapers}
        emptyMessage={`No wallpapers found in ${categoryName} yet.`}
      />
    </div>
  );
}

