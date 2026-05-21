const RoomBooking = require("../../models/Rooms/RoomBookModel");
const { sendRoomBookingEmail } = require("../EmailCont");

const genarateRoomBookingCode = async () => {
  const prefix = "SHRB";
  const randomNumber = Math.floor(1000 + Math.random() * 9000);
  const existing = await RoomBooking.findOne({
    bookingCode: `${prefix}${randomNumber}`,
  });
  if (!existing) {
    return `${prefix}${randomNumber}`;
  }
  return await genarateRoomBookingCode();
};

const createRoomBooking = async (req, res) => {
  try {
    const userId = req.userData.id;
    const {
      name,
      email,
      phone,
      checkInDate,
      checkOutDate,
      roomNumber,
      numberOfGuests,
      totalAmount,
      timeSlot,
    } = req.body;

    if (!timeSlot || !["day", "fullday"].includes(timeSlot)) {
      return res
        .status(400)
        .json({ error: "A valid time slot (day or fullday) is required." });
    }

    const parseUTC = (dateStr) => {
      const [y, m, d] = dateStr.split("-").map(Number);
      return new Date(Date.UTC(y, m - 1, d));
    };

    const newIn = parseUTC(checkInDate);
    const newOut = parseUTC(checkOutDate);

    const newStart =
      timeSlot === "day"
        ? newIn.getTime() + 12 * 3600000
        : newIn.getTime() + 16 * 3600000;
    const newEnd =
      timeSlot === "day"
        ? newIn.getTime() + 15 * 3600000
        : newOut.getTime() + 10 * 3600000;

    const activeBookings = await RoomBooking.find({
      roomNumber,
      status: { $in: ["Confirmed", "Pending"] },
    });

    const hasConflict = activeBookings.some((b) => {
      const bIn = b.checkInDate.getTime();
      const bOut = b.checkOutDate.getTime();
      const bStart =
        b.timeSlot === "day" ? bIn + 12 * 3600000 : bIn + 16 * 3600000;
      const bEnd =
        b.timeSlot === "day" ? bIn + 15 * 3600000 : bOut + 10 * 3600000;

      return newStart < bEnd && newEnd > bStart;
    });

    if (hasConflict) {
      const slotLabel =
        timeSlot === "day" ? "Day Package (12:00 PM – 3:00 PM)" : "Full Day";
      return res.status(400).json({
        error: `Sorry! The ${slotLabel} is not available for one or more of those dates. Please choose different dates.`,
      });
    }

    const newRoomBooking = new RoomBooking({
      userId,
      name,
      email,
      phone,
      checkInDate: newIn,
      checkOutDate: newOut,
      roomNumber,
      numberOfGuests,
      status: "Pending",
      bookingCode: await genarateRoomBookingCode(),
      totalAmount,
      bookingType: "day-use",
      timeSlot,
    });

    await newRoomBooking.save();

    await sendRoomBookingEmail({
      name,
      email,
      phone,
      checkInDate: newIn,
      checkOutDate: newOut,
      roomNumber,
      numberOfGuests,
      totalAmount,
      timeSlot,
      status: "Pending",
      newRoomBooking,
    });

    res.status(201).json(newRoomBooking);
  } catch (error) {
    console.error("Booking Error:", error);
    res.status(400).json({ error: error.message });
  }
};

