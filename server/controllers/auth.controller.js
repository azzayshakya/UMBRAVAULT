const jwt = require("jsonwebtoken");

const User = require("../models/user.model");
const PasswordHistory = require("../models/passwordHistory.model");
const { generateTokenPair } = require("../utils/tokenUtils/tokenSigner");
const tokenService = require("../services/token.service");
const otpService = require("../services/otp.service");
const passwordService = require("../services/password.service");
const { sendMail } = require("../services/mail.service");
const mailTemplates = require("../utils/mailTemplates/mail.templates");
const ApiError = require("../utils/apiError");
const ApiResponse = require("../utils/apiResponse");
const logger = require("../utils/logger");
const generateUniqueUsername = require("../utils/generateUniqueUsername");

const refreshCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 30 * 24 * 60 * 60 * 1000,
  path: "/",
};

const deviceCookieOptions = {
  ...refreshCookieOptions,
  httpOnly: false,
};

function sendTokens(res, { accessToken, refreshToken, deviceId }) {
  res.cookie("refreshToken", refreshToken, refreshCookieOptions);
  res.cookie("deviceId", deviceId, deviceCookieOptions);
  return { accessToken, refreshToken };
}

function toProfileUser(user) {
  console.log(user);
  return {
    _id: user._id,
    id: user._id,
    name: user.name,
    email: user.email,
    username: user.username,
    role: user.role,
    isEmailVerified: user.isEmailVerified || false,
    emailVerifiedAt: user.emailVerifiedAt || null,
    avatar: user.avatar || "/images/global/my-profile.jpg",
    phone: user.phone || "",
    bio: user.bio || "",
    interests: user.interests || [],
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

function getAccessTokenTtlSeconds(req) {
  const rawToken =
    req.headers.authorization?.split(" ")[1] || req.cookies?.accessToken;
  const decoded = jwt.decode(rawToken);
  return decoded?.exp ? decoded.exp - Math.floor(Date.now() / 1000) : 900;
}

const signup = async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw ApiError.conflict("An account with this email already exists");
  }

  const username = await generateUniqueUsername();
  const user = await User.create({
    name,
    email,
    password,
    username,
    role: "user",
    isEmailVerified: false,
  });

  // Initial password history record
  await PasswordHistory.create({
    userId: user._id,
    passwordHash: user.password,
    method: "initial",
    ip: req.ip,
    userAgent: req.headers["user-agent"] || "",
  });

  // Generate and send initial verification email in background
  try {
    const { rawOtp, expiresInSeconds } = await otpService.generateAndSaveOtp({
      email: user.email,
      purpose: "verify-email",
    });

    const template = mailTemplates.otpEmail({
      code: rawOtp,
      purpose: "verify-email",
      expiresInMinutes: Math.floor(expiresInSeconds / 60),
    });

    sendMail({ to: user.email, ...template }).catch((err) =>
      logger.error(`Signup mail dispatch failed: ${err.message}`),
    );
  } catch (err) {
    logger.warn(`Could not dispatch signup OTP: ${err.message}`);
  }

  const deviceId = req.body.deviceId || `device_${Date.now()}`;
  const tokens = await generateTokenPair(user, deviceId);
  const { accessToken, refreshToken } = sendTokens(res, tokens);

  logger.info(`New signup: ${user.email}`);
  return res
    .status(201)
    .json(
      ApiResponse(
        201,
        { user: toProfileUser(user), deviceId, accessToken, refreshToken },
        "Account created successfully. Verification code sent.",
      ),
    );
};

const login = async (req, res) => {
  const { email, password, deviceId } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user) throw ApiError.unauthorized("Invalid email or password");

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw ApiError.unauthorized("Invalid email or password");

  const isBlocked =
    (await tokenService.isUserBlocked(user._id)) || user.isBlocked;
  if (isBlocked) throw ApiError.forbidden("Your account has been blocked");

  const finalDeviceId = deviceId || `device_${Date.now()}`;
  const tokens = await generateTokenPair(user, finalDeviceId);
  const { accessToken, refreshToken } = sendTokens(res, tokens);

  logger.info(`Login: ${user.email} (device: ${finalDeviceId})`);
  return res.status(200).json(
    ApiResponse(
      200,
      {
        user: toProfileUser(user),
        accessToken,
        refreshToken,
        deviceId: finalDeviceId,
      },
      "Logged in successfully",
    ),
  );
};

