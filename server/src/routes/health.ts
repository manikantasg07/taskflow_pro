import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { redis } from "../lib/redis";
import { logger } from "../lib/logger";

export const healthRouter = async (req: Request, res: Response) => {
  let statuscode = 200;
  const services = {
    database: "ok",
    redis: "ok",
  };
  let status = "ok";

  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch (error) {
    services.database = "error";
    statuscode = 503;
    status = "degraded";
    logger.error(error);
  }
  try {
    await redis.ping();
  } catch (error) {
    services.redis = "error";
    statuscode = 503;
    status = "degraded";
    logger.error(error);
  }
  return res.status(statuscode).json({
    status,
    timestamp: Date.now().toString(),
    services,
  });
};
