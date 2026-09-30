import prisma from "../config/database";
import { WallpaperFilterOptions } from "../types";

const SAMPLE_WALLPAPERS = [
  {
    id: "sample-1",
    title: "Alpine Mist & Golden Peaks",
    description: "Serene mountain landscape at sunrise with reflections in an alpine lake",
    imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1920&q=80",
    thumbnailUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&q=80",
    width: 1920,
    height: 1080,
    orientation: "landscape",
    deviceType: "desktop",
    isAI: false,
    downloads: 1420,
    createdAt: new Date(),
    category: { id: "cat-nature", name: "Nature", slug: "nature" },
    author: { id: "dev-author-1", name: "Elena Rostova", profileImage: null },
    _count: { favorites: 85, downloadRecords: 1420 },
  },
  {
    id: "sample-2",
    title: "Cyberpunk Rainy Street",
    description: "Neon illuminated alleyway in Tokyo after rain",
    imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1920&q=80",
    thumbnailUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80",
    width: 1920,
    height: 1080,
    orientation: "landscape",
    deviceType: "desktop",
    isAI: true,
    downloads: 980,
    createdAt: new Date(),
    category: { id: "cat-aesthetic", name: "Aesthetic", slug: "aesthetic" },
    author: { id: "dev-author-2", name: "Wallora AI", profileImage: null },
    _count: { favorites: 120, downloadRecords: 980 },
  },
  {
    id: "sample-3",
    title: "Anime Hillside Twilight",
    description: "Quiet coastal train station looking over twilight ocean",
    imageUrl: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1920&q=80",
    thumbnailUrl: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&q=80",
    width: 1920,
    height: 1080,
    orientation: "landscape",
    deviceType: "desktop",
    isAI: true,
    downloads: 2150,
    createdAt: new Date(),
    category: { id: "cat-anime", name: "Anime", slug: "anime" },
    author: { id: "dev-author-2", name: "Wallora AI", profileImage: null },
    _count: { favorites: 340, downloadRecords: 2150 },
  },
  {
    id: "sample-4",
    title: "Minimalist Dune Shadows",
    description: "Soft terracotta desert curves under gentle pastel sky",
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80",
    thumbnailUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80",
    width: 1920,
    height: 1080,
    orientation: "landscape",
    deviceType: "desktop",
    isAI: false,
    downloads: 640,
    createdAt: new Date(),
    category: { id: "cat-minimalist", name: "Minimalist", slug: "minimalist" },
    author: { id: "dev-author-1", name: "Elena Rostova", profileImage: null },
    _count: { favorites: 45, downloadRecords: 640 },
  },
  {
    id: "sample-5",
    title: "GT3 Matte Black Sunset Drift",
    description: "Performance sports car reflecting sunset reflections",
    imageUrl: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=1920&q=80",
    thumbnailUrl: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=600&q=80",
    width: 1920,
    height: 1080,
    orientation: "landscape",
    deviceType: "desktop",
    isAI: true,
    downloads: 1890,
    createdAt: new Date(),
    category: { id: "cat-cars", name: "Cars", slug: "cars" },
    author: { id: "dev-author-2", name: "Wallora AI", profileImage: null },
    _count: { favorites: 290, downloadRecords: 1890 },
  },
];

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

  try {
    const [total, wallpapers] = await Promise.race([
      Promise.all([
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
      ]),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Database connection timeout")), 1500)
      ),
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
  } catch (err) {
    console.warn("[Wallpaper Service] Database offline. Returning sample wallpapers.");
    const filtered = SAMPLE_WALLPAPERS.filter((w) => {
      if (category && category !== "all" && w.category.slug !== category.toLowerCase()) return false;
      if (orientation && orientation !== "all" && w.orientation !== orientation) return false;
      if (deviceType && deviceType !== "all" && w.deviceType !== deviceType) return false;
      if (typeof isAI === "boolean" && w.isAI !== isAI) return false;
      if (q && q.trim()) {
        const query = q.toLowerCase();
        return (
          w.title.toLowerCase().includes(query) ||
          w.description.toLowerCase().includes(query) ||
          w.category.name.toLowerCase().includes(query)
        );
      }
      return true;
    });

    return {
      wallpapers: filtered,
      pagination: {
        total: filtered.length,
        page: 1,
        limit,
        totalPages: 1,
      },
    };
  }
}

export async function getWallpaperById(id: string) {
  try {
    const wallpaper = await Promise.race([
      prisma.wallpaper.findUnique({
        where: { id },
        include: {
          category: true,
          author: { select: { id: true, name: true, profileImage: true } },
          _count: { select: { favorites: true, downloadRecords: true } },
        },
      }),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Database connection timeout")), 1500)
      ),
    ]);

    if (!wallpaper) {
      const fallback = SAMPLE_WALLPAPERS.find((w) => w.id === id);
      if (fallback) {
        return {
          wallpaper: fallback,
          similar: SAMPLE_WALLPAPERS.filter((w) => w.id !== id).slice(0, 4),
        };
      }
      const error: any = new Error("Wallpaper not found.");
      error.statusCode = 404;
      throw error;
    }

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
  } catch (err: any) {
    const fallback = SAMPLE_WALLPAPERS.find((w) => w.id === id) || SAMPLE_WALLPAPERS[0];
    return {
      wallpaper: fallback,
      similar: SAMPLE_WALLPAPERS.filter((w) => w.id !== fallback.id).slice(0, 4),
    };
  }
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
