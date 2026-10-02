import prisma from "../config/database";

export async function toggleFavorite(userId: string, wallpaperId: string) {
  // Fail fast with 404 instead of a raw FK (P2003) crash.
  const wallpaper = await prisma.wallpaper.findUnique({
    where: { id: wallpaperId },
    select: { id: true },
  });
  if (!wallpaper) {
    const error: any = new Error("Wallpaper not found.");
    error.statusCode = 404;
    throw error;
  }

  const existing = await prisma.favorite.findUnique({
    where: {
      userId_wallpaperId: {
        userId,
        wallpaperId,
      },
    },
  });

  if (existing) {
    await prisma.favorite.delete({
      where: {
        userId_wallpaperId: {
          userId,
          wallpaperId,
        },
      },
    });
    return { isFavorite: false };
  } else {
    try {
      await prisma.favorite.create({
        data: {
          userId,
          wallpaperId,
        },
      });
    } catch (err: any) {
      // Lost a concurrent-toggle race (unique constraint P2002): the row
      // exists, so the desired end state (favorited) is already true.
      if (err?.code === "P2002") return { isFavorite: true };
      throw err;
    }
    return { isFavorite: true };
  }
}

export async function getUserFavorites(userId: string) {
  const favorites = await prisma.favorite.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      wallpaper: {
        include: {
          category: { select: { id: true, name: true, slug: true } },
          author: { select: { id: true, name: true, profileImage: true } },
        },
      },
    },
  });

  return favorites.map((f) => f.wallpaper);
}
