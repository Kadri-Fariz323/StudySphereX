import React, { useEffect, useState } from "react";
import { AnalyticsCards } from "@/components/admin/AnalyticsCards";
import { fetchAdminStatsService } from "@/services/AdminServices";

export const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalInstructors: 0,
    totalReports: 0,
    pendingCourses: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await fetchAdminStatsService();
        
        if (response?.data) {
          setStats(response.data);
        }
      } catch (err) {
        console.error("Failed to load admin stats", err);
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading) {
    return <div className="p-6">Loading dashboard stats...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  return (
    <div>
      <AnalyticsCards stats={stats} />
    </div>
  );
};