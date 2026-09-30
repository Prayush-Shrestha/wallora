import { Request, Response, NextFunction } from "express";
import prisma from "../config/database";

const DEFAULT_CATEGORIES = [
  { id: "cat-nature", name: "Nature", slug: "nature", description: "Breathtaking landscapes, mountains, and wildlife", image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800", wallpaperCount: 12 },
  { id: "cat-anime", name: "Anime", slug: "anime", description: "Vibrant anime art, landscapes, and characters", image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800", wallpaperCount: 18 },
  { id: "cat-cars", name: "Cars", slug: "cars", description: "Supercars, classics, and motorsport aesthetics", image: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800", wallpaperCount: 14 },
  { id: "cat-aesthetic", name: "Aesthetic", slug: "aesthetic", description: "Moodboards, cozy hues, and modern vibes", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800", wallpaperCount: 16 },
  { id: "cat-minimalist", name: "Minimalist", slug: "minimalist", description: "Clean lines, gentle gradients, and calm spaces", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800", wallpaperCount: 10 },
  { id: "cat-3d", name: "3D Renders", slug: "3d-renders", description: "Futuristic geometry, abstract shapes, and lighting", image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800", wallpaperCount: 9 },
  { id: "cat-space", name: "Space", slug: "space", description: "Galaxies, nebulae, planets, and celestial views", image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800", wallpaperCount: 11 },
];

export async function getCategories(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const categories = await Promise.race([
      prisma.category.findMany({
        include: {
          _count: {
            select: { wallpapers: true },
          },
        },
        orderBy: { name: "asc" },
      }),
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error("DB Timeout")), 1500)),
    ]);

    const formatted = categories.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description,
      image: c.image,
      wallpaperCount: c._count.wallpapers,
    }));

    res.json({
      success: true,
      data: { categories: formatted },
    });
  } catch (err: any) {
    console.warn("[Category Controller] Database offline. Returning default category list.");
    res.json({
      success: true,
      data: { categories: DEFAULT_CATEGORIES },
    });
  }
}

export async function getCategoryBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { slug } = req.params;
  const cleanSlug = slug.toLowerCase();

  try {
    const category = await Promise.race([
      prisma.category.findUnique({
        where: { slug: cleanSlug },
        include: {
          _count: { select: { wallpapers: true } },
        },
      }),
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error("DB Timeout")), 1500)),
    ]);

    if (!category) {
      const fallback = DEFAULT_CATEGORIES.find((c) => c.slug === cleanSlug);
      if (fallback) {
        res.json({ success: true, data: { category: fallback } });
        return;
      }
      res.status(404).json({ success: false, error: "Category not found." });
      return;
    }

    res.json({
      success: true,
      data: { category },
    });
  } catch (err) {
    const fallback = DEFAULT_CATEGORIES.find((c) => c.slug === cleanSlug);
    if (fallback) {
      res.json({ success: true, data: { category: fallback } });
      return;
    }
    next(err);
  }
}
