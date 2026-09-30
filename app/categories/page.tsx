import Link from "next/link";
import Image from "next/image";
import { CATEGORIES, AUDIENCE_SUGGESTIONS } from "@/lib/data";
import { ChevronRight } from "lucide-react";

export const metadata = { title: "Categories — Wallora" };

export default function CategoriesPage() {
  return (
    <div className="mx-auto max-w-[1320px] px-4 sm:px-6 py-8">
      <h1 className="font-display text-[28px] sm:text-[36px] font-bold tracking-tight">Categories</h1>
      <p className="text-neutral-400 light:text-neutral-500 text-[14px] mt-1 max-w-[560px]">
        Interest-based starting points — not boxes. Men can love minimal mountains, kids can love space. Browse everything.
      </p>

      <div className="mt-5 grid gap-2.5 sm:grid-cols-3">
        {(Object.keys(AUDIENCE_SUGGESTIONS) as Array<keyof typeof AUDIENCE_SUGGESTIONS>).map((a) => (
          <Link key={a} href={`/category/${a}`} className="rounded-xl border border-white/10 light:border-black/10 bg-ink-900 light:bg-white p-4 hover:border-accent/60 transition-colors">
            <p className="text-[11px] uppercase tracking-[0.14em] text-neutral-500 font-semibold">Suggested for {a}</p>
            <p className="text-[15px] font-bold capitalize mt-1">For {a}</p>
            <p className="text-[13px] text-neutral-400 light:text-neutral-500 mt-1">{AUDIENCE_SUGGESTIONS[a].join(" · ")}</p>
            <span className="inline-flex items-center gap-1 text-[13px] font-semibold mt-2">Open <ChevronRight className="h-3.5 w-3.5" /></span>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
        {CATEGORIES.map((c) => (
          <Link key={c.slug} href={`/category/${c.slug}`} className="group" aria-label={`${c.label} wallpapers`}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-[10px] border border-white/[0.07] light:border-black/10">
              <Image
                src={`https://picsum.photos/seed/wallora-${c.seed}/640/480`}
                alt={c.label}
                fill
                sizes="(max-width: 640px) 50vw, 300px"
                loading="lazy"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/15 transition-colors" aria-hidden />
              <div className="absolute bottom-0 inset-x-0 p-3.5">
                <p className="text-white font-semibold text-[16px]">{c.label}</p>
                <p className="text-white/65 text-[12px]">{c.count.toLocaleString()} wallpapers</p>
              </div>
            </div>
            <p className="text-[12.5px] text-neutral-500 mt-1.5 line-clamp-1">{c.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
