const userModel = require("../models/user.model");
const ApiError = require("../utils/apiError");
const ApiResponse = require("../utils/apiResponse");
const logger = require("../utils/logger");

const VALID_ROLES = ["user", "admin", "superadmin"];

function toSafeUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    username: user.username,
  };
}
const getAllUsers = async (req, res) => {
  const users = await userModel.find().select("-password");

  return res
    .status(200)
    .json(
      ApiResponse(
        200,
        { users, count: users.length },
        "Users fetched successfully",
      ),
    );
};

const updateUserRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!role || !VALID_ROLES.includes(role)) {
    throw ApiError.badRequest(
      `Invalid role. Must be one of: ${VALID_ROLES.join(", ")}`,
    );
  }

  const targetUser = await userModel.findById(id);
  if (!targetUser) throw ApiError.notFound("User not found");

  // if (String(targetUser._id) === String(req.user.id)) {
  //   throw ApiError.forbidden("You cannot change your own role");
  // }

  if (targetUser.role === role) {
    throw ApiError.badRequest(`User already has the role "${role}"`);
  }

  const previousRole = targetUser.role;
  targetUser.role = role;
  await targetUser.save();

  logger.warn(
    `Role change: user ${targetUser._id} (${previousRole} → ${role}) by superadmin ${req.user.id}`,
  );

  return res
    .status(200)
    .json(
      ApiResponse(
        200,
        { user: toSafeUser(targetUser) },
        "User role updated successfully",
      ),
    );
};

module.exports = {
  getAllUsers,
  updateUserRole,
};
