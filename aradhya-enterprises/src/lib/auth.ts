import crypto from "crypto";
import { cookies } from "next/headers";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

const SESSION_COOKIE_NAME = "aradhya_session";

export function hashPassword(password: string): string {
  const salt = "aradhya_salt_2026";
  return crypto.scryptSync(password, salt, 64).toString("hex");
}

export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

export interface SessionUser {
  id: number;
  name: string;
  email: string;
  role: "admin" | "employee" | "customer";
  phone?: string | null;
  address?: string | null;
}

export function createSessionToken(user: SessionUser): string {
  const payload = {
    ...user,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
  };
  const jsonStr = JSON.stringify(payload);
  const base64 = Buffer.from(jsonStr).toString("base64url");
  const signature = crypto
    .createHmac("sha256", "aradhya_enterprise_secret_key_2026")
    .update(base64)
    .digest("hex");
  return `${base64}.${signature}`;
}

export function verifySessionToken(token: string): SessionUser | null {
  try {
    const [base64, signature] = token.split(".");
    if (!base64 || !signature) return null;
    const expectedSig = crypto
      .createHmac("sha256", "aradhya_enterprise_secret_key_2026")
      .update(base64)
      .digest("hex");
    if (expectedSig !== signature) return null;

    const payload = JSON.parse(Buffer.from(base64, "base64url").toString("utf-8"));
    if (payload.exp && Date.now() > payload.exp) {
      return null;
    }
    return {
      id: payload.id,
      name: payload.name,
      email: payload.email,
      role: payload.role,
      phone: payload.phone,
      address: payload.address,
    };
  } catch {
    return null;
  }
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export { SESSION_COOKIE_NAME };
