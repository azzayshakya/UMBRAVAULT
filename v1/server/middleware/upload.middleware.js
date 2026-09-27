const multer = require("multer");
const upload = require("../config/multer.config");
const ApiError = require("../utils/apiError");

const MULTER_ERROR_MESSAGES = {
  LIMIT_FILE_SIZE: "File is too large",
  LIMIT_FILE_COUNT: "Too many files",
  LIMIT_UNEXPECTED_FILE: "Unexpected file field",
};

const normalizeUploadError = (err) => {
  if (err instanceof multer.MulterError) {
    return ApiError.badRequest(MULTER_ERROR_MESSAGES[err.code] || err.message);
  }
  // Anything else (e.g. our fileFilter's mimetype rejection) is already
  // operational-safe to show the client as-is.
  return ApiError.badRequest(err.message);
};

/**
 * Wraps a configured multer middleware so its errors reach your global
 * error handler as ApiError instead of a raw multer/Error object.
 */
const handleUpload = (multerMiddleware) => (req, res, next) => {
  multerMiddleware(req, res, (err) => {
    if (err) return next(normalizeUploadError(err));
    next();
  });
};

module.exports = {
  single: (fieldName) => handleUpload(upload.single(fieldName)),
  array: (fieldName, maxCount) =>
    handleUpload(upload.array(fieldName, maxCount)),
  fields: (fieldsConfig) => handleUpload(upload.fields(fieldsConfig)),
};
