import jwt from "jsonwebtoken";
import { UserPayload } from "../types";

const JWT_SECRET = process.env.JWT_SECRET || "wallora_dev_jwt_secret_32_characters_minimum";
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN || "7d") as string;

if (!process.env.JWT_SECRET) {
  console.warn("⚠️ JWT_SECRET is not set — using an insecure dev fallback. Set JWT_SECRET in backend/.env.");
}

export function signToken(payload: UserPayload): string {
  // @ts-ignore
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): UserPayload {
  return jwt.verify(token, JWT_SECRET) as UserPayload;
}
