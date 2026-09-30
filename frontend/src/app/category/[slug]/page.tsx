import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { WallpaperGrid } from "../../../components/wallpaper/WallpaperGrid";
import { WallpaperCard } from "../../../components/wallpaper/WallpaperCard";
import { FadeIn } from "../../../components/ui/FadeIn";
import { SectionHeading } from "../../../components/ui/SectionHeading";
import { CATEGORIES, MOCK_WALLPAPERS } from "../../../lib/data";
import { capitalize } from "../../../utils/format";
import * as wallpaperService from "../../../services/wallpaperService";

interface CategoryPageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const category = CATEGORIES.find((c) => c.slug === params.slug);
  const name = category?.name ?? capitalize(params.slug);
  return {
    title: `${name} Wallpapers — Wallora`,
    description: category?.description ?? `Browse ${name} wallpapers in 4K and Ultra HD.`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = params;
  const category = CATEGORIES.find((c) => c.slug === slug);
  const categoryName = category?.name || capitalize(slug);
  const index = CATEGORIES.findIndex((c) => c.slug === slug);

  let wallpapers = MOCK_WALLPAPERS.filter((w) => w.category?.slug === slug);

  try {
    const data = await wallpaperService.fetchWallpapers({ category: slug, limit: 30 });
    if (data?.wallpapers?.length > 0) {
      wallpapers = data.wallpapers;
    }
  } catch {
    // Fallback to filtered mock wallpapers
  }

  if (!category && wallpapers.length === 0) {
    notFound();
  }

  const [spotlight, ...rest] = wallpapers;

  return (
    <div className="mx-auto max-w-shell px-4 sm:px-6 py-8 space-y-12">
      {/* Category hero with its own identity (spec L) */}
      <FadeIn>
        <div>
          <Link
            href="/explore"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-strong mb-6 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" aria-hidden />
            <span>Back to explore</span>
          </Link>
          <div className="flex items-start gap-5">
            {index >= 0 && (
              <span
                aria-hidden
                className="hidden sm:block font-display text-6xl font-black text-strong/10 leading-none select-none"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
            )}
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent">
                Collection · {wallpapers.length} {wallpapers.length === 1 ? "wallpaper" : "wallpapers"}
              </p>
              <h1 className="mt-1 font-display text-4xl sm:text-5xl font-black text-strong tracking-tight uppercase text-balance">
                {categoryName}
              </h1>
              {category?.description && (
                <p className="mt-2 text-sm text-muted max-w-xl leading-relaxed">
                  {category.description}
                </p>
              )}
            </div>
          </div>
        </div>
      </FadeIn>

      {/* Spotlight + grid */}
      {spotlight && (
        <section aria-label={`Featured ${categoryName}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <WallpaperCard wallpaper={spotlight} naturalAspect />
            {rest[0] && <WallpaperCard wallpaper={rest[0]} naturalAspect />}
          </div>
        </section>
      )}

      {rest.length > 1 && (
        <section aria-label={`More ${categoryName} wallpapers`}>
          <SectionHeading
            title={`More ${categoryName.toLowerCase()}`}
            description="The rest of the collection, newest first."
            align="left"
          />
          <WallpaperGrid
            wallpapers={rest.slice(1)}
            layout="masonry"
            emptyMessage={`No wallpapers found in ${categoryName} yet.`}
          />
        </section>
      )}

      {wallpapers.length === 0 && (
        <WallpaperGrid
          wallpapers={[]}
          emptyMessage={`No wallpapers found in ${categoryName} yet.`}
        />
      )}
    </div>
  );
}
