import { AuthContext } from "@/context/AuthContext";
import { useContext, useEffect, useState } from "react";
import { Card } from "@/components/UI/Card";
import { Button } from "@/components/UI/button";
import { fetchStudentViewCourseDetailsService } from "@/services/StudentViewService";
import { useParams, useNavigate } from "react-router-dom";

export const QuizLandingPage = () => {
  const { auth } = useContext(AuthContext);

  const navigate = useNavigate();
  const { id } = useParams();

  const [examInfo, setExamInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCourse() {
      if (!id) return;

      try {
        const res = await fetchStudentViewCourseDetailsService(id);
        console.log(res);

        if (res?.success && res?.data) {
          const quiz = res.data.finalQuiz;

          if (quiz) {
            setExamInfo({
              totalQuestions: quiz.questions?.length || 0,
              passingMarks: quiz.passingMarks,
              timeLimit: quiz.timeLimit || "1",
              maxMarks: (quiz.questions?.length || 0) * 1,
              title: quiz.title,
            });
          } else {
            console.error("No quiz found for this course");
          }
        }
      } catch (error) {
        console.error("Failed to fetch quiz details:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCourse();
  }, [id]);

  if (loading) {
    return <div className="text-center p-10">Loading exam details...</div>;
  }

  if (!examInfo) {
    return (
      <div className="text-center p-10 text-red-500">
        No Final Assessment available for this course.
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-2xl p-6 md:p-8">
        <div className="space-y-6">
          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-bold text-center">
            {examInfo.title}
          </h1>

          {/* Important Notice */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm md:text-base">
            <p className="font-semibold mb-1">Important</p>
            <p>
              If you pass the exam, the following name will be listed on your
              certificate:
              <span className="font-semibold">
                {" "}
                {auth?.user?.name || "Your Name"}
              </span>
              .
            </p>
          </div>

          {/* Exam Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-500">Total Questions</p>
              <p className="text-xl font-bold">{examInfo.totalQuestions}</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-500">Time Limit</p>
              <p className="text-xl font-bold">{examInfo.timeLimit} Hour</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-500">Max Marks</p>
              <p className="text-xl font-bold">{examInfo.maxMarks}</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-500">Passing Marks</p>
              <p className="text-xl font-bold">{examInfo.passingMarks}%</p>
            </div>
          </div>

          {/* Instructions */}
          <div className="text-sm md:text-base text-gray-600 space-y-2">
            <p>• You must complete the exam in one sitting.</p>
            <p>• Once started, you cannot pause or restart.</p>
            <p>• Make sure you have a stable internet connection.</p>
          </div>

          {/* Start Button */}
          <div className="flex justify-center pt-4">
            {/* You will likely need an onClick handler here to navigate to the actual quiz questions page */}
            <Button
              className="w-full sm:w-auto px-8 py-2 text-lg"
              onClick={() => navigate(`/user/course/${id}/quiz/`)}
            >
              Start Exam
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
