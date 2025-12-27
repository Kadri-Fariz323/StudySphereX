import {
  courseLandingInitialFormData,
} from "@/config";
import { createContext, useState } from "react";

export const CourseContext = createContext(null);

export default function CourseProvider({ children }) {
  const [courseLandingFormData, setCourseLandingFormData] = useState(
    courseLandingInitialFormData
  );

   return (
    <CourseContext.Provider
      value={{
        courseLandingFormData,
        setCourseLandingFormData,
      }}
    >
      {children}
    </CourseContext.Provider>
  );
}