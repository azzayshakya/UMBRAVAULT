const multer = require("multer");

// Memory storage = no disk writes, no temp-file cleanup, and it works the
// same whether you're running one instance or many behind a load balancer.
// req.file.buffer / req.files[i].buffer is handed straight to Cloudinary.
const storage = multer.memoryStorage();

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
]);

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB — tune per use case
const MAX_FILES_PER_REQUEST = 5;

const fileFilter = (req, file, cb) => {
  if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
    return cb(new Error(`Unsupported file type: ${file.mimetype}`));
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE_BYTES,
    files: MAX_FILES_PER_REQUEST,
  },
});

module.exports = upload;
