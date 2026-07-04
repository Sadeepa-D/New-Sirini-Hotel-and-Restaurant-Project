const express = require("express");
const router = express.Router();
const upload = require("../config/CloudinaryConfig");
const authmiddleware = require("../middleware/AuthMiddleware");
const RoleBaseMiddleware = require("../middleware/RoleBaseMiddleware");
const ReceptionHallAppoint = require("../controllers/ReceptionHall/ReceptionHallAppointCont");
const ReceptionHallPackg = require("../controllers/ReceptionHall/ReceptionHallPackg");
const CateringItemsCont = require("../controllers/ReceptionHall/CateringItemsCont");
const AdvertismentCont = require("../controllers/ReceptionHall/AdvertismentCont");
const ReceptionHallBookCont = require("../controllers/ReceptionHall/ReceptionHallBookCont");
const ReceptionHallAlys = require("../controllers/ReceptionHall/ReceptionHallAlys");

router.post(
  "/appointment/add",
  authmiddleware,
  ReceptionHallAppoint.createReceptionAppointment,
);
router.get(
  "/appointment/view",
  authmiddleware,
  RoleBaseMiddleware(["Admin", "Operation Manager 2 (Reception, Room)"]),
  ReceptionHallAppoint.getReceptionAppointments,
);
router.put(
  "/appointment/update/:id",
  authmiddleware,
  ReceptionHallAppoint.updateReceptionAppointment,
);
router.put(
  "/appointment/update/completed/:id",
  authmiddleware,
  RoleBaseMiddleware(["Admin", "Operation Manager 2 (Reception, Room)"]),
  ReceptionHallAppoint.updateReceptionAppointmentasCompleted,
);
router.put(
  "/appointment/update/canceled/:id",
  authmiddleware,
  RoleBaseMiddleware([
    "Admin",
    "Operation Manager 2 (Reception, Room)",
    "User",
    "Operation Manager 1 (Restraunt,Liquor)",
  ]),
  ReceptionHallAppoint.updateReceptionAppointmentasCancelled,
);
router.get(
  "/appointment/view/pending",
  authmiddleware,
  RoleBaseMiddleware(["Admin", "Operation Manager 2 (Reception, Room)"]),
  ReceptionHallAppoint.getPendingReceptionAppointments,
);
router.get(
  "/appointment/view/completed",
  authmiddleware,
  RoleBaseMiddleware(["Admin", "Operation Manager 2 (Reception, Room)"]),
  ReceptionHallAppoint.getCompletedReceptionAppointments,
);
router.get(
  "/appointment/view/canceled",
  authmiddleware,
  RoleBaseMiddleware(["Admin", "Operation Manager 2 (Reception, Room)"]),
  ReceptionHallAppoint.getCancelledReceptionAppointments,
);
router.get(
  "/appointment/view/overdue",
  authmiddleware,
  RoleBaseMiddleware(["Admin", "Operation Manager 2 (Reception, Room)"]),
  ReceptionHallAppoint.getOverdueReceptionAppointments,
);
router.get(
  "/appointment/view/userspecific",
  authmiddleware,
  ReceptionHallAppoint.getSpecificUserReceptionAppointments,
);
router.post(
  "/package/add",
  authmiddleware,
  RoleBaseMiddleware(["Admin", "Operation Manager 2 (Reception, Room)"]),
  upload.single("image"),
  ReceptionHallPackg.createReceptionHallPackage,
);
router.get("/package/view", ReceptionHallPackg.getReceptionHallPackages);
router.put(
  "/package/update/:id",
  authmiddleware,
  RoleBaseMiddleware(["Admin", "Operation Manager 2 (Reception, Room)"]),
  upload.single("image"),
  ReceptionHallPackg.updateReceptionHallPackage,
);
router.delete(
  "/package/delete/:id",
  authmiddleware,
  RoleBaseMiddleware(["Admin", "Operation Manager 2 (Reception, Room)"]),
  ReceptionHallPackg.deleteReceptionHallPackage,
);
router.put(
  "/package/toggle/:id",
  authmiddleware,
  RoleBaseMiddleware(["Admin", "Operation Manager 2 (Reception, Room)"]),
  ReceptionHallPackg.toggleAvailability,
);
router.get("/package/:id/items", ReceptionHallPackg.getPackageCateringItems);
router.post(
  "/package/:id/add-catering",
  authmiddleware,
  RoleBaseMiddleware(["Admin", "Operation Manager 2 (Reception, Room)"]),
  ReceptionHallPackg.addCateringToPackage,
);
router.delete(
  "/package/:id/remove-catering/:itemId",
  authmiddleware,
  RoleBaseMiddleware(["Admin", "Operation Manager 2 (Reception, Room)"]),
  ReceptionHallPackg.removeCateringFromPackage,
);

