const express = require("express");
const router = express.Router();
const upload = require("../config/CloudinaryConfig");
const galleryController = require("../controllers/GalleryController");
const authMiddleware = require("../middleware/AuthMiddleware");
const RoleBaseMiddleware = require("../middleware/RoleBaseMiddleware");

router.post(
  "/add",
  authMiddleware,
  RoleBaseMiddleware(["Admin"]),
  upload.array("images", 10),
  galleryController.createGalleryItem,
);
router.get("/view", galleryController.getGalleryItems);
router.delete("/delete/:id", authMiddleware, RoleBaseMiddleware(["Admin"]), galleryController.deleteGalleryItem);

module.exports = router;
