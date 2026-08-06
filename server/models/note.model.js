const mongoose = require("mongoose");
const { NOTE_TYPE_VALUES } = require("../utils/task.constants");

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      enum: NOTE_TYPE_VALUES,
      default: "theory",
    },
    tags: {
      type: [String],
      default: [],
    },
    topic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Topic",
      required: true,
      index: true,
    },
    // null → top-level note under a topic. Set → this is a sub-note of another note.
    parentNote: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Note",
      default: null,
      index: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  { timestamps: true },
);

// Speeds up "top-level notes of a topic for this user" and "children of a note"
noteSchema.index({ createdBy: 1, topic: 1, parentNote: 1 });

// Powers the search bar (title, content, tags)
noteSchema.index({ title: "text", content: "text", tags: "text" });

module.exports = mongoose.model("Note", noteSchema);
