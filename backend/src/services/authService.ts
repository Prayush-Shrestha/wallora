import prisma from "../config/database";
import { hashPassword, comparePassword } from "../utils/password";
import { signToken } from "../utils/jwt";

interface InMemUser {
  id: string;
  name: string;
  email: string;
  password: string;
  profileImage: string | null;
  role: string;
  status: string;
  createdAt: Date;
}

// In-memory development store when PostgreSQL is offline
const devUsers = new Map<string, InMemUser>();
let isDbOffline = false;
let lastDbCheck = 0;
const DB_RETRY_INTERVAL = 30000;

// Seed a default demo user for instant development access
(async () => {
  const demoHash = await hashPassword("password123");
  devUsers.set("demo@wallora.com", {
    id: "dev-user-demo",
    name: "Wallora Demo User",
    email: "demo@wallora.com",
    password: demoHash,
    profileImage: "https://api.dicebear.com/7.x/identicon/svg?seed=DemoUser",
    role: "ADMIN",
    status: "ACTIVE",
    createdAt: new Date(),
  });
})();

async function tryDatabase<T>(
  dbOp: () => Promise<T>,
  fallbackOp: () => Promise<T>
): Promise<T> {
  // If database was recently detected offline, use fallback immediately to avoid 5-second socket timeout
  if (isDbOffline && Date.now() - lastDbCheck < DB_RETRY_INTERVAL) {
    return fallbackOp();
  }

  try {
    const result = await Promise.race([
      dbOp(),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Database connection timeout")), 1500)
      ),
    ]);
    isDbOffline = false;
    return result;
  } catch (err: any) {
    const isConnErr =
      err?.message?.includes("Can't reach database server") ||
      err?.message?.includes("Database connection timeout") ||
      err?.code === "P1001";

    if (isConnErr) {
      isDbOffline = true;
      lastDbCheck = Date.now();
      console.warn(
        "[Auth Service] Database offline at localhost:5432. Using in-memory authentication fallback for local development."
      );
      return fallbackOp();
    }
    throw err;
  }
}

export async function register(name: string, email: string, password: string) {
  const cleanEmail = email.toLowerCase().trim();

  return tryDatabase(
    async () => {
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
    },
    async () => {
      // In-memory fallback
      if (devUsers.has(cleanEmail)) {
        const error: any = new Error("An account with this email address already exists.");
        error.statusCode = 409;
        throw error;
      }

      const hashedPassword = await hashPassword(password);
      const profileImage = `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(name)}`;
      const newUser: InMemUser = {
        id: `dev-user-${Date.now()}`,
        name,
        email: cleanEmail,
        password: hashedPassword,
        profileImage,
        role: "USER",
        status: "ACTIVE",
        createdAt: new Date(),
      };

      devUsers.set(cleanEmail, newUser);

      const token = signToken({
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
      });

      return {
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          profileImage: newUser.profileImage,
          role: newUser.role,
          status: newUser.status,
          createdAt: newUser.createdAt,
        },
        token,
      };
    }
  );
}

export async function login(email: string, password: string) {
  const cleanEmail = email.toLowerCase().trim();

  return tryDatabase(
    async () => {
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
    },
    async () => {
      // In-memory fallback
      const user = devUsers.get(cleanEmail);
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

      const token = signToken({ id: user.id, email: user.email, name: user.name, role: user.role });
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
  );
}

export async function getUserProfile(id: string) {
  return tryDatabase(
    async () => {
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

      return user;
    },
    async () => {
      // In-memory lookup
      for (const u of devUsers.values()) {
        if (u.id === id) {
          return {
            id: u.id,
            name: u.name,
            email: u.email,
            profileImage: u.profileImage,
            role: u.role,
            status: u.status,
            createdAt: u.createdAt,
            _count: {
              favorites: 0,
              wallpapers: 0,
              aiWallpapers: 0,
            },
          };
        }
      }
      const error: any = new Error("User not found.");
      error.statusCode = 404;
      throw error;
    }
  );
}
