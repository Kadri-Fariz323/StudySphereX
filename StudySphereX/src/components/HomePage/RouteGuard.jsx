import { Navigate, useLocation } from "react-router-dom";
import { Fragment } from "react";

export const RouteGuard = ({ authenticated, user, element }) => {
  const location = useLocation();
console.log(authenticated, user);

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
    user?.role === "instructor" &&
    !location.pathname.includes("instructor")
  ) {
    return <Navigate to="/instructor" />;
  }
  return <Fragment>{element}</Fragment>;
};
