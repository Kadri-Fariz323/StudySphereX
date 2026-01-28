import { Button } from "@/components/UI/button";
import { Card } from "@/components/UI/Card";
import { CourseProgress } from "@/components/UI/CourseProgress";
import { AuthContext } from "@/context/AuthContext";
import { useLoader } from "@/context/LoaderContext";
import { StudentContext } from "@/context/StudentContext";
import {
  fetchStudentBoughtCoursesService,
  getCurrentCourseProgressService,
} from "@/services/StudentViewService";
import { Play, CheckCircle, GraduationCap } from "lucide-react";
import { useEffect, useContext, useCallback, useState } from "react";
import { FaBookOpen } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const PurchasedCourseCard = ({ course, auth, navigate }) => {
  const [progress, setProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(true);
  const [btnLabel, setBtnLabel] = useState("Start Watching");

  useEffect(() => {
    const fetchProgress = async () => {
      if (!auth?.user?._id) return;

      try {
        const response = await getCurrentCourseProgressService(
          auth.user._id,
          course.courseId || course._id,
        );

        if (response?.success && response?.data) {
          const {
            courseDetails,
            progress: userProgress = [],
            quizProgress = null,
          } = response.data;

          const totalLectures = courseDetails?.curriculum?.length || 0;

          const hasQuiz = courseDetails?.finalQuiz?.questions?.length > 0;

          const lecturesWatched = userProgress.length;

          const isQuizPassed = quizProgress?.passed === true;

          const lecturesCompleted =
            lecturesWatched === totalLectures && totalLectures > 0;

          // STRICT & FINAL
          const isCompleted = hasQuiz
            ? lecturesCompleted && isQuizPassed
            : lecturesCompleted;

          // Progress calculation
          const totalSteps = totalLectures + (hasQuiz ? 1 : 0);
          const completedSteps = lecturesWatched + (isQuizPassed ? 1 : 0);

          const progressPercent =
            totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

          setIsCompleted(isCompleted);
          setProgress(isCompleted ? 100 : progressPercent);

          if (isCompleted) {
            setBtnLabel("Watch Again");
          } else if (hasQuiz && lecturesCompleted && !isQuizPassed) {
            setBtnLabel("Take Quiz");
          } else if (lecturesWatched > 0) {
            setBtnLabel("Continue Learning");
          } else {
            setBtnLabel("Start Watching");
          }
        }
      } catch (err) {
        console.error("Failed to fetch progress for:", course.title, err);
      } finally {
        setLoadingProgress(false);
      }
    };

    fetchProgress();
  }, [auth?.user?._id, course]);

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col border border-gray-100">
      <div className="relative h-44 overflow-hidden bg-gray-200">
        <img
          src={course.image || course.courseImage}
          alt={course.title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        {/* Completion Badge */}
        {isCompleted && (
          <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center shadow-md">
            <CheckCircle className="w-3 h-3 mr-1" /> Completed
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h2 className="text-lg font-semibold line-clamp-2 mb-1">
          {course.title}
        </h2>

        <p className="text-sm text-gray-600 mb-2">
          Instructor:{" "}
          <span className="font-medium">{course.instructorName}</span>
        </p>

        {!loadingProgress && (
          <CourseProgress value={progress} isCompleted={isCompleted} />
        )}

        <div className="mt-auto pt-4">
          <Button
            variant={isCompleted ? "outline" : "default"}
            className="w-full cursor-pointer flex items-center justify-center gap-2"
            onClick={() => {
              const targetId = course.courseId || course._id;
              navigate(`/course-progress/${targetId}`);
            }}
          >
            {btnLabel === "Take Quiz" ? (
              <GraduationCap className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
            {btnLabel}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export const PurchasedCourses = () => {
  const { auth } = useContext(AuthContext);
  const { studentBoughtCoursesList, setStudentBoughtCoursesList } =
    useContext(StudentContext);
  const { setLoading } = useLoader();
  const navigate = useNavigate();

  const fetchCourses = useCallback(async () => {
    if (!auth?.user?._id) return;

    try {
      setLoading(true);
      const response = await fetchStudentBoughtCoursesService(auth.user._id);

      if (response?.success) {
        setStudentBoughtCoursesList(response.data || []);
      } else {
        setStudentBoughtCoursesList([]);
      }
    } catch (error) {
      console.error("Failed to fetch purchased courses:", error);
    } finally {
      setLoading(false);
    }
  }, [auth?.user?._id, setStudentBoughtCoursesList, setLoading]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

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

  return (
    <div className="px-4 py-6">
      <h1 className="text-2xl font-semibold mb-6">Purchased Courses</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {studentBoughtCoursesList.map((course) => (
          <PurchasedCourseCard
            key={course._id}
            course={course}
            auth={auth}
            navigate={navigate}
          />
        ))}
      </div>
    </div>
  );
};
