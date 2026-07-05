const express = require("express");
const router = express.Router();
const upload = require("../config/CloudinaryConfig");
const authmiddleware = require("../middleware/AuthMiddleware");
const RoleBaseMiddleware = require("../middleware/RoleBaseMiddleware");
const roomBookingController = require("../controllers/Room/RoomBookingCont");
const roomController = require("../controllers/Room/RoomCont");
const roomAnlysController = require("../controllers/Room/RoomAnlys");

router.post("/book", authmiddleware, roomBookingController.createRoomBooking);
router.delete("/deletebooking/:id", roomBookingController.deleteRoomBooking);
router.put("/updatebooking/:id", roomBookingController.editRoomBooking);
router.get("/viewbookings",authmiddleware,RoleBaseMiddleware(["Admin", "Operation Manager 2 (Reception, Room)"]), roomBookingController.getAllRoomBookings);
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
router.put(
  "/updateoverduebookings",
  roomBookingController.updateOverdueBookings,
);

router.get(
  "/viewcompletedbookings",
  roomBookingController.getCompletedRoomBookings,
);
router.put(
  "/completebooking/:id",
  authmiddleware,
  RoleBaseMiddleware(["Admin", "Operation Manager 2 (Reception, Room)"]),
  roomBookingController.setRoomBookingStatustoCompleted,
);

router.put(
  "/confirmbooking/:id",
  authmiddleware,
  RoleBaseMiddleware(["Admin", "Operation Manager 2 (Reception, Room)"]),
  roomBookingController.setRoomBookingStatustoConfirmed,
);
router.put(
  "/cancelbooking/:id",
  authmiddleware,
  RoleBaseMiddleware(["Admin", "Operation Manager 2 (Reception, Room)", "User"]),
  roomBookingController.setRoomBookingStatustoCancelled,
);

router.post(
  "/add",
  authmiddleware,
  RoleBaseMiddleware(["Admin", "Operation Manager 2 (Reception, Room)"]),
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "galleryImages", maxCount: 4 },
  ]),
  roomController.createRoom,
);
router.get("/viewrooms", roomController.getAllRooms);
router.put(
  "/updateroom/:id",
  authmiddleware,
  RoleBaseMiddleware(["Admin", "Operation Manager 2 (Reception, Room)"]),
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "galleryImages", maxCount: 4 },
  ]),
  roomController.updateRoom,
);
router.delete("/deleteroom/:id", authmiddleware, RoleBaseMiddleware(["Admin", "Operation Manager 2 (Reception, Room)"]), roomController.deleteRoom);
router.put(
  "/changeroomavailability/:id",
  authmiddleware,
  RoleBaseMiddleware(["Admin", "Operation Manager 2 (Reception, Room)"]),
  roomController.toggleRoomAvailability,
);
router.get(
  "/unavailablerooms/dates/:roomNumber",
  roomBookingController.getUnavilableDatesForRoom,
);

router.post("/roomanlys/bookingstats", roomAnlysController.getBookingStats);
router.post("/roomanlys/roomfrequency", roomAnlysController.getRoomFrequency);
router.get(
  "/roomanlys/statusoverview",
  roomAnlysController.getRoomStatusOverview,
);
router.post("/roomanlys/revenuemnothly", roomAnlysController.getMonthlyRevenue);
router.post("/roomanlys/revenuebyroom", roomAnlysController.getRevenueByRoom);

module.exports = router;
