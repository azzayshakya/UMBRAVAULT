const cloudinary = require("../config/cloudinary.config");
const ApiError = require("../utils/apiError");
const logger = require("../utils/logger");

const DEFAULT_FOLDER = process.env.CLOUDINARY_UPLOAD_FOLDER || "uploads";

/**
 * Streams an in-memory buffer to Cloudinary. Nothing ever touches local
 * disk, which is what keeps this safe to run across multiple instances.
 */
const uploadBuffer = (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: options.folder || DEFAULT_FOLDER,
        resource_type: options.resourceType || "auto",
        public_id: options.publicId,
      },
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
 * Returns only the fields callers actually need — not Cloudinary's full
 * response — so consumers aren't coupled to their API shape.
 */
const uploadFile = async (file, options = {}) => {
  if (!file?.buffer) {
    throw ApiError.badRequest(
      "No file buffer found — check multer is configured with memoryStorage",
    );
  }

  try {
    const result = await uploadBuffer(file.buffer, options);

    return {
      url: result.secure_url,
      publicId: result.public_id,
      resourceType: result.resource_type,
      format: result.format,
      bytes: result.bytes,
    };
  } catch (err) {
    if (err.isOperational) throw err;

    logger.error(`Cloudinary upload failed: ${err.message}`);
    throw ApiError.internal("Failed to upload file to Cloudinary");
  }
};

/**
 * Uploads multiple files in parallel. If you expect large batches, cap
 * concurrency with something like p-limit instead of a raw Promise.all.
 */
const uploadMultipleFiles = async (files = [], options = {}) => {
  return Promise.all(files.map((file) => uploadFile(file, options)));
};

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
