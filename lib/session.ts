import { cookies } from "next/headers";
import crypto from "crypto";

const COOKIE_NAME = "petel_admin";
const MAX_AGE = 60 * 60 * 12; // 12 hours

function secret(): string {
  return process.env.SESSION_SECRET || "petel-ofer-dev-secret-change-me";
}

export function adminPassword(): string {
  return process.env.ADMIN_PASSWORD || "petel2026!";
}

function sign(payload: string): string {
  return crypto.createHmac("sha256", secret()).update(payload).digest("hex");
}

export function createToken(): string {
  const payload = JSON.stringify({ role: "admin", exp: Date.now() + MAX_AGE * 1000 });
  const b64 = Buffer.from(payload).toString("base64url");
  return `${b64}.${sign(b64)}`;
}

export function verifyToken(token: string | undefined): boolean {
  if (!token) return false;
  const [b64, sig] = token.split(".");
  if (!b64 || !sig) return false;
  const expected = sign(b64);
  if (sig.length !== expected.length) return false;
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return false;
  try {
    const payload = JSON.parse(Buffer.from(b64, "base64url").toString());
    return payload.role === "admin" && payload.exp > Date.now();
  } catch {
    return false;
  }
}

export async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  return verifyToken(store.get(COOKIE_NAME)?.value);
}

export async function setAdminCookie() {
  const store = await cookies();
  store.set(COOKIE_NAME, createToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: MAX_AGE,
    path: "/",
  });
}

export async function clearAdminCookie() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}
