import express from "express";
import logger from "#middleware/logger.js";
import errorHandler from "#middleware/errorHandler.js";
const app = express();

app.use(logger);
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({
    ok: true,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});
app.use(errorHandler);
export default app;
