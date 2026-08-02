const Task = require("../models/task.model");
const ApiError = require("../utils/apiError");
const ApiResponse = require("../utils/apiResponse");
const asyncHandler = require("../utils/asyncHandler");
const logger = require("../utils/logger");

const {
  TASK_STATUS,
  TASK_PRIORITY,
  TASK_STATUS_VALUES,
  TASK_PRIORITY_VALUES,
  ACTIVITY_ACTION,
} = require("../utils/task.constants");

const UPDATABLE_FIELDS = [
  "title",
  "description",
  "project",
  "tags",
  "status",
  "priority",
  "dueDate",
];

// ── internal helper ──────────────────────────────────────────────────
function logActivity(task, action, message, userId) {
  task.activityLog.push({ action, message, performedBy: userId });
}

function assertValidStatus(status) {
  if (status && !TASK_STATUS_VALUES.includes(status)) {
    throw ApiError.badRequest(
      `Invalid status. Allowed values: ${TASK_STATUS_VALUES.join(", ")}`,
    );
  }
}

function assertValidPriority(priority) {
  if (priority && !TASK_PRIORITY_VALUES.includes(priority)) {
    throw ApiError.badRequest(
      `Invalid priority. Allowed values: ${TASK_PRIORITY_VALUES.join(", ")}`,
    );
  }
}

// ── GET /tasks ────────────────────────────────────────────────────────
const getAllTasks = asyncHandler(async (req, res) => {
  const {
    status,
    priority,
    project,
    tags,
    search,
    createdFrom,
    createdTo,
    dueFrom,
    dueTo,
    page = 1,
    limit = 10,
    sortBy = "updatedAt",
    sortOrder = "desc",
  } = req.query;

  assertValidStatus(status);
  assertValidPriority(priority);

  const filter = {};

  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (project) filter.project = project;

  if (tags) {
    filter.tags = { $in: tags.split(",").map((t) => t.trim()) };
  }

  if (createdFrom || createdTo) {
    filter.createdAt = {};
    if (createdFrom) filter.createdAt.$gte = new Date(createdFrom);
    if (createdTo) filter.createdAt.$lte = new Date(createdTo);
  }

  if (dueFrom || dueTo) {
    filter.dueDate = {};
    if (dueFrom) filter.dueDate.$gte = new Date(dueFrom);
    if (dueTo) filter.dueDate.$lte = new Date(dueTo);
  }

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { tags: { $regex: search, $options: "i" } },
    ];
  }

  const pageNum = Math.max(parseInt(page, 10) || 1, 1);
  const limitNum = Math.max(parseInt(limit, 10) || 10, 1);
  const skip = (pageNum - 1) * limitNum;

  const allowedSortFields = [
    "createdAt",
    "updatedAt",
    "dueDate",
    "priority",
    "status",
  ];
  const sortField = allowedSortFields.includes(sortBy) ? sortBy : "updatedAt";
  const sort = { [sortField]: sortOrder === "asc" ? 1 : -1 };

  const [tasks, total] = await Promise.all([
    Task.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .populate("createdBy", "name email username"),
    Task.countDocuments(filter),
  ]);

  return res.status(200).json(
    ApiResponse(
      200,
      {
        tasks,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum),
        },
      },
      "Tasks fetched successfully",
    ),
  );
});

// ── GET /tasks/stats ──────────────────────────────────────────────────
const getTaskStats = asyncHandler(async (req, res) => {
  const now = new Date();

  const [total, statusCounts, overdue] = await Promise.all([
    Task.countDocuments({}),
    Task.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
    Task.countDocuments({
      dueDate: { $lt: now },
      status: { $ne: TASK_STATUS.DONE },
    }),
  ]);

  const byStatus = TASK_STATUS_VALUES.reduce((acc, status) => {
    acc[status] = 0;
    return acc;
  }, {});
  statusCounts.forEach(({ _id, count }) => {
    if (_id) byStatus[_id] = count;
  });

  return res.status(200).json(
    ApiResponse(
      200,
      {
        total,
        inProgress: byStatus[TASK_STATUS.IN_PROGRESS],
        blocked: byStatus[TASK_STATUS.BLOCKED],
        done: byStatus[TASK_STATUS.DONE],
        overdue,
        byStatus,
      },
      "Task stats fetched successfully",
    ),
  );
});

// ── GET /tasks/:id ────────────────────────────────────────────────────
const getTaskById = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id)
    .populate("createdBy", "name email username")
    .populate("activityLog.performedBy", "name email username");

  if (!task) throw ApiError.notFound("Task not found");

  return res
    .status(200)
    .json(ApiResponse(200, { task }, "Task fetched successfully"));
});

