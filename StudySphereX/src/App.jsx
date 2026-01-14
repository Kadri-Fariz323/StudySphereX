import { Route, Routes } from "react-router-dom";
import { PublicLayout } from "./layouts/PublicLayout";
import {  InstructorLayout } from "./layouts/InstructorLayout";
import { Home } from "./pages/Home";
import { Contact } from "./pages/Contact";
import { Courses } from "./pages/Courses";
import { CreateCourse } from "./pages/instructor/CreateCourse";
import { RouteGuard } from "./components/HomePage/RouteGuard";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import { Dashboard } from "./pages/user/Dashboard";
import { AuthPage } from "./pages/AuthPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { ManageUsers } from "./pages/instructor/ManageUsers";
import { MyCourses } from "./pages/instructor/MyCourses";
import { InstructorDashboard } from "./pages/instructor/InstructorDashboard";
import { InstructorProfile } from "./pages/instructor/InstructorProfile";
import { StudentLayout } from "./layouts/StudentLayout";
import { CoursesDetails } from "./components/StudentView/CoursesDetails";
import { ScrollToTop } from "./components/ScrollToTop";


export const App = () => {
  const { auth } = useContext(AuthContext);
  return (
    <>
    <ScrollToTop />
      <Routes>
        {/* Public Home page Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route
            path="/auth"
            element={
              <RouteGuard
                element={<AuthPage />}
                authenticated={auth.authenticate}
                user={auth?.user}
              />
            }
          />
          <Route path="/courses" element={<Courses />} />
          <Route path="/course/details/:id" element={<CoursesDetails />} />
          
          <Route path="/contact" element={<Contact />} />
        </Route>

        {/* Users */}

        <Route
          path="/user"
          element={
            <RouteGuard
              element={<StudentLayout />}
              authenticated={auth.authenticate}
              user={auth?.user}
            />
          }
        >
          <Route index element={<Dashboard />} />
        </Route>

        {/* Admin */}
        <Route
          path="/instructor"
          element={
            <RouteGuard
              element={<InstructorLayout />}
              authenticated={auth.authenticate}
              user={auth?.user}
            />
          }
        >
          <Route index element={<InstructorDashboard />} />
          <Route path="profile" element={InstructorProfile} />
          <Route path="add-course" element={<CreateCourse />} />
          <Route path="edit-course/:courseId" element={<CreateCourse />} />
          <Route path="my-courses" element={<MyCourses />} />
          <Route path="create-course" element={<CreateCourse />} />
          <Route path="manage-users" element={<ManageUsers />} />
      
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
};
