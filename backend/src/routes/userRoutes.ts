import { Router } from "express";
import * as userController from "../controllers/userController";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();

router.get("/profile", authenticate, userController.getProfile);
router.get("/uploads", authenticate, userController.getUserUploads);

export default router;
