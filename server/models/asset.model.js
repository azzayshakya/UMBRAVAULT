const mongoose = require("mongoose");

const assetSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Asset identifier name is required"],
      trim: true,
      maxlength: 120,
    },
    originalName: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["ui", "logo", "icon", "docs", "backup", "reference", "other"],
      default: "other",
      index: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["image", "document", "archive", "code", "other"],
      default: "document",
      index: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    size: {
      type: Number, // In bytes
      required: true,
      min: 0,
    },
    url: {
      type: String,
      required: [true, "Public or CDN asset URL is required"],
      trim: true,
    },
    thumbnailUrl: {
      type: String,
      default: null,
      trim: true,
    },
    publicId: {
      type: String, // Storage identifier (e.g., Cloudinary public_id)
      required: [true, "Storage public ID is required"],
      trim: true,
      index: true,
    },
    project: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      default: "general",
      index: true,
    },
    version: {
      type: String,
      default: "v1",
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
      index: true,
    },
    status: {
      type: String,
      enum: ["active", "deprecated", "archived"],
      default: "active",
      index: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
      default: "",
    },
    metadata: {
      width: { type: Number, default: null },
      height: { type: Number, default: null },
      format: { type: String, default: null },
    },
    linkedProjects: [
      {
        projectName: {
          type: String,
          required: true,
          trim: true,
        },
        nodePath: {
          type: String,
          required: true,
          trim: true,
        },
        linkedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    usageCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    lastUsedAt: {
      type: Date,
      default: null,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  },
);

// Compound text index for search queries across multiple fields
assetSchema.index({
  name: "text",
  project: "text",
  description: "text",
  tags: "text",
});

module.exports = mongoose.model("Asset", assetSchema);
