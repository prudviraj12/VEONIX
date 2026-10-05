import { Router } from "express";
import { authRouter } from "./auth.router.js";
import { healthRouter } from "./health.router.js";

export const apiRouter = Router();
apiRouter.use("/auth", authRouter);
apiRouter.use("/health", healthRouter);
