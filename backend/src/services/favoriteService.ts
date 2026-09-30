import prisma from "../config/database";

export async function toggleFavorite(userId: string, wallpaperId: string) {
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
    await prisma.favorite.create({
      data: {
        userId,
        wallpaperId,
      },
    });
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
