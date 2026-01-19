import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const StudentCourseProgress = () => {
  const navigate = useNavigate();

  return (
    <>
      <button
        onClick={() => navigate("/user/student-courses")}
        className="
            cursor-pointer font-bold transition-all 
            bg-blue-500 text-white rounded-lg 
            border-blue-600 
            text-xs px-3 py-1.5 border-b-[3px] 
            sm:text-sm sm:px-6 sm:py-2 sm:border-b-[4px]
            hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[4px] sm:hover:border-b-[6px]
            active:border-b-[1px] active:brightness-90 active:translate-y-[2px]
            flex-shrink-0
          "
      >
        <div className="flex gap-2 items-center">
          <ArrowLeft />
          Courses
        </div>
      </button>
    </>
  );
};
