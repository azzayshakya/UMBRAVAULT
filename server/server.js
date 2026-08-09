require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const compression = require("compression");

const logger = require("./utils/logger");
const requestLogger = require("./middleware/request.logger");
const errorHandler = require("./middleware/error.handler");
const notFoundHandler = require("./middleware/notFoundHandler.middleware");
const connectDB = require("./config/db");

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const taskRoutes = require("./routes/task.routes");
const aiRoutes = require("./routes/ai.routes");
const noteRoutes = require("./routes/note.routes");
const topicRoutes = require("./routes/topic.routes");

const app = express();

app.use(compression());
const allowedOrigins = [
  "https://umbravault.vercel.app",
  "http://localhost:3005",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
app.use(requestLogger);

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    next(err);
  }
});

app.get("/health", (req, res) => res.status(200).json({ status: "ok" }));

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/task", taskRoutes);
app.use("/api/note", noteRoutes);
app.use("/api/topic", topicRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

// run locally with `node server.js`, skip listen() on Vercel
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 3006;
  app.listen(PORT, () => logger.info(`Server started on port ${PORT}`));
}

module.exports = app;
