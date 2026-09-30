import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, Download, Heart, ChevronRight, Monitor, Smartphone } from "lucide-react";
import { WALLPAPERS, CATEGORIES, COLLECTIONS, AUDIENCE_SUGGESTIONS } from "@/lib/data";
import { WallpaperMasonry } from "@/components/WallpaperCard";
import SearchBar from "@/components/SearchBar";
import CollectionCard from "@/components/CollectionCard";

function formatCount(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  return `${n}`;
}

export default function HomePage() {
  const hero = WALLPAPERS.find((w) => w.id === "midnight-porsche") ?? WALLPAPERS[0];
  if (!hero) {
    return <div className="mx-auto max-w-[1320px] px-4 py-24 text-center text-muted">No wallpapers are available yet.</div>;
  }
  const trending = [...WALLPAPERS].sort((a, b) => b.downloads - a.downloads).slice(0, 10);
  const fresh = [...WALLPAPERS].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)).slice(0, 10);
  const featured = WALLPAPERS.find((w) => w.id === "anime-sunset") ?? hero;
  const sideA = WALLPAPERS.find((w) => w.id === "dune-silence") ?? hero;
  const sideB = WALLPAPERS.find((w) => w.id === "tokyo-night") ?? hero;
  const aiFeature = WALLPAPERS.find((w) => w.id === "cyberpunk-alley") ?? hero;

  return (
    <div>
      {/* HERO — compact, wallpaper visible */}
      <section className="relative -mt-16 pt-16 overflow-hidden bg-black" aria-label="Featured wallpaper">
        <div className="absolute inset-0">
          <Image
            src={hero.image}
            alt={hero.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/55" aria-hidden />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-[#0D0D0D] light:bg-[#FAF9F6]" style={{ clipPath: "polygon(0 100%, 100% 100%, 100% 55%, 0 100%)", opacity: 1 }} aria-hidden />
        </div>
        <div className="relative mx-auto max-w-shell px-4 sm:px-6 pt-16 pb-20 sm:pt-24 sm:pb-28 max-w-[1320px]">
          <p className="text-[12px] uppercase tracking-[0.18em] text-white/70 font-semibold">Wallpaper of the day · {hero.title}</p>
          <h1 className="font-display font-extrabold tracking-tight text-white text-[34px] leading-[1.05] sm:text-[54px] sm:leading-[1.02] max-w-[620px] mt-3">
            Find a wallpaper that feels like you.
          </h1>
          <p className="text-white/75 text-[15px] sm:text-[17px] mt-3 max-w-[480px] leading-relaxed">
            Discover wallpapers for every mood, screen and style.
          </p>
          <div className="mt-6">
            <SearchBar large />
          </div>
          <div className="mt-4 flex flex-wrap gap-2.5">
            <Link href="/explore" className="inline-flex items-center gap-2 bg-white text-black text-[14px] font-semibold rounded-full px-5 py-3 hover:bg-accent transition-colors min-h-[48px]">
              Explore Wallpapers <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link href="/ai-studio" className="inline-flex items-center gap-2 bg-accent text-accent-ink text-[14px] font-semibold rounded-full px-5 py-3 hover:brightness-95 transition min-h-[48px]">
              <Sparkles className="h-4 w-4" aria-hidden /> Create with AI
            </Link>
          </div>
          <div className="mt-6 flex items-center gap-4 text-white/60 text-[12.5px]">
            <span className="inline-flex items-center gap-1.5"><Monitor className="h-3.5 w-3.5" /> 4K & ultrawide ready</span>
            <span className="inline-flex items-center gap-1.5"><Smartphone className="h-3.5 w-3.5" /> Phone-first crops</span>
            <span className="hidden sm:inline">48 curated drops this month</span>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1320px] px-4 sm:px-6">
        {/* WHAT ARE YOU INTO */}
        <section className="pt-10 sm:pt-14" aria-labelledby="interests">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 id="interests" className="font-display text-[24px] sm:text-[30px] font-bold tracking-tight">What are you into?</h2>
              <p className="text-muted light:text-neutral-500 text-[14px] mt-1">Suggested collections — browse anything, no restrictions.</p>
            </div>
            <Link href="/categories" className="hidden sm:inline-flex items-center gap-1 text-[14px] font-semibold hover:underline">All categories <ChevronRight className="h-4 w-4" /></Link>
          </div>

          {/* audience hint */}
          <div className="mt-4 flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {(["men","women","kids"] as const).map((a) => (
              <Link key={a} href={`/category/${a}`} className="shrink-0 rounded-full border border-white/10 light:border-black/10 px-4 py-2 text-[13px] font-medium capitalize bg-ink-900 light:bg-white hover:border-white/30">
                For {a} <span className="text-neutral-500">· {AUDIENCE_SUGGESTIONS[a].slice(0,3).join(" · ")}</span>
              </Link>
            ))}
          </div>

          <div className="mt-4 flex gap-3 overflow-x-auto no-scrollbar snap-x pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-4 lg:grid-cols-6 sm:overflow-visible">
            {CATEGORIES.slice(3, 15).map((c) => (
              <Link key={c.slug} href={`/category/${c.slug}`} className="group snap-start shrink-0 w-[148px] sm:w-auto" aria-label={`${c.label} wallpapers`}>
                <div className="relative aspect-[3/4] sm:aspect-[4/5] overflow-hidden rounded-[10px] border border-white/[0.07] light:border-black/10">
                  <Image src={WALLPAPERS.find((w) => w.seed === c.seed)?.thumbnail ?? hero.thumbnail} alt={c.label} fill sizes="200px" loading="lazy" className="object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/15 transition-colors" aria-hidden />
                  <div className="absolute bottom-0 inset-x-0 p-3">
                    <p className="text-white font-semibold text-[15px] leading-tight">{c.label}</p>
                    <p className="text-white/65 text-[11.5px]">{c.count.toLocaleString()} walls</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* EDITORIAL FEATURED */}
        <section className="pt-12 sm:pt-16" aria-labelledby="featured">
          <div className="flex items-baseline justify-between">
            <h2 id="featured" className="font-display text-[24px] sm:text-[30px] font-bold tracking-tight">Today&apos;s edit</h2>
            <Link href="/explore" className="text-[14px] font-semibold inline-flex items-center gap-1 hover:underline">Explore <ChevronRight className="h-4 w-4" /></Link>
          </div>
          <div className="mt-5 grid gap-3.5 md:grid-cols-[1.6fr_1fr]">
            <Link href={`/wallpaper/${featured.id}`} className="group relative block overflow-hidden rounded-[6px] border border-white/[0.07] light:border-black/10 min-h-[320px] sm:min-h-[460px]" aria-label={featured.title}>
              <Image src={featured.image} alt={featured.title} fill sizes="(max-width: 768px) 100vw, 60vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.02]" />
              <div className="absolute inset-0 bg-black/20" aria-hidden />
              <div className="absolute bottom-0 inset-x-0 p-5 sm:p-7 flex items-end justify-between gap-4">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.16em] text-white/70 font-semibold">Featured · Anime</p>
                  <p className="text-white font-display text-[22px] sm:text-[30px] font-bold leading-tight mt-1">{featured.title}</p>
                  <p className="text-white/70 text-[13px] mt-1">By {featured.author} · {formatCount(featured.downloads)} downloads</p>
                </div>
                <span className="hidden sm:inline-flex shrink-0 items-center gap-2 bg-white text-black text-[13px] font-semibold rounded-full px-4 py-2.5">View <ArrowRight className="h-4 w-4" /></span>
              </div>
            </Link>
            <div className="grid grid-rows-2 gap-3.5">
              {[sideA, sideB].map((w) => (
                <Link key={w.id} href={`/wallpaper/${w.id}`} className="group relative block overflow-hidden rounded-[6px] border border-white/[0.07] light:border-black/10 min-h-[180px]" aria-label={w.title}>
                  <Image src={w.image} alt={w.title} fill sizes="(max-width: 768px) 100vw, 30vw" loading="lazy" className="object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
                  <div className="absolute inset-0 bg-black/30" aria-hidden />
                  <div className="absolute bottom-0 p-4">
                    <p className="text-white font-semibold text-[16px] leading-tight">{w.title}</p>
                    <p className="text-white/65 text-[12px] mt-0.5">{w.category} · {w.orientation}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* TRENDING */}
        <section className="pt-12 sm:pt-16" aria-labelledby="trending">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 id="trending" className="font-display text-[24px] sm:text-[30px] font-bold tracking-tight">Trending this week</h2>
              <p className="text-muted light:text-neutral-500 text-[14px] mt-1">What people are actually downloading.</p>
            </div>
            <Link href="/explore?sort=popular" className="text-[14px] font-semibold inline-flex items-center gap-1 hover:underline shrink-0">See all <ChevronRight className="h-4 w-4" /></Link>
          </div>
          <div className="mt-5 flex gap-3 overflow-x-auto no-scrollbar snap-x pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-4 lg:grid-cols-5 sm:overflow-visible">
            {trending.slice(0, 5).map((w, i) => (
              <article key={w.id} className="snap-start shrink-0 w-[210px] sm:w-auto">
                <Link href={`/wallpaper/${w.id}`} className="group relative block overflow-hidden rounded-[10px] border border-white/[0.07] light:border-black/10 aspect-[3/4]" aria-label={w.title}>
                  <Image src={w.thumbnail} alt={w.title} fill sizes="240px" loading="lazy" className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                  <span className="absolute left-2 top-2 bg-black/65 backdrop-blur text-white text-[12px] font-bold h-7 w-7 rounded-full flex items-center justify-center">{i + 1}</span>
                  <span className="absolute bottom-2 inset-x-2 bg-black/60 backdrop-blur rounded-lg px-2.5 py-1.5 flex items-center justify-between text-white text-[11.5px]">
                    <span className="inline-flex items-center gap-1"><Download className="h-3 w-3" />{formatCount(w.downloads)}</span>
                    <span className="inline-flex items-center gap-1"><Heart className="h-3 w-3" />{formatCount(w.likes)}</span>
                  </span>
                </Link>
                <p className="mt-2 text-[13.5px] font-semibold truncate">{w.title}</p>
                <p className="text-[12px] text-neutral-500 truncate">{w.category}</p>
              </article>
            ))}
          </div>
        </section>

        {/* COLLECTIONS — editorial horizontal */}
        <section className="pt-12 sm:pt-16" aria-labelledby="collections">
          <div className="flex items-end justify-between">
            <h2 id="collections" className="font-display text-[24px] sm:text-[30px] font-bold tracking-tight">Collections</h2>
            <Link href="/collections" className="text-[14px] font-semibold inline-flex items-center gap-1 hover:underline">All <ChevronRight className="h-4 w-4" /></Link>
          </div>
          <div className="mt-5 flex gap-3.5 overflow-x-auto no-scrollbar snap-x pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
            {COLLECTIONS.slice(0, 6).map((c) => (
              <div key={c.slug} className="snap-start shrink-0 w-[270px] sm:w-[330px]">
                <CollectionCard slug={c.slug} large />
                <p className="mt-2 text-[13px] text-neutral-400 light:text-neutral-500 line-clamp-1">{c.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* AI PROMO — restrained, no glow */}
        <section className="pt-12 sm:pt-16" aria-labelledby="ai-promo">
          <div className="grid md:grid-cols-2 gap-0 overflow-hidden rounded-[8px] border border-white/10 light:border-black/10 bg-ink-900 light:bg-white">
            <div className="p-6 sm:p-10">
              <p className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em] bg-accent text-accent-ink px-2.5 py-1 rounded"><Sparkles className="h-3 w-3" /> AI Studio</p>
              <h2 id="ai-promo" className="font-display text-[26px] sm:text-[34px] font-bold tracking-tight mt-4 leading-tight">Describe it.<br />Hang it on your screen.</h2>
              <p className="text-neutral-400 light:text-neutral-600 text-[14.5px] mt-3 leading-relaxed max-w-[380px]">
                “A black Porsche driving through Tokyo at night in the rain.” Pick a style, pick a screen, generate. Remix any wallpaper into a phone version.
              </p>
              <div className="mt-6 flex flex-wrap gap-2.5">
                <Link href="/ai-studio" className="inline-flex items-center gap-2 bg-accent text-accent-ink font-semibold text-[14px] rounded-full px-5 py-3 min-h-[48px]">Create your wallpaper <ArrowRight className="h-4 w-4" /></Link>
                <Link href="/explore" className="inline-flex items-center rounded-full px-5 py-3 min-h-[48px] text-[14px] font-semibold border border-white/15 light:border-black/15 hover:border-white/30">Browse instead</Link>
              </div>
            </div>
            <div className="relative min-h-[240px] md:min-h-[320px]">
              <Image src={aiFeature.image} alt={aiFeature.title} fill sizes="(max-width: 768px) 100vw, 50vw" loading="lazy" className="object-cover" />
              <p className="absolute bottom-3 left-3 bg-black/65 backdrop-blur text-white text-[12px] px-3 py-1.5 rounded-full">Generated from a 12-word prompt</p>
            </div>
          </div>
        </section>

        {/* FRESH */}
        <section className="pt-12 sm:pt-16" aria-labelledby="fresh">
          <div className="flex items-end justify-between">
            <div>
              <h2 id="fresh" className="font-display text-[24px] sm:text-[30px] font-bold tracking-tight">Fresh wallpapers</h2>
              <p className="text-muted light:text-neutral-500 text-[14px] mt-1">New drops, newest first.</p>
            </div>
            <Link href="/explore?sort=newest" className="text-[14px] font-semibold inline-flex items-center gap-1 hover:underline">Newest <ChevronRight className="h-4 w-4" /></Link>
          </div>
          <div className="mt-5">
            <WallpaperMasonry items={fresh} />
          </div>
        </section>

        {/* DEVICE STRIP */}
        <section className="pt-12 sm:pt-16 pb-4" aria-labelledby="device">
          <h2 id="device" className="font-display text-[24px] sm:text-[30px] font-bold tracking-tight">Made for your screen</h2>
          <p className="text-muted light:text-neutral-500 text-[14px] mt-1">Every wallpaper lists real dimensions. Filter once, download right.</p>
          <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {[
              ["Phone", "1080 × 2400", "9:19.5"],
              ["Desktop", "1920 × 1080", "16:9"],
              ["4K", "3840 × 2160", "16:9"],
              ["Ultrawide", "3440 × 1440", "21:9"],
              ["Tablet", "1668 × 2420", "4:3"],
            ].map(([label, dims, ratio]) => (
              <Link key={label} href={`/explore?device=${label.toLowerCase() === "4k" ? "desktop" : label.toLowerCase()}`} className="rounded-xl border border-white/10 light:border-black/10 bg-ink-900 light:bg-white p-4 hover:border-accent/60 transition-colors">
                <div className="flex items-center justify-center h-16">
                  <span className="border-2 border-neutral-500 rounded-[4px] block" style={{ width: label === "Phone" ? 26 : label === "Ultrawide" ? 72 : 52, height: label === "Phone" ? 52 : label === "Ultrawide" ? 24 : 32 }} aria-hidden />
                </div>
                <p className="text-[14px] font-semibold mt-2">{label}</p>
                <p className="text-[12px] text-neutral-500">{dims} · {ratio}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
