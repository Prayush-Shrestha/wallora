import { Response, NextFunction } from "express";
import prisma from "../config/database";
import { AuthRequest } from "../types";

export async function getProfile(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        profileImage: true,
        createdAt: true,
        _count: {
          select: {
            favorites: true,
            wallpapers: true,
            aiWallpapers: true,
          },
        },
      },
    });

    if (!user) {
      const error: any = new Error("User not found.");
      error.statusCode = 404;
      throw error;
    }

    res.json({
      success: true,
      data: { user },
    });
  } catch (err) {
    next(err);
  }
}

export async function getUserUploads(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.id;
    const wallpapers = await prisma.wallpaper.findMany({
      where: { authorId: userId },
      orderBy: { createdAt: "desc" },
      include: {
        category: true,
      },
    });

    res.json({
      success: true,
      data: { wallpapers },
    });
  } catch (err) {
    next(err);
  }
}
