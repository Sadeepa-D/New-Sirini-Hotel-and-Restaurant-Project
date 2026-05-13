const express = require("express");
const router = express.Router();
const upload = require("../config/CloudinaryConfig");
const authmiddleware = require("../middleware/AuthMiddleware");
const ReceptionHallAppoint = require("../controllers/ReceptionHall/ReceptionHallAppointCont");
const ReceptionHallPackg = require("../controllers/ReceptionHall/ReceptionHallPackg");
const CateringItemsCont = require("../controllers/ReceptionHall/CateringItemsCont");
const AdvertismentCont = require("../controllers/ReceptionHall/AdvertismentCont");
const ReceptionHallBookCont = require("../controllers/ReceptionHall/ReceptionHallBookCont");

router.post(
  "/appointment/add",
  authmiddleware,
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
  "/appointment/update/canceled/:id",
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
  "/appointment/view/canceled",
  ReceptionHallAppoint.getCancelledReceptionAppointments,
);
router.get(
  "/appointment/view/overdue",
  ReceptionHallAppoint.getOverdueReceptionAppointments,
);
router.get(
  "/appointment/view/userspecific",
  authmiddleware,
  ReceptionHallAppoint.getSpecificUserReceptionAppointments,
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
router.get(
  "/package/:id/items",
  ReceptionHallPackg.getPackageCateringItems,
);
router.post(
  "/package/:id/add-catering",
  ReceptionHallPackg.addCateringToPackage,
);
router.delete(
  "/package/:id/remove-catering/:itemId",
  ReceptionHallPackg.removeCateringFromPackage,
);

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
  authmiddleware,
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
router.put(
  "/advertisment/toggle/pending/:id",
  AdvertismentCont.toggleAdvertismentStatustoPending,
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
router.get(
  "/advertisment/view/userspecific",
  authmiddleware,
  AdvertismentCont.getSpecificUserAdvertisments,
);
router.get("/booking/dates", ReceptionHallBookCont.GetBookingDates);
router.post("/booking/add", ReceptionHallBookCont.createReceptionHallBooking);
router.get("/booking/view", ReceptionHallBookCont.getReceptionHallBookings);
router.delete("/booking/delete/:id", ReceptionHallBookCont.deleteReceptionHallBooking);
router.put("/booking/update/:id", ReceptionHallBookCont.editReceptionHallBooking);
router.put("/booking/update/status/:id/:status", ReceptionHallBookCont.updateBookingStatus);

module.exports = router;
