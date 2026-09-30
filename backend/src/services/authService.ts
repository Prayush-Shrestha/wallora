import prisma from "../config/database";
import { hashPassword, comparePassword } from "../utils/password";
import { signToken } from "../utils/jwt";

export async function register(name: string, email: string, password: string) {
  const cleanEmail = email.toLowerCase().trim();

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
}

export async function login(email: string, password: string) {
  const cleanEmail = email.toLowerCase().trim();

  const user = await prisma.user.findUnique({
    where: { email: cleanEmail },
  });

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
}
