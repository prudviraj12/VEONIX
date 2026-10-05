import { createHash, randomBytes } from "node:crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { prisma } from "../lib/prisma.js";

const ACCESS_TOKEN_TTL = "15m";
const REFRESH_TOKEN_DAYS = 30;

export type SafeUser = { id: string; email: string; name: string | null };
export type AuthResult = { user: SafeUser; accessToken: string; refreshToken: string };

function toSafeUser(user: { id: string; email: string; name: string | null }): SafeUser {
  return { id: user.id, email: user.email, name: user.name };
}

function hashToken(token: string) { return createHash("sha256").update(token).digest("hex"); }
function createAccessToken(user: SafeUser) {
  return jwt.sign({ email: user.email, name: user.name }, env.JWT_ACCESS_SECRET, { subject: user.id, expiresIn: ACCESS_TOKEN_TTL });
}

async function createSession(user: SafeUser): Promise<AuthResult> {
  const refreshToken = randomBytes(48).toString("base64url");
  await prisma.session.create({ data: { userId: user.id, tokenHash: hashToken(refreshToken), expiresAt: new Date(Date.now() + REFRESH_TOKEN_DAYS * 86_400_000) } });
  return { user, accessToken: createAccessToken(user), refreshToken };
}

export async function register(input: { email: string; password: string; name?: string }): Promise<AuthResult> {
  const email = input.email.trim().toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new Error("EMAIL_IN_USE");
  const user = await prisma.user.create({ data: { email, name: input.name?.trim() || null, passwordHash: await bcrypt.hash(input.password, 12) } });
  return createSession(toSafeUser(user));
}

export async function login(input: { email: string; password: string }): Promise<AuthResult> {
  const user = await prisma.user.findUnique({ where: { email: input.email.trim().toLowerCase() } });
  if (!user || !(await bcrypt.compare(input.password, user.passwordHash))) throw new Error("INVALID_CREDENTIALS");
  return createSession(toSafeUser(user));
}

export async function removeSession(refreshToken?: string) {
  if (refreshToken) await prisma.session.deleteMany({ where: { tokenHash: hashToken(refreshToken) } });
}

export async function refresh(refreshToken?: string): Promise<AuthResult> {
  if (!refreshToken) throw new Error("INVALID_SESSION");
  const session = await prisma.session.findUnique({ where: { tokenHash: hashToken(refreshToken) }, include: { user: true } });
  if (!session || session.expiresAt < new Date()) {
    await removeSession(refreshToken);
    throw new Error("INVALID_SESSION");
  }
  await prisma.session.delete({ where: { id: session.id } });
  return createSession(toSafeUser(session.user));
}

export function verifyAccessToken(token: string): SafeUser | null {
  try {
    const payload = jwt.verify(token, env.JWT_ACCESS_SECRET);
    if (typeof payload === "string" || !payload.sub || typeof payload.email !== "string") return null;
    return { id: payload.sub, email: payload.email, name: typeof payload.name === "string" ? payload.name : null };
  } catch { return null; }
}
