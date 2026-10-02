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

  // Multer upload errors (e.g. file too large) are client errors, not 500s.
  if (err?.code === "LIMIT_FILE_SIZE") {
    res.status(413).json({ success: false, error: "File is too large. Maximum size is 20 MB." });
    return;
  }

  // 4xx responses are expected client outcomes, not server fires.
  const status: number = Number(err.status || err.statusCode || 500);
  const message: string = err.message || "Internal server error. Please try again later.";
  if (status < 500) {
    res.status(status).json({
      success: false,
      error: message,
    });
    return;
  }

  console.error("🔥 Server Error:", err);

  res.status(status).json({
    success: false,
    error: message,
  });
}
