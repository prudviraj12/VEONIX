import type { RequestHandler } from "express";
import { verifyAccessToken } from "../services/auth.service.js";

export const requireAuth: RequestHandler = (req, res, next) => {
  const token = req.header("authorization")?.replace(/^Bearer\s+/i, "");
  const user = token ? verifyAccessToken(token) : null;
  if (!user) return res.status(401).json({ error: "Authentication required" });
  req.user = user;
  next();
};
