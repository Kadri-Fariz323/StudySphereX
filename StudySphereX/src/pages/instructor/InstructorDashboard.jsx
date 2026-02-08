import { useContext, useEffect, useState } from "react";
import { InstructorAnalyticsCards } from "@/components/Instructor/InstructorAnalyticsCards";
import { AuthContext } from "@/context/AuthContext";
import { toast } from "sonner";
import { fetchInstructorStatsService } from "@/services";

export const InstructorDashboard = () => {
  const { auth } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
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
        toast.error("Error fetching stats");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [auth?.user?._id]);

  if (loading) return <div className="p-10 text-center">Loading Dashboard...</div>;

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold">Dashboard Overview</h1>
      
      {/* 1. Top Cards (Totals) */}
      <InstructorAnalyticsCards stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 2. Recent Enrollments Log */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h2 className="text-lg font-bold mb-4">Recent Enrollments</h2>
          <div className="space-y-4">
            {stats?.recentEnrollments?.length > 0 ? (
              stats.recentEnrollments.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center border-b pb-2">
                  <div>
                    <p className="font-medium">{item.studentName}</p>
                    <p className="text-xs text-gray-500">{item.courseTitle}</p>
                  </div>
                  <p className="text-green-600 font-bold">${item.paidAmount}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-sm">No recent sales yet.</p>
            )}
          </div>
        </div>

        {/* 3. Course Status Notifications */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h2 className="text-lg font-bold mb-4">Status Updates</h2>
          <div className="space-y-4">
            {stats?.recentUpdates?.length > 0 ? (
              stats.recentUpdates.map((course, idx) => (
                <div key={idx} className={`p-3 rounded-lg border-l-4 ${course.status === 'rejected' ? 'bg-red-50 border-red-500' : 'bg-yellow-50 border-yellow-500'}`}>
                  <div className="flex justify-between">
                    <p className="text-sm font-bold">{course.title}</p>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 bg-white rounded border">
                      {course.status}
                    </span>
                  </div>
                  {course.rejectionReason && (
                    <p className="text-xs text-red-700 mt-1 italic">Reason: {course.rejectionReason}</p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-sm">All courses are up to date.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};