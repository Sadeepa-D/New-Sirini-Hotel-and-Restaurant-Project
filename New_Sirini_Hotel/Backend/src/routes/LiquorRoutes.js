const express = require("express");
const router = express.Router();
const upload = require("../config/CloudinaryConfig");
const liquorController = require("../controllers/LiquorController");

router.post("/add", upload.single("image"), liquorController.addLiquor);
router.get("/get", liquorController.getAllLiquor);
router.delete("/delete/:id", liquorController.deleteLiquor);
router.put(
  "/update/:id",
  upload.single("image"),
  liquorController.updateLiquor,
);
router.put("/toggle/:id", liquorController.toggleAvailability);

module.exports = router;
