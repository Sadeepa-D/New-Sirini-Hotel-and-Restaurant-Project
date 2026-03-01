const express = require("express");
const router = express.Router();
const roomBookingController = require("../controllers/Room/RoomBookingCont");

router.post("/book", roomBookingController.createRoomBooking);
router.delete("/delete/:id", roomBookingController.deleteRoomBooking);
router.put("/edit/:id", roomBookingController.editRoomBooking);
router.get("/viewbookings", roomBookingController.getAllRoomBookings);

module.exports = router;
