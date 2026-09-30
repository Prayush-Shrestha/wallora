import Link from "next/link";
import Image from "next/image";
import { Category } from "../../types/category";

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      href={`/category/${category.slug}`}
      className="group relative rounded-2xl overflow-hidden aspect-[16/10] bg-raised border border-line/10 hover:border-accent/50 focus-visible:border-accent transition-all duration-300 block"
    >
      {category.image && (
        <Image
          src={category.image}
          alt={category.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          loading="lazy"
          className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-70 group-hover:opacity-90"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-5 flex flex-col justify-end">
        <h3 className="font-display text-lg font-bold text-white group-hover:text-accent transition-colors">
          {category.name}
        </h3>
        {category.description && (
          <p className="text-xs text-neutral-300 mt-1 line-clamp-1">{category.description}</p>
        )}
        {category.wallpaperCount !== undefined && (
          <span className="text-[11px] text-neutral-400 mt-2 font-medium">
            {category.wallpaperCount} wallpapers
          </span>
        )}
      </div>
    </Link>
  );
}

