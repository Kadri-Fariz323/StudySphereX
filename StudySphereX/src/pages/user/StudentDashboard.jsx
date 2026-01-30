import { useContext, useEffect, useState } from "react";
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

  useEffect(() => {
    const fetchStats = async () => {
      if (auth.user?.id) {
        try {
          const response = await fetchStudentStatsService(auth.user.id);
          if (response.success) {
            setStats(response.data);
          }
        } catch (error) {
          console.error("Error fetching student stats:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchStats();
  }, [auth.user?.id]);

  return (
    <div>
      <StudentAnalyticsCards stats={stats} loading={loading} />
    </div>
  );
};
