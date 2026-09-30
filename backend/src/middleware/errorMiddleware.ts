import { Request, Response, NextFunction } from "express";

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
  console.error("🔥 Server Error:", err);
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal server error. Please try again later.";

  res.status(status).json({
    success: false,
    error: message,
  });
}
