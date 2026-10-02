import { Request, Response, NextFunction } from "express";
import { isDbOfflineError, dbOfflineError } from "../utils/db";

export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    success: false,
    error: `Cannot ${req.method} ${req.originalUrl} — Route not found.`,
  });
}

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Safety net: translate "Postgres is down" crashes from ANY route into a
  // friendly 503 instead of leaking raw Prisma errors to the client.
  if (isDbOfflineError(err)) {
    const offline = dbOfflineError();
    res.status(offline.statusCode).json({ success: false, error: offline.message });
    return;
  }

  console.error("🔥 Server Error:", err);
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal server error. Please try again later.";

  res.status(status).json({
    success: false,
    error: message,
  });
}
