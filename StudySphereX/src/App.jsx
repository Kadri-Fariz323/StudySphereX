import { Route, Routes } from "react-router-dom";
import { PublicLayout } from "./layouts/PublicLayout";

import { Login } from "./pages/Login";
import { Home } from './pages/Home'
import { Contact } from './pages/Contact'
import { Courses } from "./pages/Courses";

export const App = () => {
  return (
   
        <Routes>
        {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/contact" element={<Contact />} />

          </Route>
        
        </Routes>
    
  );
};
