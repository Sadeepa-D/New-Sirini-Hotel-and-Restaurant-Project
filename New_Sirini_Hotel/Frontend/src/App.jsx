import React from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Login from "./Pages/Login";
import Registration from "./Pages/Registration";
import MainPage from "./Pages/MainPage";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import Liquor from "./Pages/ServicesPages/LiquorStore";
import LiquorManagment from "./Components/OperationManager/Liquor/LiquorMngHome";
import OperationManager from "./Pages/Administration/OperationManager";
import { Admin } from "./Pages/Administration/Admin";
import { Manager } from "./Pages/Administration/Manager";
import Rooms from "./Pages/ServicesPages/Rooms";


export const App = () => {
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />{" "}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/manager" element={<Manager />} />
        <Route path="/liquor" element={<Liquor />} />
        <Route path="/operationmanager" element={<OperationManager />} />
        <Route
          path="/operationmanager/liquormanagment"
          element={<LiquorManagment />}
        />
      </Routes>
        <Route path="/rooms" element={<Rooms />} />
      </Routes>
      <Footer />

    </>
  );
};
export default App;
