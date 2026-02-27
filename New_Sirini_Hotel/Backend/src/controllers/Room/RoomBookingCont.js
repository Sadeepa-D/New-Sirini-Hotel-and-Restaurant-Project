const RoomBooking = require("../../models/Rooms/RoomBookModel");

const createRoomBooking = async (req, res) => {
  try {
    const { name, email, phone, checkInDate, checkOutDate } = req.body;
    if (!name || !email || !phone || !checkInDate || !checkOutDate) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const newRoomBooking = new RoomBooking({
      name,
      email,
      phone,
      checkInDate,
      checkOutDate,
    });
    await newRoomBooking.save();
    res.status(201).json(newRoomBooking);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
module.exports = {
  createRoomBooking,
};
