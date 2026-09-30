import prisma from "../config/database";
import { WallpaperFilterOptions } from "../types";

export async function getWallpapers(filters: WallpaperFilterOptions) {
  const {
    category,
    orientation,
    deviceType,
    isAI,
    q,
    sort = "trending",
    page = 1,
    limit = 24,
  } = filters;

  const where: any = {};

  if (category && category !== "all") {
    where.category = {
      slug: category.toLowerCase(),
    };
  }

  if (orientation && orientation !== "all") {
    where.orientation = orientation;
  }

  if (deviceType && deviceType !== "all") {
    where.deviceType = deviceType;
  }

  if (typeof isAI === "boolean") {
    where.isAI = isAI;
  }

  if (q && q.trim()) {
    const search = q.trim();
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { category: { name: { contains: search, mode: "insensitive" } } },
    ];
  }

  let orderBy: any = { createdAt: "desc" };
  if (sort === "downloads") {
    orderBy = { downloads: "desc" };
  } else if (sort === "trending") {
    orderBy = [{ downloads: "desc" }, { createdAt: "desc" }];
  }

  const skip = (page - 1) * limit;

  const [total, wallpapers] = await Promise.all([
    prisma.wallpaper.count({ where }),
    prisma.wallpaper.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        category: { select: { id: true, name: true, slug: true } },
        author: { select: { id: true, name: true, profileImage: true } },
        _count: { select: { favorites: true, downloadRecords: true } },
      },
    }),
  ]);

  return {
    wallpapers,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getWallpaperById(id: string) {
  const wallpaper = await prisma.wallpaper.findUnique({
    where: { id },
    include: {
      category: true,
      author: { select: { id: true, name: true, profileImage: true } },
      _count: { select: { favorites: true, downloadRecords: true } },
    },
  });

  if (!wallpaper) {
    const error: any = new Error("Wallpaper not found.");
    error.statusCode = 404;
    throw error;
  }

  // Similar wallpapers
  const similar = await prisma.wallpaper.findMany({
    where: {
      categoryId: wallpaper.categoryId,
      id: { not: wallpaper.id },
    },
    take: 8,
    include: {
      category: { select: { id: true, name: true, slug: true } },
      author: { select: { id: true, name: true, profileImage: true } },
    },
  });

  return { wallpaper, similar };
}

export async function createWallpaper(data: {
  title: string;
  description?: string;
  imageUrl: string;
  thumbnailUrl?: string;
  width?: number;
  height?: number;
  orientation?: string;
  deviceType?: string;
  categoryId?: string;
  categorySlug?: string;
  authorId?: string;
  isAI?: boolean;
}) {
  let categoryId = data.categoryId;

  if (!categoryId && data.categorySlug) {
    const cat = await prisma.category.findUnique({
      where: { slug: data.categorySlug.toLowerCase() },
    });
    if (cat) categoryId = cat.id;
  }

  return prisma.wallpaper.create({
    data: {
      title: data.title,
      description: data.description || "",
      imageUrl: data.imageUrl,
      thumbnailUrl: data.thumbnailUrl || data.imageUrl,
      width: data.width || 1920,
      height: data.height || 1080,
      orientation: data.orientation || "landscape",
      deviceType: data.deviceType || "desktop",
      categoryId: categoryId || null,
      authorId: data.authorId || null,
      isAI: Boolean(data.isAI),
    },
    include: {
      category: true,
      author: { select: { id: true, name: true, profileImage: true } },
    },
  });
}

export async function recordDownload(wallpaperId: string, userId?: string) {
  const [wallpaper] = await Promise.all([
    prisma.wallpaper.update({
      where: { id: wallpaperId },
      data: { downloads: { increment: 1 } },
    }),
    prisma.download.create({
      data: {
        wallpaperId,
        userId: userId || null,
      },
    }),
  ]);

  return { downloads: wallpaper.downloads };
}
