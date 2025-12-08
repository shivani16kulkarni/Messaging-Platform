export default function errorHandler(err, req, res, next) {
  const status = err.status || err.statusCode || 500;

  const isDev = process.env.NODE_ENV !== "production";

  console.error(err);

  const payload = {
    error: err.message || "Internal Server Error",
  };

  if (isDev && err.stack) {
    payload.stack = err.stack.split("\n").map((line) => line.trim());
  }

  res.status(status).json(payload);
}
