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
import { RouteGuard } from "./components/HomePage/RouteGuard";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import { UserLayout } from "./layouts/UserLayout";

export const App = () => {
  const { auth } = useContext(AuthContext);
  return (
    <>
      
      <Routes>
        
        {/* Public Home page Routes */}
        <Route element={<PublicLayout />}>
          
          <Route path="/" element={<Home />} />
          <Route
            path="/login"
            element={
              <RouteGuard
                element={<Login />}
                authenticated={auth.authenticate}
                user={auth?.user}
              />
            }
          />
          <Route path="/courses" element={<Courses />} />
          <Route path="/contact" element={<Contact />} />
        </Route>
        {/* User */}
        <Route
          path="/UserDashboard"
          element={
            <RouteGuard
              element={<UserLayout />}
              authenticated={auth.authenticate}
              user={auth?.user}
            />
          }
        >
          
          <Route path="" element={<UserLayout />} />
        </Route>
        {/* Admin */}
        <Route path="/admin" element={<AdminPanelLayout />}>
          
          <Route
            index
            element={
              <RouteGuard
                element={<AdminDashboard />}
                authenticated={auth.authenticate}
                user={auth?.user}
              />
            }
          />
          <Route
            path="add-course"
            element={
              <RouteGuard
                element={<AddCourse />}
                authenticated={auth.authenticate}
                user={auth?.user}
              />
            }
          />
          <Route
            path="create-course"
            element={
              <RouteGuard
                element={<CreateCourse />}
                authenticated={auth.authenticate}
                user={auth?.user}
              />
            }
          />
        </Route>
      </Routes>
    </>
  );
};
