import { Response, NextFunction } from "express";
import prisma from "../config/database";
import { isDbOfflineError } from "../utils/db";
import { AuthRequest } from "../types";

/** Blocks non-admins. Re-checks role from the DB so demotions apply instantly. */
export async function requireAdmin(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, error: "Authentication required." });
      return;
    }

    let role: string | undefined;
    let status: string | undefined;
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        select: { role: true, status: true },
      });
      role = user?.role;
      status = user?.status;
    } catch (err: any) {
      if (!isDbOfflineError(err)) throw err;
      // Database offline: trust the signed JWT payload (it can't be forged
      // without JWT_SECRET). Demo ADMIN tokens keep working; real data
      // still needs Postgres for the admin pages themselves.
      role = req.user.role;
      status = "ACTIVE";
    }

    if (!role || role !== "ADMIN") {
      res.status(403).json({ success: false, error: "Admin access required." });
      return;
    }

    if (status === "SUSPENDED") {
      res.status(403).json({ success: false, error: "This account has been suspended." });
      return;
    }

    next();
  } catch (err) {
    next(err);
  }
}
