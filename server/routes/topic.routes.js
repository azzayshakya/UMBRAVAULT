const express = require("express");
const router = express.Router();

const {
  authenticateAccessToken,
} = require("../middleware/auth/auth.middleware");

const {
  getAllTopics,
  getTopicStats,
  getTopicById,
  createTopic,
  updateTopic,
  deleteTopic,
} = require("../controllers/topic.controller");

const { getNotesByTopic } = require("../controllers/note.controller");

// Stats first — must not be shadowed by "/:id"
router.get("/stats", authenticateAccessToken, getTopicStats);

router.get("/", authenticateAccessToken, getAllTopics);
router.post("/", authenticateAccessToken, createTopic);

router.get("/:id", authenticateAccessToken, getTopicById);
router.patch("/:id", authenticateAccessToken, updateTopic);
router.delete("/:id", authenticateAccessToken, deleteTopic);

// Notes scoped under their topic
router.get("/:topicId/notes", authenticateAccessToken, getNotesByTopic);

module.exports = router;
