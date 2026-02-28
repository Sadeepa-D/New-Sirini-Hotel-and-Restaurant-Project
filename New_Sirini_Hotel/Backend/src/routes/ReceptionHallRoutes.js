const express = require("express");
const router = express.Router();
const ReceptionHallAppoint = require("../controllers/ReceptionHall/ReceptionHallCont");

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
module.exports = router;
