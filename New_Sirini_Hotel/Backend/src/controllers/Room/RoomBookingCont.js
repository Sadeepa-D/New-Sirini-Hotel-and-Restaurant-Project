const RoomBooking = require("../../models/Rooms/RoomBookModel");

const createRoomBooking = async (req, res) => {
  try {
    const { name, email, phone, checkInDate, checkOutDate, roomNumber, numberOfGuests } = req.body;

    // 1. දිනවල වේලාව ඉවත් කර පිරිසිදු දින ලබා ගැනීම (Normalize Dates)
    const newIn = new Date(checkInDate);
    newIn.setHours(0, 0, 0, 0);

    const newOut = new Date(checkOutDate);
    newOut.setHours(0, 0, 0, 0);

    // 2. පද්ධතියේ දැනට පවතින ගැටෙන දින (Overlapping Bookings) පරීක්ෂා කිරීම
    const existingBooking = await RoomBooking.findOne({
      roomNumber: roomNumber, // ✅ Schema එකේ ඇති field name එකම භාවිතා කළා
      status: { $in: ["Confirmed", "Pending"] }, // Confirmed හෝ Pending ඕනෑම එකක් ඇත්නම් අවහිර කරයි
      $or: [
        {
          checkInDate: { $lt: newOut }, // පවතින එකේ ඇතුළු වන දිනය අලුත් එකේ පිටවන දිනයට පෙර විය යුතුයි
          checkOutDate: { $gt: newIn }  // පවතින එකේ පිටවන දිනය අලුත් එකේ ඇතුළු වන දිනයට පසු විය යුතුයි
        }
      ]
    });

    // 3. ගැටෙන දින හමු වුවහොත් පාරිභෝගිකයාට ඉඩ නොදෙන්න
    if (existingBooking) {
      return res.status(400).json({ 
        error: "Sorry! This room is already reserved for the dates you selected. Please try different dates." 
      });
    }

    // 4. කිසිම ගැටළුවක් නැතිනම් පමණක් අලුත් Booking එක සාදන්න
    const newRoomBooking = new RoomBooking({
      name,
      email,
      phone,
      checkInDate: newIn,
      checkOutDate: newOut,
      roomNumber,
      numberOfGuests,
      status: "Pending", // Admin review සඳහා Pending ලෙස තබයි
    });

    await newRoomBooking.save();
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
    const roomBookings = await RoomBooking.find();
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
    const pendingRoomBookings = await RoomBooking.find({ status: "Pending" });
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
    });
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
    });
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
    const overdueRoomBookings = await RoomBooking.find({ status: "Overdue" });
    if (overdueRoomBookings.length === 0) {
      return res.status(404).json({ error: "No overdue room bookings found" });
    }
    res.status(200).json(overdueRoomBookings);
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
};
