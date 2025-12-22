export function createPaginationMiddleware({
  defaultLimit = 20,
  maxLimit = 50,
  allowedDirections = null,
} = {}) {
  return function paginationMiddleware(req, res, next) {
    let limit = defaultLimit;
    if (req.query.limit !== undefined) {
      const n = Number(req.query.limit);
      if (Number.isNaN(n) || n <= 0) {
        return res.status(400).json({
          success: false,
          error: { message: "limit must be a positive number" },
        });
      }
      limit = Math.min(n, maxLimit);
    }

    let cursor = null;
    if (req.query.cursor !== undefined) {
      const c = Number(req.query.cursor);
      if (Number.isNaN(c) || c <= 0) {
        return res.status(400).json({
          success: false,
          error: { message: "cursor must be a positive number" },
        });
      }
      cursor = c;
    }

    let direction = null;
    if (Array.isArray(allowedDirections) && req.query.direction !== undefined) {
      if (!allowedDirections.includes(req.query.direction)) {
        return res.status(400).json({
          success: false,
          error: {
            message: `direction must be one of: ${allowedDirections.join(", ")}`,
          },
        });
      }
      direction = req.query.direction;
    }

    req.pagination = {
      limit,
      cursor,
      direction,
    };

    next();
  };
}
