import { Router } from "express";
import * as favoriteController from "../controllers/favoriteController";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();

router.get("/", authenticate, favoriteController.getFavorites);
router.post("/:wallpaperId", authenticate, favoriteController.toggleFavorite);

export default router;
