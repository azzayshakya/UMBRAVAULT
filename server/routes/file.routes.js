const express = require("express");
const uploadMiddleware = require("../middleware/upload.middleware");
const fileController = require("../controllers/file.controller");

const router = express.Router();

router.post(
  "/upload",
  uploadMiddleware.single("file"),
  fileController.uploadSingleFile,
);

router.post(
  "/upload-multiple",
  uploadMiddleware.array("files", 5),
  fileController.uploadMultipleFilesHandler,
);

router.delete("/", fileController.deleteFileHandler);

module.exports = router;
