const express = require("express");
const router = express.Router();
const FoodOrderCont = require("../controllers/Restraunt/FoodOrderCont");
const FoodItemsCont = require("../controllers/Restraunt/FoodItemsCont");
const RestrauntAnlysCont = require("../controllers/Restraunt/RestrauntAnlys");
const upload = require("../config/CloudinaryConfig");
const authMiddleware = require("../middleware/AuthMiddleware");
const RoleBaseMiddleware = require("../middleware/RoleBaseMiddleware");

router.post("/placeorder", authMiddleware, FoodOrderCont.createFoodOrder);
router.get(
  "/vieworders",
  authMiddleware,
  RoleBaseMiddleware(["Admin", "Operation Manager 1 (Restraunt,Liquor)"]),
  FoodOrderCont.getFoodOrders,
);
router.put("/updateorder/:id", authMiddleware, RoleBaseMiddleware(["Admin", "Operation Manager 1 (Restraunt,Liquor)","User"]), FoodOrderCont.editfoodOrder);
router.delete(
  "/deleteorder/:id",
  authMiddleware,
  RoleBaseMiddleware(["Admin", "Operation Manager 1 (Restraunt,Liquor)","User"]),
  FoodOrderCont.deleteFoodOrder,
);
router.put(
  "/updateorderstatus/complete/:id",
  authMiddleware,
  RoleBaseMiddleware(["Admin", "Operation Manager 1 (Restraunt,Liquor)"]),
  FoodOrderCont.updateFoodOrderStatusTOComplete,
);
router.put(
  "/updateorderstatus/accepted/:id",
  authMiddleware,
  RoleBaseMiddleware(["Admin", "Operation Manager 1 (Restraunt,Liquor)"]),
  FoodOrderCont.updateFoodOrderStatusToAccepted,
);
router.put(
  "/updateorderstatus/preparing/:id",
  authMiddleware,
  RoleBaseMiddleware(["Admin", "Operation Manager 1 (Restraunt,Liquor)"]),
  FoodOrderCont.updateFoodOrderStatusToPreparing,
);
router.get("/completeorders", FoodOrderCont.getCompleteFoodOrders);
router.get("/acceptedorders", FoodOrderCont.getAcceptedFoodOrders);
router.get("/preparingorders", FoodOrderCont.getPreparingFoodOrders);
router.get("/pendingorders", FoodOrderCont.getPendingFoodOrders);

router.post(
  "/addfooditem",
  authMiddleware,
  RoleBaseMiddleware(["Admin", "Operation Manager 1 (Restraunt,Liquor)"]),
  upload.single("image"),
  FoodItemsCont.createFoodItem,
);
router.get("/viewfooditems", FoodItemsCont.getFoodItems);
router.put(
  "/updatefooditem/:id",
  authMiddleware,
  RoleBaseMiddleware(["Admin", "Operation Manager 1 (Restraunt,Liquor)"]),
  upload.single("image"),
  FoodItemsCont.updateFoodItem,
);
router.put(
  "/toggleavailability/:id",
  authMiddleware,
  RoleBaseMiddleware(["Admin", "Operation Manager 1 (Restraunt,Liquor)"]),
  FoodItemsCont.toggleFoodItemAvailability,
);
router.delete(
  "/deletefooditem/:id",
  authMiddleware,
  RoleBaseMiddleware(["Admin", "Operation Manager 1 (Restraunt,Liquor)"]),
  FoodItemsCont.deleteFoodItem,
);

router.get("/orders/userspecific", authMiddleware, FoodOrderCont.getUserOrders);
router.post("/orders/stats", RestrauntAnlysCont.getRestaurantOrderStats);
router.get("/fooditems/status", RestrauntAnlysCont.getrestrauntfooditemsstatus);

module.exports = router;
