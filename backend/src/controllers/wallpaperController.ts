import { Request, Response, NextFunction } from "express";
import * as wallpaperService from "../services/wallpaperService";
import { uploadToCloudinary } from "../services/cloudinaryService";
import { AuthRequest } from "../types";

export async function getWallpapers(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { category, orientation, deviceType, isAI, q, sort, page, limit } = req.query;

    const result = await wallpaperService.getWallpapers({
      category: category as string,
      orientation: orientation as string,
      deviceType: deviceType as string,
      isAI: isAI !== undefined ? isAI === "true" || isAI === "1" : undefined,
      q: q as string,
      sort: sort as any,
      page: page ? parseInt(page as string, 10) : 1,
      limit: limit ? parseInt(limit as string, 10) : 24,
    });

    res.json({
      success: true,
      data: result,
    });
  } catch (err) {
    next(err);
  }
}

export async function getWallpaperById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const result = await wallpaperService.getWallpaperById(id);
    res.json({
      success: true,
      data: result,
    });
  } catch (err) {
    next(err);
  }
}

export async function uploadWallpaper(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { title, description, categoryId, categorySlug, orientation, deviceType, isAI, imageUrl: providedImageUrl } = req.body;

    if (!title) {
      res.status(400).json({ success: false, error: "Title is required." });
      return;
    }

    let imageUrl = providedImageUrl;
    let thumbnailUrl = providedImageUrl;
    let width = 1920;
    let height = 1080;

    // Handle uploaded file via Multer
    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.buffer, req.file.originalname);
      imageUrl = uploadResult.imageUrl;
      thumbnailUrl = uploadResult.thumbnailUrl;
      width = uploadResult.width;
      height = uploadResult.height;
    }

    if (!imageUrl) {
      res.status(400).json({
        success: false,
        error: "Either an image file upload or an imageUrl is required.",
      });
      return;
    }

    const wallpaper = await wallpaperService.createWallpaper({
      title,
      description,
      imageUrl,
      thumbnailUrl,
      width,
      height,
      orientation,
      deviceType,
      categoryId,
      categorySlug,
      authorId: req.user?.id,
      isAI: isAI === "true" || isAI === true,
    });

    res.status(201).json({
      success: true,
      message: "Wallpaper uploaded successfully.",
      data: { wallpaper },
    });
  } catch (err) {
    next(err);
  }
}

export async function downloadWallpaper(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const result = await wallpaperService.recordDownload(id, req.user?.id);
    res.json({
      success: true,
      data: result,
    });
  } catch (err) {
    next(err);
  }
}
