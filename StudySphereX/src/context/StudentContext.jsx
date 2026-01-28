import { createContext, useState } from "react";

export const StudentContext = createContext(null);

export default function StudentProvider({ children }) {
  const [studentViewCoursesList, setStudentViewCoursesList] = useState([]);
  const [studentViewCourseDetails, setStudentViewCourseDetails] =
    useState(null);
  const [currentCourseDetailsId, setCurrentCourseDetailsId] = useState(null);
  const [studentBoughtCoursesList, setStudentBoughtCoursesList] = useState([]);
  const [studentCurrentCourseProgress, setStudentCurrentCourseProgress] =
    useState({});

  // ✅ ADD THIS
  const [currentCourseMeta, setCurrentCourseMeta] = useState(null);

  return (
    <StudentContext.Provider
      value={{
        studentViewCoursesList,
        setStudentViewCoursesList,
        studentViewCourseDetails,
        setStudentViewCourseDetails,
        currentCourseDetailsId,
        setCurrentCourseDetailsId,
        studentBoughtCoursesList,
        setStudentBoughtCoursesList,
        studentCurrentCourseProgress,
        setStudentCurrentCourseProgress,

        currentCourseMeta,
        setCurrentCourseMeta,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
}
