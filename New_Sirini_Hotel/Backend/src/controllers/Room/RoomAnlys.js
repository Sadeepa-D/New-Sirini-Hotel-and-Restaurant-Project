const RoomBook = require("../../models/Rooms/RoomBookModel");
const Room = require("../../models/Rooms/RoomModel");

const getBookingStats = async (req, res) => {
  try {
    const { month, year } = req.body;
    
    if (!month || !year) {
      return res.status(400).json({ message: "Month and year are required" });
    }

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);

    const bookings = await RoomBook.find({
      checkInDate: { $gte: startDate, $lte: endDate }
    });

    const summary = {
      Confirmed: 0,
      Cancelled: 0,
      Overdue: 0,
      Pending: 0,
      Completed: 0
    };

    for (let i = 0; i < bookings.length; i++) {
      const status = bookings[i].status;
      if (summary[status] !== undefined) {
        summary[status] += 1;
      }
    }

    res.status(200).json({ summary });
  } catch (error) {
    res.status(500).json({ message: "Error fetching booking stats", error: error.message });
  }
};

const getRoomFrequency = async (req, res) => {
  try {
    const { month, year } = req.body;
    
    if (!month || !year) {
      return res.status(400).json({ message: "Month and year are required" });
    }

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);

    const bookings = await RoomBook.find({
      checkInDate: { $gte: startDate, $lte: endDate },
      status: { $ne: "Cancelled" } 
    });

    const roomCounts = {};

    for (let i = 0; i < bookings.length; i++) {
      const roomNum = bookings[i].roomNumber;
      if (roomCounts[roomNum]) {
        roomCounts[roomNum] += 1;
      } else {
        roomCounts[roomNum] = 1;
      }
    }

    const frequency = [];
    for (const room in roomCounts) {
      frequency.push({
        roomNumber: room,
        count: roomCounts[room]
      });
    }

    res.status(200).json({ frequency });
  } catch (error) {
    res.status(500).json({ message: "Error fetching room frequency", error: error.message });
  }
};

const getRoomStatusOverview = async (req, res) => {
  try {
    const rooms = await Room.find({});

    const statusOverview = {
      available: 0,
      reserved: 0,
      maintenance: 0
    };

    for (let i = 0; i < rooms.length; i++) {
      const status = rooms[i].status ? rooms[i].status.toLowerCase() : "";
      if (statusOverview[status] !== undefined) {
        statusOverview[status] += 1;
      }
    }

    res.status(200).json({ statusOverview });
  } catch (error) {
    res.status(500).json({ message: "Error fetching room status overview", error: error.message });
  }
};

const getMonthlyRevenue = async (req, res) => {
  try {
    const { year } = req.body;

    if (!year) {
      return res.status(400).json({ message: "Year is required" });
    }

    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31, 23, 59, 59, 999);

    const bookings = await RoomBook.find({
      checkInDate: { $gte: startDate, $lte: endDate },
      status: { $in: ["Confirmed", "Completed"] }
    });

    const monthsArray = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    const monthlyRevenue = monthsArray.map((month, index) => ({
      month,
      revenue: 0,
      monthNumber: index + 1
    }));

    for (let i = 0; i < bookings.length; i++) {
      const bookingDate = new Date(bookings[i].checkInDate);
      const monthIndex = bookingDate.getMonth();
      const amount = Number(bookings[i].totalAmount) || 0;
      
      monthlyRevenue[monthIndex].revenue += amount;
    }

    res.status(200).json({ monthlyRevenue });
  } catch (error) {
    res.status(500).json({ message: "Error fetching monthly revenue", error: error.message });
  }
};

const getRevenueByRoom = async (req, res) => {
  try {
    const { year } = req.body;

    if (!year) {
      return res.status(400).json({ message: "Year is required" });
    }

    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31, 23, 59, 59, 999);

    const bookings = await RoomBook.find({
      checkInDate: { $gte: startDate, $lte: endDate },
      status: { $in: ["Confirmed", "Completed"] }
    });

    const roomRevenues = {};

    for (let i = 0; i < bookings.length; i++) {
      const roomNum = bookings[i].roomNumber;
      const amount = Number(bookings[i].totalAmount) || 0;

      if (roomRevenues[roomNum]) {
        roomRevenues[roomNum] += amount;
      } else {
        roomRevenues[roomNum] = amount;
      }
    }

    const revenueByRoom = [];
    for (const room in roomRevenues) {
      revenueByRoom.push({
        roomNumber: room,
        revenue: roomRevenues[room]
      });
    }

    res.status(200).json({ revenueByRoom });
  } catch (error) {
    res.status(500).json({ message: "Error fetching revenue by room", error: error.message });
  }
};

module.exports = {
  getBookingStats,
  getRoomFrequency,
  getRoomStatusOverview,
  getMonthlyRevenue,
  getRevenueByRoom
};
