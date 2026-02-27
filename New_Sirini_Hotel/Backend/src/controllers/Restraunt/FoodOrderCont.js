const FoodOrder = require("../../models/Restraunt/FoodItemBookModel");

const createFoodOrder = async (req, res) => {
  try {
    const { fullName, quantity, phoneNumber, pickupDate, pickupTime } =
      req.body;

    if (!fullName || !quantity || !phoneNumber || !pickupDate || !pickupTime) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newFoodOrder = new FoodOrder({
      fullName,
      quantity,
      phoneNumber,
      pickupDate,
      pickupTime,
    });
    const savedOrder = await newFoodOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({ message: "Failed to create food order", error });
  }
};
module.exports = {
  createFoodOrder,
};
