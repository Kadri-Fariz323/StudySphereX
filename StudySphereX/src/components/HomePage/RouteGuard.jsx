import { Navigate, useLocation } from "react-router-dom";
import { Fragment } from "react";

export const RouteGuard = ({ authenticated, user, element }) => {
  const location = useLocation();

  if (!authenticated && !location.pathname.includes("/auth")) {
    return <Navigate to="/auth" />;
  }

  if (
    authenticated &&
    user?.role !== "instructor" &&
    (location.pathname.includes("instructor") ||
      location.pathname.includes("/auth"))
  ) {
    return <Navigate to="/user" />;
  }

  if (
  authenticated &&
  user?.role === "admin" &&
  !location.pathname.includes("admin")
) {
  return <Navigate to="/admin" />;
}

 
  if (
    authenticated &&
    user?.role === "instructor" &&
    !location.pathname.includes("instructor")
  ) {
    return <Navigate to="/instructor" />;
  }
  return <Fragment>{element}</Fragment>;
};
