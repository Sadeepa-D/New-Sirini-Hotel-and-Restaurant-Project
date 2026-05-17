const ReceptionAppointModel = require("../../models/Reception/ReciptionAppointModel");

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

module.exports = {
  getmonthlyappointmentdetails,
};
