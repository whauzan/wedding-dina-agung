import "server-only";
import crypto from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const SESSION_COOKIE = "admin_session";
const SESSION_SUBJECT = "admin";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8; // 8 hours

function getSessionSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) throw new Error("Missing ADMIN_SESSION_SECRET environment variable");
  return secret;
}

function getAdminPassword(): string {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) throw new Error("Missing ADMIN_PASSWORD environment variable");
  return password;
}

export function verifyPassword(input: string): boolean {
  const expected = Buffer.from(getAdminPassword());
  const actual = Buffer.from(input);

  if (expected.length !== actual.length) return false;
  return crypto.timingSafeEqual(expected, actual);
}

export function createSessionToken(): string {
  return crypto
    .createHmac("sha256", getSessionSecret())
    .update(SESSION_SUBJECT)
    .digest("hex");
}

function isValidSessionToken(token: string | undefined): boolean {
  if (!token) return false;

  const expected = Buffer.from(createSessionToken());
  const actual = Buffer.from(token);

  if (expected.length !== actual.length) return false;
  return crypto.timingSafeEqual(expected, actual);
}

export async function setSessionCookie(): Promise<void> {
  const store = await cookies();
  store.set(SESSION_COOKIE, createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export async function clearSessionCookie(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

export async function hasValidSession(): Promise<boolean> {
  const store = await cookies();
  return isValidSessionToken(store.get(SESSION_COOKIE)?.value);
}

export async function assertAdminPage(): Promise<void> {
  if (!(await hasValidSession())) {
    redirect("/admin/login");
  }
}

export async function assertAdminApi(): Promise<Response | null> {
  if (!(await hasValidSession())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}
