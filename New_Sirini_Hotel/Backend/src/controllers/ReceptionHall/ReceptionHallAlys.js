const ReceptionAppointModel = require("../../models/Reception/ReciptionAppointModel");
const ReceptionHallBookingModel = require("../../models/Reception/ReceptionHallBookings");

const getmonthlyappointmentdetails = async (req, res) => {
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
    const appointments = await ReceptionAppointModel.find({
      date: { $gte: startofmonth, $lt: endofmonth },
    });
    const stats = {
      Pending: 0,
      Completed: 0,
      Cancelled: 0,
      Overdue: 0,
    };
    appointments.forEach((appointment) => {
      if (appointment.status in stats) {
        stats[appointment.status] += 1;
      }
    });
    res.json(stats);
  } catch (error) {
    console.error("Error fetching appointment stats:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getmonthlyReceptionHallBookingDetails = async (req, res) => {
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

    const bookings = await ReceptionHallBookingModel.find({
      eventDate: { $gte: startofmonth, $lt: endofmonth },
    });

    const stats = {
      DayConfirmed: 0,
      DayCancelled: 0,
      NightConfirmed: 0,
      NightCancelled: 0,
    };

    bookings.forEach((booking) => {
      const bookingstatus = booking.status;
      const bookingtime = booking.eventTime;
      if (bookingstatus === "Confirmed" && bookingtime.includes("Day")) {
        stats.DayConfirmed += 1;
      }
      if (bookingstatus === "Cancelled" && bookingtime.includes("Day")) {
        stats.DayCancelled += 1;
      }
      if (bookingstatus === "Confirmed" && bookingtime.includes("Night")) {
        stats.NightConfirmed += 1;
      }
      if (bookingstatus === "Cancelled" && bookingtime.includes("Night")) {
        stats.NightCancelled += 1;
      }
    });

    res.json(stats);
  } catch (error) {
    console.error("Error fetching reception hall booking stats:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getmonthlyappointmentdetails,
  getmonthlyReceptionHallBookingDetails,
};
