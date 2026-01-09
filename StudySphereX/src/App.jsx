import { Route, Routes } from "react-router-dom";
import { PublicLayout } from "./layouts/PublicLayout";
import { AdminPanelLayout } from "./layouts/AdminPanelLayout";
import { Home } from "./pages/Home";
import { Contact } from "./pages/Contact";
import { Courses } from "./pages/Courses";
import { AdminDashboard } from "./pages/instructor/AdminDashboard";
import { AddCourse } from "./pages/instructor/AddCourse";
import { CreateCourse } from "./pages/instructor/CreateCourse";
import { RouteGuard } from "./components/HomePage/RouteGuard";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import { UserLayout } from "./layouts/UserLayout";
import { Dashboard } from "./pages/user/Dashboard";
import { AuthPage } from "./pages/AuthPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { ManageUsers } from "./pages/instructor/ManageUsers";


export const App = () => {
  const { auth } = useContext(AuthContext);
  return (
    <>
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
          <Route path="/contact" element={<Contact />} />
        </Route>

        {/* Users */}

        <Route
          path="/user"
          element={
            <RouteGuard
              element={<UserLayout />}
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
              element={<AdminPanelLayout />}
              authenticated={auth.authenticate}
              user={auth?.user}
            />
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="add-course" element={<AddCourse />} />
          <Route path="create-course" element={<CreateCourse />} />
          <Route path="manage-users" element={<ManageUsers />} />
      
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
};
