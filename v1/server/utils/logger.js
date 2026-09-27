const winston = require("winston");
const path = require("path");

const { combine, timestamp, printf, errors, json } = winston.format;

const LEVEL_STYLES = {
  error: { icon: "✖", color: "31" }, // red
  warn: { icon: "⚠", color: "33" }, // yellow
  info: { icon: "ℹ", color: "36" }, // cyan
  http: { icon: "→", color: "35" }, // magenta
  verbose: { icon: "…", color: "34" }, // blue
  debug: { icon: "•", color: "90" }, // gray (single-width icon, aligns cleanly)
  silly: { icon: "✧", color: "90" }, // gray
};

const LEVEL_NAME_PAD = Math.max(
  ...Object.keys(LEVEL_STYLES).map((l) => l.length),
);

const ansi = (code, text) => `\x1b[${code}m${text}\x1b[0m`;

const devFormat = combine(
  timestamp({ format: "HH:mm:ss.SSS" }),
  errors({ stack: true }),
  printf(({ level, message, timestamp: ts, stack, ...meta }) => {
    const style = LEVEL_STYLES[level] || { icon: "•", color: "0" };
    const label = ansi(
      style.color,
      `${style.icon} ${level.toUpperCase().padEnd(LEVEL_NAME_PAD)}`,
    );
    const time = ansi("90", ts);

    // Any extra fields passed as the second arg (logger.info("msg", { meta }))
    // get pretty-printed underneath instead of squashed onto one line.
    const extra = Object.keys(meta).length
      ? `\n${JSON.stringify(meta, null, 2)
          .split("\n")
          .map((l) => `  ${l}`)
          .join("\n")}`
      : "";

    if (stack) {
      const divider = ansi("90", "─".repeat(60));
      return `${time}  ${label}  ${message}\n${divider}\n${stack}\n${divider}`;
    }

    return `${time}  ${label}  ${message}${extra}`;
  }),
);

// ---------------------------------------------------------------------------
// Prod format — structured JSON for log aggregators (Datadog, CloudWatch, etc.)
// ---------------------------------------------------------------------------

const prodFormat = combine(
  timestamp(),
  errors({ stack: true }),
  json(),
  // Attach static context fields to every line without touching call sites.
  winston.format((info) => {
    info.service = process.env.SERVICE_NAME || "app";
    info.env = process.env.NODE_ENV || "development";
    return info;
  })(),
);

// ---------------------------------------------------------------------------
// Transports
// ---------------------------------------------------------------------------

// Covers Vercel by default, plus a generic manual override for any other
// read-only/ephemeral filesystem (Lambda, Render free tier, etc.)
const fileLoggingDisabled =
  !!process.env.VERCEL || process.env.DISABLE_FILE_LOGS === "true";

const transports = [new winston.transports.Console()];

if (!fileLoggingDisabled) {
  const logDir = process.env.LOG_DIR || path.join(__dirname, "..", "logs");

  transports.push(
    new winston.transports.File({
      filename: path.join(logDir, "error.log"),
      level: "error",
      maxsize: 5 * 1024 * 1024, // 5MB per file
      maxFiles: 5, // keep last 5, then roll off oldest
    }),
    new winston.transports.File({
      filename: path.join(logDir, "combined.log"),
      maxsize: 5 * 1024 * 1024,
      maxFiles: 5,
    }),
  );
}

// ---------------------------------------------------------------------------
// Logger
// ---------------------------------------------------------------------------

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "http",
  format: process.env.NODE_ENV === "production" ? prodFormat : devFormat,
  transports,
  exitOnError: false,

  // If something throws or a promise rejects and nobody catches it, it still
  // goes through the logger/files instead of just dumping to stderr raw.
  exceptionHandlers: fileLoggingDisabled
    ? [new winston.transports.Console()]
    : [
        new winston.transports.File({
          filename: path.join(
            process.env.LOG_DIR || path.join(__dirname, "..", "logs"),
            "exceptions.log",
          ),
        }),
      ],
  rejectionHandlers: fileLoggingDisabled
    ? [new winston.transports.Console()]
    : [
        new winston.transports.File({
          filename: path.join(
            process.env.LOG_DIR || path.join(__dirname, "..", "logs"),
            "rejections.log",
          ),
        }),
      ],
});

module.exports = logger;

// const winston = require("winston");
// const path = require("path");

// const { combine, timestamp, printf, colorize, errors, json } = winston.format;

// const LEVEL_STYLES = {
//   error: { icon: "✖", color: "red" },
//   warn: { icon: "⚠", color: "yellow" },
//   info: { icon: "ℹ", color: "cyan" },
//   http: { icon: "→", color: "magenta" },
//   verbose: { icon: "…", color: "blue" },
//   debug: { icon: "🐛", color: "gray" },
//   silly: { icon: "✧", color: "gray" },
// };

// winston.addColors(
//   Object.fromEntries(
//     Object.entries(LEVEL_STYLES).map(([lvl, { color }]) => [lvl, color]),
//   ),
// );

// const PAD = Math.max(...Object.keys(LEVEL_STYLES).map((l) => l.length));

// const devFormat = combine(
//   colorize({
//     all: false,
//     colors: Object.fromEntries(
//       Object.entries(LEVEL_STYLES).map(([l, s]) => [l, s.color]),
//     ),
//   }),
//   timestamp({ format: "HH:mm:ss.SSS" }),
//   errors({ stack: true }),
//   printf(({ level, message, timestamp, stack, ...meta }) => {
//     const plain = level.replace(/\x1b\[[0-9;]*m/g, "");
//     const style = LEVEL_STYLES[plain] || { icon: "•" };
//     const label = `${style.icon} ${plain.toUpperCase()}`.padEnd(PAD + 2);

//     const colored = level
//       .replace(plain.toUpperCase(), label)
//       .replace(plain, label);

//     const time = `\x1b[90m${timestamp}\x1b[0m`; // dim gray timestamp
//     const extra = Object.keys(meta).length ? `\n  ${JSON.stringify(meta)}` : "";

//     if (stack) {
//       const divider = "\x1b[90m" + "─".repeat(60) + "\x1b[0m";
//       return `${time}  ${colored}  ${message}\n${divider}\n${stack}\n${divider}`;
//     }

//     return `${time}  ${colored}  ${message}${extra}`;
//   }),
// );

// const prodFormat = combine(timestamp(), errors({ stack: true }), json());

// const isVercel = !!process.env.VERCEL;

// const transports = [new winston.transports.Console()];

// if (!isVercel) {
//   transports.push(
//     new winston.transports.File({
//       filename: path.join(__dirname, "..", "logs", "error.log"),
//       level: "error",
//     }),
//     new winston.transports.File({
//       filename: path.join(__dirname, "..", "logs", "combined.log"),
//     }),
//   );
// }

// const logger = winston.createLogger({
//   level: process.env.LOG_LEVEL || "http",
//   format: process.env.NODE_ENV === "production" ? prodFormat : devFormat,
//   transports,
//   exitOnError: false,
// });

// module.exports = logger;
