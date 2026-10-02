import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Layers } from "lucide-react";
import { FadeIn } from "../../components/ui/FadeIn";

interface Collection {
  slug: string;
  name: string;
  description: string;
  query: string;
  image: string;
  count: string;
}

const COLLECTIONS: Collection[] = [
  { slug: "midnight-drive", name: "Midnight Drive", description: "Rain-slick streets and neon headlights.", query: "cars", image: "https://picsum.photos/seed/wallora-coll-drive/600/400", count: "24 wallpapers" },
  { slug: "dark-mode", name: "Dark Mode", description: "Deep blacks and calm minimal gradients.", query: "minimal", image: "https://picsum.photos/seed/wallora-coll-dark/600/400", count: "32 wallpapers" },
  { slug: "future-cities", name: "Future Cities", description: "Glass towers and sunrise reflections.", query: "technology", image: "https://picsum.photos/seed/wallora-coll-future/600/400", count: "18 wallpapers" },
  { slug: "lost-in-space", name: "Lost in Space", description: "Stations, galaxies, and distant planets.", query: "space", image: "https://picsum.photos/seed/wallora-coll-space/600/400", count: "21 wallpapers" },
  { slug: "mountain-escape", name: "Mountain Escape", description: "Foggy pines and quiet alpine lakes.", query: "nature", image: "https://picsum.photos/seed/wallora-coll-mountain/600/400", count: "27 wallpapers" },
  { slug: "gaming-nights", name: "Gaming Nights", description: "Cyberpunk alleys and setup glows.", query: "gaming", image: "https://picsum.photos/seed/wallora-coll-gaming/600/400", count: "19 wallpapers" },
  { slug: "anime-worlds", name: "Anime Worlds", description: "Sunsets, city streets, and summer skies.", query: "anime", image: "https://picsum.photos/seed/wallora-coll-anime/600/400", count: "23 wallpapers" },
  { slug: "ocean-dreams", name: "Ocean Dreams", description: "Pastel dunes and twilight horizons.", query: "aesthetic", image: "https://picsum.photos/seed/wallora-coll-ocean/600/400", count: "16 wallpapers" },
];

export const metadata = {
  title: "Collections — Wallora",
  description: "Hand-picked wallpaper collections for every mood.",
};

// /collections — curated sets that link into explore search.
export default function CollectionsPage() {
  return (
    <div className="mx-auto max-w-shell px-4 sm:px-6 py-8 space-y-8">
      <FadeIn>
        <p className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-accent">
          <Layers className="w-3.5 h-3.5" aria-hidden /> Curated sets
        </p>
        <h1 className="mt-1 font-display text-3xl sm:text-4xl font-black text-strong tracking-tight">
          Wallpaper Collections
        </h1>
        <p className="mt-2 text-sm text-muted max-w-xl">
          Hand-picked moods — open a collection to browse matching wallpapers.
        </p>
      </FadeIn>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {COLLECTIONS.map((c) => (
          <Link
            key={c.slug}
            href={`/explore?q=${encodeURIComponent(c.query)}`}
            className="group relative rounded-2xl overflow-hidden aspect-[16/10] bg-raised border border-line/10 hover:border-accent/50 transition block"
          >
            <Image
              src={c.image}
              alt={c.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              loading="lazy"
              className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-70 group-hover:opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-5 flex flex-col justify-end">
              <h2 className="font-display text-lg font-bold text-white group-hover:text-accent transition-colors">
                {c.name}
              </h2>
              <p className="text-xs text-neutral-300 mt-1 line-clamp-1">{c.description}</p>
              <span className="text-[11px] text-neutral-400 mt-2 font-medium">{c.count}</span>
            </div>
            <span className="absolute top-3 right-3 p-2 rounded-full bg-black/60 border border-white/10 text-white opacity-0 group-hover:opacity-100 transition">
              <ArrowRight className="w-4 h-4" aria-hidden />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
