const mailConfig = {
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === "true", // true for port 465, false for 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  pool: true, // reuse connections instead of opening one per mail
  maxConnections: 5,
  maxMessages: 100,
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 20000,
};

module.exports = mailConfig;
