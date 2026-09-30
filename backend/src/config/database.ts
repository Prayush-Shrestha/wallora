import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var prismaBackend: PrismaClient | undefined;
}

export const prisma =
  global.prismaBackend ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  global.prismaBackend = prisma;
}

export async function connectDatabase() {
  try {
    await prisma.$connect();
    console.log(" PostgreSQL connected via Prisma.");
  } catch (err: any) {
    console.warn("⚠️ PostgreSQL connection failed (API will run in graceful fallback mode):", err.message);
  }
}

export default prisma;
