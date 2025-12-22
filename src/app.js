import express from "express";
import logger from "#middleware/logger.js";
import errorHandler from "#middleware/errorHandler.js";
import authRoutes from "#routes/auth.js";
import userRoutes from "#routes/user.js";
import conversationRoutes from "#routes/conversation.js";
import helmet from "helmet";
const app = express();

app.use(logger);
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({
    ok: true,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/conversations", conversationRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      message: "Not Found",
    },
  });
});
app.use(errorHandler);
export default app;
