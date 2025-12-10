import express from "express";
import logger from "#middleware/logger.js";
import errorHandler from "#middleware/errorHandler.js";
import authRoutes from "#routes/auth.js";
import userRoutes from "#routes/users.js";
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

app.use("/auth", authRoutes);
app.use("/users", userRoutes);

app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});
app.use(errorHandler);
export default app;
