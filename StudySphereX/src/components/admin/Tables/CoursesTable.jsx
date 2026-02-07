import React, { useEffect, useState } from "react";
import {
  Search,
  CheckCircle,
  XCircle,
  Users,
  Calendar,
  AlertCircle,
  X,
  Eye,
  BookOpen,
  DollarSign,
  Globe,
} from "lucide-react";
import {
  fetchCoursesService,
  updateCourseApprovalService,
  fetchCourseDetailsService,
} from "@/services/AdminServices";

export const CoursesTable = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // --- Rejection Modal State ---
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");

  // --- NEW: View/Preview Modal State ---
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewCourseData, setViewCourseData] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);

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

  // --- VIEW HANDLER ---
  const handleViewCourse = async (courseId) => {
    setIsViewModalOpen(true);
    setViewLoading(true);
    try {
      const response = await fetchCourseDetailsService(courseId);
      if (response.success) {
        setViewCourseData(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch course details", error);
    } finally {
      setViewLoading(false);
    }
  };

  // --- APPROVAL HANDLER ---
  const handleApproval = async (courseId, action, reason = null) => {
    try {
      setCourses((prev) =>
        prev.map((c) =>
          c._id === courseId
            ? {
                ...c,
                approvalStatus: action === "approve" ? "approved" : "rejected",
              }
            : c,
        ),
      );
      await updateCourseApprovalService(courseId, action, reason);
    } catch (error) {
      console.error("Failed to update course", error);
      loadCourses();
    }
  };

  const openRejectModal = (courseId) => {
    setSelectedCourseId(courseId);
    setRejectionReason("");
    setIsRejectModalOpen(true);
  };

  const handleConfirmReject = async () => {
    if (selectedCourseId) {
      await handleApproval(selectedCourseId, "reject", rejectionReason);
      setIsRejectModalOpen(false);
      setSelectedCourseId(null);
    }
  };

  const StatusBadge = ({ status }) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      approved: "bg-green-100 text-green-800 border-green-200",
      rejected: "bg-red-100 text-red-800 border-red-200",
    };
    return (
      <span
        className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status]}`}
      >
        {status?.toUpperCase()}
      </span>
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 relative">
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
              <tr>
                <td colSpan="6" className="text-center py-8 text-gray-500">
                  Loading courses...
                </td>
              </tr>
            ) : courses.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-8 text-gray-500">
                  No courses found.
                </td>
              </tr>
            ) : (
              courses.map((course) => (
                <tr
                  key={course._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-md bg-gray-200 overflow-hidden shrink-0">
                        {course.image ? (
                          <img
                            src={course.image}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-gray-400 text-xs">
                            IMG
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 line-clamp-1 max-w-[200px]">
                          {course.title}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(course.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-700 font-medium">
                    {course.instructorName}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {course.students?.length || 0}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-900 font-medium">
                    {course.pricing === 0 ? "Free" : `$${course.pricing}`}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={course.approvalStatus} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      {/* VIEW BUTTON - Always visible */}
                      <button
                        onClick={() => handleViewCourse(course._id)}
                        className="p-1.5 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 hover:scale-110 transition-all"
                        title="View Details"
                      >
                        <Eye className="w-5 h-5" />
                      </button>

                      {/* APPROVE BUTTON - Show if pending OR rejected */}
                      {course.approvalStatus !== "approved" && (
                        <button
                          onClick={() => handleApproval(course._id, "approve")}
                          className="p-1.5 rounded-full bg-green-50 text-green-600 hover:bg-green-100 hover:scale-110 transition-all"
                          title="Approve Course"
                        >
                          <CheckCircle className="w-5 h-5" />
                        </button>
                      )}

                      {/* REJECT BUTTON - Show if pending OR approved */}
                      {course.approvalStatus !== "rejected" && (
                        <button
                          onClick={() => openRejectModal(course._id)}
                          className="p-1.5 rounded-full bg-red-50 text-red-600 hover:bg-red-100 hover:scale-110 transition-all"
                          title="Reject Course"
                        >
                          <XCircle className="w-5 h-5" />
                        </button>
                      )}
                    </div>
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
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className="px-3 py-1 border rounded text-sm disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-sm text-gray-600">
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          className="px-3 py-1 border rounded text-sm disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* --- 1. REJECTION MODAL --- */}
      {isRejectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-600" /> Reject Course
              </h3>
              <button
                onClick={() => setIsRejectModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for Rejection
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 min-h-[100px] resize-none"
                placeholder="e.g., The audio quality is too low..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsRejectModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- 2. VIEW DETAILS MODAL --- */}
      {isViewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col">
            {/* Modal Header */}
            <div className="sticky top-0 z-10 bg-white px-6 py-4 border-b flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">
                Course Preview
              </h3>
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {viewLoading ? (
                <div className="h-64 flex items-center justify-center text-gray-500">
                  Loading course details...
                </div>
              ) : !viewCourseData ? (
                <div className="h-64 flex items-center justify-center text-red-500">
                  Failed to load details.
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Left Column: Thumbnail & Basic Info */}
                  <div className="lg:col-span-1 space-y-6">
                    <div className="rounded-lg overflow-hidden border border-gray-200 shadow-sm aspect-video bg-gray-100">
                      {viewCourseData.image ? (
                        <img
                          src={viewCourseData.image}
                          alt={viewCourseData.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          No Image
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />{" "}
                          {viewCourseData.instructorName}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />{" "}
                          {new Date(viewCourseData.date).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex items-center justify-between font-medium">
                        <div className="flex items-center gap-1 text-green-600">
                          <DollarSign className="w-4 h-4" />{" "}
                          {viewCourseData.pricing || "Free"}
                        </div>
                        <div className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md">
                          {viewCourseData.level}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Globe className="w-4 h-4" />{" "}
                        {viewCourseData.primaryLanguage || "English"}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Description & Curriculum */}
                  <div className="lg:col-span-2 space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        {viewCourseData.title}
                      </h2>
                      <p className="text-gray-500 text-sm mb-4">
                        {viewCourseData.subtitle}
                      </p>
                      <StatusBadge status={viewCourseData.approvalStatus} />
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">
                        Description
                      </h4>
                      <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                        {viewCourseData.description}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <BookOpen className="w-5 h-5" /> Curriculum Preview
                      </h4>
                      <div className="bg-gray-50 rounded-lg border border-gray-200 divide-y divide-gray-200 max-h-[300px] overflow-y-auto">
                        {viewCourseData.curriculum &&
                        viewCourseData.curriculum.length > 0 ? (
                          viewCourseData.curriculum.map((lec, idx) => (
                            <div
                              key={idx}
                              className="p-3 text-sm flex items-center gap-3 hover:bg-gray-100"
                            >
                              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                                {idx + 1}
                              </span>
                              <span className="text-gray-700 font-medium">
                                {lec.title}
                              </span>
                              {lec.freePreview && (
                                <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded">
                                  Preview
                                </span>
                              )}
                            </div>
                          ))
                        ) : (
                          <div className="p-4 text-center text-gray-400 text-sm">
                            No lectures found.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-4 border-t flex justify-end">
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-100"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
