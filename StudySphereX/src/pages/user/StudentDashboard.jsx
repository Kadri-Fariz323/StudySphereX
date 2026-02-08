import { useContext, useEffect, useState, useCallback } from "react";
import { AuthContext } from "@/context/AuthContext";
import { StudentAnalyticsCards } from "@/components/StudentView/StudentAnalyticsCards";
import { fetchStudentStatsService } from "@/services/StudentViewService";
import { StudentsLogs } from "@/components/StudentView/StudentsLogs";

export const StudentDashboard = () => {
  const { auth } = useContext(AuthContext);

  const [stats, setStats] = useState({
    stats: {
      totalPurchased: 0,
      totalInProgress: 0,
      totalCompleted: 0,
      totalCertificates: 0,
    },
    continueLearning: [],
    recentCertificates: [],
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
      // The backend now returns { success, data: { stats, continueLearning, recentCertificates } }
      if (response?.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error("Dashboard Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  }, [auth?.user]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return (
    <div className="flex flex-col gap-8 p-4">
      {/* Pass the nested stats object to the cards */}
      <StudentAnalyticsCards stats={stats.stats} loading={loading} />
      
      {/* Pass the log arrays to the logs component */}
      <StudentsLogs 
        continueLearning={stats.continueLearning} 
        recentCertificates={stats.recentCertificates} 
        loading={loading}
      />
    </div>
  );
};