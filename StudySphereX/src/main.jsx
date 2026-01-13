import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import { App } from "./App.jsx";
import AuthProvider from "./context/AuthContext.jsx";
import CourseProvider from "./context/CourseContext";
import { Toaster } from "sonner";
import StudentProvider from "./context/StudentContext";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <CourseProvider>
        <StudentProvider>
          <App />
          <Toaster richColors position="top-right" />
        </StudentProvider>
      </CourseProvider>
    </AuthProvider>
  </BrowserRouter>
);
