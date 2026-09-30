import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { COLLECTIONS, WALLPAPERS } from "@/lib/data";
import { WallpaperMasonry } from "@/components/WallpaperCard";
import { ChevronRight } from "lucide-react";

export function generateStaticParams() {
  return COLLECTIONS.map((c) => ({ slug: c.slug }));
}

export default function CollectionDetailPage({ params }: { params: { slug: string } }) {
  const c = COLLECTIONS.find((x) => x.slug === params.slug);
  if (!c) return notFound();
  const items = c.wallpaperIds.map((id) => WALLPAPERS.find((w) => w.id === id)).filter(Boolean) as typeof WALLPAPERS;
  const more = WALLPAPERS.filter((w) => !c.wallpaperIds.includes(w.id) && items[0] && w.category === items[0].category).slice(0, 8);
  const all = [...items, ...more];

  return (
    <div>
      <div className="relative overflow-hidden bg-black">
        <div className="absolute inset-0">
          <Image src={`https://picsum.photos/seed/wallora-${c.seed}/1600/700`} alt="" fill sizes="100vw" className="object-cover opacity-70" priority />
          <div className="absolute inset-0 bg-black/55" aria-hidden />
        </div>
        <div className="relative mx-auto max-w-[1320px] px-4 sm:px-6 pt-12 pb-10">
          <nav aria-label="Breadcrumb" className="text-[13px] text-white/60 flex items-center gap-1.5">
            <Link href="/collections" className="hover:underline">Collections</Link>
            <ChevronRight className="h-3.5 w-3.5" aria-hidden />
            <span className="text-white font-medium">{c.title}</span>
          </nav>
          <h1 className="font-display text-white text-[32px] sm:text-[48px] font-bold tracking-tight mt-3">{c.title}</h1>
          <p className="text-white/75 text-[15px] mt-2 max-w-[520px]">{c.description}</p>
          <p className="text-white/55 text-[12.5px] mt-3">{all.length} wallpapers · Updated {c.updatedAt}</p>
        </div>
      </div>
      <div className="mx-auto max-w-[1320px] px-4 sm:px-6 py-8">
        <WallpaperMasonry items={all} />
      </div>
    </div>
  );
}
