import Image from "next/image";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Wallpaper } from "../../types/wallpaper";
import { Category } from "../../types/category";
import { SearchPanel } from "../search/SearchPanel";
import { FadeIn } from "../ui/FadeIn";

interface HeroProps {
  hero?: Wallpaper;
  totalCount: number;
  categories: Category[];
}

const TRENDING_LINKS = ["Anime", "Cars", "Minimal", "Nature", "Aesthetic"];

// Home hero — full-bleed wallpaper backdrop + search.
export function Hero({ hero, totalCount, categories }: HeroProps) {
  return (
    <section className="relative -mt-16 pt-32 sm:pt-40 pb-16 sm:pb-24 px-4 sm:px-6">
      {hero && (
        <div className="absolute inset-0 overflow-hidden" aria-hidden>
          <Image
            src={hero.imageUrl}
            alt=""
            aria-hidden
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/55" />
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/75 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink-950 to-transparent" />
        </div>
      )}
      <FadeIn className="relative z-10 max-w-3xl mx-auto text-center">
        <p className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/50 border border-line/15 text-[11px] font-semibold text-neutral-200 mb-6 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-accent" aria-hidden />
          <span>{totalCount * 1247}+ hand-picked 4K wallpapers</span>
        </p>

        <h1 className="font-display text-4xl sm:text-6xl font-black tracking-tight leading-[1.05] text-white text-balance">
          Find a wallpaper that feels like you.
        </h1>

        <div className="mt-8">
          <SearchPanel categories={categories} />
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
  );
}
