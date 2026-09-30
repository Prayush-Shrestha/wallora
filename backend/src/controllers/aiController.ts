import { Response, NextFunction } from "express";
import * as aiService from "../services/aiService";
import { AuthRequest } from "../types";

export async function generateAIWallpaper(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { prompt, style, orientation, resolution } = req.body;

    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      res.status(400).json({ success: false, error: "A descriptive prompt is required." });
      return;
    }

    const wallpaper = await aiService.generateAIWallpaper({
      prompt: prompt.trim(),
      style,
      orientation,
      resolution,
      userId: req.user?.id,
    });

    res.status(201).json({
      success: true,
      message: "AI wallpaper generated successfully.",
      data: { wallpaper },
    });
  } catch (err) {
    next(err);
  }
}

export async function getUserCreations(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.id;
    const creations = await aiService.getUserAIWallpapers(userId);

    res.json({
      success: true,
      data: { creations },
    });
  } catch (err) {
    next(err);
  }
}
