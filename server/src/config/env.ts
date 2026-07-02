import * as z from "zod";
import dotenv from "dotenv";
import { logger } from "../lib/logger";

dotenv.config();

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  SERVER_PORT: z.string().default("3000"),
  NODE_ENV: z.enum(["development", "production", "test"]),
  REDIS_URL: z.string().min(1),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  logger.error("Invalid environment variables:");
  logger.error(parsed.error);
  process.exit(1);
}

export const env = parsed.data;
