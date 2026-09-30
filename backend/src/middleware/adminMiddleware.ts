import { Response, NextFunction } from "express";
import prisma from "../config/database";
import { AuthRequest } from "../types";

/** Blocks non-admins. Re-checks role from the DB so demotions apply instantly. */
export async function requireAdmin(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, error: "Authentication required." });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { role: true, status: true },
    });

    if (!user || user.role !== "ADMIN") {
      res.status(403).json({ success: false, error: "Admin access required." });
      return;
    }

    if (user.status === "SUSPENDED") {
      res.status(403).json({ success: false, error: "This account has been suspended." });
      return;
    }

    next();
  } catch (err) {
    next(err);
  }
}
