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
      status: "In Progress",
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

    // Check if user is NOT an Operation Manager or Admin
    const isStaff = userRole && (userRole.includes("Operation Manager") || userRole === "Admin");

    if (!isStaff) {
      const { slDate, slTime } = getCurrentSLTime();
      const pickupDateStr = new Date(order.pickupDate).toISOString().split('T')[0];
      const pickupDateTime = new Date(`${pickupDateStr}T${order.pickupTime}`);
      const currentSLDateTime = new Date(`${slDate}T${slTime}`);

      const diffInMs = pickupDateTime - currentSLDateTime;
      const diffInHours = diffInMs / (1000 * 60 * 60);

      if (diffInHours < 1) {
        return res.status(400).json({ 
          message: "Cannot cancel now. Less than 1 hour left. Please contact hotel for cancellation." 
        });
      }
    }

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
      { status: "Completed" },
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

const updateFoodOrderStatusToCancelled = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Food order ID is required" });
    }
    const updatedOrder = await FoodOrder.findByIdAndUpdate(
      id,
      { status: "Cancelled" },
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

const getCompletedFoodOrders = async (req, res) => {
  try {
    const completedOrders = await FoodOrder.find({ status: "Completed" });
    if (completedOrders.length === 0) {
      return res
        .status(404)
        .json({ message: "No completed food orders found" });
    }
    res.status(200).json(completedOrders);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to retrieve completed food orders", error });
  }
};

const getCancelledFoodOrders = async (req, res) => {
  try {
    const cancelledOrders = await FoodOrder.find({
      status: { $in: ["Cancelled", "delete"] },
    });
    if (cancelledOrders.length === 0) {
      return res
        .status(404)
        .json({ message: "No cancelled or deleted food orders found" });
    }
    res.status(200).json(cancelledOrders);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to retrieve cancelled food orders", error });
  }
};

const getInProgressFoodOrders = async (req, res) => {
  try {
    const inProgressOrders = await FoodOrder.find({ status: "In Progress" });
    if (inProgressOrders.length === 0) {
      return res
        .status(404)
        .json({ message: "No in-progress food orders found" });
    }
    res.status(200).json(inProgressOrders);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to retrieve in-progress food orders", error });
  }
};
const getOverdueFoodOrders = async (req, res) => {
  try {
    const overdueOrders = await FoodOrder.find({ status: "Overdue" });
    if (overdueOrders.length === 0) {
      return res.status(404).json({ message: "No overdue food orders found" });
    }
    res.status(200).json(overdueOrders);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to retrieve overdue food orders", error });
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
  updateFoodOrderStatusToCancelled,
  getCompletedFoodOrders,
  getCancelledFoodOrders,
  getInProgressFoodOrders,
  getOverdueFoodOrders,
  getUserOrders,
};
