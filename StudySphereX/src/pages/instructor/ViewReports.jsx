import React, { useEffect, useState, useContext } from 'react';

import { AlertCircle, BookOpen, ArrowRight } from 'lucide-react';
import { fetchInstructorRejectedCourse } from '@/services';
import { AuthContext } from '@/context/AuthContext';

export const ViewReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const { auth } = useContext(AuthContext); // Get the instructor's info

  useEffect(() => {
    async function getReports() {
      try {
        // Note: Your service might need to be updated to accept the auth.user.id
        const response = await fetchInstructorRejectedCourse(auth?.user?._id);
        if (response?.success) {
          setReports(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch reports", error);
      } finally {
        setLoading(false);
      }
    }

    if (auth?.user?._id) {
      getReports();
    }
  }, [auth?.user?._id]);

  if (loading) return <div className="p-10 text-center">Loading reports...</div>;

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Course Reports</h1>
        <p className="text-gray-600">Review feedback on courses that require revisions.</p>
      </div>

      {reports.length === 0 ? (
        <div className="bg-white border rounded-lg p-12 text-center shadow-sm">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No rejected courses</h3>
          <p className="text-gray-500">All your courses are either approved or pending review.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {reports.map((course) => (
            <div key={course._id} className="bg-white border border-red-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="h-16 w-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                      <img src={course.image} alt="" className="h-full w-full object-cover" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800">{course.title}</h2>
                      <p className="text-sm text-gray-500 capitalize">{course.category} • {course.level}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm font-medium border border-red-100">
                    <AlertCircle size={16} />
                    Needs Revision
                  </div>
                </div>

                <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">Rejection Reason</h4>
                  <p className="text-gray-700 leading-relaxed">
                    {course.rejectionReason || "No detailed feedback provided. Please review course guidelines."}
                  </p>
                </div>

                <div className="mt-6 flex justify-end border-t pt-4">
                  <button 
                    onClick={() => window.location.href = `/instructor/edit-course/${course._id}`}
                    className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Edit & Resubmit <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};