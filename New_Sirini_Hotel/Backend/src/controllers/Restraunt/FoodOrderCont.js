const FoodOrder = require("../../models/Restraunt/FoodItemBookModel");
const User = require("../../models/UserModel");

const {
  sendRestaurantOrderEmail,
  sendmultiplerestrauntitemsEmail,
} = require("../EmailCont");
const NotifiModel = require("../../models/NotifiModel");

const getCurrentSLTime = () => {
  const now = new Date();
  const slDate = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Colombo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);

  const slTime = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Colombo",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
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
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!user.Phone) {
      return res.status(400).json({
        message:
          "Please update your profile with a phone number before creating Order.",
      });
    }
    const { items, fullName, email, phoneNumber, pickupDate, pickupTime } =
      req.body;

    if (
      !fullName ||
      !email ||
      !phoneNumber ||
      !pickupDate ||
      !pickupTime ||
      !items?.length
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const phoneRegex = /^(?:\+94|0)?(7[0-8]\d{7}|[1-9]\d{8})$/;
    if (!phoneRegex.test(phoneNumber)) {
      return res.status(400).json({ message: "Invalid phone number format" });
    }
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    // Sri Lanka Time Validation
    const { slDate, slTime } = getCurrentSLTime();
    if (pickupDate < slDate) {
      return res.status(400).json({
        message:
          "Selected date is in the past. Please choose today or a future date.",
      });
    }
    if (pickupDate === slDate && pickupTime <= slTime) {
      return res.status(400).json({
        message:
          "Selected time has already passed for today. Please choose a future time.",
      });
    }
    const orderCode = await GenarateFoodOrderCode();
    const savedOrders = [];
    for (const item of items) {
      const newFoodOrder = new FoodOrder({
        userId,
        foodName: item.foodName,
        fullName,
        email,
        quantity: item.quantity,
        phoneNumber,
        pickupDate,
        pickupTime,
        orderCode,
        status: "Pending",
        Price: item.Price,
        portion: item.portion,
      });
      savedOrders.push(await newFoodOrder.save());
    }

    if (savedOrders.length > 1) {
      await sendmultiplerestrauntitemsEmail({
        email,
        fullName,
        phoneNumber,
        pickupDate,
        pickupTime,
        orders: savedOrders,
      });
    } else {
      const savedOrder = savedOrders[0];
      await sendRestaurantOrderEmail({
        email,
        fullName,
        savedOrder,
        foodName: savedOrder.foodName,
        portion: savedOrder.portion,
        quantity: savedOrder.quantity,
        Price: savedOrder.Price,
        pickupDate,
        pickupTime,
        phoneNumber,
      });
    }

    const refNumbers = savedOrders.map((o) => o.orderCode).join(", ");
    try {
      const newNotification = new NotifiModel({
        userId,
        title: savedOrders.length > 1 ? "New Food Orders" : "New Food Order",
        message: `A new food order has been placed. Your Ref Number(s): ${refNumbers}.`,
      });
      await newNotification.save();

      // Notify managers
      const managers = await User.find({
        Role: "Operation Manager 1 (Restraunt,Liquor)",
      }).select("_id");

      if (managers.length > 0) {
        await NotifiModel.insertMany(
          managers.map((manager) => ({
            userId: manager._id,
            title:
              savedOrders.length > 1 ? "New Food Orders" : "New Food Order",
            message: `${fullName} placed a new food order. Ref Number(s): ${refNumbers}.`,
          })),
        );
      } else {
        console.warn("No managers found for new order notification");
      }
    } catch (notifError) {
      console.error("Notification error (non-blocking):", notifError);
    }

    res.status(201).json(savedOrders.length > 1 ? savedOrders : savedOrders[0]);
  } catch (error) {
    console.error("Error creating food order:", error);
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "A duplicate entry was detected. Please try again." });
    }
    res.status(500).json({ message: "Failed to create food order" });
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
    const userId = req.userData.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!user.Phone) {
      return res.status(400).json({
        message:
          "Please update your profile with a phone number before Updating Order.",
      });
    }
    const { id } = req.params;
    const {
      fullName,
      email,
      quantity,
      phoneNumber,
      pickupDate,
      pickupTime,
      Price,
      portion,
    } = req.body;
    if (!id) {
      return res.status(400).json({ message: "Food order ID is required" });
    }
    if (
      !fullName ||
      !email ||
      !quantity ||
      !phoneNumber ||
      !pickupDate ||
      !pickupTime ||
      !portion
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const phoneRegex = /^(?:\+94|0)?(7[0-8]\d{7}|[1-9]\d{8})$/;
    if (!phoneRegex.test(phoneNumber)) {
      return res.status(400).json({ message: "Invalid phone number format" });
    }
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    // Sri Lanka Time Validation
    const { slDate, slTime } = getCurrentSLTime();
    if (pickupDate < slDate) {
      return res.status(400).json({
        message:
          "Selected date is in the past. Please choose today or a future date.",
      });
    }
    if (pickupDate === slDate && pickupTime <= slTime) {
      return res.status(400).json({
        message:
          "Selected time has already passed for today. Please choose a future time.",
      });
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

    try {
      await NotifiModel.create({
        userId: updatedOrder.userId,
        title: "Food Order Updated",
        message: `Your food order with Ref Number: ${updatedOrder.orderCode} has been updated.`,
      });

      const managers = await User.find({
        Role: "Operation Manager 1 (Restraunt,Liquor)",
      }).select("_id");

      if (managers.length > 0) {
        await NotifiModel.insertMany(
          managers.map((manager) => ({
            userId: manager._id,
            title: "Food Order Updated",
            message: `The food order ${updatedOrder.orderCode} has been updated. Please review the changes.`,
          })),
        );
      }
    } catch (notifError) {
      console.error("Notification error (non-blocking):", notifError);
    }

    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error("Error updating food order:", error); // full detail in server terminal
    res.status(500).json({
      message: "Failed to update food order",
      error: error.message, // explicitly extract the string, not the Error object
    });
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

    const newNotification = new NotifiModel({
      userId: order.userId,
      title: "Food Order Deleted",
      message: `Your food order with Ref Number: ${order.orderCode} has been deleted.`,
    });
    await newNotification.save();

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
    const newNotification = new NotifiModel({
      userId: updatedOrder.userId,
      title: "Food Order Completed",
      message: `Your food order with Ref Number: ${updatedOrder.orderCode} has been completed.`,
    });
    await newNotification.save();
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
    const newNotification = new NotifiModel({
      userId: updatedOrder.userId,
      title: "Food Order Accepted",
      message: `Your food order with Ref Number: ${updatedOrder.orderCode} has been accepted.`,
    });
    await newNotification.save();
    res.status(200).json(updatedOrder);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update food order status", error });
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
    const newNotification = new NotifiModel({
      userId: updatedOrder.userId,
      title: "Food Order Preparing",
      message: `Your food order with Ref Number: ${updatedOrder.orderCode} is now being preparing.`,
    });
    await newNotification.save();
    res.status(200).json(updatedOrder);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update food order status", error });
  }
};

const getCompleteFoodOrders = async (req, res) => {
  try {
    const completeOrders = await FoodOrder.find({ status: "Complete" });
    if (completeOrders.length === 0) {
      return res.status(404).json({ message: "No complete food orders found" });
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
    res
      .status(500)
      .json({ message: "Failed to retrieve accepted orders", error });
  }
};

const getPreparingFoodOrders = async (req, res) => {
  try {
    const preparingOrders = await FoodOrder.find({ status: "Preparing" });
    res.status(200).json(preparingOrders);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to retrieve preparing orders", error });
  }
};

const getPendingFoodOrders = async (req, res) => {
  try {
    const pendingOrders = await FoodOrder.find({ status: "Pending" });
    if (pendingOrders.length === 0) {
      return res.status(404).json({ message: "No pending food orders found" });
    }
    res.status(200).json(pendingOrders);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to retrieve pending food orders", error });
  }
};
const getUserOrders = async (req, res) => {
  try {
    const userId = req.userData.id;

    const orders = await FoodOrder.find({ userId }).sort({ createdAt: -1 });

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
