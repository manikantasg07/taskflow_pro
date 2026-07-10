// server/src/utils/date.ts
export const getExpiryDate = (duration: string): Date => {
  const unit = duration.slice(-1);
  const value = parseInt(duration.slice(0, -1));

  const ms: Record<string, number> = {
    s: value * 1000,
    m: value * 60 * 1000,
    h: value * 60 * 60 * 1000,
    d: value * 24 * 60 * 60 * 1000,
  };

  return new Date(Date.now() + (ms[unit] ?? parseInt(duration) * 1000));
};
