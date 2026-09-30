import { Router } from "express";
import * as adminController from "../controllers/adminController";
import { authenticate } from "../middleware/authMiddleware";
import { requireAdmin } from "../middleware/adminMiddleware";

const router = Router();

router.use(authenticate, requireAdmin);

router.get("/stats", adminController.getStats);
router.get("/users", adminController.getUsers);
router.patch("/users/:id", adminController.patchUser);
router.get("/subscriptions", adminController.getSubscriptions);
router.post("/subscriptions", adminController.postSubscription);
router.patch("/subscriptions/:id", adminController.patchSubscription);
router.get("/payments", adminController.getPayments);
router.get("/plans", adminController.getPlans);
router.post("/plans", adminController.postPlan);
router.patch("/plans/:id", adminController.patchPlan);

export default router;
