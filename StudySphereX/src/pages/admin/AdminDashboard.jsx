import React, { useEffect, useState } from "react";
import { AnalyticsCards } from "@/components/admin/AnalyticsCards";
import { fetchAdminStatsService } from "@/services/AdminServices";
import { ActivityLogs } from "@/components/admin/ActivityLogs";


export const AdminDashboard = () => {
  const [data, setData] = useState({
    counts: {
      totalCourses: 0,
      totalStudents: 0,
      totalInstructors: 0,
      totalContacts: 0,
      pendingCourses: 0,
      totalUsers: 0
    },
    logs: {
      recentCourses: [],
      recentUsers: [],
      recentContacts: []
    }
  });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await fetchAdminStatsService();
        if (response?.data) {
          setData(response.data); // Stores both 'counts' and 'logs'
          console.log(response);
          
        }
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  if (loading) return <div className="p-6">Loading dashboard...</div>;

  return (
    <div>
      {/* 1. Top Cards Section */}
      <AnalyticsCards stats={data.counts} />

      {/* 2. Activity Logs Section */}
      <ActivityLogs logs={data.logs} />
    </div>
  );
};