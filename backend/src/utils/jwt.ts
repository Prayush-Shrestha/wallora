import jwt from "jsonwebtoken";
import { UserPayload } from "../types";

const JWT_SECRET = process.env.JWT_SECRET || "wallora_dev_jwt_secret_32_characters_minimum";
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN || "7d") as string;

export function signToken(payload: UserPayload): string {
  // @ts-ignore
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): UserPayload {
  return jwt.verify(token, JWT_SECRET) as UserPayload;
}
