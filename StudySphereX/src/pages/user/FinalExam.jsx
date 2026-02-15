import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom"; 
import { fetchStudentViewCourseDetailsService, submitQuizService } from "@/services/StudentViewService";
import { AuthContext } from "@/context/AuthContext";

export const FinalExam = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext); 

  const EXAM_DURATION = 60 * 60; 
const [timeLeft, setTimeLeft] = useState(EXAM_DURATION);

  const formatTime = (seconds) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h.toString().padStart(2, "0")}:${m
    .toString()
    .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
};


  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false); 

  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({}); 
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [isPassed, setIsPassed] = useState(false);

  
  useEffect(() => {
    
    const handleBeforeUnload = (e) => {
      if (!showResult) { 
        e.preventDefault();
        e.returnValue = ''; 
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [showResult]);

useEffect(() => {
  const handleBackButton = (event) => {
    if (!showResult) {
      const confirmLeave = window.confirm(
        "Your exam progress will be lost. Are you sure you want to leave?"
      );

      if (!confirmLeave) {
        window.history.pushState(null, "", window.location.pathname);
      }
    }
  };

  window.history.pushState(null, "", window.location.pathname);
  window.addEventListener("popstate", handleBackButton);

  return () => {
    window.removeEventListener("popstate", handleBackButton);
  };
}, [showResult]);


  useEffect(() => {
    loadCourseDetails();
  }, [id]);

  
  useEffect(() => {
  if (showResult) return;

  const timer = setInterval(() => {
    setTimeLeft(prev => {
      if (prev <= 1) {
        clearInterval(timer);
        handleSubmit(); 
        return 0;
      }
      return prev - 1;
    });
  }, 1000);

  return () => clearInterval(timer);
}, [showResult]);

useEffect(() => {
  const disable = (e) => e.preventDefault();
  document.addEventListener("contextmenu", disable);
  document.addEventListener("copy", disable);

  return () => {
    document.removeEventListener("contextmenu", disable);
    document.removeEventListener("copy", disable);
  };
}, []);

useEffect(() => {
  const handleVisibility = () => {
    if (document.hidden && !showResult) {
      alert("Do not switch tabs during the exam!");
    }
  };

  document.addEventListener("visibilitychange", handleVisibility);
  return () =>
    document.removeEventListener("visibilitychange", handleVisibility);
}, [showResult]);


  const loadCourseDetails = async () => {
    try {
      const response = await fetchStudentViewCourseDetailsService(id);
      setCourseData(response?.data); 
    } catch (error) {
      console.error("Failed to fetch quiz data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = (optionIndex) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestionIndex]: optionIndex,
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < courseData?.finalQuiz?.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  

  
  const handleSubmit = async () => {
    const unAnsweredCount = courseData?.finalQuiz?.questions.length - Object.keys(selectedAnswers).length;
    if (unAnsweredCount > 0) {
       const confirmSubmit = window.confirm(`You have ${unAnsweredCount} unanswered questions. Are you sure you want to submit?`);
       if (!confirmSubmit) return;
    }

    setIsSubmitting(true);

    try {
      
      let calculatedScore = 0;
      const questions = courseData?.finalQuiz?.questions;
      const totalQuestions = questions.length;

      const formattedAnswers = questions.map((q, index) => {
        const userAns = selectedAnswers[index];
        if (userAns === q.correctAnswerIndex) calculatedScore++;
        return {
          questionId: q._id,
          selectedOption: userAns
        };
      });

      const finalPercentage = (calculatedScore / totalQuestions) * 100;
      const hasPassed = finalPercentage >= courseData?.finalQuiz?.passingMarks;

      
      const response = await submitQuizService(
        auth?.user?._id,
        id,
        courseData?.finalQuiz?._id,
        formattedAnswers
      );

      if (response?.success) {
        
        navigate(`/course/quiz-result/${id}`, {
          state: {
            score: finalPercentage,
            isPassed: hasPassed,
            passingMarks: courseData?.finalQuiz?.passingMarks
          },
          replace: true 
        });
      } else {
        alert(response?.message || "Submission failed.");
      }

    } catch (error) {
      console.error("Error submitting quiz:", error);
      alert("Something went wrong submitting your quiz.");
    } finally {
      setIsSubmitting(false);
    }
  };



  if (loading) return <div className="p-10 text-center font-medium text-gray-500">Loading Exam...</div>;
  if (!courseData?.finalQuiz) return <div className="p-10 text-center font-medium text-red-500">No Quiz Available.</div>;

  const { questions, passingMarks } = courseData.finalQuiz;
  const currentQuestion = questions[currentQuestionIndex];

  
  if (showResult) {
    return (
      <div className="flex flex-col items-center justify-center p-10 space-y-6 animate-in fade-in zoom-in duration-300">
        <div className={`p-8 rounded-lg shadow-2xl text-center border-t-8 max-w-md w-full bg-white 
          ${isPassed ? "border-green-500" : "border-red-500"}`}>
          
          <h2 className={`text-4xl font-extrabold mb-4 ${isPassed ? "text-green-600" : "text-red-600"}`}>
            {isPassed ? "Pass" : "Fail"}
          </h2>
          
          <p className="text-xl text-gray-700">
            Your Score: <span className="font-bold text-2xl">{score.toFixed(0)}%</span>
          </p>
          <p className="text-sm text-gray-500 mt-2">Required to Pass: {passingMarks}%</p>
          
          <div className="mt-8 flex gap-4 justify-center">
             <button 
              onClick={() => navigate(`/course-details/${id}`)} 
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition"
            >
              Back to Course
            </button>
            <button 
              onClick={() => window.location.reload()} 
              className="px-6 py-2 bg-gray-900 text-white rounded hover:bg-gray-800 transition shadow-lg"
            >
              Try Again
            </button> 
          </div>
        </div>
      </div>
    );
  }

  
  return (
    <div className="max-w-3xl mx-auto mt-10 p-8 bg-white shadow-2xl rounded-xl border border-gray-100">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
  <h1 className="text-2xl font-bold">Final Examination</h1>

  <span className={`px-4 py-2 rounded-full font-bold
    ${timeLeft < 300 ? "bg-red-100 text-red-700" : "bg-blue-50 text-blue-700"}`}>
    ⏳ {formatTime(timeLeft)}
  </span>
</div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
        <div 
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
          style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
        ></div>
      </div>

      <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
        <h1 className="text-2xl font-bold text-gray-800">Final Examination</h1>
        <span className="px-3 py-1 bg-blue-50 text-blue-700 text-sm font-bold rounded-full">
          {currentQuestionIndex + 1} / {questions.length}
        </span>
      </div>

      <h2 className="text-xl font-medium text-gray-900 mb-8 leading-relaxed">
        {currentQuestion.question}
      </h2>

      <div className="space-y-4">
        {currentQuestion.options.map((option, index) => {
          const isSelected = selectedAnswers[currentQuestionIndex] === index;
          return (
            <div
              key={index}
              onClick={() => handleOptionSelect(index)}
              className={`p-5 rounded-xl border-2 cursor-pointer transition-all duration-200 flex items-center justify-between group
                ${isSelected 
                  ? "border-blue-600 bg-blue-50/50 shadow-md" 
                  : "border-gray-200 hover:border-blue-400 hover:bg-gray-50"
                }`}
            >
              <span className={`text-lg ${isSelected ? "font-semibold text-blue-800" : "text-gray-700"}`}>
                {option}
              </span>
              
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors
                ${isSelected ? "border-blue-600" : "border-gray-300 group-hover:border-blue-400"}`}
              >
                {isSelected && <div className="w-3 h-3 bg-blue-600 rounded-full" />}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-between mt-10 pt-6 border-t border-gray-100">
        <button
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          className={`px-6 py-3 rounded-lg font-medium transition flex items-center gap-2
            ${currentQuestionIndex === 0 
              ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
              : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:shadow-sm"}`}
        >
          Previous
        </button>

        {currentQuestionIndex === questions.length - 1 ? (
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-8 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition shadow-lg hover:shadow-xl disabled:opacity-70 flex items-center gap-2"
          >
            {isSubmitting ? "Submitting..." : "Finish Exam"}
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition shadow-lg hover:shadow-xl"
          >
            Next Question
          </button>
        )}
      </div>
    </div>
  );
};