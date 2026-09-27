const logger = require("../utils/logger");

const NOTIFICATION_SERVICE_URL =
  process.env.NOTIFICATION_SERVICE_URL || "http://localhost:5002";
const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY;

async function sendNotification({
  userId,
  appId = "umbra-vault",
  templateKey,
  params = {},
  metadata = {},
}) {
  try {
    const res = await fetch(
      `${NOTIFICATION_SERVICE_URL}/api/v1/notifications/send`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": INTERNAL_API_KEY, // <--- Add this header
        },
        body: JSON.stringify({
          userId: String(userId),
          appId,
          templateKey,
          params,
          metadata,
        }),
      },
    );

    if (!res.ok) {
      const errBody = await res.text();
      logger.warn(
        `[NotificationClient] Dispatch failed (${res.status}): ${errBody}`,
      );
      return false;
    }

    return true;
  } catch (error) {
    logger.error(
      `[NotificationClient] Could not reach notification service: ${error.message}`,
    );
    return false;
  }
}

module.exports = { sendNotification };
