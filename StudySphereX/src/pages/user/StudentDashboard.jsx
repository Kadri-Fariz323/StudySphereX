import { useContext, useEffect, useState, useCallback } from "react";
import { AuthContext } from "@/context/AuthContext";
import { StudentAnalyticsCards } from "@/components/StudentView/StudentAnalyticsCards";
import { fetchStudentStatsService } from "@/services/StudentViewService";

export const StudentDashboard = () => {
  const { auth } = useContext(AuthContext);

  const [stats, setStats] = useState({
    totalPurchased: 0,
    totalInProgress: 0,
    totalCompleted: 0,
    totalCertificates: 0,
  });

  const [loading, setLoading] = useState(true);



const fetchStats = useCallback(async () => {
  
  const userId = auth?.user?.id || auth?.user?._id;

  if (!userId) {
      setLoading(false); 
      return;
  }

  setLoading(true);
  try {
    
    const response = await fetchStudentStatsService(userId);
    if (response?.success) setStats(response.data);
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
}, [auth?.user]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return (
    <div>
      <StudentAnalyticsCards stats={stats} loading={loading} />
    </div>
  );
};
