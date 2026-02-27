// Name 
// Email
// Phone number
// Date

const mongoose = require("mongoose");

const reciptionAppointSchema = new mongoose.Schema({
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
    date: {
        type: Date,
        required: true,
    },
});
module.exports = mongoose.model("ReciptionAppoint", reciptionAppointSchema);