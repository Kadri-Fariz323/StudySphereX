import React, { useEffect, useState } from "react";
import { Search, CheckCircle, XCircle, Users, DollarSign, Calendar } from "lucide-react";
import { fetchCoursesService, updateCourseApprovalService } from "@/services/AdminServices";

export const CoursesTable = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadCourses();
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [search, page]);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const response = await fetchCoursesService(page, 10, search);
      if (response.success) {
        setCourses(response.data);
        setTotalPages(response.pagination.totalPages);
      }
    } catch (error) {
      console.error("Failed to load courses", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (courseId, action) => {
    try {
      // Optimistic Update
      setCourses(prev => prev.map(c => 
        c._id === courseId 
          ? { ...c, approvalStatus: action === 'approve' ? 'approved' : 'rejected' } 
          : c
      ));

      await updateCourseApprovalService(courseId, action);
    } catch (error) {
      console.error("Failed to update course", error);
      loadCourses(); // Revert on error
    }
  };

  const StatusBadge = ({ status }) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      approved: "bg-green-100 text-green-800 border-green-200",
      rejected: "bg-red-100 text-red-800 border-red-200"
    };
    return (
      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status]}`}>
        {status.toUpperCase()}
      </span>
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">All Courses</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search by title or instructor..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm uppercase">
              <th className="px-4 py-3">Course</th>
              <th className="px-4 py-3">Instructor</th>
              <th className="px-4 py-3">Enrolled</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-gray-100">
            {loading ? (
               <tr><td colSpan="6" className="text-center py-8 text-gray-500">Loading courses...</td></tr>
            ) : courses.length === 0 ? (
               <tr><td colSpan="6" className="text-center py-8 text-gray-500">No courses found.</td></tr>
            ) : (
              courses.map((course) => (
                <tr key={course._id} className="hover:bg-gray-50 transition-colors">
                  {/* Course Title + Image */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-md bg-gray-200 overflow-hidden shrink-0">
                         {course.image ? (
                             <img src={course.image} alt="" className="h-full w-full object-cover"/>
                         ) : (
                             <div className="h-full w-full flex items-center justify-center text-gray-400 text-xs">IMG</div>
                         )}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 line-clamp-1 max-w-[200px]">{course.title}</div>
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(course.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Instructor */}
                  <td className="px-4 py-3 text-gray-700 font-medium">
                    {course.instructorName}
                  </td>

                  {/* Enrolled Students Count */}
                  <td className="px-4 py-3 text-gray-600">
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {course.students?.length || 0}
                    </div>
                  </td>

                  {/* Price */}
                  <td className="px-4 py-3 text-gray-900 font-medium">
                     {course.pricing === 0 ? 'Free' : `$${course.pricing}`}
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3">
                    <StatusBadge status={course.approvalStatus} />
                  </td>

                  {/* Actions (Approve/Reject) */}
                  <td className="px-4 py-3 text-right">
                    {course.approvalStatus === 'pending' ? (
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleApproval(course._id, 'approve')}
                          className="p-1.5 rounded-full bg-green-50 text-green-600 hover:bg-green-100 hover:scale-110 transition-all"
                          title="Approve Course"
                        >
                          <CheckCircle className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleApproval(course._id, 'reject')}
                          className="p-1.5 rounded-full bg-red-50 text-red-600 hover:bg-red-100 hover:scale-110 transition-all"
                          title="Reject Course"
                        >
                          <XCircle className="w-5 h-5" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">
                        Processed
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
       {/* Pagination Controls */}
       <div className="flex justify-between items-center mt-4">
        <button
          disabled={page === 1}
          onClick={() => setPage(p => Math.max(1, p - 1))}
          className="px-3 py-1 border rounded text-sm disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-sm text-gray-600">Page {page} of {totalPages}</span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
          className="px-3 py-1 border rounded text-sm disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};