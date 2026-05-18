const FoodItemsBookModel = require("../../models/Restraunt/FoodItemBookModel");

const getRestaurantOrderStats = async (req, res) => {
  try {
    const { month, year } = req.body;

    if (!month || !year) {
      return res.status(400).json({ error: "Month and year are required" });
    }
    const startofmonth = new Date(
      Date.UTC(Number(year), Number(month) - 1, 1, 0, 0, 0),
    );
    const endofmonth = new Date(
      Date.UTC(Number(year), Number(month), 1, 0, 0, 0),
    );
    const slStartBoundary = new Date(
      startofmonth.getTime() - 5.5 * 60 * 60 * 1000,
    );
    const slEndBoundary = new Date(endofmonth.getTime() - 5.5 * 60 * 60 * 1000);
    const orderscount = await FoodItemsBookModel.find({
      pickupDate: { $gte: slStartBoundary, $lt: slEndBoundary },
    });
    const status = {
      Accepted: 0,
      Complete: 0,
      delete: 0,
      Overdue: 0,
    };
    orderscount.forEach((order) => {
      if (order.status in status) {
        status[order.status] += 1;
      }
    });
    res.json(status);
  } catch (error) {
    console.error("Error fetching restaurant order stats:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getRestaurantOrderStats,
};
