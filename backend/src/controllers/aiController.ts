import { Response, NextFunction } from "express";
import * as aiService from "../services/aiService";
import { AuthRequest } from "../types";

export async function generateAIWallpaper(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const {
      prompt,
      style,
      category,
      orientation,
      resolution,
      negativePrompt,
      provider,
      referenceImageUrl,
      referenceType,
      userRightsConfirmed,
    } = req.body;

    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      res.status(400).json({ success: false, error: "A descriptive prompt is required." });
      return;
    }

    const wallpaper = await aiService.generateAIWallpaper({
      prompt: prompt.trim(),
      style,
      category,
      orientation,
      resolution,
      negativePrompt,
      provider,
      referenceImageUrl,
      referenceType,
      userRightsConfirmed: Boolean(userRightsConfirmed),
      userId: req.user?.id,
    });

    res.status(201).json({
      success: true,
      message: "AI wallpaper generated successfully.",
      data: { wallpaper },
    });
  } catch (err: any) {
    console.error("[AI Controller Error]:", err?.message || err);
    res.status(500).json({
      success: false,
      error: err?.message || "Failed to generate AI wallpaper. Please try again.",
    });
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