const refreshToken = async (req, res) => {
  const { userId, deviceId } = req.refreshPayload;

  const user = await User.findById(userId);
  if (!user) throw ApiError.unauthorized("User no longer exists");

  const isBlocked = await tokenService.isUserBlocked(user._id);
  if (isBlocked) throw ApiError.forbidden("Your account has been blocked");

  const tokens = await generateTokenPair(user, deviceId);
  const { accessToken, refreshToken } = sendTokens(res, tokens);

  return res
    .status(200)
    .json(
      ApiResponse(
        200,
        { user: toProfileUser(user), accessToken, refreshToken, deviceId },
        "Token refreshed",
      ),
    );
};

// GET /api/v1/auth/profile - Fetches strictly the authenticated caller's profile
const getMyProfile = async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) throw ApiError.notFound("User not found");

  return res
    .status(200)
    .json(
      ApiResponse(
        200,
        { user: toProfileUser(user) },
        "Profile fetched successfully",
      ),
    );
};

// PUT or PATCH /api/v1/auth/profile - Updates strictly the authenticated caller's profile
const updateMyProfile = async (req, res) => {
  const { name, phone, bio, interests, avatar } = req.body;

  const updatePayload = {};
  if (name !== undefined) updatePayload.name = name.trim();
  if (phone !== undefined) updatePayload.phone = phone.trim();
  if (bio !== undefined) updatePayload.bio = bio.trim();
  if (interests !== undefined && Array.isArray(interests)) {
    updatePayload.interests = interests
      .map((item) => String(item).trim())
      .filter(Boolean);
  }
  if (avatar !== undefined) updatePayload.avatar = avatar.trim();

  const user = await User.findByIdAndUpdate(req.user.id, updatePayload, {
    new: true,
    runValidators: true,
  });

  if (!user) throw ApiError.notFound("User not found");

  logger.info(`Profile updated for user: ${user._id}`);
  return res
    .status(200)
    .json(
      ApiResponse(200, toProfileUser(user), "Profile updated successfully"),
    );
};

// ── OTP & Email Verification ──────────────────────────────────────────

const requestOtp = async (req, res) => {
  const { email, purpose } = req.body;
  const user = await User.findOne({ email });

  // Prevent account enumeration: generic response if account does not exist
  if (!user && purpose === "forgot-password") {
    return res
      .status(200)
      .json(
        ApiResponse(
          200,
          { expiresInSeconds: 300, resendInSeconds: 60 },
          "If this email exists, a code was sent.",
        ),
      );
  }

  // Idempotency: skip re-issuing if already verified
  if (purpose === "verify-email" && user?.isEmailVerified) {
    return res
      .status(200)
      .json(ApiResponse(200, null, "Email is already verified."));
  }

  const { rawOtp, expiresInSeconds, resendInSeconds } =
    await otpService.generateAndSaveOtp({ email, purpose });

  const template = mailTemplates.otpEmail({
    code: rawOtp,
    purpose,
    expiresInMinutes: Math.floor(expiresInSeconds / 60),
  });

  await sendMail({ to: email, ...template });

  return res
    .status(200)
    .json(
      ApiResponse(
        200,
        { expiresInSeconds, resendInSeconds },
        "Code sent successfully",
      ),
    );
};

const getOtpStatus = async (req, res) => {
  const { email, purpose } = req.query;
  const status = await otpService.getOtpStatus({ email, purpose });
  return res.status(200).json(ApiResponse(200, status, "OTP status retrieved"));
};

const verifyEmail = async (req, res) => {
  const { email, code } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw ApiError.notFound("User not found");

  // Idempotent success response
  if (user.isEmailVerified) {
    return res
      .status(200)
      .json(
        ApiResponse(
          200,
          { user: toProfileUser(user) },
          "Email is already verified.",
        ),
      );
  }

  await otpService.verifyOtp({
    email,
    purpose: "verify-email",
    rawOtp: code,
  });

  user.isEmailVerified = true;
  user.emailVerifiedAt = new Date();
  await user.save();

  logger.info(`Email verified: ${user.email}`);
  return res
    .status(200)
    .json(
      ApiResponse(
        200,
        { user: toProfileUser(user) },
        "Email verified successfully",
      ),
    );
};

// ── Forgot Password ───────────────────────────────────────────────────

const verifyForgotPasswordOtp = async (req, res) => {
  const { email, code } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw ApiError.badRequest("Invalid code or request expired");

  await otpService.verifyOtp({
    email,
    purpose: "forgot-password",
    rawOtp: code,
  });

  const resetToken = await otpService.createPasswordResetToken(user._id);

  return res
    .status(200)
    .json(ApiResponse(200, { resetToken }, "Code verified successfully"));
};

