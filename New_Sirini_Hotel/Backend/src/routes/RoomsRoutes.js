const express = require("express");
const router = express.Router();
const upload = require("../config/CloudinaryConfig");
const roomBookingController = require("../controllers/Room/RoomBookingCont");
const roomController = require("../controllers/Room/RoomCont");

router.post("/book", roomBookingController.createRoomBooking);
router.delete("/deletebooking/:id", roomBookingController.deleteRoomBooking);
router.put("/updatebooking/:id", roomBookingController.editRoomBooking);
router.get("/viewbookings", roomBookingController.getAllRoomBookings);
router.get(
  "/viewpendingbookings",
  roomBookingController.getPendingRoomBookings,
);
router.get(
  "/viewconfirmedbookings",
  roomBookingController.getConfirmedRoomBookings,
);
router.get(
  "/viewcancelledbookings",
  roomBookingController.getCancelledRoomBookings,
);
router.put(
  "/confirmbooking/:id",
  roomBookingController.setRoomBookingStatustoConfirmed,
);
router.put(
  "/cancelbooking/:id",
  roomBookingController.setRoomBookingStatustoCancelled,
);

router.post("/add", upload.single("image"), roomController.createRoom);
router.get("/viewrooms", roomController.getAllRooms);
router.put(
  "/updateroom/:id",
  upload.single("image"),
  roomController.updateRoom,
);
router.delete("/deleteroom/:id", roomController.deleteRoom);
router.put(
  "/changeroomavailability/:id",
  roomController.toggleRoomAvailability,
);

module.exports = router;
