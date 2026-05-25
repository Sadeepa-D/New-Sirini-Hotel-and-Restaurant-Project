const cron = require("node-cron");
const FoodItemorder = require("../models/Restraunt/FoodItemBookModel");
const Appointment = require("../models/Reception/ReciptionAppointModel");
const RoomBook = require("../models/Rooms/RoomBookModel");
const NotifiModel = require("../models/NotifiModel");

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

      // ================= FOOD ORDERS =================

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
          const newNotifi = new NotifiModel({
            userId: order.userId,
            title: `${order.foodName} Order is overdue`,
            message: `The pickup time for order, Ref: ${order.orderCode} has passed without completion.`,
          });
          await newNotifi.save();
          updatedCount++;
        }
      }

      if (updatedCount > 0) {
        console.log(`[Cron] Updated ${updatedCount} orders to 'Overdue'`);
      }

      // ================= APPOINTMENTS =================

      const appointments = await Appointment.find({
        status: "Pending",
      });

      let updatedappointments = 0;
      for (const appointment of appointments) {
        if (!appointment.date) continue;
        const appointmentDate = new Date(appointment.date)
          .toISOString()
          .split("T")[0];
        if (appointmentDate < slDate) {
          appointment.status = "Overdue";
          await appointment.save();
          const newNotifi = new NotifiModel({
            userId: appointment.userId,
            title: `${appointment.eventType} Appointment is overdue`,
            message: `The date for your appointment, Ref: ${appointment.appointcode} has passed without completion.`,
          });
          await newNotifi.save();
          updatedappointments++;
        }
      }

      if (updatedappointments > 0) {
        console.log(
          `[Cron] Updated ${updatedappointments} appointments to 'Overdue'`,
        );
      }

      // ================= Room Bookings =================

      const roomBookings = await RoomBook.find({
        status: "Pending",
      });
      let updatedRoomBookings = 0;
      for (const booking of roomBookings) {
        if (!booking.checkInDate) continue;
        const bookingCheckInDate = new Date(booking.checkInDate)
          .toISOString()
          .split("T")[0];
        if (bookingCheckInDate < slDate) {
          booking.status = "Overdue";
          await booking.save();
          const newNotifi = new NotifiModel({
            userId: booking.userId,
            title: `Room Number:${booking.roomNumber} Booking is overdue`,
            message: `The check-in date for your room booking, Ref: ${booking.bookingCode} has passed without completion.`,
          });
          await newNotifi.save();
          updatedRoomBookings++;
        }
      }
      if (updatedRoomBookings > 0) {
        console.log(
          `[Cron] Updated ${updatedRoomBookings} room bookings to 'Overdue'`,
        );
      }
    } catch (error) {
      console.error("[Cron Error] Error in overdue automation job:", error);
    }
  });

  // ================= Read Notifi clear =================

  cron.schedule("0 0 */5 * *", async () => {
    try {
      console.log("[Cron Cleanup] Starting cleanup of read notifications...");
      const result = await NotifiModel.deleteMany({ isRead: true });
      console.log(
        `[Cron Cleanup] Successfully deleted ${result.deletedCount} read notifications.`,
      );
    } catch (error) {
      console.error("[Cron Error] Error in notification cleanup job:", error);
    }
  });
  console.log("[Cron] Overdue status automation system initialized");
};

module.exports = { initCronJobs };
