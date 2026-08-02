const nodemailer = require("nodemailer");
const mailConfig = require("../config/mail.config");
const logger = require("../utils/logger");
const ApiError = require("../utils/apiError");

const FROM_ADDRESS = process.env.MAIL_FROM || "no-reply@yourapp.com";

let transporter = null;

const readyPromise = new Promise((resolve, reject) => {
  if (!mailConfig.auth.user || !mailConfig.auth.pass || !mailConfig.host) {
    const msg =
      "Mail service misconfigured: missing SMTP_HOST/SMTP_USER/SMTP_PASS";
    logger.error(msg);
    reject(new Error(msg));
    return;
  }

  transporter = nodemailer.createTransport(mailConfig);

  transporter.verify((err) => {
    if (err) {
      logger.error(`Mail service failed to initialize: ${err.message}`);
      reject(err);
    } else {
      logger.info("Mail service connected and ready to send");
      resolve(true);
    }
  });
});

readyPromise.catch(() => {});

const sendMail = async ({ to, subject, text, html, attachments }) => {
  if (!to || !subject || (!text && !html)) {
    throw ApiError.badRequest(
      "Missing required mail fields: to, subject, text/html",
    );
  }

  try {
    await readyPromise;
  } catch (err) {
    throw ApiError.internal("Mail service is not available");
  }

  try {
    const info = await transporter.sendMail({
      from: FROM_ADDRESS,
      to,
      subject,
      text,
      html,
      attachments,
    });

    logger.info(
      `Mail sent to ${to} | subject: "${subject}" | messageId: ${info.messageId}`,
    );
    return info;
  } catch (err) {
    logger.error(`Failed to send mail to ${to}: ${err.message}`);
    throw ApiError.internal("Failed to send email");
  }
};

const getMailStatus = async () => {
  try {
    await readyPromise;
    return true;
  } catch {
    return false;
  }
};

module.exports = {
  sendMail,
  getMailStatus,
};
