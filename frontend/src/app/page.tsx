import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, Download } from "lucide-react";
import { WallpaperGrid } from "../components/wallpaper/WallpaperGrid";
import { WallpaperCard } from "../components/wallpaper/WallpaperCard";
import { CategoryCard } from "../components/categories/CategoryCard";
import { FadeIn } from "../components/ui/FadeIn";
import { SectionHeading } from "../components/ui/SectionHeading";
import { SearchPanel } from "../components/search/SearchPanel";
import { MOCK_WALLPAPERS, CATEGORIES } from "../lib/data";
import { formatNumber } from "../utils/format";
import * as wallpaperService from "../services/wallpaperService";

export const revalidate = 60;

const TRENDING_LINKS = ["Anime", "Cars", "Minimal", "Nature", "Aesthetic"];

export default async function HomePage() {
  let wallpapers = MOCK_WALLPAPERS;

  try {
    const data = await wallpaperService.fetchWallpapers({ limit: 24, sort: "trending" });
    if (data?.wallpapers?.length > 0) {
      wallpapers = data.wallpapers;
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
      {/* ── Hero (spec D): wallpaper centerpiece + search ── */}
      <section className="relative -mt-16 pt-32 sm:pt-40 pb-16 sm:pb-24 px-4 sm:px-6 overflow-hidden">
        {hero && (
          <>
            <Image
              src={hero.imageUrl}
              alt=""
              aria-hidden
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/55" aria-hidden />
            <div
              className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/75 to-transparent"
              aria-hidden
            />
            <div
              className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink-950 to-transparent"
              aria-hidden
            />
          </>
        )}
        <FadeIn className="relative max-w-3xl mx-auto text-center">
          <p className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/50 border border-line/15 text-[11px] font-semibold text-neutral-200 mb-6 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-accent" aria-hidden />
            <span>{wallpapers.length * 1247}+ hand-picked 4K wallpapers</span>
          </p>

          <h1 className="font-display text-4xl sm:text-6xl font-black tracking-tight leading-[1.05] text-white text-balance">
            Find a wallpaper that feels like you.
          </h1>

          <div className="mt-8">
            <SearchPanel categories={CATEGORIES} />
          </div>

          <p className="mt-5 text-xs text-neutral-300">
            <span className="text-muted">Trending:</span>{" "}
            {TRENDING_LINKS.map((t, i) => (
              <span key={t}>
                <Link
                  href={`/explore?q=${encodeURIComponent(t.toLowerCase())}`}
                  className="font-medium text-neutral-200 hover:text-accent transition underline-offset-4 hover:underline"
                >
                  {t}
                </Link>
                {i < TRENDING_LINKS.length - 1 && <span className="text-faint"> · </span>}
              </span>
            ))}
          </p>
        </FadeIn>
      </section>

      {/* ── Featured editorial (spec B: intentional asymmetry) ── */}
      {featuredLarge && (
        <section className="mx-auto max-w-shell px-4 sm:px-6 mt-4 sm:mt-8" aria-label="Featured wallpapers">
          <SectionHeading
            eyebrow="Curated"
            title="Featured this week"
            actionHref="/explore?sort=trending"
            actionLabel="View all"
          />
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 sm:gap-6">
            <div className="md:col-span-3">
              <WallpaperCard wallpaper={featuredLarge} naturalAspect />
            </div>
            <div className="md:col-span-2 grid grid-cols-2 md:grid-cols-1 gap-4 sm:gap-6">
              {featuredSmall.map((w) => (
                <WallpaperCard key={w.id} wallpaper={w} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Trending masonry (spec E) ── */}
      {trending.length > 0 && (
        <section className="mx-auto max-w-shell px-4 sm:px-6 mt-16 sm:mt-24" aria-label="Trending wallpapers">
          <SectionHeading
            eyebrow="Masonry mix"
            title="Trending across the community"
            description="Different shapes, one flow — wallpapers keep their natural aspect."
            actionHref="/explore?sort=trending"
            actionLabel="Explore more"
          />
          <WallpaperGrid wallpapers={trending} layout="masonry" />
        </section>
      )}

      {/* ── Vibes: horizontal scroll on mobile (spec P) ── */}
      <section className="mt-16 sm:mt-24" aria-label="Browse by vibe">
        <div className="mx-auto max-w-shell px-4 sm:px-6">
          <SectionHeading
            eyebrow="Vibes"
            title="Pick a lane"
            actionHref="/explore"
            actionLabel="All categories"
          />
        </div>
        <div className="mx-auto max-w-shell pl-4 sm:px-6">
          <div className="flex gap-4 overflow-x-auto pb-2 pr-4 scrollbar-none snap-x lg:grid lg:grid-cols-4 lg:overflow-visible lg:pr-0">
            {CATEGORIES.slice(0, 8).map((cat) => (
              <div key={cat.id} className="min-w-[240px] snap-start lg:min-w-0">
                <CategoryCard category={cat} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Wallpaper of the Day (large editorial, spec C) ── */}
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
                <p className="mt-3 text-sm text-muted leading-relaxed">
                  {ofTheDay.description}
                </p>
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
                className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-strong text-white text-sm font-bold hover:bg-accent hover:text-accent-ink transition"
              >
                <span>View wallpaper</span>
                <ArrowRight className="w-4 h-4" aria-hidden />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── AI Studio band (restrained, spec B) ── */}
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

      {/* ── Latest ── */}
      {latest.length > 0 && (
        <section className="mx-auto max-w-shell px-4 sm:px-6 mt-16 sm:mt-24" aria-label="Latest wallpapers">
          <SectionHeading
            eyebrow="Fresh"
            title="Latest drops"
            actionHref="/explore?sort=recent"
            actionLabel="See newest"
          />
          <WallpaperGrid wallpapers={latest} />
        </section>
      )}
    </div>
  );
}