const resetPassword = async (req, res) => {
  const { resetToken, newPassword } = req.body;

  const userId = await otpService.consumePasswordResetToken(resetToken);
  const user = await User.findById(userId).select("+password");
  if (!user) throw ApiError.notFound("User not found");

  await passwordService.recordPasswordChange({
    user,
    newPlainPassword: newPassword,
    method: "email_reset",
    ip: req.ip,
    userAgent: req.headers["user-agent"] || "",
  });

  const mailData = mailTemplates.passwordChangedEmail({
    changedAt: new Date(),
    ip: req.ip,
    userAgent: req.headers["user-agent"] || "",
  });
  sendMail({ to: user.email, ...mailData }).catch(() => {});

  // Clear cookies as all sessions are revoked
  res.clearCookie("refreshToken", { path: refreshCookieOptions.path });
  res.clearCookie("deviceId", { path: refreshCookieOptions.path });

  logger.info(`Password reset completed for: ${user.email}`);
  return res
    .status(200)
    .json(
      ApiResponse(
        200,
        null,
        "Password reset successfully. Please log in again with your new credentials.",
      ),
    );
};

// ── Change Password ───────────────────────────────────────────────────

const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const deviceId = req.cookies?.deviceId || req.body?.deviceId;

  const user = await User.findById(req.user.id).select("+password");
  if (!user) throw ApiError.notFound("User not found");

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) throw ApiError.badRequest("Current password is incorrect");

  await passwordService.recordPasswordChange({
    user,
    newPlainPassword: newPassword,
    method: "direct_change",
    ip: req.ip,
    userAgent: req.headers["user-agent"] || "",
    currentDeviceId: deviceId,
  });

  const mailData = mailTemplates.passwordChangedEmail({
    changedAt: new Date(),
    ip: req.ip,
    userAgent: req.headers["user-agent"] || "",
  });
  sendMail({ to: user.email, ...mailData }).catch(() => {});

  logger.info(`Password changed directly for user: ${user._id}`);
  return res
    .status(200)
    .json(ApiResponse(200, null, "Password updated successfully"));
};

const logout = async (req, res) => {
  const { id, jti } = req.user;
  const deviceId = req.cookies?.deviceId || req.body?.deviceId || "default";

  const ttlSeconds = getAccessTokenTtlSeconds(req);
  await tokenService.blacklistAccessToken(jti, ttlSeconds);

  await tokenService.revokeSession(id, deviceId);

  res.clearCookie("refreshToken", { path: refreshCookieOptions.path });
  res.clearCookie("deviceId", { path: refreshCookieOptions.path });

  logger.info(`Logout: user ${id} (device: ${deviceId})`);
  return res
    .status(200)
    .json(ApiResponse(200, null, "Logged out successfully"));
};

const logoutAllSessions = async (req, res) => {
  const { id, jti } = req.user;

  const ttlSeconds = getAccessTokenTtlSeconds(req);
  await tokenService.blacklistAccessToken(jti, ttlSeconds);

  const revokedCount = await tokenService.revokeAllSessions(id);

  res.clearCookie("refreshToken", { path: refreshCookieOptions.path });
  res.clearCookie("deviceId", { path: refreshCookieOptions.path });

  logger.info(`Logout-all: user ${id}, ${revokedCount} session(s) terminated`);
  return res
    .status(200)
    .json(ApiResponse(200, null, "Logged out from all devices"));
};

const blockUser = async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id);
  if (!user) throw ApiError.notFound("User not found");
  if (user.role === "admin" || user.role === "superadmin") {
    throw ApiError.forbidden("Cannot block an admin account");
  }

  await tokenService.blockUserAndRevokeSessions(id);
  user.isBlocked = true;
  await user.save();

  logger.warn(`User ${id} blocked by admin ${req.user.id}`);
  return res
    .status(200)
    .json(ApiResponse(200, null, "User blocked successfully"));
};

const terminateSession = async (req, res) => {
  const { sessionId } = req.params;
  const { userId } = req.query;

  if (!userId) throw ApiError.badRequest("userId query param is required");

  const wasRevoked = await tokenService.revokeSession(userId, sessionId);
  if (!wasRevoked) {
    throw ApiError.notFound("Session not found or already expired");
  }

  logger.warn(
    `Session ${sessionId} for user ${userId} terminated by admin ${req.user.id}`,
  );
  return res
    .status(200)
    .json(ApiResponse(200, null, "Session terminated successfully"));
};

module.exports = {
  signup,
  login,
  refreshToken,
  getMyProfile,
  updateMyProfile,
  requestOtp,
  getOtpStatus,
  verifyEmail,
  verifyForgotPasswordOtp,
  resetPassword,
  changePassword,
  logout,
  logoutAllSessions,
  blockUser,
  terminateSession,
};
