import { CategoryGrid } from "../../components/categories/CategoryGrid";
import { FadeIn } from "../../components/ui/FadeIn";
import { CATEGORIES } from "../../lib/data";
import * as categoryService from "../../services/categoryService";

export const revalidate = 60;

export const metadata = {
  title: "All Categories — Wallora",
  description: "Browse every wallpaper category: nature, cars, anime, gaming, minimal, space, and more.",
};

// /categories — every category links to /category/[slug].
export default async function CategoriesPage() {
  let categories = CATEGORIES;
  try {
    const live = await categoryService.getCategories();
    if (live.length > 0) categories = live;
  } catch {
    // Fallback to bundled data.
  }

  return (
    <div className="mx-auto max-w-shell px-4 sm:px-6 py-8 space-y-8">
      <FadeIn>
        <h1 className="font-display text-3xl sm:text-4xl font-black text-strong tracking-tight">
          All Categories
        </h1>
        <p className="mt-2 text-sm text-muted max-w-xl">
          Pick a vibe — each category opens its own page at{" "}
          <span className="font-mono text-xs">/category/[slug]</span>.
        </p>
      </FadeIn>

      <CategoryGrid categories={categories} emptyMessage="No categories yet." />
    </div>
  );
}
