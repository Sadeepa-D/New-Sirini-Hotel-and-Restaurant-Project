const express = require("express");
const router = express.Router();
const ReceptionHallAppoint = require("../controllers/ReceptionHall/ReceptionHallAppointCont");

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
module.exports = router;
