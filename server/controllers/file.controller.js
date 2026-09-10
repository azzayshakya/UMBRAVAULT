const ApiResponse = require("../utils/apiResponse");
const ApiError = require("../utils/apiError");
const cloudinaryService = require("../services/cloudinary.service");

const uploadSingleFile = async (req, res, next) => {
  try {
    if (!req.file) {
      throw ApiError.badRequest("No file provided");
    }

    // Allows the client to pass a target folder (e.g., 'avatars', 'documents', 'vault')
    const folder = req.body.folder || "general";

    const result = await cloudinaryService.uploadFile(req.file, { folder });

    res
      .status(201)
      .json(ApiResponse(201, result, "File uploaded successfully"));
  } catch (error) {
    next(error);
  }
};

const uploadMultipleFilesHandler = async (req, res, next) => {
  try {
    if (!req.files?.length) {
      throw ApiError.badRequest("No files provided");
    }

    const folder = req.body.folder || "general";

    const results = await cloudinaryService.uploadMultipleFiles(req.files, {
      folder,
    });

    res
      .status(201)
      .json(ApiResponse(201, results, "Files uploaded successfully"));
  } catch (error) {
    next(error);
  }
};

const deleteFileHandler = async (req, res, next) => {
  try {
    const { publicId, resourceType = "image" } = req.body;

    if (!publicId) {
      throw ApiError.badRequest("publicId is required");
    }

    await cloudinaryService.deleteFile(publicId, resourceType);

    res.status(200).json(ApiResponse(200, null, "File deleted successfully"));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadSingleFile,
  uploadMultipleFilesHandler,
  deleteFileHandler,
};
