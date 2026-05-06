const express = require("express");
const router = express.Router();
const FoodOrderCont = require("../controllers/Restraunt/FoodOrderCont");
const FoodItemsCont = require("../controllers/Restraunt/FoodItemsCont");
const upload = require("../config/CloudinaryConfig");
const authMiddleware = require("../middleware/AuthMiddleware");

router.post("/placeorder", authMiddleware,FoodOrderCont.createFoodOrder);
router.get("/vieworders", FoodOrderCont.getFoodOrders);
router.put("/updateorder/:id", FoodOrderCont.editfoodOrder);
router.delete("/deleteorder/:id", FoodOrderCont.deleteFoodOrder);
router.put(
  "/updateorderstatus/complete/:id",
  FoodOrderCont.updateFoodOrderStatusTOComplete,
);
router.put(
  "/updateorderstatus/cancelled/:id",
  FoodOrderCont.updateFoodOrderStatusToCancelled,
);
router.get("/completedorders", FoodOrderCont.getCompletedFoodOrders);
router.get("/cancelledorders", FoodOrderCont.getCancelledFoodOrders);
router.get("/inprogressorders", FoodOrderCont.getInProgressFoodOrders);
router.get("/overdueorders", FoodOrderCont.getOverdueFoodOrders);

router.post(
  "/addfooditem",
  upload.single("image"),
  FoodItemsCont.createFoodItem,
);
router.get("/viewfooditems", FoodItemsCont.getFoodItems);
router.put(
  "/updatefooditem/:id",
  upload.single("image"),
  FoodItemsCont.updateFoodItem,
);
router.put("/toggleavailability/:id", FoodItemsCont.toggleFoodItemAvailability);
router.delete("/deletefooditem/:id", FoodItemsCont.deleteFoodItem);


router.get("/orders/userspecific", authMiddleware, FoodOrderCont.getUserOrders);

module.exports = router;
