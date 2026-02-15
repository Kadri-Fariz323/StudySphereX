import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

export const StudentQuizResult = () => {
  const { id } = useParams(); // courseId
  const location = useLocation();
  const navigate = useNavigate();

  // Retrieve data passed from the FinalExam component
  const resultData = location.state;

  // If user accesses this page directly without taking quiz, redirect back
  if (!resultData) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-xl mb-4">No result data found.</p>
        <button 
          onClick={() => navigate(`/user/course/${id}/quiz`)}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Go to Quiz
        </button>
      </div>
    );
  }

  const { score, isPassed, passingMarks } = resultData;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className={`p-10 rounded-xl shadow-2xl text-center border-t-8 max-w-lg w-full bg-white 
        ${isPassed ? "border-green-500" : "border-red-500"}`}>
        
        {/* Icon / Heading */}
        <div className="mb-6">
          {isPassed ? (
            <div className="text-6xl mb-2">🎉</div>
          ) : (
            <div className="text-6xl mb-2">⚠️</div>
          )}
          <h2 className={`text-4xl font-extrabold ${isPassed ? "text-green-600" : "text-red-600"}`}>
            {isPassed ? "Quiz Passed!" : "Quiz Failed"}
          </h2>
        </div>

        {/* Score Details */}
        <div className="bg-gray-100 p-6 rounded-lg mb-8">
          <p className="text-lg text-gray-600 mb-2">Your Score</p>
          <p className="text-5xl font-bold text-gray-800 mb-2">
            {score.toFixed(0)}%
          </p>
          <div className="h-1 w-full bg-gray-300 rounded-full mt-2 overflow-hidden">
             <div 
               className={`h-full ${isPassed ? "bg-green-500" : "bg-red-500"}`} 
               style={{ width: `${score}%` }} 
             />
          </div>
          <p className="text-sm text-gray-500 mt-3 font-medium">
            Passing Score Required: {passingMarks}%
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          {isPassed ? (
            <button 
              onClick={() => navigate(`/course-progress/${id}`)}
              className="w-full py-4 bg-green-600 text-white text-lg rounded-lg font-bold hover:bg-green-700 transition shadow-lg flex items-center justify-center gap-2"
            >
              Finish & Review Course
              <span>→</span>
            </button>
          ) : (
            <button 
              onClick={() => navigate(`/user/course/${id}/quiz`)}
              className="w-full py-4 bg-gray-900 text-white text-lg rounded-lg font-bold hover:bg-gray-800 transition shadow-lg flex items-center justify-center gap-2"
            >
              ↺ Reattempt Quiz
            </button>
          )}

          {/* Optional: Back to Dashboard for both cases */}
          <button 
            onClick={() => navigate('/user/student-courses')} // Adjust route as needed
            className="text-gray-500 hover:text-gray-800 text-sm font-medium mt-4 underline"
          >
            Back to My Courses
          </button>
        </div>
      </div>
    </div>
  );
};