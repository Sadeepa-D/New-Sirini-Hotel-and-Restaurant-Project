const express = require("express");
const router = express.Router();
const upload = require("../config/CloudinaryConfig");
const ReceptionHallAppoint = require("../controllers/ReceptionHall/ReceptionHallAppointCont");
const ReceptionHallPackg = require("../controllers/ReceptionHall/ReceptionHallPackg");
const CateringItemsCont = require("../controllers/ReceptionHall/CateringItemsCont");
const AdvertismentCont = require("../controllers/ReceptionHall/AdvertismentCont");

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

router.post(
  "/catering/add",
  upload.single("image"),
  CateringItemsCont.createCateringItem,
);
router.get("/catering/view", CateringItemsCont.getCateringItems);
router.put(
  "/catering/update/:id",
  upload.single("image"),
  CateringItemsCont.updateCateringItem,
);
router.delete("/catering/delete/:id", CateringItemsCont.deleteCateringItem);
router.put(
  "/catering/toggle/:id",
  CateringItemsCont.toggleCateringItemAvailability,
);

router.post(
  "/advertisment/add",
  upload.single("image"),
  AdvertismentCont.createAdvertisment,
);
router.get("/advertisment/view", AdvertismentCont.getAdvertisments);
router.delete("/advertisment/delete/:id", AdvertismentCont.deleteAdvertisment);
router.put(
  "/advertisment/update/:id",
  upload.single("image"),
  AdvertismentCont.updateAdvertisment,
);
router.put(
  "/advertisment/toggle/approved/:id",
  AdvertismentCont.toggleAdvertismentStatustoApproved,
);
router.put(
  "/advertisment/toggle/rejected/:id",
  AdvertismentCont.toggleAdvertismentStatustoRejected,
);
router.get(
  "/advertisment/view/approved",
  AdvertismentCont.getApprovedAdvertisments,
);
router.get(
  "/advertisment/view/pending",
  AdvertismentCont.getPendingAdvertisments,
);
router.get(
  "/advertisment/view/rejected",
  AdvertismentCont.getRejectedAdvertisments,
);
module.exports = router;
