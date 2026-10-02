import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { connectDatabase } from "./config/database";
import authRoutes from "./routes/authRoutes";
import wallpaperRoutes from "./routes/wallpaperRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import favoriteRoutes from "./routes/favoriteRoutes";
import userRoutes from "./routes/userRoutes";
import aiRoutes from "./routes/aiRoutes";
import adminRoutes from "./routes/adminRoutes";
import { notFoundHandler, errorHandler } from "./middleware/errorMiddleware";

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";

// CORS configuration for frontend. Localhost origins are a dev convenience —
// in production only the configured CLIENT_URL is trusted.
const LOCAL_ORIGINS =
  process.env.NODE_ENV === "production"
    ? []
    : [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:3002",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
        "http://127.0.0.1:3002",
      ];
app.use(
  cors({
    origin: [CLIENT_URL, ...LOCAL_ORIGINS],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Endpoint
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "Wallora Backend REST API",
    timestamp: new Date().toISOString(),
  });
});

// Mount REST API Routes
app.use("/api/auth", authRoutes);
app.use("/api/wallpapers", wallpaperRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/users", userRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/admin", adminRoutes);

// Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

// Connect DB & Listen
connectDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Wallora Backend Server running on http://localhost:${PORT}`);
    console.log(`📡 Healthcheck: http://localhost:${PORT}/api/health`);
  });
});

export default app;
