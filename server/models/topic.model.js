const mongoose = require("mongoose");

const topicSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    icon: {
      type: String,
      default: "folder",
    },
    color: {
      type: String,
      default: "#4f46e5",
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

// Speeds up "list my topics" and prevents duplicate topic names per user
topicSchema.index({ createdBy: 1, name: 1 });

module.exports = mongoose.model("Topic", topicSchema);
