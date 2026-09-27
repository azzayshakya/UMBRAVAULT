const mongoose = require("mongoose");

const {
  TASK_STATUS_VALUES,
  TASK_PRIORITY_VALUES,
  ACTIVITY_ACTION_VALUES,
  TASK_STATUS,
  TASK_PRIORITY,
} = require("../utils/task.constants");

const subtaskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    isDone: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const activityLogSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      enum: ACTIVITY_ACTION_VALUES,
      required: true,
    },
    message: { type: String, required: true, trim: true },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: "" },

    project: { type: String, trim: true, default: "" },
    tags: [{ type: String, trim: true }],

    status: {
      type: String,
      enum: TASK_STATUS_VALUES,
      default: TASK_STATUS.BACKLOG,
    },
    priority: {
      type: String,
      enum: TASK_PRIORITY_VALUES,
      default: TASK_PRIORITY.MEDIUM,
    },

    dueDate: { type: Date, default: null },

    subtasks: [subtaskSchema],
    activityLog: [activityLogSchema],

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

// Filters/sorts the table view runs on most
taskSchema.index({ status: 1 });
taskSchema.index({ priority: 1 });
taskSchema.index({ project: 1 });
taskSchema.index({ dueDate: 1 });
taskSchema.index({ title: "text", description: "text" });

// Virtual: is this task past its due date and still open
taskSchema.virtual("isOverdue").get(function () {
  return (
    !!this.dueDate &&
    this.dueDate.getTime() < Date.now() &&
    this.status !== TASK_STATUS.DONE
  );
});

taskSchema.set("toJSON", { virtuals: true });
taskSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Task", taskSchema);
