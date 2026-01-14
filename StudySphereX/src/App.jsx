import { Route, Routes } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

// Layouts
import { PublicLayout } from "./layouts/PublicLayout";
import { InstructorLayout } from "./layouts/InstructorLayout";
import { StudentLayout } from "./layouts/StudentLayout";

// Components
import { RouteGuard } from "./components/HomePage/RouteGuard";
import { ScrollToTop } from "./components/ScrollToTop";
import { Loader } from "./components/Loader";

// Public Pages
import { Home } from "./pages/Home";
import { Contact } from "./pages/Contact";
import { Courses } from "./pages/Courses";
import { CoursesDetails } from "./components/StudentView/CoursesDetails"; // Check if this should be a page or component
import { AuthPage } from "./pages/AuthPage";
import { NotFoundPage } from "./pages/NotFoundPage";

// User Pages
import { Dashboard } from "./pages/user/Dashboard";

// Instructor Pages
import { CreateCourse } from "./pages/instructor/CreateCourse";
import { ManageUsers } from "./pages/instructor/ManageUsers";
import { MyCourses } from "./pages/instructor/MyCourses";
import { InstructorDashboard } from "./pages/instructor/InstructorDashboard";
import { InstructorProfile } from "./pages/instructor/InstructorProfile";

export const App = () => {
  const { auth } = useContext(AuthContext);

  return (
    <>
      <ScrollToTop />
      <Loader />
      <Routes>
        {/* ================= PUBLIC ROUTES ================= */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/course/details/:id" element={<CoursesDetails />} />
          <Route path="/contact" element={<Contact />} />
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
        </Route>

        {/* ================= USER ROUTES ================= */}
        
        {/* 1. Dashboard (WITH Sidebar/Layout) */}
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

        {/* 2. User Courses (WITHOUT Sidebar/Layout - as requested for UI) */}
        {/* These are siblings to /user, not children, so they won't inherit StudentLayout */}
        <Route
          path="/user/courses"
          element={
            <RouteGuard
              element={<Courses />}
              authenticated={auth.authenticate}
              user={auth?.user}
            />
          }
        />

        <Route
          path="/user/course/details/:id"
          element={
            <RouteGuard
              element={<CoursesDetails />}
              authenticated={auth.authenticate}
              user={auth?.user}
            />
          }
        />

        {/* ================= INSTRUCTOR ROUTES ================= */}
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
          
          {/* FIXED: Added < /> around Component Name */}
          <Route path="profile" element={<InstructorProfile />} />
          
          <Route path="add-course" element={<CreateCourse />} />
          <Route path="edit-course/:courseId" element={<CreateCourse />} />
          <Route path="my-courses" element={<MyCourses />} />
          <Route path="manage-users" element={<ManageUsers />} />
        </Route>

        {/* ================= CATCH ALL ================= */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
};