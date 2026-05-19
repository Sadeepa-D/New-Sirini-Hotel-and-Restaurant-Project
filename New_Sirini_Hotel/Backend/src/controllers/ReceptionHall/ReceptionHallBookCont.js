const receptionandHallBook = require("../../models/Reception/ReceptionHallBookings");

const createReceptionHallBooking = async (req, res) => {
  try {
    const {
      customerName,
      customerEmail,
      customerPhone,
      eventDate,
      eventTime,
      eventType,
      numberOfGuests,
      specialRequests,
      status,
      selectedPackage,
      amountPayed,
    } = req.body;
    if (
      !customerName ||
      !customerEmail ||
      !customerPhone ||
      !eventDate ||
      !eventTime ||
      !eventType ||
      !numberOfGuests ||
      !status ||
      !selectedPackage ||
      !amountPayed
    ) {
      return res
        .status(400)
        .json({ message: "All required fields must be filled" });
    }
    const existingBooking = await receptionandHallBook.findOne({
      eventDate: eventDate,
      eventTime: eventTime,
      status: "Confirmed",
    });
    if (existingBooking) {
      return res
        .status(400)
        .json({ message: "Selected date and time slot is already booked" });
    }
    const newBooking = new receptionandHallBook({
      customerName,
      customerEmail,
      customerPhone,
      eventDate,
      eventTime,
      eventType,
      numberOfGuests,
      specialRequests,
      status: status || "Confirmed",
      selectedPackage,
      amountPayed,
    });
    await newBooking.save();
    res.status(201).json(newBooking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getReceptionHallBookings = async (req, res) => {
  try {
    const bookings = await receptionandHallBook.find();
    res.status(200).json(bookings);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteReceptionHallBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBooking = await receptionandHallBook.findByIdAndDelete(id);
    if (!deletedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const editReceptionHallBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      customerName,
      customerEmail,
      customerPhone,
      eventDate,
      eventTime,
      eventType,
      numberOfGuests,
      specialRequests,
      status,
      selectedPackage,
      amountPayed,
    } = req.body;
    const updatedBooking = await receptionandHallBook.findByIdAndUpdate(
      id,
      {
        customerName,
        customerEmail,
        customerPhone,
        eventDate,
        eventTime,
        eventType,
        numberOfGuests,
        specialRequests,
        status,
        selectedPackage,
        amountPayed,
      },
      { new: true },
    );
    if (!updatedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.status(200).json(updatedBooking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateBookingStatus = async (req, res) => {
  try {
    const { id, status } = req.params;
    if (!id || !status) {
      return res
        .status(400)
        .json({ message: "Booking ID and status are required" });
    }
    if (!["Confirmed", "Booked", "Cancelled"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }
    const updatedBooking = await receptionandHallBook.findByIdAndUpdate(
      id,
      { status },
      { new: true },
    );
    if (!updatedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.status(200).json(updatedBooking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const GetBookingDates = async (req, res) => {
  try {
    const bookings = await receptionandHallBook.find(
      { status: { $in: ["Confirmed", "Booked"] } },
      "eventDate eventTime",
    );
    res.status(200).json(bookings);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createReceptionHallBooking,
  GetBookingDates,
  getReceptionHallBookings,
  deleteReceptionHallBooking,
  editReceptionHallBooking,
  updateBookingStatus,
};
