import { Button } from "@/components/UI/button";
import { Card } from "@/components/UI/Card";
import { AuthContext } from "@/context/AuthContext";
import { useLoader } from "@/context/LoaderContext";
import { StudentContext } from "@/context/StudentContext";
import { fetchStudentBoughtCoursesService } from "@/services/StudentViewService";
import { Play } from "lucide-react";
import { useEffect, useContext } from "react";
import { FaBookOpen } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // 1. Import useNavigate

export const PurchasedCourses = () => {
  const { auth } = useContext(AuthContext);
  const { studentBoughtCoursesList, setStudentBoughtCoursesList } =
    useContext(StudentContext);
  const { setLoading } = useLoader();
  const navigate = useNavigate(); // 2. Initialize hook

  const fetchCourses = async () => {
    try {
      if (!auth?.user?._id) return;

      setLoading(true);
      const response = await fetchStudentBoughtCoursesService(auth.user._id);

      if (response?.success) {
        setStudentBoughtCoursesList(response.data || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); // 3. Fix: Ensure loader stops even if API fails
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [auth?.user?._id]);

  // ---------- NO COURSES UI ----------
  if (!studentBoughtCoursesList?.length) {
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
            className="overflow-hidden hover:shadow-lg transition-shadow"
          >
            <img
              src={course.courseImage}
              alt={course.title}
              className="w-full h-44 object-cover"
            />

            <div className="p-4">
              <h2 className="text-lg font-semibold line-clamp-2">
                {course.title}
              </h2>

              <p className="text-sm text-gray-600 mt-1">
                Instructor:{" "}
                <span className="font-medium">
                  {course.instructorName}
                </span>
              </p>

              <p className="text-xs text-gray-500 mt-2">
                Purchased on{" "}
                {new Date(course.dateOfPurchase).toLocaleDateString()}
              </p>
              
              {/* 4. Navigation Button */}
              <Button 
                className='mt-4 w-full cursor-pointer flex items-center gap-2'
                onClick={() => {
            
                   navigate(`/course-progress/${course.courseId}`)
                }}
              > 
                 Start Watching <Play className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};