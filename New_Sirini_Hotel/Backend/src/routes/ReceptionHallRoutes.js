const express = require("express");
const router = express.Router();
const upload = require("../config/CloudinaryConfig");
const ReceptionHallAppoint = require("../controllers/ReceptionHall/ReceptionHallAppointCont");
const ReceptionHallPackg = require("../controllers/ReceptionHall/ReceptionHallPackg");

router.post(
  "/appointment/add",
  ReceptionHallAppoint.createReceptionAppointment,
);
router.get("/appointment/view", ReceptionHallAppoint.getReceptionAppointments);
router.delete(
  "/appointment/delete/:id",
  ReceptionHallAppoint.deleteReceptionAppointment,
);
router.put(
  "/appointment/update/:id",
  ReceptionHallAppoint.updateReceptionAppointment,
);
router.put(
  "/appointment/update/completed/:id",
  ReceptionHallAppoint.updateReceptionAppointmentasCompleted,
);
router.put(
  "/appointment/update/cancelled/:id",
  ReceptionHallAppoint.updateReceptionAppointmentasCancelled,
);
router.get(
  "/appointment/view/pending",
  ReceptionHallAppoint.getPendingReceptionAppointments,
);
router.get(
  "/appointment/view/completed",
  ReceptionHallAppoint.getCompletedReceptionAppointments,
);
router.get(
  "/appointment/view/cancelled",
  ReceptionHallAppoint.getCancelledReceptionAppointments,
);
router.get(
  "/appointment/view/overdue",
  ReceptionHallAppoint.getoOverdueReceptionAppointments,
);
router.post(
  "/package/add",
  upload.single("image"),
  ReceptionHallPackg.createReceptionHallPackage,
);
router.get("/package/view", ReceptionHallPackg.getReceptionHallPackages);
router.put(
  "/package/update/:id",
  upload.single("image"),
  ReceptionHallPackg.updateReceptionHallPackage,
);
router.delete(
  "/package/delete/:id",
  ReceptionHallPackg.deleteReceptionHallPackage,
);
router.put("/package/toggle/:id", ReceptionHallPackg.toggleAvailability);
module.exports = router;
