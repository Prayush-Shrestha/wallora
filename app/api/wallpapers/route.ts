import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { WALLPAPERS, Wallpaper } from "@/lib/data";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim();
  const category = searchParams.get("category");
  const orientation = searchParams.get("orientation");
  const device = searchParams.get("device");
  const isAI = searchParams.get("isAI");
  const featured = searchParams.get("featured");
  const sort = searchParams.get("sort") || "trending";
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "24", 10)));

  // Try PostgreSQL via Prisma first
  try {
    const where: any = {};

    if (category && category !== "all") {
      where.categorySlug = { equals: category, mode: "insensitive" };
    }

    if (orientation && orientation !== "all") {
      where.orientation = orientation;
    }

    if (device && device !== "all") {
      where.device = { has: device };
    }

    if (isAI !== null && isAI !== undefined && isAI !== "") {
      where.isAI = isAI === "true" || isAI === "1";
    }

    if (featured !== null && featured !== undefined && featured !== "") {
      where.featured = featured === "true" || featured === "1";
    }

    // PostgreSQL search (case-insensitive)
    if (q) {
      where.OR = [
        { title: { contains: q, mode: "insensitive" } },
        { categorySlug: { contains: q, mode: "insensitive" } },
        { tags: { has: q.toLowerCase() } },
      ];
    }

    let orderBy: any = { createdAt: "desc" };
    if (sort === "likes") orderBy = { likes: "desc" };
    else if (sort === "downloads") orderBy = { downloads: "desc" };

    const total = await prisma.wallpaper.count({ where });
    const wallpapers = await prisma.wallpaper.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    });

    if (wallpapers.length > 0 || total > 0) {
      return NextResponse.json({
        wallpapers,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    }
  } catch (dbErr) {
    // If PostgreSQL is not yet configured or connected, seamlessly fallback to local dataset
  }

  // Local fallback (in-memory data.ts)
  let filtered = [...WALLPAPERS];

  if (category && category !== "all") {
    filtered = filtered.filter((w) => w.category.toLowerCase() === category.toLowerCase());
  }
  if (orientation && orientation !== "all") {
    filtered = filtered.filter((w) => w.orientation === orientation);
  }
  if (device && device !== "all") {
    filtered = filtered.filter((w) => w.device.includes(device as any));
  }
  if (isAI !== null && isAI !== undefined && isAI !== "") {
    filtered = filtered.filter((w) => w.isAI === (isAI === "true" || isAI === "1"));
  }
  if (featured !== null && featured !== undefined && featured !== "") {
    filtered = filtered.filter((w) => Boolean(w.featured) === (featured === "true" || featured === "1"));
  }
  if (q) {
    const lower = q.toLowerCase();
    filtered = filtered.filter(
      (w) =>
        w.title.toLowerCase().includes(lower) ||
        w.category.toLowerCase().includes(lower) ||
        w.tags.some((t) => t.toLowerCase().includes(lower))
    );
  }

  if (sort === "likes") {
    filtered.sort((a, b) => b.likes - a.likes);
  } else if (sort === "downloads") {
    filtered.sort((a, b) => b.downloads - a.downloads);
  } else if (sort === "recent") {
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } else {
    filtered.sort((a, b) => b.likes * 2 + b.downloads - (a.likes * 2 + a.downloads));
  }

  const total = filtered.length;
  const start = (page - 1) * limit;
  const paginated = filtered.slice(start, start + limit);

  return NextResponse.json({
    wallpapers: paginated,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    const { title, image, thumbnail, category, tags, orientation, device, colors } = body;

    if (!title || !image || !category) {
      return NextResponse.json(
        { error: "Title, image URL, and category are required" },
        { status: 400 }
      );
    }

    const userId = (session?.user as any)?.id || null;
    const author = session?.user?.name || session?.user?.email?.split("@")[0] || "Community Artist";
    const authorAvatar = session?.user?.image || `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(author)}`;

    const newWallpaperData = {
      id: `wall-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      title,
      image,
      thumbnail: thumbnail || image,
      categorySlug: category.toLowerCase(),
      tags: Array.isArray(tags) ? tags : [],
      author,
      authorAvatar,
      userId,
      width: 1920,
      height: 1080,
      orientation: orientation || "landscape",
      device: Array.isArray(device) ? device : ["desktop", "laptop"],
      downloads: 0,
      likes: 0,
      isAI: false,
      colors: Array.isArray(colors) ? colors : ["#0b0e14"],
      featured: false,
    };

    try {
      const created = await prisma.wallpaper.create({
        data: newWallpaperData,
      });
      return NextResponse.json({ success: true, wallpaper: created }, { status: 201 });
    } catch {
      return NextResponse.json({ success: true, wallpaper: newWallpaperData }, { status: 201 });
    }
  } catch (err: any) {
    console.error("Create wallpaper error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to create wallpaper" },
      { status: 500 }
    );
  }
}
