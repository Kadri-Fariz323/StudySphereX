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
  const [mediaUploadProgressPercentage, setMediaUploadProgressPercentage] =
    useState(0);

  const [instructorCoursesList, setInstructorCoursesList] = useState([]);

  return (
    <CourseContext.Provider
      value={{
        courseLandingFormData,
        setCourseLandingFormData,
        courseCurriculumFormData,
        setCourseCurriculumFormData,
        mediaUploadProgress,
        setMediaUploadProgress,
        mediaUploadProgressPercentage, 
        setMediaUploadProgressPercentage,
        instructorCoursesList,
         setInstructorCoursesList
      }}
    >
      {children}
    </CourseContext.Provider>
  );
}
