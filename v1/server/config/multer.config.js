const multer = require("multer");
const ApiError = require("../utils/apiError");

const storage = multer.memoryStorage();

// Allowed MIME types across images, documents, and archives
const ALLOWED_MIME_TYPES = [
  // Images
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  // Documents
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/plain",
  "text/csv",
  "application/json",
  // Archives
  "application/zip",
  "application/x-zip-compressed",
  "application/x-tar",
  "application/gzip",
];

const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      ApiError.badRequest(
        `Unsupported file type (${file.mimetype}). Allowed types include images, PDFs, office documents, and archives.`,
      ),
      false,
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 40 * 1024 * 1024, // 25 MB max limit
  },
});

module.exports = upload;
