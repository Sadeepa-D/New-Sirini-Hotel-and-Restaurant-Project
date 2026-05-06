import React from "react";
import PackagesMng from "./PackagesMng";
import CateringMng from "./CateringMng";
import AdvertismentMng from "./AdvertismentMng";
import AppointmentMng from "./AppointmentMng";
import ReceptionHallBookMng from "./ReceptionHallBookMng";

const ReceptionMngHome = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 space-y-10">
      <PackagesMng />
      <CateringMng />
      <AdvertismentMng />
      <AppointmentMng />
      <ReceptionHallBookMng />
    </div>
  );
};
export default ReceptionMngHome;
