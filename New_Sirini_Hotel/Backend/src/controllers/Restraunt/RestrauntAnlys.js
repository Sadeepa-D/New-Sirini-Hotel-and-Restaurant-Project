const FoodItemsBookModel = require("../../models/Restraunt/FoodItemBookModel");
const FoodItemModel = require("../../models/Restraunt/FoodItemModel");

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
      Revenue: 0,
    };

    const dailyMap = {};

    orderscount.forEach((order) => {
      const currentstatus = order.status;

      if (currentstatus in status) {
        status[currentstatus] += 1;
        if (currentstatus === "Complete" && order.Price) {
          status.Revenue += order.Price;
        }
      }

      if (order.pickupDate) {
        const dateobj = new Date(order.pickupDate);
        const sldateobj = new Date(dateobj.getTime() + 5.5 * 60 * 60 * 1000);
        const dateKey = sldateobj.toISOString().split("T")[0];

        if (!dailyMap[dateKey]) {
          dailyMap[dateKey] = {
            date: dateKey,
            Accepted: 0,
            Complete: 0,
            delete: 0,
            Overdue: 0,
            Revenue: 0,
          };
        }
        if (currentstatus in dailyMap[dateKey]) {
          dailyMap[dateKey][currentstatus] += 1;
          if (currentstatus === "Complete" && order.Price) {
            dailyMap[dateKey].Revenue += order.Price;
          }
        }
      }
    });

    const dailyarray = Object.values(dailyMap).sort((a, b) =>
      a.date.localeCompare(b.date),
    );

    res.json({
      summary: status,
      daily: dailyarray,
    });
  } catch (error) {
    console.error("Error fetching restaurant order stats:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getrestrauntfooditemsstatus = async (req, res) => {
  try {
    const foodItems = await FoodItemModel.find();
    const Categories = [
      "Chopsy Rice",
      "Rice & Nasi Goreng",
      "Kottu",
      "Noodles",
      "Bites",
      "Side Dishes",
      "Snacks",
    ];
    const catgoryStatus = {};
    Categories.forEach((category) => {
      catgoryStatus[category] = {
        category: category,
        Available: 0,
        Unavailable: 0,
      };
    });

    foodItems.forEach((item) => {
      if (item.category in catgoryStatus) {
        if (item.availability) {
          catgoryStatus[item.category].Available += 1;
        } else {
          catgoryStatus[item.category].Unavailable += 1;
        }
      }
    });
    const statusobj = Object.values(catgoryStatus);
    res.json(statusobj);
  } catch (error) {
    console.error("Error fetching restaurant food items status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getRestaurantOrderStats,
  getrestrauntfooditemsstatus,
};
