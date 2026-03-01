const FoodOrder = require("../../models/Restraunt/FoodItemBookModel");

const GenarateFoodOrderCode = async () => {
  const prefix = "SH";
  const randomNumber = Math.floor(1000 + Math.random() * 9000);
  const existing = await FoodOrder.findOne({
    orderCode: `${prefix}${randomNumber}`,
  });
  if (!existing) {
    return `${prefix}${randomNumber}`;
  }

  return await GenarateFoodOrderCode();
};

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
      orderCode: await GenarateFoodOrderCode(),
    });
    const savedOrder = await newFoodOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({ message: "Failed to create food order", error });
  }
};
const getFoodOrders = async (req, res) => {
  try {
    const foodOrders = await FoodOrder.find();
    if (foodOrders.length === 0) {
      return res.status(404).json({ message: "No food orders found" });
    }
    res.status(200).json(foodOrders);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve food orders", error });
  }
};
const editfoodOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, quantity, phoneNumber, pickupDate, pickupTime } =
      req.body;
    if (!id) {
      return res.status(400).json({ message: "Food order ID is required" });
    }
    if (!fullName || !quantity || !phoneNumber || !pickupDate || !pickupTime) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const updatedOrder = await FoodOrder.findByIdAndUpdate(
      id,
      {
        fullName,
        quantity,
        phoneNumber,
        pickupDate,
        pickupTime,
      },
      { new: true },
    );
    if (!updatedOrder) {
      return res.status(404).json({ message: "Food order not found" });
    }
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: "Failed to update food order", error });
  }
};
const deleteFoodOrder = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Food order ID is required" });
    }
    const deletedOrder = await FoodOrder.findByIdAndDelete(id);
    if (!deletedOrder) {
      return res.status(404).json({ message: "Food order not found" });
    }
    res.status(200).json({ message: "Food order deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete food order", error });
  }
};
module.exports = {
  createFoodOrder,
  getFoodOrders,
  editfoodOrder,
  deleteFoodOrder,
};
