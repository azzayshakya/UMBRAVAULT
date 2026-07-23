require("dotenv").config();
require("express-async-errors"); // must be required before routes

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const cookieParser = require("cookie-parser");

const logger = require("./utils/logger");
const requestLogger = require("./middleware/request.logger");
const errorHandler = require("./middleware/error.handler");
// const notFoundHandler = require("./middleware/not.found.handler"); // new
const connectDB = require("./config/db");
const redisClient = require("./services/redis.client");
const { apiLimiter, authLimiter } = require("./middleware/rate.limiter");

const userRoutes = require("./routes/user.routes");
const aiRoutes = require("./routes/ai.routes");

const app = express();

// Trust the first proxy hop (adjust number/value to your actual deployment:
// nginx/ALB in front = 1; Vercel/Cloudflare may need 'true' or a specific count)
app.set("trust proxy", 1);

app.use(helmet());
app.use(compression());
app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
app.use(requestLogger);

app.get("/health", (req, res) => res.status(200).json({ status: "ok" }));

// General limiter for everything, stricter one specifically on auth routes
app.use("/", apiLimiter);
app.use("/api/auth", authLimiter, userRoutes); // adjust path to match your auth routes
app.use("/", userRoutes);
app.use("/", aiRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 3006;
app.get("/health", (req, res) => res.status(200).json({ status: "ok" }));

let server;

async function start() {
  const required = ["MONGO_URI", "UPSTASH_REDIS_URL"];
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length) {
    logger.error(`Missing required env vars: ${missing.join(", ")}`);
    process.exit(1);
  }

  await connectDB();

  server = app.listen(PORT, () => {
    logger.info(`Server started on port ${PORT}`);
  });
}

start();

async function shutdown(signal) {
  logger.info(`${signal} received, shutting down gracefully`);
  server?.close(() => logger.info("HTTP server closed"));
  try {
    await redisClient.quit();
    logger.info("Redis connection closed");
  } catch (err) {
    logger.error(`Error closing Redis: ${err.message}`);
  }
  process.exit(0);
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

module.exports = app; // useful for supertest / integration tests
