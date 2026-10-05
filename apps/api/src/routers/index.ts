import { Router } from "express";
import { healthRouter } from "./health.router.js";

export const apiRouter = Router();
apiRouter.use("/health", healthRouter);
