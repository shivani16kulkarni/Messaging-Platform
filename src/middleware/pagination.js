export function createPaginationMiddleware({
  defaultLimit = 20,
  maxLimit = 50,
  allowedDirections = false,
} = {}) {
  const direction = allowedDirections ? ["Older", "Newer"] : [];

  return function paginationMiddleware(req, res, next) {
    let rawLimit = req.query.limit;
    let limit = defaultLimit;

    if (rawLimit !== undefined) {
      const n = Number(rawLimit);
      if (Number.isNaN(n) || n <= 0) {
        return res
          .status(400)
          .json({ message: "limit must be a positive number" });
      }
      limit = Math.min(n, maxLimit);
    }

    let cursor = null;
    const rawCursor = req.query.cursor;
    if (rawCursor !== undefined) {
      const c = Number(rawCursor);
      if (Number.isNaN(c) || c <= 0) {
        return res
          .status(400)
          .json({ message: "cursor must be a positive number" });
      }
      cursor = c;
    }
    let direction = null;
    const rawDirection = req.params.direction;
    if (allowedDirections && rawDirection !== undefined) {
      if (!allowedDirections.includes(rawDirection)) {
        return res.status(400).json({
          message: `direction must be one of: ${allowedDirections.join(", ")}`,
        });
      }
      direction = rawDirection;
    }

    req.pagination = {
      limit,
      cursor,
      direction,
    };

    return next();
  };
}
