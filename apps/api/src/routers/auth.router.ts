import { Router } from "express";
import { z } from "zod";
import { env } from "../config/env.js";
import { requireAuth } from "../middleware/require-auth.js";
import { login, refresh, register, removeSession } from "../services/auth.service.js";

const credentials = z.object({ email: z.string().email(), password: z.string().min(8).max(128) });
const registration = credentials.extend({ name: z.string().trim().min(1).max(80).optional() });
const cookieOptions = { httpOnly: true, secure: env.NODE_ENV === "production", sameSite: "lax" as const, path: "/api/v1/auth", maxAge: 30 * 86_400_000 };

export const authRouter = Router();

authRouter.post("/register", async (req, res, next) => {
  try {
    const result = await register(registration.parse(req.body));
    res.cookie("refresh_token", result.refreshToken, cookieOptions);
    res.status(201).json({ user: result.user, accessToken: result.accessToken });
  } catch (error) {
    if (error instanceof Error && error.message === "EMAIL_IN_USE") return res.status(409).json({ error: "An account already exists for this email" });
    next(error);
  }
});

authRouter.post("/login", async (req, res, next) => {
  try {
    const result = await login(credentials.parse(req.body));
    res.cookie("refresh_token", result.refreshToken, cookieOptions);
    res.json({ user: result.user, accessToken: result.accessToken });
  } catch (error) {
    if (error instanceof Error && error.message === "INVALID_CREDENTIALS") return res.status(401).json({ error: "Invalid email or password" });
    next(error);
  }
});

authRouter.post("/logout", async (req, res, next) => {
  try {
    await removeSession(req.cookies.refresh_token);
    res.clearCookie("refresh_token", cookieOptions).status(204).send();
  } catch (error) { next(error); }
});

authRouter.post("/refresh", async (req, res, next) => {
  try {
    const result = await refresh(req.cookies.refresh_token);
    res.cookie("refresh_token", result.refreshToken, cookieOptions);
    res.json({ user: result.user, accessToken: result.accessToken });
  } catch (error) {
    res.clearCookie("refresh_token", cookieOptions);
    if (error instanceof Error && error.message === "INVALID_SESSION") return res.status(401).json({ error: "Session expired" });
    next(error);
  }
});

authRouter.get("/me", requireAuth, (req, res) => res.json({ user: req.user }));
