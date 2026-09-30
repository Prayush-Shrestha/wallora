import { Router } from "express";
import * as wallpaperController from "../controllers/wallpaperController";
import { authenticate, optionalAuth } from "../middleware/authMiddleware";
import { upload } from "../middleware/uploadMiddleware";

const router = Router();

router.get("/", wallpaperController.getWallpapers);
router.get("/:id", wallpaperController.getWallpaperById);
router.post("/", optionalAuth, upload.single("file"), wallpaperController.uploadWallpaper);
router.post("/:id/download", optionalAuth, wallpaperController.downloadWallpaper);

export default router;
