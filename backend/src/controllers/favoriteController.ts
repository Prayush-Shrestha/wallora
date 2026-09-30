import { Response, NextFunction } from "express";
import * as favoriteService from "../services/favoriteService";
import { AuthRequest } from "../types";

export async function toggleFavorite(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { wallpaperId } = req.params;
    const userId = req.user!.id;

    const result = await favoriteService.toggleFavorite(userId, wallpaperId);

    res.json({
      success: true,
      data: result,
    });
  } catch (err) {
    next(err);
  }
}

export async function getFavorites(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.id;
    const favorites = await favoriteService.getUserFavorites(userId);

    res.json({
      success: true,
      data: { favorites },
    });
  } catch (err) {
    next(err);
  }
}
