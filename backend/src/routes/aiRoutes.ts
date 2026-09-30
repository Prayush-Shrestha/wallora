import { Router } from "express";
import * as aiController from "../controllers/aiController";
import { authenticate, optionalAuth } from "../middleware/authMiddleware";

const router = Router();

router.post("/generate", optionalAuth, aiController.generateAIWallpaper);
router.get("/creations", authenticate, aiController.getUserCreations);

export default router;
