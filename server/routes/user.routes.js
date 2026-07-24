const express = require("express");
const router = express.Router();

const authorizeRoles = require("../middleware/rbac.middleware");

const {
  authenticateAccessToken,
} = require("../middleware/auth/auth.middleware");
const {
  getAllUsers,
  updateUserRole,
} = require("../controllers/user.controller");

router.get("/all-users", authenticateAccessToken, getAllUsers);
router.patch(
  "/update-role/:id",
  authenticateAccessToken,
  authorizeRoles("superadmin"),
  updateUserRole,
);

module.exports = router;
