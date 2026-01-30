import { useContext, useEffect, useState } from "react";
import { InstructorAnalyticsCards } from "@/components/Instructor/InstructorAnalyticsCards";
import { AuthContext } from "@/context/AuthContext";
import { toast } from "sonner";
import { fetchInstructorStatsService } from "@/services";

export const InstructorDashboard = () => {
  const { auth } = useContext(AuthContext);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

useEffect(() => {
  if (!auth?.user?._id) return;

  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = await fetchInstructorStatsService(auth.user._id);
      if (response.success) {
        setStats(response.data);
      } else {
        toast.error("Failed to fetch stats");
      }
    } catch (error) {
      console.error("Error fetching instructor stats:", error);
      toast.error("Error fetching stats");
    } finally {
      setLoading(false);
    }
  };

  fetchStats();
}, [auth?.user?._id]);


  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <InstructorAnalyticsCards stats={stats} />
    </div>
  );
};
