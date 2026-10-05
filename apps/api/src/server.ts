import { app } from "./app.js";
import { env } from "./config/env.js";
import { prisma } from "./lib/prisma.js";

const server = app.listen(env.PORT, () => console.info(`VEONIX API listening on :${env.PORT}`));
async function shutdown(signal: string) {
  console.info(`${signal} received; shutting down`);
  server.close(async () => { await prisma.$disconnect(); process.exit(0); });
}
process.on("SIGTERM", () => void shutdown("SIGTERM"));
process.on("SIGINT", () => void shutdown("SIGINT"));
