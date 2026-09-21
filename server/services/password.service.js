const bcrypt = require("bcrypt");
const PasswordHistory = require("../models/passwordHistory.model");
const tokenService = require("./token.service");
const ApiError = require("../utils/apiError");

const PASSWORD_HISTORY_LIMIT = 3;

class PasswordService {
  /**
   * Checks if candidate password matches any of the last N passwords used.
   */
  async checkPasswordReuse(userId, newPlainPassword) {
    const histories = await PasswordHistory.find({ userId })
      .sort({ changedAt: -1 })
      .limit(PASSWORD_HISTORY_LIMIT);

    for (const record of histories) {
      const isMatch = await bcrypt.compare(
        newPlainPassword,
        record.passwordHash,
      );
      if (isMatch) {
        throw ApiError.badRequest(
          `You cannot reuse any of your last ${PASSWORD_HISTORY_LIMIT} passwords.`,
        );
      }
    }
  }

  /**
   * Updates user password, writes to history, and cleans up sessions.
   */
  async recordPasswordChange({
    user,
    newPlainPassword,
    method,
    ip,
    userAgent,
    currentDeviceId = null,
  }) {
    await this.checkPasswordReuse(user._id, newPlainPassword);

    user.password = newPlainPassword; // Pre-save hook hashes this
    await user.save();

    // Write audit record with the resulting hash
    await PasswordHistory.create({
      userId: user._id,
      passwordHash: user.password,
      method,
      ip,
      userAgent,
      changedAt: new Date(),
    });

    // Session revocation handling
    if (method === "direct_change" && currentDeviceId) {
      // Keeps current device session, revokes others
      await tokenService.revokeAllSessionsExcept(user._id, currentDeviceId);
    } else {
      // Reset via email revokes all active sessions everywhere
      await tokenService.revokeAllSessions(user._id);
    }
  }
}

module.exports = new PasswordService();
