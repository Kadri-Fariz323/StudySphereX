import { Route, Routes } from "react-router-dom";
import { PublicLayout } from "./layouts/PublicLayout";
import { AdminPanelLayout } from "./layouts/AdminPanelLayout";

import { Login } from "./pages/Login";
import { Home } from "./pages/Home";
import { Contact } from "./pages/Contact";
import { Courses } from "./pages/Courses";

import { AdminDashboard } from "./pages/admin/adminDashboard";
import { AddCourse } from "./pages/admin/AddCourse";
import { CreateCourse } from "./pages/admin/CreateCourse";

export const App = () => {
  return (
    <>
      <Routes>
        {/* Public Home page Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/contact" element={<Contact />} />
        </Route>

        {/* Admin */}
        <Route path="/admin" element={<AdminPanelLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="add-course" element={<AddCourse />} />
          <Route path="create-course" element={<CreateCourse />} />
        </Route>
      </Routes>
    </>
  );
};
