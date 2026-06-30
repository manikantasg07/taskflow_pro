// server/src/lib/logger.ts
export const logger = {
  error: (...args: unknown[]) => {
    // eslint-disable-next-line no-console
    console.error(...args);
  },
};
