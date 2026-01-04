import { Navigate, Outlet } from "react-router-dom";

export const RequireGuest = ({ authenticated, user }) => {
  if (authenticated) {
    return user?.role === "admin"
      ? <Navigate to="/admin" replace />
      : <Navigate to="/UserDashboard" replace />;
  }
  return <Outlet />;
};
