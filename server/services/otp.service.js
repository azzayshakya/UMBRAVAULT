/**
 * src/services/otp.service.js
 */

const crypto = require("crypto");
const redisClient = require("../services/redis.client");
const ApiError = require("../utils/apiError");
const logger = require("../utils/logger");

const OTP_TTL_SECONDS = 5 * 60; // 5 minutes
const COOLDOWN_SECONDS = 60; // 60 seconds
const RESET_TOKEN_TTL_SECONDS = 10 * 60; // 10 minutes
const MAX_ATTEMPTS = 5;

class OtpService {
  /**
   * Hashes plain strings (OTP or Reset Token) using SHA-256.
   * OTPs are short-lived and kept only in memory/Redis; SHA-256 avoids
   * the high CPU cost of bcrypt for high-throughput OTP lookups.
   */
  #hash(value) {
    return crypto.createHash("sha256").update(value).digest("hex");
  }

  /**
   * Generates an unguessable 6-digit numeric OTP.
   */
  #generateSecureOtp() {
    return crypto.randomInt(100000, 1000000).toString();
  }

  /**
   * Normalizes purpose strings to prevent key collision bugs.
   */
  #validatePurpose(purpose) {
    const validPurposes = ["verify-email", "forgot-password"];
    if (!validPurposes.includes(purpose)) {
      throw ApiError.badRequest(`Invalid OTP purpose: ${purpose}`);
    }
  }

  /**
   * Creates and stores a hashed OTP in Redis.
   * Enforces a 60-second resend cooldown.
   *
   * @param {Object} params
   * @param {string} params.email
   * @param {string} params.purpose "verify-email" | "forgot-password"
   * @returns {Promise<{ rawOtp: string, expiresInSeconds: number, resendInSeconds: number }>}
   */
  async generateAndSaveOtp({ email, purpose }) {
    this.#validatePurpose(purpose);
    const normalizedEmail = email.toLowerCase().trim();

    const cooldownKey = `otp-cooldown:${purpose}:${normalizedEmail}`;
    const otpKey = `otp:${purpose}:${normalizedEmail}`;

    // 1. Check Resend Cooldown
    const cooldownActive = await redisClient.get(cooldownKey);
    if (cooldownActive) {
      const remainingCooldown = await redisClient.ttl(cooldownKey);
      throw ApiError.tooManyRequests(
        `Please wait ${remainingCooldown > 0 ? remainingCooldown : 60} seconds before requesting another code.`,
      );
    }

    // 2. Generate raw OTP and hash it
    const rawOtp = this.#generateSecureOtp();
    const hashedOtp = this.#hash(rawOtp);

    // 3. Atomically persist OTP and establish Cooldown
    const pipeline = redisClient.pipeline();

    // Store state as a JSON string with an attempt counter
    const payload = JSON.stringify({
      hashedOtp,
      attempts: 0,
    });

    pipeline.set(otpKey, payload, "EX", OTP_TTL_SECONDS);
    pipeline.set(cooldownKey, "1", "EX", COOLDOWN_SECONDS);

    await pipeline.exec();

    logger.info(`OTP issued for [${purpose}] -> ${normalizedEmail}`);

    return {
      rawOtp,
      expiresInSeconds: OTP_TTL_SECONDS,
      resendInSeconds: COOLDOWN_SECONDS,
    };
  }

  /**
   * Verifies the provided OTP against the stored hash.
   * Increments attempt count on failure; deletes OTP if limit is reached.
   *
   * @param {Object} params
   * @param {string} params.email
   * @param {string} params.purpose
   * @param {string} params.rawOtp
   * @returns {Promise<boolean>}
   */
  async verifyOtp({ email, purpose, rawOtp }) {
    this.#validatePurpose(purpose);
    const normalizedEmail = email.toLowerCase().trim();
    const otpKey = `otp:${purpose}:${normalizedEmail}`;

    const rawData = await redisClient.get(otpKey);
    if (!rawData) {
      throw ApiError.badRequest(
        "Verification code has expired or was never requested",
      );
    }

    let parsed;
    try {
      parsed = JSON.parse(rawData);
    } catch {
      await redisClient.del(otpKey);
      throw ApiError.internal("Corrupted OTP state encountered");
    }

    // 1. Attempt threshold check
    if (parsed.attempts >= MAX_ATTEMPTS) {
      await redisClient.del(otpKey);
      throw ApiError.badRequest(
        "Too many incorrect attempts. Please request a new code.",
      );
    }

    // 2. Hash comparison
    const incomingHash = this.#hash(String(rawOtp).trim());
    const isMatch = crypto.timingSafeEqual(
      Buffer.from(incomingHash, "hex"),
      Buffer.from(parsed.hashedOtp, "hex"),
    );

    if (!isMatch) {
      parsed.attempts += 1;
      const ttl = await redisClient.ttl(otpKey);

      if (parsed.attempts >= MAX_ATTEMPTS) {
        await redisClient.del(otpKey);
        throw ApiError.badRequest(
          "Too many incorrect attempts. Please request a new code.",
        );
      }

      // Preserve existing TTL when updating attempt count
      if (ttl > 0) {
        await redisClient.set(otpKey, JSON.stringify(parsed), "EX", ttl);
      }

      const remainingAttempts = MAX_ATTEMPTS - parsed.attempts;
      throw ApiError.badRequest(
        `Invalid code. ${remainingAttempts} attempt${remainingAttempts === 1 ? "" : "s"} remaining.`,
      );
    }

    // 3. Match found: Invalidate OTP immediately (Single-use enforcement)
    await redisClient.del(otpKey);
    return true;
  }

  /**
   * Returns remaining TTL for both OTP and cooldown to synchronize frontend countdown timers.
   *
   * @param {Object} params
   * @param {string} params.email
   * @param {string} params.purpose
   * @returns {Promise<{ hasActiveOtp: boolean, expiresInSeconds: number, resendInSeconds: number }>}
   */
  async getOtpStatus({ email, purpose }) {
    this.#validatePurpose(purpose);
    const normalizedEmail = email.toLowerCase().trim();

    const otpKey = `otp:${purpose}:${normalizedEmail}`;
    const cooldownKey = `otp-cooldown:${purpose}:${normalizedEmail}`;

    const [otpTtl, cooldownTtl] = await Promise.all([
      redisClient.ttl(otpKey),
      redisClient.ttl(cooldownKey),
    ]);

    return {
      hasActiveOtp: otpTtl > 0,
      expiresInSeconds: otpTtl > 0 ? otpTtl : 0,
      resendInSeconds: cooldownTtl > 0 ? cooldownTtl : 0,
    };
  }

  /**
   * Generates a 10-minute reset token stored in Redis after OTP validation.
   *
   * @param {string} userId
   * @returns {Promise<string>} rawResetToken
   */
  async createPasswordResetToken(userId) {
    const rawResetToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = this.#hash(rawResetToken);
    const key = `reset-token:${tokenHash}`;

    await redisClient.set(key, String(userId), "EX", RESET_TOKEN_TTL_SECONDS);
    return rawResetToken;
  }

  /**
   * Validates a password reset token and returns the corresponding userId.
   * Consumes (deletes) the token immediately upon verification.
   *
   * @param {string} rawResetToken
   * @returns {Promise<string>} userId
   */
  async consumePasswordResetToken(rawResetToken) {
    if (!rawResetToken) {
      throw ApiError.badRequest("Reset token is required");
    }

    const tokenHash = this.#hash(rawResetToken.trim());
    const key = `reset-token:${tokenHash}`;

    const userId = await redisClient.get(key);
    if (!userId) {
      throw ApiError.badRequest(
        "Password reset token is invalid or has expired",
      );
    }

    await redisClient.del(key);
    return userId;
  }
}

module.exports = new OtpService();
