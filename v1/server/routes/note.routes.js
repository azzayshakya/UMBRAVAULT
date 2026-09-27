const express = require("express");
const router = express.Router();

const {
  authenticateAccessToken,
} = require("../middleware/auth/auth.middleware");

const {
  getNoteChildren,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
  searchNotes,
} = require("../controllers/note.controller");

router.get("/search", authenticateAccessToken, searchNotes);

router.post("/", authenticateAccessToken, createNote);

router.get("/:id", authenticateAccessToken, getNoteById);
router.patch("/:id", authenticateAccessToken, updateNote);
router.delete("/:id", authenticateAccessToken, deleteNote);

router.get("/:id/children", authenticateAccessToken, getNoteChildren);

module.exports = router;
