const FoodOrder = require("../../models/Restraunt/FoodItemBookModel");

const getCurrentSLTime = () => {
  const now = new Date();
  const slDate = new Intl.DateTimeFormat('en-CA', { 
    timeZone: 'Asia/Colombo', 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit' 
  }).format(now);
  
  const slTime = new Intl.DateTimeFormat('en-GB', { 
    timeZone: 'Asia/Colombo', 
    hour: '2-digit', 
    minute: '2-digit', 
    hour12: false 
  }).format(now);
  
  return { slDate, slTime };
};

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
    const userId = req.userData.id;
    const { foodName, fullName, email, quantity, phoneNumber, pickupDate, pickupTime, Price, portion } =
      req.body;

    if (!fullName || !email || !quantity || !phoneNumber || !pickupDate || !pickupTime || !portion) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Sri Lanka Time Validation
    const { slDate, slTime } = getCurrentSLTime();
    if (pickupDate < slDate) {
      return res.status(400).json({ message: "Selected date is in the past. Please choose today or a future date." });
    }
    if (pickupDate === slDate && pickupTime <= slTime) {
      return res.status(400).json({ message: "Selected time has already passed for today. Please choose a future time." });
    }

    const newFoodOrder = new FoodOrder({
      userId,
      foodName,
      fullName,
      email,
      quantity,
      phoneNumber,
      pickupDate,
      pickupTime,
      orderCode: await GenarateFoodOrderCode(),
      status: "Pending",
      Price,
      portion,
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
    const { fullName, email, quantity, phoneNumber, pickupDate, pickupTime, Price, portion } =
      req.body;
    if (!id) {
      return res.status(400).json({ message: "Food order ID is required" });
    }
    if (!fullName || !email || !quantity || !phoneNumber || !pickupDate || !pickupTime || !portion) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Sri Lanka Time Validation
    const { slDate, slTime } = getCurrentSLTime();
    if (pickupDate < slDate) {
      return res.status(400).json({ message: "Selected date is in the past. Please choose today or a future date." });
    }
    if (pickupDate === slDate && pickupTime <= slTime) {
      return res.status(400).json({ message: "Selected time has already passed for today. Please choose a future time." });
    }
    const updatedOrder = await FoodOrder.findByIdAndUpdate(
      id,
      {
        fullName,
        email,
        quantity,
        phoneNumber,
        pickupDate,
        pickupTime,
        portion,
        ...(Price && { Price }),
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
    const userRole = req.userData.role;

    if (!id) {
      return res.status(400).json({ message: "Food order ID is required" });
    }

    const order = await FoodOrder.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Food order not found" });
    }

    // Simplified deletion logic: allow for all active orders

    order.status = "delete";
    await order.save();
    
    res.status(200).json({ message: "Food order marked as deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete food order", error });
  }
};

const updateFoodOrderStatusTOComplete = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Food order ID is required" });
    }
    const updatedOrder = await FoodOrder.findByIdAndUpdate(
      id,
      { status: "Complete" },
      { new: true },
    );
    if (!updatedOrder) {
      return res.status(404).json({ message: "Food order not found" });
    }
    res.status(200).json(updatedOrder);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update food order status", error });
  }
};

const updateFoodOrderStatusToAccepted = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Food order ID is required" });
    }
    const updatedOrder = await FoodOrder.findByIdAndUpdate(
      id,
      { status: "Accepted" },
      { new: true },
    );
    if (!updatedOrder) {
      return res.status(404).json({ message: "Food order not found" });
    }
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: "Failed to update food order status", error });
  }
};

const updateFoodOrderStatusToPreparing = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Food order ID is required" });
    }
    const updatedOrder = await FoodOrder.findByIdAndUpdate(
      id,
      { status: "Preparing" },
      { new: true },
    );
    if (!updatedOrder) {
      return res.status(404).json({ message: "Food order not found" });
    }
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: "Failed to update food order status", error });
  }
};

const getCompleteFoodOrders = async (req, res) => {
  try {
    const completeOrders = await FoodOrder.find({ status: "Complete" });
    if (completeOrders.length === 0) {
      return res
        .status(404)
        .json({ message: "No complete food orders found" });
    }
    res.status(200).json(completeOrders);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to retrieve complete food orders", error });
  }
};

const getAcceptedFoodOrders = async (req, res) => {
  try {
    const acceptedOrders = await FoodOrder.find({ status: "Accepted" });
    res.status(200).json(acceptedOrders);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve accepted orders", error });
  }
};

const getPreparingFoodOrders = async (req, res) => {
  try {
    const preparingOrders = await FoodOrder.find({ status: "Preparing" });
    res.status(200).json(preparingOrders);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve preparing orders", error });
  }
};

const getPendingFoodOrders = async (req, res) => {
  try {
    const pendingOrders = await FoodOrder.find({ status: "Pending" });
    if (pendingOrders.length === 0) {
      return res
        .status(404)
        .json({ message: "No pending food orders found" });
    }
    res.status(200).json(pendingOrders);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to retrieve pending food orders", error });
  }
};
// GET /api/restaurant/orders/userspecific
const getUserOrders = async (req, res) => {
  try {
    const userId = req.userData.id; // comes from JWT payload

    const orders = await FoodOrder.find({ userId })
      .sort({ createdAt: -1 }); // newest first

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ message: "Server error fetching orders" });
  }
};
module.exports = {
  createFoodOrder,
  getFoodOrders,
  editfoodOrder,
  deleteFoodOrder,
  updateFoodOrderStatusTOComplete,
  updateFoodOrderStatusToAccepted,
  updateFoodOrderStatusToPreparing,
  getCompleteFoodOrders,
  getAcceptedFoodOrders,
  getPreparingFoodOrders,
  getPendingFoodOrders,
  getUserOrders,
};
