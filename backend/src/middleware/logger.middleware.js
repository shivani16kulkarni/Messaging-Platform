export default function logger(req, res, next) {
  const start = Date.now();
  const { method, originalUrl } = req;

  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(`${method} ${originalUrl} ${res.statusCode} - ${duration}ms`);
  });

  next();
}
