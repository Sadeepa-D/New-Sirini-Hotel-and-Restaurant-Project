import React from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Login from "./Pages/Login";
import Registration from "./Pages/Registration";
export const App = () => {
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />{" "}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Registration />} />
      </Routes>
    </>
  );
};
export default App;
