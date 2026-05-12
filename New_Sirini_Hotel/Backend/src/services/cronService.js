const cron = require("node-cron");
const FoodItemorder = require("../models/Restraunt/FoodItemBookModel");

const initCronJobs = () => {
  // Run every minute
  cron.schedule("* * * * *", async () => {
    try {
      // Get current time in Sri Lanka using the same logic as the controller
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

      // Find orders with status 'Pending' or 'Accepted'
      const orders = await FoodItemorder.find({
        status: { $in: ["Pending", "Accepted"] },
      });

      let updatedCount = 0;

      for (const order of orders) {
        if (!order.pickupDate || !order.pickupTime) continue;

        // Get pickup date in YYYY-MM-DD format
        const orderPickupDate = new Date(order.pickupDate)
          .toISOString()
          .split("T")[0];

        // Compare using the same logic as validation
        let isOverdue = false;
        if (orderPickupDate < slDate) {
          isOverdue = true;
        } else if (orderPickupDate === slDate && order.pickupTime < slTime) {
          isOverdue = true;
        }

        if (isOverdue) {
          order.status = "Overdue";
          await order.save();
          updatedCount++;
        }
      }

      if (updatedCount > 0) {
        console.log(`[Cron] Updated ${updatedCount} orders to 'Overdue'`);
      }
    } catch (error) {
      console.error("[Cron Error] Error in overdue automation job:", error);
    }
  });

  console.log("[Cron] Overdue status automation system initialized");
};

module.exports = { initCronJobs };
