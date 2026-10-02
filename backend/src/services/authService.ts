import prisma from "../config/database";
import { hashPassword, comparePassword } from "../utils/password";
import { signToken } from "../utils/jwt";
import { isDbOfflineError, dbOfflineError } from "../utils/db";

// Demo account shown on the login page (frontend/src/app/login/page.tsx).
// Used as an offline fallback so learners can sign in without a database.
// Role matches prisma/seed.ts where demo@wallora.com is the platform admin,
// so the offline demo can also open /admin.
const DEMO_EMAIL = "demo@wallora.com";
const DEMO_PASSWORD = "password123";
const DEMO_USER = {
  id: "demo-user-id",
  name: "Demo User",
  email: DEMO_EMAIL,
  profileImage: "https://api.dicebear.com/7.x/identicon/svg?seed=Demo%20User",
  role: "ADMIN",
  status: "ACTIVE",
  createdAt: new Date().toISOString(),
};

export async function register(name: string, email: string, password: string) {
  const cleanEmail = email.toLowerCase().trim();

  try {
    const existing = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (existing) {
      const error: any = new Error("An account with this email address already exists.");
      error.statusCode = 409;
      throw error;
    }

    const hashedPassword = await hashPassword(password);
    const profileImage = `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(name)}`;

    const user = await prisma.user.create({
      data: {
        name,
        email: cleanEmail,
        password: hashedPassword,
        profileImage,
      },
      select: {
        id: true,
        name: true,
        email: true,
        profileImage: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });

    const token = signToken({ id: user.id, email: user.email, name: user.name, role: user.role });

    return { user, token };
  } catch (err: any) {
    if (err?.statusCode || !isDbOfflineError(err)) throw err;
    // Offline fallback: ephemeral account (not persisted). Lets learners
    // continue without Postgres; data resets on restart.
    const user = {
      id: `local-${Date.now()}`,
      name,
      email: cleanEmail,
      profileImage: `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(name)}`,
      role: "USER",
      status: "ACTIVE",
      createdAt: new Date().toISOString(),
    };
    const token = signToken({ id: user.id, email: user.email, name: user.name, role: user.role });
    return { user, token, offline: true };
  }
}

export async function login(email: string, password: string) {
  const cleanEmail = email.toLowerCase().trim();

  let user;
  try {
    user = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });
  } catch (err: any) {
    if (!isDbOfflineError(err)) throw err;
    // Offline fallback: only the demo account works without a database.
    if (cleanEmail === DEMO_EMAIL && password === DEMO_PASSWORD) {
      const token = signToken({
        id: DEMO_USER.id,
        email: DEMO_USER.email,
        name: DEMO_USER.name,
        role: DEMO_USER.role,
      });
      return { user: DEMO_USER, token, offline: true };
    }
    throw dbOfflineError();
  }

  if (!user) {
    const error: any = new Error("Invalid email or password.");
    error.statusCode = 401;
    throw error;
  }

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    const error: any = new Error("Invalid email or password.");
    error.statusCode = 401;
    throw error;
  }

  if (user.status === "SUSPENDED") {
    const error: any = new Error("This account has been suspended. Please contact support.");
    error.statusCode = 403;
    throw error;
  }

  const token = signToken({ id: user.id, email: user.email, name: user.name, role: user.role });

  // Track last login (fire-and-forget — login succeeds even if this fails)
  prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } }).catch(() => {});

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      profileImage: user.profileImage,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt,
    },
    token,
  };
}

export async function getUserProfile(id: string) {
  try {
    const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      profileImage: true,
      role: true,
      status: true,
      createdAt: true,
      _count: {
        select: {
          favorites: true,
          wallpapers: true,
          aiWallpapers: true,
        },
      },
    },
  });

  if (!user) {
    const error: any = new Error("User not found.");
    error.statusCode = 404;
    throw error;
  }

  if (user.status === "SUSPENDED") {
    const error: any = new Error("This account has been suspended. Please contact support.");
    error.statusCode = 403;
    throw error;
  }

  return user;
  } catch (err: any) {
    if (err?.statusCode || !isDbOfflineError(err)) throw err;
    // Offline fallback: demo + ephemeral local accounts resolve without a DB.
    if (id === DEMO_USER.id) return { ...DEMO_USER, _count: { favorites: 0, wallpapers: 0, aiWallpapers: 0 } };
    if (id.startsWith("local-")) {
      return {
        id,
        name: "Local User",
        email: "local@wallora.dev",
        profileImage: `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(id)}`,
        role: "USER",
        status: "ACTIVE",
        createdAt: new Date().toISOString(),
        _count: { favorites: 0, wallpapers: 0, aiWallpapers: 0 },
      };
    }
    throw dbOfflineError();
  }
}
