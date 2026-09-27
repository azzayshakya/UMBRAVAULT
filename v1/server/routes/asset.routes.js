const express = require("express");
const router = express.Router();

const {
  authenticateAccessToken,
} = require("../middleware/auth/auth.middleware");
const checkTokenBlacklist = require("../middleware/auth/blackList.middleware");
const assetController = require("../controllers/asset.controller");

// All endpoints require verified user authentication
router.use(authenticateAccessToken);
router.use(checkTokenBlacklist);

// Create and List
router.post("/", assetController.createAsset);
router.get("/", assetController.getAssets);

// Single Node Operations
router.get("/:id", assetController.getAssetById);
router.post("/:id/link", assetController.linkAssetUsage);
router.delete("/:id", assetController.deleteAsset);

module.exports = router;