const deleteRoomBooking = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "ID is required" });
    }
    const deletedRoomBooking = await RoomBooking.findByIdAndDelete(id);
    if (!deletedRoomBooking) {
      return res.status(404).json({ error: "Room booking not found" });
    }
    res.status(200).json({ message: "Room booking deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const editRoomBooking = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "ID is required" });
    }
    const { name, email, phone, checkInDate, checkOutDate } = req.body;
    if (!name || !email || !phone || !checkInDate || !checkOutDate) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const updatedRoomBooking = await RoomBooking.findByIdAndUpdate(
      id,
      { name, email, phone, checkInDate, checkOutDate },
      { new: true },
    );
    if (!updatedRoomBooking) {
      return res.status(404).json({ error: "Room booking not found" });
    }
    res.status(200).json(updatedRoomBooking);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAllRoomBookings = async (req, res) => {
  try {
    const roomBookings = await RoomBooking.find().sort({ createdAt: -1 });
    if (roomBookings.length === 0) {
      return res.status(404).json({ error: "No room bookings found" });
    }
    res.status(200).json(roomBookings);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const getPendingRoomBookings = async (req, res) => {
  try {
    const pendingRoomBookings = await RoomBooking.find({
      status: "Pending",
    }).sort({ createdAt: -1 });
    if (pendingRoomBookings.length === 0) {
      return res.status(404).json({ error: "No pending room bookings found" });
    }
    res.status(200).json(pendingRoomBookings);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const getConfirmedRoomBookings = async (req, res) => {
  try {
    const confirmedRoomBookings = await RoomBooking.find({
      status: "Confirmed",
    }).sort({ createdAt: -1 });
    if (confirmedRoomBookings.length === 0) {
      return res
        .status(404)
        .json({ error: "No confirmed room bookings found" });
    }
    res.status(200).json(confirmedRoomBookings);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const getCancelledRoomBookings = async (req, res) => {
  try {
    const cancelledRoomBookings = await RoomBooking.find({
      status: "Cancelled",
    }).sort({ createdAt: -1 });
    if (cancelledRoomBookings.length === 0) {
      return res
        .status(404)
        .json({ error: "No cancelled room bookings found" });
    }
    res.status(200).json(cancelledRoomBookings);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const setRoomBookingStatustoConfirmed = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "ID is required" });
    }
    const updatedRoomBooking = await RoomBooking.findByIdAndUpdate(
      id,
      { status: "Confirmed" },
      { new: true },
    );
    if (!updatedRoomBooking) {
      return res.status(404).json({ error: "Room booking not found" });
    }
    res.status(200).json(updatedRoomBooking);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const setRoomBookingStatustoCancelled = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "ID is required" });
    }
    const updatedRoomBooking = await RoomBooking.findByIdAndUpdate(
      id,
      { status: "Cancelled" },
      { new: true },
    );
    if (!updatedRoomBooking) {
      return res.status(404).json({ error: "Room booking not found" });
    }
    res.status(200).json(updatedRoomBooking);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const getOverdueRoomBookings = async (req, res) => {
  try {
    const overdueRoomBookings = await RoomBooking.find({
      status: "Overdue",
    }).sort({ createdAt: -1 });
    if (overdueRoomBookings.length === 0) {
      return res.status(404).json({ error: "No overdue room bookings found" });
    }
    res.status(200).json(overdueRoomBookings);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const setRoomBookingStatustoCompleted = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedBooking = await RoomBooking.findByIdAndUpdate(
      id,
      { status: "Completed" },
      { new: true },
    );
    res.status(200).json(updatedBooking);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getCompletedRoomBookings = async (req, res) => {
  try {
    const completed = await RoomBooking.find({ status: "Completed" }).sort({
      createdAt: -1,
    });
    res.status(200).json(completed);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getspecificuserbookings = async (req, res) => {
  try {
    const userId = req.userData.id;
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }
    const userBookings = await RoomBooking.find({ userId }).sort({
      createdAt: -1,
    });

    if (userBookings.length === 0) {
      return res.status(404).json({ error: "No bookings found for this user" });
    }
    res.status(200).json(userBookings);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getUnavilableDatesForRoom = async (req, res) => {
  try {
    const { roomNumber } = req.params;
    if (!roomNumber) {
      return res.status(400).json({ error: "Room number is required" });
    }
    const unavialbleDates = await RoomBooking.find(
      { roomNumber, status: { $in: ["Confirmed", "Pending"] } },
      "checkInDate checkOutDate timeSlot",
    ).sort({ createdAt: -1 });
    res.status(200).json(unavialbleDates);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateOverdueBookings = async (req, res) => {
  try {
    // Get today's date at 00:00:00
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Mark as overdue if checkOutDate is BEFORE today (i.e., day has already passed)
    // Example: If checkOutDate is May 14, it will be overdue on May 15 onwards
    const result = await RoomBooking.updateMany(
      {
        checkOutDate: { $lt: today },
        status: { $in: ["Confirmed", "Pending"] },
      },
      { status: "Overdue" },
    );

    res.status(200).json({
      message: "Overdue bookings updated successfully",
      updatedCount: result.modifiedCount,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createRoomBooking,
  deleteRoomBooking,
  editRoomBooking,
  getAllRoomBookings,
  getPendingRoomBookings,
  getConfirmedRoomBookings,
  getCancelledRoomBookings,
  setRoomBookingStatustoConfirmed,
  setRoomBookingStatustoCancelled,
  getOverdueRoomBookings,
  setRoomBookingStatustoCompleted,
  getCompletedRoomBookings,
  getspecificuserbookings,
  getUnavilableDatesForRoom,
  updateOverdueBookings,
};