router.post(
  "/catering/add",
  authmiddleware,
  RoleBaseMiddleware(["Admin", "Operation Manager 2 (Reception, Room)"]),
  upload.single("image"),
  CateringItemsCont.createCateringItem,
);
router.get("/catering/view", CateringItemsCont.getCateringItems);
router.put(
  "/catering/update/:id",
  authmiddleware,
  RoleBaseMiddleware(["Admin", "Operation Manager 2 (Reception, Room)"]),
  upload.single("image"),
  CateringItemsCont.updateCateringItem,
);
router.delete(
  "/catering/delete/:id",
  authmiddleware,
  RoleBaseMiddleware(["Admin", "Operation Manager 2 (Reception, Room)"]),
  CateringItemsCont.deleteCateringItem,
);
router.put(
  "/catering/toggle/:id",
  authmiddleware,
  RoleBaseMiddleware(["Admin", "Operation Manager 2 (Reception, Room)"]),
  CateringItemsCont.toggleCateringItemAvailability,
);

router.post(
  "/advertisment/add",
  authmiddleware,
  upload.single("image"),
  AdvertismentCont.createAdvertisment,
);
router.get("/advertisment/view", AdvertismentCont.getAdvertisments);
router.delete(
  "/advertisment/delete/:id",
  authmiddleware,
  RoleBaseMiddleware([
    "Admin",
    "Operation Manager 2 (Reception, Room)",
    "User",
    "Operation Manager 1 (Restraunt,Liquor)",
  ]),
  AdvertismentCont.deleteAdvertisment,
);
router.put(
  "/advertisment/update/:id",
  upload.single("image"),
  authmiddleware,
  RoleBaseMiddleware([
    "Admin",
    "Operation Manager 2 (Reception, Room)",
    "User",
    "Operation Manager 1 (Restraunt,Liquor)",
  ]),
  AdvertismentCont.updateAdvertisment,
);
router.put(
  "/advertisment/toggle/approved/:id",
  authmiddleware,
  RoleBaseMiddleware(["Admin", "Operation Manager 2 (Reception, Room)"]),
  AdvertismentCont.toggleAdvertismentStatustoApproved,
);
router.put(
  "/advertisment/toggle/rejected/:id",
  authmiddleware,
  RoleBaseMiddleware(["Admin", "Operation Manager 2 (Reception, Room)"]),
  AdvertismentCont.toggleAdvertismentStatustoRejected,
);
router.put(
  "/advertisment/toggle/pending/:id",
  authmiddleware,
  RoleBaseMiddleware([
    "Admin",
    "Operation Manager 2 (Reception, Room)",
    "Operation Manager 1 (Restraunt,Liquor)",
  ]),
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
router.post(
  "/booking/add",
  authmiddleware,
  RoleBaseMiddleware(["Admin", "Operation Manager 2 (Reception, Room)"]),
  ReceptionHallBookCont.createReceptionHallBooking,
);
router.get(
  "/booking/view",
  authmiddleware,
  RoleBaseMiddleware(["Admin", "Operation Manager 2 (Reception, Room)"]),
  ReceptionHallBookCont.getReceptionHallBookings,
);
router.delete(
  "/booking/delete/:id",
  authmiddleware,
  RoleBaseMiddleware(["Admin", "Operation Manager 2 (Reception, Room)"]),
  ReceptionHallBookCont.deleteReceptionHallBooking,
);
router.put(
  "/booking/update/:id",
  authmiddleware,
  RoleBaseMiddleware(["Admin", "Operation Manager 2 (Reception, Room)"]),
  ReceptionHallBookCont.editReceptionHallBooking,
);
router.put(
  "/booking/update/status/:id/:status",
  authmiddleware,
  RoleBaseMiddleware(["Admin", "Operation Manager 2 (Reception, Room)"]),
  ReceptionHallBookCont.updateBookingStatus,
);
router.post(
  "/appointments/stats",
  ReceptionHallAlys.getmonthlyappointmentdetails,
);
router.post(
  "/bookings/stats",
  ReceptionHallAlys.getmonthlyReceptionHallBookingDetails,
);
router.get("/income/yearly", ReceptionHallAlys.getYearlyReceptionHallIncome);
router.get("/common/details", ReceptionHallAlys.getreceptionhallcommondetails);
router.get(
  "/packages/booked/count",
  ReceptionHallAlys.getreceptionhallpackagesbookedcount,
);

module.exports = router;
