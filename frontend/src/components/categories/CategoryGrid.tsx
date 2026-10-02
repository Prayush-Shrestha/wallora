import { Category } from "../../types/category";
import { CategoryCard } from "./CategoryCard";

interface CategoryGridProps {
  categories: Category[];
  emptyMessage?: string;
}

// Responsive grid of category cards used by /categories and home.
export function CategoryGrid({
  categories,
  emptyMessage = "No categories found.",
}: CategoryGridProps) {
  if (categories.length === 0) {
    return (
      <div role="status" className="text-center py-20 border border-dashed border-line/10 rounded-2xl">
        <p className="text-muted text-sm">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      {categories.map((category) => (
        <CategoryCard key={category.id} category={category} />
      ))}
    </div>
  );
}
