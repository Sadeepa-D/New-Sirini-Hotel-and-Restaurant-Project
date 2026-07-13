const mongoose = require("mongoose");

const receptionHallBookingSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: true,
    },
    customerEmail: {
      type: String,
      required: true,
    },
    customerPhone: {
      type: String,
      required: true,
    },
    eventDate: {
      type: Date,
      required: true,
    },
    eventTime: {
      type: String,
      required: true,
    },
    eventType: {
      type: String,
      required: true,
    },
    numberOfGuests: {
      type: Number,
      required: true,
    },
    specialRequests: {
      type: String,
    },
    status: {
      type: String,
      enum: ["Confirmed", "Booked", "Cancelled"],
      default: "Confirmed",
    },
    amountPayed: {
      type: Number,
      required: false,
      default: 0,
    },
    paymentMethod: {
      type: String,
      enum: ["Cash", "Online Transfer"],
      default: "Cash",
    },
    paymentProofUrl: {
      type: String,
      default: "",
    },
    paymentProofPublicId: {
      type: String,
      default: "",
    },
    selectedPackage: {
      type: String,
      required: true,
    },
    refnumber: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model(
  "ReceptionHallBooking",
  receptionHallBookingSchema,
);
