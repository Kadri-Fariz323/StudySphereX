import { useContext, useEffect, useState, useCallback } from "react";
import { AuthContext } from "@/context/AuthContext";
import { FetchEnrolledStudents } from "@/services/index";
import { EnrolledUsersTable } from "@/components/Instructor/EnrolledUsersTable";
import { Button } from "@/components/ui/button"; // Assuming you have this
import { RefreshCcw } from "lucide-react"; // Optional icon

export const ViewUsers = () => {
  const { auth } = useContext(AuthContext);
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // FIX 1: Robust ID check (Handles 'id' vs '_id' mismatch)
  const instructorId = auth?.user?.id || auth?.user?._id;

  // FIX 2: Use useCallback for manual refreshing
  const fetchEnrolledStudents = useCallback(async () => {
    
    // FIX 3: The Trap Preventer
    // If no ID exists yet, turn OFF loading and stop. 
    // This prevents the infinite spinner if auth is slow.
    if (!instructorId) {
        setLoading(false); 
        return;
    }

    setLoading(true);
    try {
      const response = await FetchEnrolledStudents(instructorId);
      if (response.success) {
        setEnrolledStudents(response.data);
      }
    } catch (error) {
      console.error("Error fetching enrolled students:", error);
    } finally {
      setLoading(false);
    }
  }, [instructorId]);

  useEffect(() => {
    fetchEnrolledStudents();
  }, [fetchEnrolledStudents]);

  return (
    <div className="space-y-4">
      {/* Header with Manual Refresh for Unstable Wifi */}
      <div className="flex justify-end mb-4">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={fetchEnrolledStudents} 
          disabled={loading}
        >
          <RefreshCcw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Syncing...' : 'Refresh List'}
        </Button>
      </div>

      <EnrolledUsersTable
        enrolledStudents={enrolledStudents}
        loading={loading}
      />
    </div>
  );
};