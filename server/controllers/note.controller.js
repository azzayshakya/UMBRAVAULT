const Note = require("../models/note.model");
const Topic = require("../models/topic.model");
const ApiError = require("../utils/apiError");
const ApiResponse = require("../utils/apiResponse");
const logger = require("../utils/logger");
const { NOTE_TYPE_VALUES } = require("../utils/note.constant");

const UPDATABLE_FIELDS = ["title", "content", "type", "tags", "parentNote"];

// ── internal helpers ─────────────────────────────────────────────────
function assertOwnership(doc, userId, resourceName = "Resource") {
  if (doc.createdBy.toString() !== userId.toString()) {
    throw ApiError.forbidden(`You do not have access to this ${resourceName}`);
  }
}

function assertValidType(type) {
  if (type && !NOTE_TYPE_VALUES.includes(type)) {
    throw ApiError.badRequest(
      `Invalid type. Allowed values: ${NOTE_TYPE_VALUES.join(", ")}`,
    );
  }
}

// Walks the note tree downward and returns every descendant note's _id.
// Used for cascade delete and for blocking "move note under its own child".
async function collectDescendantIds(noteId) {
  const children = await Note.find({ parentNote: noteId }).select("_id");
  let ids = children.map((child) => child._id);

  for (const child of children) {
    const nestedIds = await collectDescendantIds(child._id);
    ids = ids.concat(nestedIds);
  }

  return ids;
}

// ── GET /topics/:topicId/notes ───────────────────────────────────────
// Top-level notes only (parentNote: null) for one topic, scoped to the user
const getNotesByTopic = async (req, res) => {
  const { topicId } = req.params;
  const {
    type,
    tags,
    search,
    page = 1,
    limit = 20,
    sortBy = "updatedAt",
    sortOrder = "desc",
  } = req.query;

  assertValidType(type);

  const topic = await Topic.findById(topicId);
  if (!topic) throw ApiError.notFound("Topic not found");
  assertOwnership(topic, req.user.id, "topic");

  const filter = {
    topic: topicId,
    createdBy: req.user.id,
    parentNote: null,
  };

  if (type) filter.type = type;
  if (tags) {
    filter.tags = { $in: tags.split(",").map((tag) => tag.trim()) };
  }
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { content: { $regex: search, $options: "i" } },
      { tags: { $regex: search, $options: "i" } },
    ];
  }

  const pageNum = Math.max(parseInt(page, 10) || 1, 1);
  const limitNum = Math.max(parseInt(limit, 10) || 20, 1);
  const skip = (pageNum - 1) * limitNum;

  const allowedSortFields = ["createdAt", "updatedAt", "title"];
  const sortField = allowedSortFields.includes(sortBy) ? sortBy : "updatedAt";
  const sort = { [sortField]: sortOrder === "asc" ? 1 : -1 };

  const [notes, total] = await Promise.all([
    Note.find(filter).sort(sort).skip(skip).limit(limitNum),
    Note.countDocuments(filter),
  ]);

  return res.status(200).json(
    ApiResponse(
      200,
      {
        topic,
        notes,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum),
        },
      },
      "Notes fetched successfully",
    ),
  );
};

// ── GET /notes/:id/children ──────────────────────────────────────────
// Direct sub-notes of one note (one level down — the UI drills in note by note)
const getNoteChildren = async (req, res) => {
  const parent = await Note.findById(req.params.id);
  if (!parent) throw ApiError.notFound("Note not found");
  assertOwnership(parent, req.user.id, "note");

  const children = await Note.find({
    parentNote: parent._id,
    createdBy: req.user.id,
  }).sort({ updatedAt: -1 });

  return res
    .status(200)
    .json(
      ApiResponse(200, { notes: children }, "Sub-notes fetched successfully"),
    );
};

// ── GET /notes/:id ────────────────────────────────────────────────────
const getNoteById = async (req, res) => {
  const note = await Note.findById(req.params.id).populate(
    "topic",
    "name icon color",
  );
  if (!note) throw ApiError.notFound("Note not found");
  assertOwnership(note, req.user.id, "note");

  const childCount = await Note.countDocuments({ parentNote: note._id });

  return res
    .status(200)
    .json(
      ApiResponse(
        200,
        { note: { ...note.toObject(), childCount } },
        "Note fetched successfully",
      ),
    );
};

