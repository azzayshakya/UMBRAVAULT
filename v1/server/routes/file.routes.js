const express = require("express");
const uploadMiddleware = require("../middleware/upload.middleware");
const fileController = require("../controllers/file.controller");

const router = express.Router();

// Upload a single file (image, PDF, archive, document)
router.post(
  "/upload",
  uploadMiddleware.single("file"),
  fileController.uploadSingleFile,
);

// Upload up to 10 files in a single batch
router.post(
  "/upload-multiple",
  uploadMiddleware.array("files", 10),
  fileController.uploadMultipleFilesHandler,
);

// Delete file from Cloudinary (pass publicId and optional resourceType)
router.delete("/", fileController.deleteFileHandler);

module.exports = router;
