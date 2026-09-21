const mongoose = require("mongoose");

const passwordHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    method: {
      type: String,
      enum: ["initial", "direct_change", "email_reset"],
      required: true,
    },
    ip: {
      type: String,
      default: "",
    },
    userAgent: {
      type: String,
      default: "",
    },
    changedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: false },
);

module.exports = mongoose.model("PasswordHistory", passwordHistorySchema);
