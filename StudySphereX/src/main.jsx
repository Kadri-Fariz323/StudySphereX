import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import { App } from "./App.jsx";
import AuthProvider from "./context/AuthContext.jsx";
import CourseProvider from "./context/CourseContext";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <CourseProvider>
      <App />
      </CourseProvider>
    </AuthProvider>
  </BrowserRouter>
);
