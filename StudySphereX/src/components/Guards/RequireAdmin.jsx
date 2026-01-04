import { Navigate, Outlet } from "react-router-dom";

export const RequireAdmin = ({ user,loading }) => {
   if (loading) return null;
  if (user?.role !== "admin") {
    return <Navigate to="/UserDashboard" replace />;
  }
  return <Outlet />;
};
