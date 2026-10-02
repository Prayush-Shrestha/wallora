import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, Download } from "lucide-react";
import { Hero } from "../components/home/Hero";
import { FeaturedWallpaper } from "../components/home/FeaturedWallpaper";
import { TrendingWallpapers } from "../components/home/TrendingWallpapers";
import { PopularCategories } from "../components/home/PopularCategories";
import { FreshWallpapers } from "../components/home/FreshWallpapers";
import { CATEGORIES, MOCK_WALLPAPERS } from "../lib/data";
import { formatNumber } from "../utils/format";
import * as wallpaperService from "../services/wallpaperService";

export const revalidate = 60;

// Home page — thin assembly of focused home components.
// Each section lives in components/home/ so this file stays readable.
export default async function HomePage() {
  let wallpapers = MOCK_WALLPAPERS;

  // Never let a slow backend stall the homepage: give it 3s, then use mocks.
  // (AI generation intentionally has no such cap — it can take 30s+.)
  try {
    const data = await Promise.race([
      wallpaperService.fetchWallpapers({ limit: 24, sort: "trending" }),
      new Promise<null>((resolve) => setTimeout(() => resolve(null), 3000)),
    ]);
    const fresh = data?.wallpapers;
    if (fresh && fresh.length > 0) {
      wallpapers = fresh;
    }
  } catch {
    // Graceful fallback to mock data
  }

  const hero = wallpapers[0];
  const featuredLarge = wallpapers[1];
  const featuredSmall = wallpapers.slice(2, 4);
  const trending = wallpapers.slice(4, 13);
  const latest = wallpapers.slice(13, 21);
  const ofTheDay =
    wallpapers.length > 0
      ? [...wallpapers].sort((a, b) => (b.downloads || 0) - (a.downloads || 0))[0]
      : undefined;

  return (
    <div className="pb-16">
      <Hero hero={hero} totalCount={wallpapers.length} categories={CATEGORIES} />

      <FeaturedWallpaper large={featuredLarge} small={featuredSmall} />

      <TrendingWallpapers wallpapers={trending} />

      <PopularCategories categories={CATEGORIES} />

      {ofTheDay && (
        <section className="mx-auto max-w-shell px-4 sm:px-6 mt-16 sm:mt-24" aria-label="Wallpaper of the day">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center border-y border-line/10 py-12 sm:py-16">
            <Link
              href={`/wallpaper/${ofTheDay.id}`}
              className="group relative block rounded-3xl overflow-hidden border border-line/10 aspect-[16/10]"
              aria-label={`${ofTheDay.title} — wallpaper of the day`}
            >
              <Image
                src={ofTheDay.imageUrl}
                alt={ofTheDay.title}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                loading="lazy"
                className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
              />
            </Link>
            <div className="max-w-md">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent mb-3">
                Wallpaper of the day
              </p>
              <h2 className="font-display text-2xl sm:text-4xl font-black text-strong tracking-tight text-balance">
                {ofTheDay.title}
              </h2>
              {ofTheDay.description && (
                <p className="mt-3 text-sm text-muted leading-relaxed">{ofTheDay.description}</p>
              )}
              <p className="mt-4 flex items-center gap-4 text-xs text-muted">
                <span className="inline-flex items-center gap-1.5">
                  <Download className="w-3.5 h-3.5" aria-hidden />
                  {formatNumber(ofTheDay.downloads || 0)} downloads
                </span>
                {ofTheDay.category && <span>{ofTheDay.category.name}</span>}
                {ofTheDay.width >= 3000 && (
                  <span className="px-2 py-0.5 rounded-md border border-line/15 text-[10px] font-bold text-strong">
                    4K
                  </span>
                )}
              </p>
              <Link
                href={`/wallpaper/${ofTheDay.id}`}
                className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-strong text-base text-sm font-bold hover:bg-accent hover:text-accent-ink transition"
              >
                <span>View wallpaper</span>
                <ArrowRight className="w-4 h-4" aria-hidden />
              </Link>
            </div>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-shell px-4 sm:px-6 mt-16 sm:mt-24" aria-label="AI Studio">
        <div className="rounded-3xl overflow-hidden border border-line/10 bg-raised p-8 sm:p-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
          <div className="max-w-xl">
            <p className="text-[11px] font-bold text-accent uppercase tracking-[0.18em]">
              AI Studio
            </p>
            <h2 className="mt-2 font-display text-2xl sm:text-3xl font-black text-strong tracking-tight text-balance">
              Can&apos;t find the right wallpaper? Generate it.
            </h2>
            <p className="mt-2 text-sm text-muted">
              Describe any vision — style, lighting, aspect — and download a 4K piece in seconds.
            </p>
          </div>
          <Link
            href="/ai-studio"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-accent text-accent-ink font-bold text-sm shrink-0 hover:brightness-110 active:scale-95 transition"
          >
            <Sparkles className="w-4 h-4" aria-hidden />
            <span>Launch AI Studio</span>
          </Link>
        </div>
      </section>

      <FreshWallpapers wallpapers={latest} />
    </div>
  );
}
