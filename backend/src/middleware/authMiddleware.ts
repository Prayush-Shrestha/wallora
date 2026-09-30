import { Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import { AuthRequest } from "../types";

export function authenticate(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({
      success: false,
      error: "Authentication token is missing. Please log in.",
    });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = verifyToken(token);
    req.user = payload;
    next();
  } catch (err) {
    res.status(401).json({
      success: false,
      error: "Token is invalid or expired. Please log in again.",
    });
  }
}

export function optionalAuth(req: AuthRequest, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      const payload = verifyToken(token);
      req.user = payload;
    } catch {
      // Ignore invalid token for optional auth routes
    }
  }

  next();
}
