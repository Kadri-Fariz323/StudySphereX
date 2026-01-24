import { Button } from "@/components/UI/button";
import { Card } from "@/components/UI/Card";
import { AuthContext } from "@/context/AuthContext";
import { useLoader } from "@/context/LoaderContext";
import { StudentContext } from "@/context/StudentContext";
import { fetchStudentBoughtCoursesService } from "@/services/StudentViewService";
import { Play } from "lucide-react";
import { useEffect, useContext, useCallback } from "react";
import { FaBookOpen } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export const PurchasedCourses = () => {
  const { auth } = useContext(AuthContext);
  const { studentBoughtCoursesList, setStudentBoughtCoursesList } =
    useContext(StudentContext);
  const { setLoading } = useLoader();
  const navigate = useNavigate();

  // 1. Wrap fetch in useCallback to ensure stability and proper dependency tracking
  const fetchCourses = useCallback(async () => {
    // Only fetch if we have a valid user ID
    if (!auth?.user?._id) return;

    try {
      setLoading(true);
      const response = await fetchStudentBoughtCoursesService(auth.user._id);

      if (response?.success) {
        setStudentBoughtCoursesList(response.data || []);
      } else {
        // Optional: Reset list if response fails so we don't show stale data
        setStudentBoughtCoursesList([]);
      }
    } catch (error) {
      console.error("Failed to fetch purchased courses:", error);
    } finally {
      setLoading(false);
    }
  }, [auth?.user?._id, setStudentBoughtCoursesList, setLoading]);

  // 2. useEffect now depends on the stable fetchCourses function
  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  // ---------- NO COURSES UI ----------
  if (!studentBoughtCoursesList || studentBoughtCoursesList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <FaBookOpen className="text-6xl text-gray-400 mb-4" />
        <h2 className="text-xl font-semibold text-gray-700">
          No Courses Found
        </h2>
        <p className="text-gray-500 mt-2">
          You haven’t purchased any courses yet.
        </p>
      </div>
    );
  }

  // ---------- COURSES UI ----------
  return (
    <div className="px-4 py-6">
      <h1 className="text-2xl font-semibold mb-6">Purchased Courses</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {studentBoughtCoursesList.map((course) => (
          <Card
            key={course._id}
            className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col"
          >
            {/* 3. Image Handling: Fallback to ensure consistency with AllCoursesList */}
            <div className="relative h-44 overflow-hidden bg-gray-200">
              <img
                src={course.image || course.courseImage}
                alt={course.title}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>

            <div className="p-4 flex flex-col flex-1">
              <h2 className="text-lg font-semibold line-clamp-2 mb-1">
                {course.title}
              </h2>

              <p className="text-sm text-gray-600 mb-2">
                Instructor:{" "}
                <span className="font-medium">{course.instructorName}</span>
              </p>

              {/* Only show date if it exists */}
              {course.dateOfPurchase && (
                <p className="text-xs text-gray-500 mb-4">
                  Purchased on{" "}
                  {new Date(course.dateOfPurchase).toLocaleDateString()}
                </p>
              )}

              {/* 4. Navigation & Footer: Pushes button to bottom */}
              <div className="mt-auto">
                <Button
                  className="w-full cursor-pointer flex items-center justify-center gap-2"
                  onClick={() => {
                    // Check for courseId (from purchase record) or fallback to _id (if raw course)
                    const targetId = course.courseId || course._id;
                    navigate(`/course-progress/${targetId}`);
                  }}
                >
                  Start Watching <Play className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};