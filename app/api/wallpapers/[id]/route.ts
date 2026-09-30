import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { WALLPAPERS, getWallpaper, relatedWallpapers } from "@/lib/data";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const wallpaper = await prisma.wallpaper.findUnique({
      where: { id },
    });

    if (wallpaper) {
      const similar = await prisma.wallpaper.findMany({
        where: {
          categorySlug: wallpaper.categorySlug,
          id: { not: id },
        },
        take: 8,
      });

      return NextResponse.json({ wallpaper, similar });
    }
  } catch (dbErr) {
    // Fallback to data.ts
  }

  const wallpaper = getWallpaper(id);
  if (!wallpaper) {
    return NextResponse.json({ error: "Wallpaper not found" }, { status: 404 });
  }

  const similar = relatedWallpapers(id, 8);
  return NextResponse.json({ wallpaper, similar });
}
