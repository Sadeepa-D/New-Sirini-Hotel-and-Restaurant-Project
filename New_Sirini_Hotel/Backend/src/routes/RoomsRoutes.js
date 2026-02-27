const express = require("express");
const router = express.Router();
const roomBookingController = require("../controllers/Room/RoomBookingCont");

router.post("/book", roomBookingController.createRoomBooking);

module.exports = router;
