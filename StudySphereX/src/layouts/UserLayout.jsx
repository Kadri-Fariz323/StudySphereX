import { Dashboard } from "@/pages/user/Dashboard";
import { Outlet } from "react-router-dom";

export const UserLayout = () => {
  return (
    <div>
    <Outlet />

    </div>
  )
}
