import { Request, Response, NextFunction } from "express";
import prisma from "../config/database";

export async function getCategories(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { wallpapers: true },
        },
      },
      orderBy: { name: "asc" },
    });

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
  } catch (err) {
    next(err);
  }
}

export async function getCategoryBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { slug } = req.params;
    const category = await prisma.category.findUnique({
      where: { slug: slug.toLowerCase() },
      include: {
        _count: { select: { wallpapers: true } },
      },
    });

    if (!category) {
      res.status(404).json({ success: false, error: "Category not found." });
      return;
    }

    res.json({
      success: true,
      data: { category },
    });
  } catch (err) {
    next(err);
  }
}
