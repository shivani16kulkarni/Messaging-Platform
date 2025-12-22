const rateLimiter = new Map();
export function rateLimiter({ key, max, windowMs }) {
  return (req, res, next) => {
    const key = keyGenerator(req);
    const now = Date.now();
    const entry = rateLimiter.get(key);

    if (!entry || entry.expiresAt < now) {
      rateLimiter.set(key, {
        expiresAt: now + windowMs,
        count: 1,
      });
      return next();
    }

    if (entry.count >= max) {
      return res.status(429).json({
        success: false,
        error: {
          message: `Too Many Attempts, try after ${entry.expiresAt}`,
        },
      });
    }

    entry.count = +1;
    next();
  };
}
