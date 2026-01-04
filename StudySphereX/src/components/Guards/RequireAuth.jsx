import { Navigate, Outlet } from "react-router-dom";

export const RequireAuth = ({ authenticated, loading  }) => {
    if (loading) return null;
  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};
