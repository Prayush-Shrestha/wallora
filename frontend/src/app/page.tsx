import Link from "next/link";
import { ArrowRight, Sparkles, Flame, Grid } from "lucide-react";
import { WallpaperGrid } from "../components/wallpaper/WallpaperGrid";
import { CategoryCard } from "../components/categories/CategoryCard";
import { FadeIn } from "../components/ui/FadeIn";
import { MOCK_WALLPAPERS, CATEGORIES } from "../lib/data";
import * as wallpaperService from "../services/wallpaperService";

export const revalidate = 60;

export default async function HomePage() {
  let wallpapers = MOCK_WALLPAPERS;

  try {
    const data = await wallpaperService.fetchWallpapers({ limit: 8, sort: "trending" });
    if (data?.wallpapers?.length > 0) {
      wallpapers = data.wallpapers;
    }
  } catch {
    // Graceful fallback to mock data
  }

  const featured = wallpapers.slice(0, 4);
  const trending = wallpapers.slice(4, 8);

  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 pt-12 sm:pt-20 text-center max-w-4xl mx-auto">
        <FadeIn>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-accent mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Studio &amp; Ultra HD 4K Collection Live</span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl font-black tracking-tight leading-[1.1] text-white">
            Find wallpapers that <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-amber-200 to-white">
              feel like you.
            </span>
          </h1>

          <p className="mt-4 sm:mt-6 text-sm sm:text-base text-neutral-400 max-w-xl mx-auto">
            Discover thousands of hand-crafted 4K desktop, mobile and AI-generated wallpapers. Free to browse and download.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/explore"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-accent text-accent-ink text-sm font-bold hover:brightness-110 active:scale-95 transition shadow-lg shadow-accent/20"
            >
              <span>Explore Gallery</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/ai-studio"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/15 bg-white/5 text-white text-sm font-semibold hover:bg-white/10 active:scale-95 transition"
            >
              <Sparkles className="w-4 h-4 text-accent" />
              <span>Generate with AI</span>
            </Link>
          </div>
        </FadeIn>
      </section>

      {/* Featured Wallpapers */}
      <section className="mx-auto max-w-shell px-4 sm:px-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-accent" />
            <h2 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight">
              Featured Wallpapers
            </h2>
          </div>
          <Link
            href="/explore"
            className="text-xs font-semibold text-neutral-400 hover:text-accent flex items-center gap-1 transition"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <WallpaperGrid wallpapers={featured} />
      </section>

      {/* Categories Grid */}
      <section className="mx-auto max-w-shell px-4 sm:px-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Grid className="w-5 h-5 text-accent" />
            <h2 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight">
              Browse by Category
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {CATEGORIES.slice(0, 8).map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>
      </section>

      {/* Trending Gallery */}
      {trending.length > 0 && (
        <section className="mx-auto max-w-shell px-4 sm:px-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight">
              Trending This Week
            </h2>
            <Link
              href="/explore?sort=trending"
              className="text-xs font-semibold text-neutral-400 hover:text-accent flex items-center gap-1 transition"
            >
              <span>Explore More</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <WallpaperGrid wallpapers={trending} />
        </section>
      )}

      {/* AI Studio Callout */}
      <section className="mx-auto max-w-shell px-4 sm:px-6">
        <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-r from-ink-900 via-amber-950/20 to-ink-900 p-8 sm:p-12 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-8">
          <div className="max-w-xl space-y-3">
            <span className="text-xs font-bold text-accent uppercase tracking-wider">
              Create Custom Art
            </span>
            <h3 className="font-display text-2xl sm:text-3xl font-black text-white tracking-tight">
              Can’t find the right wallpaper? Generate it.
            </h3>
            <p className="text-sm text-neutral-400">
              Type any vision, style, or landscape into AI Studio and download a 4K masterpiece in seconds.
            </p>
          </div>

          <Link
            href="/ai-studio"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-accent text-accent-ink font-bold text-sm shrink-0 hover:brightness-110 transition shadow-lg shadow-accent/20"
          >
            <Sparkles className="w-4 h-4" />
            <span>Launch AI Studio</span>
          </Link>
        </div>
      </section>
    </div>
  );
}

