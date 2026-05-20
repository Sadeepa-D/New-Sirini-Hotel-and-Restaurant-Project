const ReceptionAppointModel = require("../../models/Reception/ReciptionAppointModel");
const ReceptionHallBookingModel = require("../../models/Reception/ReceptionHallBookings");
const ReceptionHallPackageModel = require("../../models/Reception/ReceptionHallPackages");
const CateringitemsModel = require("../../models/Reception/CateringItems");
const AdvertisementModel = require("../../models/Reception/AdvertisingModel");

const getSLMonthRange = (month, year) => {
  const startUTC = new Date(
    Date.UTC(Number(year), Number(month) - 1, 1, 0, 0, 0),
  );

  const endUTC = new Date(Date.UTC(Number(year), Number(month), 1, 0, 0, 0));

  return {
    start: new Date(startUTC.getTime() - 5.5 * 60 * 60 * 1000),
    end: new Date(endUTC.getTime() - 5.5 * 60 * 60 * 1000),
  };
};

const getmonthlyappointmentdetails = async (req, res) => {
  try {
    const { month, year } = req.body;
    if (!month || !year) {
      return res.status(400).json({ error: "Month and year are required" });
    }
    const { start, end } = getSLMonthRange(month, year);
    const appointments = await ReceptionAppointModel.find({
      date: { $gte: start, $lt: end },
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

    const { start, end } = getSLMonthRange(month, year);

    const bookings = await ReceptionHallBookingModel.find({
      eventDate: { $gte: start, $lt: end },
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

const getYearlyReceptionHallIncome = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    const startOfYear = new Date(Date.UTC(currentYear, 0, 1, 0, 0, 0));
    const endOfYear = new Date(Date.UTC(currentYear + 1, 0, 1, 0, 0, 0));
    const slStartOfYear = new Date(
      startOfYear.getTime() - 5.5 * 60 * 60 * 1000,
    );
    const slEndOfYear = new Date(endOfYear.getTime() - 5.5 * 60 * 60 * 1000);

    const bookings = await ReceptionHallBookingModel.find({
      eventDate: { $gte: slStartOfYear, $lt: slEndOfYear },
      status: { $in: ["Confirmed", "Booked"] },
    });
    const monthlyIncome = Array(12).fill(0);

    bookings.forEach((booking) => {
      if (booking.eventDate) {
        const slDate = new Date(
          booking.eventDate.getTime() + 5.5 * 60 * 60 * 1000,
        );
        const month = slDate.getUTCMonth();
        monthlyIncome[month] += Number(booking.amountPayed);
      }
    });
    const MonthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const Incomewithmonths = monthlyIncome.map((income, index) => ({
      month: MonthNames[index],
      income,
    }));
    res.json(Incomewithmonths);
  } catch (error) {
    console.error("Error fetching yearly reception hall income:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getreceptionhallcommondetails = async (req, res) => {
  try {
    const activePackagesCount = await ReceptionHallPackageModel.countDocuments({
      status: true,
    });
    const inactivePackagesCount =
      await ReceptionHallPackageModel.countDocuments({ status: false });
    const ActiveCateringItemsCount = await CateringitemsModel.countDocuments({
      status: true,
    });
    const InactiveCateringItemsCount = await CateringitemsModel.countDocuments({
      status: false,
    });
    const ActiveAdvertismentsCount = await AdvertisementModel.countDocuments({
      status: "approved",
    });
    const PendingAdvertismentsCount = await AdvertisementModel.countDocuments({
      status: "pending",
    });
    const RejectedAdvertismentsCount = await AdvertisementModel.countDocuments({
      status: "rejected",
    });

    res.json({
      activePackages: activePackagesCount,
      inactivePackages: inactivePackagesCount,
      activeCateringItems: ActiveCateringItemsCount,
      inactiveCateringItems: InactiveCateringItemsCount,
      activeAdvertisments: ActiveAdvertismentsCount,
      pendingAdvertisments: PendingAdvertismentsCount,
      rejectedAdvertisments: RejectedAdvertismentsCount,
    });
  } catch (error) {
    console.error("Error fetching reception hall common details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getreceptionhallpackagesbookedcount = async (req, res) => {
  try {
    const packages = await ReceptionHallPackageModel.find();
    const bookings = await ReceptionHallBookingModel.find({
      status: { $in: ["Confirmed", "Booked"] },
    });

    const packagesandcount = packages.map((pkg) => ({
      packageName: pkg.name,
      count: 0,
    }));

    bookings.forEach((booking) => {
      const matchedPackage = packagesandcount.find(
        (p) => p.packageName === booking.selectedPackage,
      );
      if (matchedPackage) {
        matchedPackage.count += 1;
      }
    });

    res.json(packagesandcount);
  } catch (error) {
    console.error(
      "Error fetching reception hall package booking counts:",
      error,
    );
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getmonthlyappointmentdetails,
  getmonthlyReceptionHallBookingDetails,
  getreceptionhallcommondetails,
  getYearlyReceptionHallIncome,
  getreceptionhallpackagesbookedcount,
};
