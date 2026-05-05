const receptionandHallBook = require("../../models/Reception/ReceptionHallBookings");

const createReceptionHallBooking = async (req, res) => {
  try {
    const {
      customerName,
      customerEmail,
      customerPhone,
      eventDate,
      eventType,
      numberOfGuests,
      specialRequests,
    } = req.body;
    if (
      !customerName ||
      !customerEmail ||
      !customerPhone ||
      !eventDate ||
      !eventType ||
      !numberOfGuests
    ) {
      return res
        .status(400)
        .json({ message: "All required fields must be filled" });
    }
    const newBooking = new receptionandHallBook({
      customerName,
      customerEmail,
      customerPhone,
      eventDate,
      eventType,
      numberOfGuests,
      specialRequests,
    });
    await newBooking.save();
    res.status(201).json(newBooking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};



module.exports = {
  createReceptionHallBooking,
  GetBookingDates,
};
