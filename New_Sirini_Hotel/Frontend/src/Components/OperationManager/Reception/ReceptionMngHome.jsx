import React from "react";
import PackagesMng from "./PackagesMng";
import CateringMng from "./CateringMng";
import AdvertismentMng from "./AdvertismentMng";

const ReceptionMngHome = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 space-y-10">
      <PackagesMng />
      <CateringMng />
      <AdvertismentMng />
    </div>
  );
}
export default ReceptionMngHome;