import * as z from "zod";
import dotenv from "dotenv";
import { logger } from "../lib/logger";
import { StringValue } from "ms";

dotenv.config();

const msStringPattern =
  /^\d+\s?(ms|s|m|h|d|w|y|second|seconds|minute|minutes|hour|hours|day|days|week|weeks|year|years)$/i;

const stringValueSchema = z
  .string()
  .min(1)
  .refine((val) => msStringPattern.test(val), {
    message: 'Must be a valid duration string like "15m", "7d", or "1h"',
  }) as unknown as z.ZodType<StringValue>;

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  SERVER_PORT: z.string().default("3000"),
  NODE_ENV: z.enum(["development", "production", "test"]),
  REDIS_URL: z.string().min(1),
  SALT_ROUNDS: z.string().min(1),
  ACCESS_TOKEN_EXPIRY: stringValueSchema,
  REFRESH_TOKEN_EXPIRY: stringValueSchema,
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  logger.error("Invalid environment variables:");
  logger.error(parsed.error);
  process.exit(1);
}

export const env = parsed.data;
