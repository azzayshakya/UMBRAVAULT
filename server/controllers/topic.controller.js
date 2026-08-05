const mongoose = require("mongoose");
const Topic = require("../models/topic.model");
const Note = require("../models/note.model");
const ApiError = require("../utils/apiError");
const ApiResponse = require("../utils/apiResponse");
const logger = require("../utils/logger");

const UPDATABLE_FIELDS = ["name", "description", "icon", "color"];

// ── internal helper ──────────────────────────────────────────────────
function assertOwnership(doc, userId, resourceName = "Resource") {
  if (doc.createdBy.toString() !== userId.toString()) {
    throw ApiError.forbidden(`You do not have access to this ${resourceName}`);
  }
}

// ── GET /topics ───────────────────────────────────────────────────────
// Returns only topics created by the logged-in user, with a live note count per topic
const getAllTopics = async (req, res) => {
  const {
    search,
    page = 1,
    limit = 20,
    sortBy = "updatedAt",
    sortOrder = "desc",
  } = req.query;

  const filter = { createdBy: req.user.id };
  if (search) {
    filter.name = { $regex: search, $options: "i" };
  }

  const pageNum = Math.max(parseInt(page, 10) || 1, 1);
  const limitNum = Math.max(parseInt(limit, 10) || 20, 1);
  const skip = (pageNum - 1) * limitNum;

  const allowedSortFields = ["createdAt", "updatedAt", "name"];
  const sortField = allowedSortFields.includes(sortBy) ? sortBy : "updatedAt";
  const sort = { [sortField]: sortOrder === "asc" ? 1 : -1 };

  const [topics, total] = await Promise.all([
    Topic.find(filter).sort(sort).skip(skip).limit(limitNum),
    Topic.countDocuments(filter),
  ]);

  // Note counts fetched in one grouped query rather than N queries per topic
  const topicIds = topics.map((topic) => topic._id);
  const userId = new mongoose.Types.ObjectId(req.user.id);

  const noteCounts = await Note.aggregate([
    { $match: { createdBy: userId, topic: { $in: topicIds } } },
    { $group: { _id: "$topic", count: { $sum: 1 } } },
  ]);

  const countByTopicId = noteCounts.reduce((acc, entry) => {
    acc[entry._id.toString()] = entry.count;
    return acc;
  }, {});

  const topicsWithCounts = topics.map((topic) => ({
    ...topic.toObject(),
    noteCount: countByTopicId[topic._id.toString()] || 0,
  }));

  return res.status(200).json(
    ApiResponse(
      200,
      {
        topics: topicsWithCounts,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum),
        },
      },
      "Topics fetched successfully",
    ),
  );
};

// ── GET /topics/stats ─────────────────────────────────────────────────
// Powers the "Total Topics / Total Notes / Total Tags / Last Updated" dashboard cards
const getTopicStats = async (req, res) => {
  const userId = new mongoose.Types.ObjectId(req.user.id);

  const [totalTopics, totalNotes, tagResult, lastTopic, lastNote] =
    await Promise.all([
      Topic.countDocuments({ createdBy: req.user.id }),
      Note.countDocuments({ createdBy: req.user.id }),
      Note.aggregate([
        { $match: { createdBy: userId } },
        { $unwind: "$tags" },
        { $group: { _id: "$tags" } },
        { $count: "totalTags" },
      ]),
      Topic.findOne({ createdBy: req.user.id })
        .sort({ updatedAt: -1 })
        .select("updatedAt"),
      Note.findOne({ createdBy: req.user.id })
        .sort({ updatedAt: -1 })
        .select("updatedAt"),
    ]);

  const totalTags = tagResult[0]?.totalTags || 0;

  const candidates = [lastTopic?.updatedAt, lastNote?.updatedAt].filter(
    Boolean,
  );
  const lastUpdated = candidates.length
    ? new Date(Math.max(...candidates.map((date) => date.getTime())))
    : null;

  return res
    .status(200)
    .json(
      ApiResponse(
        200,
        { totalTopics, totalNotes, totalTags, lastUpdated },
        "Topic stats fetched successfully",
      ),
    );
};

// ── GET /topics/:id ───────────────────────────────────────────────────
const getTopicById = async (req, res) => {
  const topic = await Topic.findById(req.params.id);
  if (!topic) throw ApiError.notFound("Topic not found");

  assertOwnership(topic, req.user.id, "topic");

  return res
    .status(200)
    .json(ApiResponse(200, { topic }, "Topic fetched successfully"));
};

// ── POST /topics ──────────────────────────────────────────────────────
const createTopic = async (req, res) => {
  const { name, description, icon, color } = req.body;

  if (!name) throw ApiError.badRequest("Topic name is required");

  const topic = await Topic.create({
    name,
    description,
    icon,
    color,
    createdBy: req.user.id,
  });

  logger.info(`Topic created: ${topic._id} by ${req.user.id}`);
  return res
    .status(201)
    .json(ApiResponse(201, { topic }, "Topic created successfully"));
};

// ── PATCH /topics/:id ─────────────────────────────────────────────────
const updateTopic = async (req, res) => {
  const topic = await Topic.findById(req.params.id);
  if (!topic) throw ApiError.notFound("Topic not found");

  assertOwnership(topic, req.user.id, "topic");

  UPDATABLE_FIELDS.forEach((field) => {
    if (req.body[field] !== undefined) topic[field] = req.body[field];
  });

  await topic.save();

  logger.info(`Topic updated: ${topic._id} by ${req.user.id}`);
  return res
    .status(200)
    .json(ApiResponse(200, { topic }, "Topic updated successfully"));
};

// ── DELETE /topics/:id ────────────────────────────────────────────────
// Cascades: deleting a topic removes every note (and sub-note) that belongs to it
const deleteTopic = async (req, res) => {
  const topic = await Topic.findById(req.params.id);
  if (!topic) throw ApiError.notFound("Topic not found");

  assertOwnership(topic, req.user.id, "topic");

  await Note.deleteMany({ topic: topic._id, createdBy: req.user.id });
  await topic.deleteOne();

  logger.warn(
    `Topic deleted: ${req.params.id} (with all its notes) by ${req.user.id}`,
  );
  return res
    .status(200)
    .json(ApiResponse(200, null, "Topic and its notes deleted successfully"));
};

module.exports = {
  getAllTopics,
  getTopicStats,
  getTopicById,
  createTopic,
  updateTopic,
  deleteTopic,
};
