import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";
import { redis } from "../lib/redis";
import { logger } from "../lib/logger";

export const healthRouter = async (
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const services = {
    database: "ok",
    redis: "ok",
  };

  // check database
  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch (error) {
    services.database = "error";
    logger.error("Database health check failed", { error });
  }

  // check redis
  try {
    if (redis.status !== "ready") {
      throw new Error(`Redis not ready. Status: ${redis.status}`);
    }
    await redis.ping();
  } catch (error) {
    services.redis = "error";
    logger.error("Redis health check failed", { error });
  }

  // determine overall status
  const isHealthy = Object.values(services).every((s) => s === "ok");

  return res.status(isHealthy ? 200 : 503).json({
    status: isHealthy ? "ok" : "degraded",
    timestamp: new Date().toISOString(),
    services,
  });
};
