import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { CATEGORIES, WALLPAPERS, AUDIENCE_SUGGESTIONS } from "@/lib/data";
import { WallpaperMasonry } from "@/components/WallpaperCard";
import { ChevronRight } from "lucide-react";

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ slug: c.slug }));
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const cat = CATEGORIES.find((c) => c.slug === params.slug);
  if (!cat) return notFound();

  const items = WALLPAPERS.filter((w) => w.category === params.slug);
  const fallback = items.length > 0 ? items : WALLPAPERS.filter((w) =>
    (AUDIENCE_SUGGESTIONS[params.slug] ?? []).includes(w.category)
  ).slice(0, 8);
  const featured = fallback.slice(0, 3);
  const rest = fallback.slice(0, 12);
  const suggestions = AUDIENCE_SUGGESTIONS[params.slug];

  return (
    <div className="mx-auto max-w-[1320px] px-4 sm:px-6 py-8">
      <nav aria-label="Breadcrumb" className="text-[13px] text-neutral-500 flex items-center gap-1.5">
        <Link href="/" className="hover:underline">Home</Link>
        <ChevronRight className="h-3.5 w-3.5" aria-hidden />
        <Link href="/categories" className="hover:underline">Categories</Link>
        <ChevronRight className="h-3.5 w-3.5" aria-hidden />
        <span className="text-neutral-200 light:text-neutral-700 font-medium capitalize">{cat.label}</span>
      </nav>

      <div className="mt-4 grid md:grid-cols-[1fr_320px] gap-6 items-end">
        <div>
          <h1 className="font-display text-[30px] sm:text-[42px] font-bold tracking-tight capitalize">{cat.label}</h1>
          <p className="text-neutral-400 light:text-neutral-500 text-[14.5px] mt-2 max-w-[560px] leading-relaxed">{cat.description}</p>
          {suggestions && (
            <p className="text-[13px] mt-3 text-neutral-500">
              People browsing <span className="capitalize font-semibold text-neutral-300 light:text-neutral-700">{cat.label}</span> also explore:{" "}
              {suggestions.map((s, i) => (
                <span key={s}>
                  <Link href={`/category/${s}`} className="underline underline-offset-2 hover:text-white light:hover:text-black">{s}</Link>
                  {i < suggestions.length - 1 ? " · " : ""}
                </span>
              ))}
            </p>
          )}
        </div>
        <div className="relative aspect-[16/9] md:aspect-[4/3] overflow-hidden rounded-[8px] border border-white/10 light:border-black/10">
          <Image src={`https://picsum.photos/seed/wallora-${cat.seed}/800/600`} alt={`${cat.label} featured`} fill sizes="360px" className="object-cover" priority />
          <p className="absolute bottom-2.5 left-2.5 bg-black/65 backdrop-blur text-white text-[12px] px-3 py-1.5 rounded-full">{cat.count.toLocaleString()} wallpapers</p>
        </div>
      </div>

      {featured.length > 0 && (
        <div className="mt-8 grid gap-3.5 md:grid-cols-3">
          {featured.map((w, i) => (
            <Link key={w.id} href={`/wallpaper/${w.id}`} className={`group relative block overflow-hidden rounded-[6px] border border-white/[0.07] light:border-black/10 ${i === 0 ? "md:col-span-2 md:row-span-1 min-h-[240px]" : "min-h-[240px]"}`} aria-label={w.title}>
              <Image src={`https://picsum.photos/seed/${w.seed}/800/500`} alt={w.title} fill sizes="400px" loading="lazy" className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
              <div className="absolute inset-0 bg-black/25" aria-hidden />
              <div className="absolute bottom-0 p-4">
                <p className="text-white font-semibold text-[16px]">{w.title}</p>
                <p className="text-white/65 text-[12px]">By {w.author}</p>
              </div>
            </Link>
          ))}
        </div>
      )}

      <h2 className="font-display text-[22px] font-bold tracking-tight mt-10">Latest in {cat.label}</h2>
      <div className="mt-4">
        <WallpaperMasonry items={rest} />
      </div>
    </div>
  );
}
