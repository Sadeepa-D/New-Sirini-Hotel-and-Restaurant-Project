const express = require("express");
const router = express.Router();
const FoodOrderCont = require("../controllers/Restraunt/FoodOrderCont");

router.post("/placeorder", FoodOrderCont.createFoodOrder);

module.exports = router;
