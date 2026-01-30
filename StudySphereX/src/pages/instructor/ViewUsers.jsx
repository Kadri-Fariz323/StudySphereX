import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import { FetchEnrolledStudents } from "@/services/index";
import { EnrolledUsersTable } from "@/components/Instructor/EnrolledUsersTable";

export const ViewUsers = () => {
  const { auth } = useContext(AuthContext);
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  if (!auth?.user?.id) return;

  const fetchEnrolledStudents = async () => {
    setLoading(true);
    try {
      const response = await FetchEnrolledStudents(auth.user.id);
      if (response.success) {
        setEnrolledStudents(response.data);
      }
    } catch (error) {
      console.error("Error fetching enrolled students:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchEnrolledStudents();
}, [auth?.user?.id]);

  return (
    <div>
      <EnrolledUsersTable
        enrolledStudents={enrolledStudents}
        loading={loading}
      />
    </div>
  );
};