// ── POST /tasks ───────────────────────────────────────────────────────
const createTask = asyncHandler(async (req, res) => {
  const { title, description, project, tags, status, priority, dueDate } =
    req.body;

  if (!title) throw ApiError.badRequest("Title is required");
  assertValidStatus(status);
  assertValidPriority(priority);

  const task = await Task.create({
    title,
    description,
    project,
    tags,
    status: status || TASK_STATUS.BACKLOG,
    priority: priority || TASK_PRIORITY.MEDIUM,
    dueDate,
    createdBy: req.user.id,
  });

  logActivity(task, ACTIVITY_ACTION.TASK_CREATED, "Task created", req.user.id);
  await task.save();

  logger.info(`Task created: ${task._id} by ${req.user.id}`);
  return res
    .status(201)
    .json(ApiResponse(201, { task }, "Task created successfully"));
});

// ── PATCH /tasks/:id ──────────────────────────────────────────────────
const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) throw ApiError.notFound("Task not found");

  const { status, priority, dueDate } = req.body;
  assertValidStatus(status);
  assertValidPriority(priority);

  if (status && status !== task.status) {
    logActivity(
      task,
      ACTIVITY_ACTION.STATUS_CHANGED,
      `Status changed: ${task.status} -> ${status}`,
      req.user.id,
    );
  }

  if (priority && priority !== task.priority) {
    logActivity(
      task,
      ACTIVITY_ACTION.PRIORITY_CHANGED,
      `Priority changed: ${task.priority} -> ${priority}`,
      req.user.id,
    );
  }

  if (dueDate && new Date(dueDate).getTime() !== task.dueDate?.getTime()) {
    logActivity(
      task,
      ACTIVITY_ACTION.DUE_DATE_CHANGED,
      `Due date updated to ${new Date(dueDate).toDateString()}`,
      req.user.id,
    );
  }

  UPDATABLE_FIELDS.forEach((field) => {
    if (req.body[field] !== undefined) task[field] = req.body[field];
  });

  await task.save();

  logger.info(`Task updated: ${task._id} by ${req.user.id}`);
  return res
    .status(200)
    .json(ApiResponse(200, { task }, "Task updated successfully"));
});

// ── DELETE /tasks/:id ─────────────────────────────────────────────────
const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findByIdAndDelete(req.params.id);
  if (!task) throw ApiError.notFound("Task not found");

  logger.warn(`Task deleted: ${req.params.id} by ${req.user.id}`);
  return res
    .status(200)
    .json(ApiResponse(200, null, "Task deleted successfully"));
});

// ── POST /tasks/:id/subtasks ──────────────────────────────────────────
const addSubtask = asyncHandler(async (req, res) => {
  const { title } = req.body;
  if (!title) throw ApiError.badRequest("Subtask title is required");

  const task = await Task.findById(req.params.id);
  if (!task) throw ApiError.notFound("Task not found");

  task.subtasks.push({ title });
  logActivity(
    task,
    ACTIVITY_ACTION.SUBTASK_ADDED,
    `Subtask added: "${title}"`,
    req.user.id,
  );

  await task.save();
  return res
    .status(201)
    .json(ApiResponse(201, { task }, "Subtask added successfully"));
});

// ── PATCH /tasks/:id/subtasks/:subtaskId ──────────────────────────────
const updateSubtask = asyncHandler(async (req, res) => {
  const { id, subtaskId } = req.params;
  const { title, isDone } = req.body;

  const task = await Task.findById(id);
  if (!task) throw ApiError.notFound("Task not found");

  const subtask = task.subtasks.id(subtaskId);
  if (!subtask) throw ApiError.notFound("Subtask not found");

  if (title !== undefined) subtask.title = title;
  if (isDone !== undefined) subtask.isDone = isDone;

  logActivity(
    task,
    ACTIVITY_ACTION.SUBTASK_UPDATED,
    `Subtask "${subtask.title}" updated`,
    req.user.id,
  );

  await task.save();
  return res
    .status(200)
    .json(ApiResponse(200, { task }, "Subtask updated successfully"));
});

// ── DELETE /tasks/:id/subtasks/:subtaskId ─────────────────────────────
const deleteSubtask = asyncHandler(async (req, res) => {
  const { id, subtaskId } = req.params;

  const task = await Task.findById(id);
  if (!task) throw ApiError.notFound("Task not found");

  const subtask = task.subtasks.id(subtaskId);
  if (!subtask) throw ApiError.notFound("Subtask not found");

  const subtaskTitle = subtask.title;
  subtask.deleteOne();

  logActivity(
    task,
    ACTIVITY_ACTION.SUBTASK_DELETED,
    `Subtask deleted: "${subtaskTitle}"`,
    req.user.id,
  );

  await task.save();
  return res
    .status(200)
    .json(ApiResponse(200, { task }, "Subtask deleted successfully"));
});

// ── GET /tasks/:id/activity ────────────────────────────────────────────
const getTaskActivity = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id)
    .select("activityLog")
    .populate("activityLog.performedBy", "name email username");

  if (!task) throw ApiError.notFound("Task not found");

  const activity = [...task.activityLog].sort(
    (a, b) => b.createdAt - a.createdAt,
  );

  return res
    .status(200)
    .json(ApiResponse(200, { activity }, "Activity log fetched successfully"));
});

module.exports = {
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
};
