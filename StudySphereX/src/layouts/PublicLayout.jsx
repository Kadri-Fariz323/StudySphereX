import { HomeNav } from "../components/HomePage/HomeNav";
import { Footer } from "../components/HomePage/Footer";
import { Outlet } from "react-router-dom";

export const PublicLayout = () => (
  <>
    <HomeNav />
    <Outlet />
    <Footer />
  </>
);
