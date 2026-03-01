const express = require("express");
const router = express.Router();
const FoodOrderCont = require("../controllers/Restraunt/FoodOrderCont");

router.post("/placeorder", FoodOrderCont.createFoodOrder);
router.get("/vieworders", FoodOrderCont.getFoodOrders);
router.put("/updateorder/:id", FoodOrderCont.editfoodOrder);
router.delete("/deleteorder/:id", FoodOrderCont.deleteFoodOrder);

module.exports = router;
