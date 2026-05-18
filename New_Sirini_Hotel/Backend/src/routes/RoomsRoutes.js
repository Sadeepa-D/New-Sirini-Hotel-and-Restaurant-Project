const express = require("express");
const router = express.Router();
const upload = require("../config/CloudinaryConfig");
const authmiddleware = require("../middleware/AuthMiddleware");
const roomBookingController = require("../controllers/Room/RoomBookingCont");
const roomController = require("../controllers/Room/RoomCont");
const roomAnlysController = require("../controllers/Room/RoomAnlys");

router.post("/book", authmiddleware, roomBookingController.createRoomBooking);
router.delete("/deletebooking/:id", roomBookingController.deleteRoomBooking);
router.put("/updatebooking/:id", roomBookingController.editRoomBooking);
router.get("/viewbookings", roomBookingController.getAllRoomBookings);
router.get(
  "/viewspecificuserbookings",
  authmiddleware,
  roomBookingController.getspecificuserbookings,
);
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
router.get(
  "/viewoverduebookings",
  roomBookingController.getOverdueRoomBookings,
);

router.get(
  "/viewcompletedbookings",
  roomBookingController.getCompletedRoomBookings,
);
router.put(
  "/completebooking/:id",
  roomBookingController.setRoomBookingStatustoCompleted,
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
router.get(
  "/unavailablerooms/dates/:roomNumber",
  roomBookingController.getUnavilableDatesForRoom,
);

router.post("/roomanlys/bookingstats", roomAnlysController.getBookingStats);
router.post("/roomanlys/roomfrequency", roomAnlysController.getRoomFrequency);
router.get("/roomanlys/statusoverview", roomAnlysController.getRoomStatusOverview);
router.post("/roomanlys/revenuemnothly", roomAnlysController.getMonthlyRevenue);
router.post("/roomanlys/revenuebyroom", roomAnlysController.getRevenueByRoom);

module.exports = router;
