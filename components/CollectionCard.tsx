import Link from "next/link";
import Image from "next/image";
import { COLLECTIONS } from "@/lib/data";

export default function CollectionCard({ slug, large = false }: { slug: string; large?: boolean }) {
  const c = COLLECTIONS.find((x) => x.slug === slug);
  if (!c) return null;
  return (
    <Link
      href={`/collections/${c.slug}`}
      className={`group relative block overflow-hidden ${large ? "rounded-[4px]" : "rounded-[10px]"} border border-white/[0.07] light:border-black/10 bg-ink-800`}
      aria-label={`${c.title} collection`}
    >
      <div className={`relative w-full ${large ? "aspect-[16/10]" : "aspect-[4/5] sm:aspect-[4/3]"}`}>
        <Image
          src={`https://picsum.photos/seed/wallora-${c.seed}/800/600`}
          alt={c.title}
          fill
          sizes="(max-width: 768px) 80vw, 400px"
          loading="lazy"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 bg-black/35 group-hover:bg-black/25 transition-colors" aria-hidden />
        <div className="absolute inset-x-0 bottom-0 p-4">
          <p className="text-[11px] uppercase tracking-[0.14em] text-white/70 font-semibold">{c.wallpaperIds.length * 12 + 8} wallpapers</p>
          <h3 className="text-white font-display text-[20px] leading-tight font-bold mt-0.5">{c.title}</h3>
          <p className="text-white/70 text-[13px] mt-1 line-clamp-1 hidden sm:block">{c.description}</p>
        </div>
      </div>
    </Link>
  );
}
