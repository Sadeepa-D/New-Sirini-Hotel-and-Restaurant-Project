const express = require("express");
const router = express.Router();
const upload = require("../config/CloudinaryConfig");
const galleryController = require("../controllers/GalleryController");

router.post(
  "/add",
  upload.array("images", 10),
  galleryController.createGalleryItem,
);
router.get("/view", galleryController.getGalleryItems);
router.delete("/delete/:id", galleryController.deleteGalleryItem);

module.exports = router;
