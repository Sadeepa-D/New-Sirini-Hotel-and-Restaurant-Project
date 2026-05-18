const express = require("express");
const router = express.Router();
const upload = require("../config/CloudinaryConfig");
const liquorController = require("../controllers/LiquorController");
const liquorAnlysController = require("../controllers/Liquor/LiquorAnlys");

router.post("/add", upload.single("image"), liquorController.addLiquor);
router.get("/get", liquorController.getAllLiquor);
router.delete("/delete/:id", liquorController.deleteLiquor);
router.put(
  "/update/:id",
  upload.single("image"),
  liquorController.updateLiquor,
);
router.put("/toggle/:id", liquorController.toggleAvailability);
router.put("/decreaseinventory/", liquorController.decreaseLiquorInventory);
router.put("/increaseinventory/", liquorController.increaseLiquorInventory);

router.get("/stats/stockvalue", liquorAnlysController.getLiquorStockValue);
router.get("/stats/stocklevels", liquorAnlysController.getLiquorStockLevels);
router.get("/stats/categorystock", liquorAnlysController.getLiquorCategoryStock);
router.get("/stats/brandprofit", liquorAnlysController.getLiquorBrandProfit);

module.exports = router;
