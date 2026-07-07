import Redis from "ioredis";
import { env } from "../config/env";
import { logger } from "./logger";

class RedisClient {
  private static instance: Redis | undefined;

  static getInstance() {
    if (!RedisClient.instance) {
      RedisClient.instance = new Redis(env.REDIS_URL, {
        connectTimeout: 3000,
      });
    }
    RedisClient.instance.on("error", function (error) {
      logger.error(error);
    });
    return RedisClient.instance;
  }
}

export const redis = RedisClient.getInstance();
