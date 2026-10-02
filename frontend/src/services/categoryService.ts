import { apiClient } from "./api";
import { Category } from "../types/category";
import { CATEGORIES } from "../lib/data";

// Category service — thin wrapper around the API with mock fallback.
// Pages should call these helpers instead of raw fetch().

export async function getCategories(): Promise<Category[]> {
  try {
    const res = await apiClient<{ success: boolean; data: { categories: Category[] } }>(
      "/categories"
    );
    if (res.data?.categories?.length > 0) return res.data.categories;
  } catch {
    // Backend offline — fall through to bundled data.
  }
  return CATEGORIES;
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const res = await apiClient<{ success: boolean; data: { category: Category } }>(
      `/categories/${slug}`
    );
    if (res.data?.category) return res.data.category;
  } catch {
    // Fall through to bundled data.
  }
  return CATEGORIES.find((c) => c.slug === slug) ?? null;
}
