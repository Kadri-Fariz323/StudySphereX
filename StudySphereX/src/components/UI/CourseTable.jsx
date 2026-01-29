import { MdEdit, MdDeleteForever } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { deleteCourseById } from "../../services/index";
import { StatusBadge } from "../admin/StatusBadge";

export const CourseTable = ({ listOfCourses, onRefresh }) => {
  const navigate = useNavigate();

  const handleDeleteCourse = async (courseId) => {
    // 1. Confirm deletion
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this course? This action cannot be undone."
    );

    if (!confirmDelete) return;

    try {
      const res = await deleteCourseById(courseId);

      if (res?.success) {
       
        console.log("Course deleted:", res);

        if (onRefresh) {
          onRefresh();
        }
      } else {
        console.warn("Delete completed but indicated failure:", res);
      }
    } catch (error) {
      console.error("Delete course failed:", error);
    }
  };

  return (
    <div className="w-[380px] sm:w-full overflow-x-auto shadow-md sm:rounded-lg bg-white">
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
          {listOfCourses?.length > 0 ? (
            listOfCourses.map((course) => (
              <tr key={course?._id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">
                  {course?.title}
                </td>

                <td className="px-4 py-3">
                  {course?.students?.length || 0}
                </td>

                <td className="px-4 py-3">
                  ${course?.pricing}
                </td>

               <td className="py-2 px-4 border-b">
          <StatusBadge status={course.approvalStatus} />
        </td>

                <td className="px-4 py-3">
                  <div className="flex justify-center gap-2">
                    {/* DELETE BUTTON */}
                    <button
                      onClick={() => handleDeleteCourse(course?._id)}
                      className="p-1 hover:bg-red-100 rounded-full transition-colors duration-200"
                      title="Delete Course"
                    >
                      <MdDeleteForever className="text-xl text-red-500" />
                    </button>

                    {/* EDIT BUTTON */}
                    <button
                      onClick={() =>
                        navigate(`/instructor/edit-course/${course?._id}`)
                      }
                      className="p-1 hover:bg-green-100 rounded-full transition-colors duration-200"
                      title="Edit Course"
                    >
                      <MdEdit className="text-xl text-green-500" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="px-4 py-6 text-center text-gray-500">
                No courses found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};