// Name එක
// Email එක
// Phone num එක
// Check in date
// Check out date

const mongoose = require("mongoose");

const roomBookSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  checkInDate: {
    type: Date,
    required: true,
  },
  checkOutDate: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model("RoomBook", roomBookSchema);