// ── POST /notes ───────────────────────────────────────────────────────
const createNote = async (req, res) => {
  const { topic: topicId, parentNote, title, content, type, tags } = req.body;

  if (!title) throw ApiError.badRequest("Title is required");
  if (!topicId) throw ApiError.badRequest("Topic is required");
  assertValidType(type);

  const topic = await Topic.findById(topicId);
  if (!topic) throw ApiError.notFound("Topic not found");
  assertOwnership(topic, req.user.id, "topic");

  if (parentNote) {
    const parent = await Note.findById(parentNote);
    if (!parent) throw ApiError.notFound("Parent note not found");
    assertOwnership(parent, req.user.id, "note");

    if (parent.topic.toString() !== topicId) {
      throw ApiError.badRequest("Parent note must belong to the same topic");
    }
  }

  const note = await Note.create({
    title,
    content,
    type: type || "theory",
    tags,
    topic: topicId,
    parentNote: parentNote || null,
    createdBy: req.user.id,
  });

  logger.info(`Note created: ${note._id} by ${req.user.id}`);
  return res
    .status(201)
    .json(ApiResponse(201, { note }, "Note created successfully"));
};

// ── PATCH /notes/:id ──────────────────────────────────────────────────
const updateNote = async (req, res) => {
  const note = await Note.findById(req.params.id);
  if (!note) throw ApiError.notFound("Note not found");
  assertOwnership(note, req.user.id, "note");

  assertValidType(req.body.type);

  // Moving a note to a new parent — validate the target before applying it
  if (req.body.parentNote !== undefined && req.body.parentNote !== null) {
    const newParentId = req.body.parentNote;

    if (newParentId === note._id.toString()) {
      throw ApiError.badRequest("A note cannot be its own parent");
    }

    const newParent = await Note.findById(newParentId);
    if (!newParent) throw ApiError.notFound("Parent note not found");
    assertOwnership(newParent, req.user.id, "note");

    if (newParent.topic.toString() !== note.topic.toString()) {
      throw ApiError.badRequest("Parent note must belong to the same topic");
    }

    const descendantIds = await collectDescendantIds(note._id);
    const isMovingUnderOwnDescendant = descendantIds.some(
      (id) => id.toString() === newParentId,
    );
    if (isMovingUnderOwnDescendant) {
      throw ApiError.badRequest("Cannot move a note under its own sub-note");
    }
  }

  UPDATABLE_FIELDS.forEach((field) => {
    if (req.body[field] !== undefined) note[field] = req.body[field];
  });

  await note.save();

  logger.info(`Note updated: ${note._id} by ${req.user.id}`);
  return res
    .status(200)
    .json(ApiResponse(200, { note }, "Note updated successfully"));
};

// ── DELETE /notes/:id ─────────────────────────────────────────────────
// Cascades: deleting a note removes every sub-note nested underneath it
const deleteNote = async (req, res) => {
  const note = await Note.findById(req.params.id);
  if (!note) throw ApiError.notFound("Note not found");
  assertOwnership(note, req.user.id, "note");

  const descendantIds = await collectDescendantIds(note._id);
  const idsToDelete = [note._id, ...descendantIds];

  await Note.deleteMany({ _id: { $in: idsToDelete } });

  logger.warn(
    `Note deleted: ${req.params.id} (with ${descendantIds.length} sub-notes) by ${req.user.id}`,
  );
  return res
    .status(200)
    .json(
      ApiResponse(200, null, "Note and its sub-notes deleted successfully"),
    );
};

// ── GET /notes/search ─────────────────────────────────────────────────
// Global search across all of the user's notes, regardless of topic
const searchNotes = async (req, res) => {
  const { q, page = 1, limit = 20 } = req.query;

  if (!q) throw ApiError.badRequest("Search query is required");

  const pageNum = Math.max(parseInt(page, 10) || 1, 1);
  const limitNum = Math.max(parseInt(limit, 10) || 20, 1);
  const skip = (pageNum - 1) * limitNum;

  const filter = {
    createdBy: req.user.id,
    $or: [
      { title: { $regex: q, $options: "i" } },
      { content: { $regex: q, $options: "i" } },
      { tags: { $regex: q, $options: "i" } },
    ],
  };

  const [notes, total] = await Promise.all([
    Note.find(filter)
      .populate("topic", "name icon color")
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limitNum),
    Note.countDocuments(filter),
  ]);

  return res.status(200).json(
    ApiResponse(
      200,
      {
        notes,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum),
        },
      },
      "Search results fetched successfully",
    ),
  );
};

module.exports = {
  getNotesByTopic,
  getNoteChildren,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
  searchNotes,
};
