const express = require("express");
const router = express.Router();
const upload = require("../config/CloudinaryConfig");
const liquorController = require("../controllers/LiquorController");
const liquorAnlysController = require("../controllers/Liquor/LiquorAnlys");
const authMiddleware = require("../middleware/AuthMiddleware");
const RoleBaseMiddleware = require("../middleware/RoleBaseMiddleware");

router.post("/add",authMiddleware, RoleBaseMiddleware(["Admin", "Operation Manager 1 (Restraunt,Liquor)"]), upload.single("image"), liquorController.addLiquor);
router.get("/get",liquorController.getAllLiquor);
router.delete("/delete/:id", authMiddleware, RoleBaseMiddleware(["Admin", "Operation Manager 1 (Restraunt,Liquor)"]), liquorController.deleteLiquor);
router.put(
  "/update/:id",
  authMiddleware,
  RoleBaseMiddleware(["Admin", "Operation Manager 1 (Restraunt,Liquor)"]),
  upload.single("image"),
  liquorController.updateLiquor,
);
router.put("/toggle/:id", authMiddleware, RoleBaseMiddleware(["Admin", "Operation Manager 1 (Restraunt,Liquor)"]), liquorController.toggleAvailability);
router.put("/decreaseinventory/", authMiddleware, RoleBaseMiddleware(["Admin", "Operation Manager 1 (Restraunt,Liquor)"]), liquorController.decreaseLiquorInventory);
router.put("/increaseinventory/", authMiddleware, RoleBaseMiddleware(["Admin", "Operation Manager 1 (Restraunt,Liquor)"]), liquorController.increaseLiquorInventory);

router.get("/stats/stockvalue",liquorAnlysController.getLiquorStockValue);
router.get("/stats/stocklevels", liquorAnlysController.getLiquorStockLevels);
router.get("/stats/categorystock", liquorAnlysController.getLiquorCategoryStock);
router.get("/stats/brandprofit", liquorAnlysController.getLiquorBrandProfit);

module.exports = router;
