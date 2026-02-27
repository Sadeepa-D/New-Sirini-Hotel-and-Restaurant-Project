// Full name
// Phone Number
// Quantity
// Pickup date
// Pickup time

const mongoose = require("mongoose");

const foodItemBookSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  pickupDate: {
    type: Date,
    required: true,
  },
  pickupTime: {
    type: String,
    required: true,
  },
});
module.exports = mongoose.model("FoodItemBook", foodItemBookSchema);
