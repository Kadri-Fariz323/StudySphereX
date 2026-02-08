import { useState, useMemo } from "react"; // Added useMemo for performance
import { MdEdit, MdDeleteForever, MdSearch } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { deleteCourseById } from "../../services/index";
import { StatusBadge } from "../admin/StatusBadge";

export const CourseTable = ({ listOfCourses, onRefresh }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  // 1. Memoized Search Logic
  const filteredCourses = useMemo(() => {
    if (!searchQuery.trim()) return listOfCourses;

    const lowerCaseQuery = searchQuery.toLowerCase();
    return listOfCourses.filter((course) => {
      return (
        course?.title?.toLowerCase().includes(lowerCaseQuery) ||
        course?.approvalStatus?.toLowerCase().includes(lowerCaseQuery)
      );
    });
  }, [searchQuery, listOfCourses]);

  const handleDeleteCourse = async (courseId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this course? This action cannot be undone."
    );

    if (!confirmDelete) return;

    try {
      const res = await deleteCourseById(courseId);
      if (res?.success) {
        if (onRefresh) onRefresh();
      }
    } catch (error) {
      console.error("Delete course failed:", error);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* 2. Search Input UI */}
      <div className="relative w-full max-w-sm">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <MdSearch className="text-gray-400 text-xl" />
        </div>
        <input
          type="text"
          placeholder="Search by course title or status..."
          className="block w-full p-2.5 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Table Container */}
      <div className="w-[380px] sm:w-full overflow-x-auto shadow-md sm:rounded-lg bg-white border border-gray-100">
        <table className="w-full min-w-[600px] text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3">Course</th>
              <th className="px-4 py-3">Students</th>
              <th className="px-4 py-3">Revenue</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {filteredCourses?.length > 0 ? (
              filteredCourses.map((course) => (
                <tr key={course?._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {course?.title}
                  </td>
                  <td className="px-4 py-3">{course?.students?.length || 0}</td>
                  <td className="px-4 py-3">${course?.pricing}</td>
                  <td className="px-4 py-3">
                    <StatusBadge
                      status={course.approvalStatus}
                      isPublished={course.isPublished}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleDeleteCourse(course?._id)}
                        className="p-1.5 hover:bg-red-50 rounded-lg text-red-500 transition-colors"
                        title="Delete Course"
                      >
                        <MdDeleteForever className="text-xl" />
                      </button>
                      <button
                        onClick={() => navigate(`/instructor/edit-course/${course?._id}`)}
                        className="p-1.5 hover:bg-green-50 rounded-lg text-green-600 transition-colors"
                        title="Edit Course"
                      >
                        <MdEdit className="text-xl" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-4 py-10 text-center text-gray-500">
                  {searchQuery ? `No matches found for "${searchQuery}"` : "No courses found."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};