export default function errorHandler(err, req, res, next) {
  const status =
    Number.isInteger(err.statusCode) && err.statusCode >= 400
      ? err.statusCode
      : 500;

  const isDev = process.env.NODE_ENV !== "production";

  console.error(err);

  const error = {
    message:
      status === 500
        ? "Internal Server Error"
        : err.message || "Something went wrong",
  };

  if (isDev && err.stack) {
    error.stack = err.stack.split("\n").map((line) => line.trim());
  }

  res.status(status).json({
    success: false,
    error,
  });
}
