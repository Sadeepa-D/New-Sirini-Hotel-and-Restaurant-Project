import React from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import ScrollToTop from "./Components/ScrollToTop";
import Login from "./Pages/Login";
import Registration from "./Pages/Registration";
import MainPage from "./Pages/MainPage";
// import Header from "./Components/Header";
import Footer from "./Components/Footer";
import Liquor from "./Pages/ServicesPages/LiquorStore";
// import LiquorManagment from "./Components/OperationManager/Liquor/LiquorMngHome";
import OperationManager from "./Pages/Administration/OperationManager";
import { Admin } from "./Pages/Administration/Admin";
import Manager from "./Pages/Administration/Manager";
import Reception from "./Pages/ServicesPages/Reception";

import Rooms from "./Pages/ServicesPages/Rooms";
import Restaurant from "./Pages/ServicesPages/Restaurant";
import Dashboard from "./Pages/Dashboard";

export const App = () => {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/liquor" element={<Liquor />} />
        <Route path="/reception" element={<Reception />} />
        <Route path="/operationmanager" element={<OperationManager />} />
        <Route path="/manager" element={<Manager />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/restaurant" element={<Restaurant />} />
        {/* <Route
          path="/operationmanager/liquormanagment"
          element={<LiquorManagment />}
        /> */}
      </Routes>
      <Footer />
    </>
  );
};
export default App;
