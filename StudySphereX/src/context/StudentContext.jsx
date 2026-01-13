import { createContext, useState } from "react";

export const StudentContext = createContext(null);

export default function StudentProvider({ children }) {
  const [studentViewCoursesList, setStudentViewCoursesList] = useState([]);

  return (
    <StudentContext.Provider
      value={{ studentViewCoursesList, setStudentViewCoursesList }}
    >
      {children}
    </StudentContext.Provider>
  );
}
