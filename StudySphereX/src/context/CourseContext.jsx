import {
  courseLandingInitialFormData,
  courseCurriculumInitialFormData,
} from "@/config";
import { createContext, useState } from "react";

export const CourseContext = createContext(null);

export default function CourseProvider({ children }) {
  const [courseLandingFormData, setCourseLandingFormData] = useState(
    courseLandingInitialFormData
  );

    const [courseCurriculumFormData, setCourseCurriculumFormData] = useState(
    courseCurriculumInitialFormData
  );

  const [mediaUploadProgress, setMediaUploadProgress] = useState(false);

   return (
    <CourseContext.Provider
      value={{
        courseLandingFormData,
        setCourseLandingFormData,
       courseCurriculumFormData,
        setCourseCurriculumFormData,
        mediaUploadProgress,
         setMediaUploadProgress
      }}
    >
      {children}
    </CourseContext.Provider>
  );
}