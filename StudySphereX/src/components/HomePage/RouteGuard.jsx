import { Navigate, useLocation } from "react-router-dom";
import { Fragment } from "react";

export const RouteGuard = ({ authenticated, user, element }) => {
  const location = useLocation();
console.log(authenticated, user);

  if (!authenticated && !location.pathname.includes("/login")) {
    return <Navigate to="/login" />;
  }

  if (
    authenticated &&
    user?.role !== "admin" &&
    (location.pathname.includes("admin") ||
      location.pathname.includes("/login"))
  ) {
    return <Navigate to="/UserDashboard" />;
  }

  if (
    authenticated &&
    user?.role === "admin" &&
    !location.pathname.includes("admin")
  ) {
    return <Navigate to="/admin" />;
  }
  return <Fragment>{element}</Fragment>;
};
