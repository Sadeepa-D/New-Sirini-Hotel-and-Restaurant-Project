import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Login from "./Pages/Login";
import Registration from "./Pages/Registration";
import MainPage from "./Pages/MainPage";
import Header from "./Components/Header";
import { Admin } from "./Pages/Admin";
import { Manager } from "./Pages/Manager";


export const App = () => {
  return (
    <>
    <Header />
      <Toaster position="top-right" reverseOrder={false} />{" "}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/manager" element={<Manager />} />
      </Routes>
      
    </>
  );
};
export default App;
