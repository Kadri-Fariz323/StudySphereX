import { AuthContext } from "@/context/AuthContext";
import { useContext } from "react";
import { Card } from "@/components/UI/Card";
import { Button } from "@/components/UI/button";

export const QuizLandingPage = () => {
  const { auth } = useContext(AuthContext);

  // Dummy data (later from DB)
  const examInfo = {
    totalQuestions: 30,
    passingMarks: 60, // in percentage
    timeLimit: "30 minutes",
    maxMarks: 100,
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-2xl p-6 md:p-8">
        <div className="space-y-6">
          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-bold text-center">
            Certificate Final Exam
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
              <p className="text-xl font-bold">
                {examInfo.totalQuestions}
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-500">Time Limit</p>
              <p className="text-xl font-bold">
                {examInfo.timeLimit}
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-500">Max Marks</p>
              <p className="text-xl font-bold">
                {examInfo.maxMarks}
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-500">Passing Marks</p>
              <p className="text-xl font-bold">
                {examInfo.passingMarks}%
              </p>
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
            <Button className="w-full sm:w-auto px-8 py-2 text-lg">
              Start Exam
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
