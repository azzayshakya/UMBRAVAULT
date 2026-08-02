const express = require("express");
const router = express.Router();

const authorizeRoles = require("../middleware/rbac.middleware");
const {
  authenticateAccessToken,
} = require("../middleware/auth/auth.middleware");

const {
  getAllTasks,
  getTaskStats,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  addSubtask,
  updateSubtask,
  deleteSubtask,
  getTaskActivity,
} = require("../controllers/task.controller");

// Stats first — must not be shadowed by "/:id"
router.get("/stats", authenticateAccessToken, getTaskStats);

router.get("/", authenticateAccessToken, getAllTasks);
router.post("/", authenticateAccessToken, createTask);

router.get("/:id", authenticateAccessToken, getTaskById);
router.patch("/:id", authenticateAccessToken, updateTask);
router.delete(
  "/:id",
  authenticateAccessToken,
  authorizeRoles("admin", "superadmin"),
  deleteTask,
);

router.get("/:id/activity", authenticateAccessToken, getTaskActivity);

router.post("/:id/subtasks", authenticateAccessToken, addSubtask);
router.patch(
  "/:id/subtasks/:subtaskId",
  authenticateAccessToken,
  updateSubtask,
);
router.delete(
  "/:id/subtasks/:subtaskId",
  authenticateAccessToken,
  deleteSubtask,
);

module.exports = router;
