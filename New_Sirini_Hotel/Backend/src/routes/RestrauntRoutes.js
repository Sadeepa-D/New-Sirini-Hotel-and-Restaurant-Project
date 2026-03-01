const express = require("express");
const router = express.Router();
const FoodOrderCont = require("../controllers/Restraunt/FoodOrderCont");

router.post("/placeorder", FoodOrderCont.createFoodOrder);
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

module.exports = router;
