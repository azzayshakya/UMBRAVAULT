const express = require("express");
const router = express.Router();

const { authLimiter } = require("../middleware/rate.limiter");
const validateRequest = require("../middleware/validate.request.middleware");
const {
  authenticateAccessToken,
} = require("../middleware/auth/auth.middleware");
const {
  verifyRefreshToken,
} = require("../middleware/auth/refreshToken.middleware");
const checkTokenBlacklist = require("../middleware/auth/blackList.middleware");
const checkUserBlockedStatus = require("../middleware/auth/blockCheck.middleware");
const authorizeRoles = require("../middleware/rbac.middleware");
const { signupSchema, loginSchema } = require("../validator/auth.validate");

const authController = require("../controllers/auth.controller");

// ── Public Authentication Routes ──────────────────────────────────────
router.post(
  "/signup",
  // authLimiter,
  validateRequest(signupSchema),
  authController.signup,
);

router.post(
  "/login",
  // authLimiter,
  validateRequest(loginSchema),
  authController.login,
);

router.post(
  "/refresh-token",
  // authLimiter,
  verifyRefreshToken,
  authController.refreshToken,
);

// ── Authenticated User Profile Routes ─────────────────────────────────
// Both use authenticateAccessToken so only the token owner's id (req.user.id) is used
router.get(
  "/profile",
  authenticateAccessToken,
  checkTokenBlacklist,
  checkUserBlockedStatus,
  authController.getMyProfile,
);

router.put(
  "/profile",
  authenticateAccessToken,
  checkTokenBlacklist,
  checkUserBlockedStatus,
  authController.updateMyProfile,
);

// Retained for backward-compatibility with session verification
router.get(
  "/my-session",
  authenticateAccessToken,
  checkTokenBlacklist,
  checkUserBlockedStatus,
  authController.getMyProfile,
);

// ── Logout Routes ─────────────────────────────────────────────────────
router.post(
  "/logout",
  authenticateAccessToken,
  checkTokenBlacklist,
  authController.logout,
);

router.post(
  "/logout-all",
  authenticateAccessToken,
  checkTokenBlacklist,
  checkUserBlockedStatus,
  authController.logoutAllSessions,
);

// ── Administrative Routes ─────────────────────────────────────────────
router.post(
  "/admin/users/:id/block",
  authenticateAccessToken,
  checkTokenBlacklist,
  checkUserBlockedStatus,
  authorizeRoles("admin", "superadmin"),
  authController.blockUser,
);

router.delete(
  "/admin/sessions/:sessionId",
  authenticateAccessToken,
  checkTokenBlacklist,
  checkUserBlockedStatus,
  authorizeRoles("admin", "superadmin"),
  authController.terminateSession,
);

module.exports = router;
