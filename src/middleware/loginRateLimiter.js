import { rateLimiter } from "#src/middleware/rateLimiter.js";

export const loginRateLimiter = rateLimiter({
  windowMs: 10 * 60 * 1000,
  max: 5,
  keyGenerator: (req) => req.ip,
});
