import Link from "next/link";
import { COLLECTIONS } from "@/lib/data";
import CollectionCard from "@/components/CollectionCard";

export const metadata = { title: "Collections — Wallora" };

export default function CollectionsPage() {
  return (
    <div className="mx-auto max-w-[1320px] px-4 sm:px-6 py-8">
      <h1 className="font-display text-[28px] sm:text-[36px] font-bold tracking-tight">Collections</h1>
      <p className="text-neutral-400 light:text-neutral-500 text-[14px] mt-1 max-w-[540px]">Curated sets with a point of view — midnight drives, quiet mornings, OLED blacks. Updated weekly.</p>
      <div className="mt-6 grid gap-5 md:grid-cols-2">
        {COLLECTIONS.map((c, i) => (
          <article key={c.slug}>
            <CollectionCard slug={c.slug} large={i % 3 === 0} />
            <div className="mt-2.5 flex items-start justify-between gap-3">
              <div>
                <Link href={`/collections/${c.slug}`} className="font-display text-[17px] font-bold hover:underline">{c.title}</Link>
                <p className="text-[13.5px] text-neutral-400 light:text-neutral-500 mt-0.5">{c.description}</p>
              </div>
              <span className="shrink-0 text-[12px] text-neutral-500 mt-1">Upd. {c.updatedAt}</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
