import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoutes = ({ allowedRoles }) => {
  const token = localStorage.getItem("token");
  const userString = localStorage.getItem("user");

  const user = userString ? JSON.parse(userString) : null;

  const userRole = user?.Role ? user.Role.trim() : null;
  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" />;
  }
  if (!token) {
    return <Navigate to="/login" />;
  }
  return <Outlet />;
};
export default ProtectedRoutes;
