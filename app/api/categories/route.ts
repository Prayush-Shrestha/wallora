import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { CATEGORIES } from "@/lib/data";

export async function GET() {
  try {
    const categoriesFromDb = await prisma.category.findMany({
      include: {
        _count: {
          select: { wallpapers: true },
        },
      },
      orderBy: { name: "asc" },
    });

    if (categoriesFromDb.length > 0) {
      const formatted = categoriesFromDb.map((c) => ({
        slug: c.slug,
        name: c.name,
        description: c.description,
        count: c._count.wallpapers,
        previewImage: c.preview,
      }));
      return NextResponse.json({ categories: formatted });
    }
  } catch (err) {
    // Fallback to data.ts
  }

  return NextResponse.json({ categories: CATEGORIES });
}
