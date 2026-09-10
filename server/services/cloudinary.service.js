const path = require("path");
const cloudinary = require("../config/cloudinary.config");
const ApiError = require("../utils/apiError");
const logger = require("../utils/logger");

const DEFAULT_FOLDER = process.env.CLOUDINARY_UPLOAD_FOLDER || "uploads";

/**
 * Derives Cloudinary resource_type and ensures original file extensions
 * are preserved for raw/document files (PDF, ZIP, DOCX, etc.).
 */
const resolveFileOptions = (file, options = {}) => {
  const mime = file.mimetype || "";
  const isImage = mime.startsWith("image/") && !mime.includes("svg");

  let resourceType = options.resourceType || "auto";

  // Use raw storage for non-image documents to preserve binary headers
  if (
    mime.includes("pdf") ||
    mime.includes("zip") ||
    mime.includes("tar") ||
    mime.includes("msword") ||
    mime.includes("officedocument") ||
    mime.includes("text") ||
    mime.includes("json")
  ) {
    resourceType = "raw";
  }

  // Preserve the original extension for raw non-image downloads
  let publicId = options.publicId;
  if (!publicId && resourceType === "raw" && file.originalname) {
    const ext = path.extname(file.originalname);
    const basename = path
      .basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9_-]/g, "_");
    publicId = `${basename}_${Date.now()}${ext}`;
  }

  return { resourceType, publicId };
};

/**
 * Streams in-memory buffer to Cloudinary with dynamic resource types.
 */
const uploadBuffer = (buffer, uploadOptions = {}) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      },
    );

    stream.end(buffer);
  });
};

/**
 * Uploads a single Multer file (req.file) to Cloudinary.
 */
const uploadFile = async (file, options = {}) => {
  if (!file?.buffer) {
    throw ApiError.badRequest(
      "No file buffer found — verify multer is configured with memoryStorage",
    );
  }

  try {
    const { resourceType, publicId } = resolveFileOptions(file, options);

    const uploadOptions = {
      folder: options.folder || DEFAULT_FOLDER,
      resource_type: resourceType,
      public_id: publicId,
    };

    const result = await uploadBuffer(file.buffer, uploadOptions);

    // Generate lightweight thumbnail URL for images or PDF documents
    let thumbnailUrl = null;
    if (result.resource_type === "image") {
      thumbnailUrl = cloudinary.url(result.public_id, {
        width: 300,
        height: 300,
        crop: "fill",
        secure: true,
      });
    }

    return {
      url: result.secure_url,
      thumbnailUrl,
      publicId: result.public_id,
      resourceType: result.resource_type,
      format: result.format || path.extname(file.originalname).replace(".", ""),
      bytes: result.bytes,
      originalName: file.originalname,
      mimeType: file.mimetype,
    };
  } catch (err) {
    if (err.isOperational) throw err;

    logger.error(`Cloudinary upload failed: ${err.message}`);
    throw ApiError.internal("Failed to upload file to Cloudinary");
  }
};

/**
 * Uploads multiple files in parallel.
 */
const uploadMultipleFiles = async (files = [], options = {}) => {
  return Promise.all(files.map((file) => uploadFile(file, options)));
};

/**
 * Deletes a file. Accepts resourceType ('image', 'raw', or 'video')
 * because Cloudinary requires the exact resource_type to locate raw files.
 */
const deleteFile = async (publicId, resourceType = "image") => {
  if (!publicId) return null;

  try {
    return await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
  } catch (err) {
    logger.error(`Cloudinary delete failed for ${publicId}: ${err.message}`);
    throw ApiError.internal("Failed to delete file from Cloudinary");
  }
};

module.exports = {
  uploadFile,
  uploadMultipleFiles,
  deleteFile,
};
