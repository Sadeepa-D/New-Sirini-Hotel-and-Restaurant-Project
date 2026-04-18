// Room Number එක
// Room type එක
// එක රෑකට price එක
// තියෙන ඇඳේ type එක
// ඉන්න පුලුවන් ගාන
// Room avalability එක
// Room image
const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema(
  {
    roomNumber: {
      type: Number,
      required: true,
      unique: true,
    },
    roomType: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    bedType: {
      type: String,
      required: true,
    },
    capacity: {
      type: Number,
      required: true,
    },

    //availability (Boolean) ඉවත් කර status (String) එක් කළා
    status: {
      type: String,
      required: true,
      enum: ["available", "reserved", "maintenance"], // මේ වචන 3 පමණක් භාර ගනී
      default: "available",
    },
    image: {
      type: String,
      required: true,
    },

    condition: {
    type: String,
    enum: ['AC', 'Fan'], // AC හෝ Fan පමණක් තෝරාගත හැකි ලෙස
    default: 'Fan'
  },

    description: {
    type: String,
    default: "",
  },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Room", RoomSchema);
