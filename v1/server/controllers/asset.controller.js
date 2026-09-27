const Asset = require("../models/asset.model");
const ApiResponse = require("../utils/apiResponse");
const ApiError = require("../utils/apiError");
const cloudinaryService = require("../services/cloudinary.service");

// POST /api/assets — Save and index asset metadata in MongoDB
const createAsset = async (req, res, next) => {
  try {
    const {
      name,
      originalName,
      type,
      category,
      mimeType,
      size,
      url,
      thumbnailUrl,
      publicId,
      project,
      version,
      tags,
      description,
      metadata,
    } = req.body;

    if (!name || !url || !publicId) {
      throw ApiError.badRequest("Name, url, and publicId are required");
    }

    const asset = await Asset.create({
      name,
      originalName: originalName || name,
      type: type || "other",
      category: category || "document",
      mimeType: mimeType || "application/octet-stream",
      size: size || 0,
      url,
      thumbnailUrl: thumbnailUrl || null,
      publicId,
      project: (project || "general").toLowerCase().trim(),
      version: version || "v1",
      tags: Array.isArray(tags) ? tags : [],
      description: description || "",
      metadata: metadata || {},
      uploadedBy: req.user.id,
    });

    res.status(201).json(ApiResponse(201, asset, "Asset indexed successfully"));
  } catch (error) {
    next(error);
  }
};

// GET /api/assets — List with search, filtering, and summary metrics
const getAssets = async (req, res, next) => {
  try {
    const {
      search,
      type,
      category,
      project,
      status,
      limit = 30,
      offset = 0,
    } = req.query;

    const query = { uploadedBy: req.user.id };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { project: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }
    if (type) query.type = type;
    if (category) query.category = category;
    if (project) query.project = project.toLowerCase().trim();
    if (status) query.status = status;

    const [assets, total, statsAggregation] = await Promise.all([
      Asset.find(query)
        .sort({ createdAt: -1 })
        .skip(Number(offset))
        .limit(Number(limit)),
      Asset.countDocuments(query),
      Asset.aggregate([
        { $match: { uploadedBy: req.user._id || req.user.id } },
        { $group: { _id: "$category", count: { $sum: 1 } } },
      ]),
    ]);

    const stats = statsAggregation.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {});

    res.status(200).json(
      ApiResponse(
        200,
        {
          assets,
          total,
          stats: {
            image: stats.image || 0,
            document: stats.document || 0,
            archive: stats.archive || 0,
          },
        },
        "Assets retrieved successfully",
      ),
    );
  } catch (error) {
    next(error);
  }
};

// GET /api/assets/:id — Retrieve single asset details by ID
const getAssetById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const asset = await Asset.findOne({
      _id: id,
      uploadedBy: req.user.id,
    });

    if (!asset) {
      throw ApiError.notFound("Asset not found");
    }

    res.status(200).json(ApiResponse(200, asset, "Asset details retrieved"));
  } catch (error) {
    next(error);
  }
};

// POST /api/assets/:id/link — Connect an asset to project nodes / track dependencies
const linkAssetUsage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { projectName, nodePath } = req.body;

    if (!projectName || !nodePath) {
      throw ApiError.badRequest("projectName and nodePath are required");
    }

    const asset = await Asset.findOneAndUpdate(
      { _id: id, uploadedBy: req.user.id },
      {
        $push: { linkedProjects: { projectName, nodePath } },
        $inc: { usageCount: 1 },
        $set: { lastUsedAt: new Date() },
      },
      { new: true },
    );

    if (!asset) {
      throw ApiError.notFound("Asset not found");
    }

    res.status(200).json(ApiResponse(200, asset, "Asset dependency linked"));
  } catch (error) {
    next(error);
  }
};

// DELETE /api/assets/:id — Remove from MongoDB & Cloudinary storage
const deleteAsset = async (req, res, next) => {
  try {
    const { id } = req.params;

    const asset = await Asset.findOne({
      _id: id,
      uploadedBy: req.user.id,
    });

    if (!asset) {
      throw ApiError.notFound("Asset not found");
    }

    // Delete the file from Cloudinary (determines raw vs image)
    const resourceType = asset.category === "image" ? "image" : "raw";
    if (asset.publicId) {
      await cloudinaryService.deleteFile(asset.publicId, resourceType);
    }

    await Asset.findByIdAndDelete(id);

    res.status(200).json(ApiResponse(200, null, "Asset removed permanently"));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createAsset,
  getAssets,
  getAssetById,
  linkAssetUsage,
  deleteAsset,
};
