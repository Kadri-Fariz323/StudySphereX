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
import { CoursesDetails } from "./components/StudentView/CoursesDetails";
import { AuthPage } from "./pages/AuthPage";
import { NotFoundPage } from "./pages/NotFoundPage";

// User Pages
import { StudentDashboard } from "./pages/user/StudentDashboard";
import { PaymentReturn } from "./pages/user/PaymentReturn";
import { PurchasedCourses } from "./pages/user/PurchasedCourses";
import { StudentCourseProgress } from "./pages/user/StudentCourseProgress";

// Instructor Pages
import { CreateCourse } from "./pages/instructor/CreateCourse";
import { ViewUsers } from "./pages/instructor/ViewUsers";
import { MyCourses } from "./pages/instructor/MyCourses";
import { InstructorDashboard } from "./pages/instructor/InstructorDashboard";
import { InstructorProfile } from "./pages/instructor/InstructorProfile";
import { QuizLandingPage } from "./pages/user/QuizLandingPage";
import { FinalExam } from "./pages/user/FinalExam";
import { StudentQuizResult } from "./pages/user/StudentQuizResult";
import { StudentCertificate } from "./pages/user/StudentCertificate";
import { StudentCertificatesList } from "./pages/user/StudentCertificatesList";
import { AdminLayout } from "./layouts/AdminLayout";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { ManageCourses } from "./pages/admin/ManageCourses";
import { CoursesCategories } from "./pages/admin/CoursesCategories";
import { Reports } from "./pages/admin/Reports";
import { ManageUsers } from "./pages/admin/ManageUsers";

export const App = () => {
  const { auth } = useContext(AuthContext);

  return (
    <>
      <ScrollToTop />
      <Loader />
      <Routes>
        {/* ================= PUBLIC ROUTES WITH NAVBAR ================= */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
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

        {/* ================= STANDALONE PUBLIC ROUTES (NO NAVBAR) ================= */}
        {/* MOVED OUTSIDE PublicLayout so Navbar does not appear */}
        <Route path="/course/details/:id" element={<CoursesDetails />} />

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
          <Route index element={<StudentDashboard />} />
          <Route path="student-courses" element={<PurchasedCourses />} />
          <Route path="certificates" element={<StudentCertificatesList />} />
        </Route>

        {/* 2. User Courses (WITHOUT Sidebar/Layout) */}
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

        {/* This was already standalone, but ensure it stays outside layouts */}
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

        <Route
          path="/course-progress/:id"
          element={
            <RouteGuard
              element={<StudentCourseProgress />}
              authenticated={auth.authenticate}
              user={auth?.user}
            />
          }
        />

        <Route
          path="/user/course/:id/quiz-view/"
          element={
            <RouteGuard
              element={<QuizLandingPage />}
              authenticated={auth.authenticate}
              user={auth?.user}
            />
          }
        />

        <Route
          path="/user/course/:id/quiz/"
          element={
            <RouteGuard
              element={<FinalExam />}
              authenticated={auth.authenticate}
              user={auth?.user}
            />
          }
        />

        {/* NEW Route for Result */}
        <Route path="/course/quiz-result/:id" element={<StudentQuizResult />} />

        <Route
          path="/course-certificate/:id"
          element={<StudentCertificate />}
        />

        <Route path="/payment-return" element={<PaymentReturn />} />

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
          <Route path="profile" element={<InstructorProfile />} />
          <Route path="add-course" element={<CreateCourse />} />
          <Route path="edit-course/:courseId" element={<CreateCourse />} />
          <Route path="my-courses" element={<MyCourses />} />
          <Route path="manage-users" element={<ViewUsers />} />
        </Route>

        {/* ================= ADMIN ROUTES ================= */}
        <Route
          path="/admin"
          element={
            <RouteGuard
              element={<AdminLayout />}
              authenticated={auth.authenticate}
              user={auth?.user}
            />
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<ManageUsers />} />
          <Route path="courses" element={<ManageCourses />} />
          <Route path="categories" element={<CoursesCategories />} />
          <Route path="reports" element={<Reports />} />
        </Route>

        {/* ================= CATCH ALL ================= */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
};
