import { Category } from "../../types/category";
import { CategoryCard } from "../categories/CategoryCard";
import { SectionHeading } from "../ui/SectionHeading";

interface PopularCategoriesProps {
  categories: Category[];
}

// "Pick a lane" — horizontal scroll on mobile, grid on desktop.
export function PopularCategories({ categories }: PopularCategoriesProps) {
  return (
    <section className="mt-16 sm:mt-24" aria-label="Browse by vibe">
      <div className="mx-auto max-w-shell px-4 sm:px-6">
        <SectionHeading
          eyebrow="Vibes"
          title="Pick a lane"
          actionHref="/categories"
          actionLabel="All categories"
        />
      </div>
      <div className="mx-auto max-w-shell pl-4 sm:px-6">
        <div className="flex gap-4 overflow-x-auto pb-2 pr-4 scrollbar-none snap-x lg:grid lg:grid-cols-4 lg:overflow-visible lg:pr-0">
          {categories.slice(0, 8).map((cat) => (
            <div key={cat.id} className="min-w-[240px] snap-start lg:min-w-0">
              <CategoryCard category={cat} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
