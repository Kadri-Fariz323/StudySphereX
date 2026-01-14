import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { StudentContext } from "@/context/StudentContext";
import { fetchStudentViewCourseDetailsService } from "@/services/StudentViewService";
import { Button } from "../UI/button";
import {
  PlayCircle,
  Lock,
  Globe,
  CheckCircle,
  Clock,
  User,
  Video,
  FileText,
  HelpCircle,
  Award,
  Trophy,
} from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";
import { AuthContext } from "@/context/AuthContext";
import { useLoader } from "@/context/LoaderContext";

export const CoursesDetails = () => {
  const { auth } = useContext(AuthContext);

  const { studentViewCourseDetails, setStudentViewCourseDetails } =
    useContext(StudentContext);

  const navigate = useNavigate();
  const { setLoading } = useLoader();

  const { id } = useParams();

  useEffect(() => {
    if (id) {
      const fetchDetails = async () => {
        setLoading(true);
        const response = await fetchStudentViewCourseDetailsService(id);

        if (response?.success) {
          // Handling Array vs Object return from backend
          const courseData = Array.isArray(response.data)
            ? response.data[0]
            : response.data;
          setStudentViewCourseDetails(courseData);
        } else {
          setStudentViewCourseDetails(null);
        }
        setLoading(false);
      };

      fetchDetails();
    } else {
      setStudentViewCourseDetails(null);
    }
  }, [id, setStudentViewCourseDetails]);

  if (!studentViewCourseDetails) {
    return (
      <div className="p-20 text-center text-gray-500">
        No Course Details Found
      </div>
    );
  }

  const {
    title,
    subtitle,
    date,
    language,
    level,
    pricing,
    objectives,
    curriculum,
    instructorName,
    image,
    category,
    finalQuiz,
  } = studentViewCourseDetails;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 1. HERO HEADER SECTION */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-900 text-white py-12 md:py-20">
        <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          {/* Left Column: Course Info */}
          <div className="lg:col-span-2 space-y-5">
            <div className="flex items-center gap-3 text-blue-200 text-xs font-bold uppercase tracking-widest">
              <span className="bg-blue-800/50 px-3 py-1 rounded-full border border-blue-500/30">
                {category}
              </span>
              <span>•</span>
              <span className="bg-blue-800/50 px-3 py-1 rounded-full border border-blue-500/30">
                {level}
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight tracking-tight">
              {title}
            </h1>
            <p className="text-lg text-blue-100 max-w-2xl leading-relaxed">
              {subtitle}
            </p>

            <div className="flex flex-wrap gap-6 text-sm mt-6 pt-6 border-t border-blue-500/30 text-blue-100">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-blue-300" />
                <span>
                  Created by{" "}
                  <span className="font-bold text-white hover:underline cursor-pointer">
                    {instructorName}
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-300" />
                <span>Updated {new Date(date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-blue-300" />
                <span className="capitalize">{language || "English"}</span>
              </div>
            </div>
          </div>

          <div className="hidden lg:block"></div>
        </div>
      </div>

      {/* 2. MAIN CONTENT GRID */}
      <div className="container mx-auto px-4 -mt-8 relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT COLUMN: Objectives, Curriculum & Certificate */}
        <div className="lg:col-span-2 space-y-8 mt-8 lg:mt-0">
          {/* What You Will Learn */}
          <div className="bg-white rounded-xl p-8 border border-gray-100 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              What you'll learn
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {objectives?.split(",").map((objective, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600 text-sm leading-relaxed">
                    {objective.trim()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Curriculum Section */}
          <div className="bg-white rounded-xl p-8 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Course Content
              </h2>
              <span className="text-sm text-gray-500 font-medium">
                {curriculum?.length} Lectures
              </span>
            </div>

            <div className="space-y-0 divide-y divide-gray-100 border border-gray-100 rounded-lg overflow-hidden">
              {/* Lectures Map */}
              {curriculum?.map((lecture, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-white hover:bg-indigo-50/50 transition-colors group cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`
                          h-8 w-8 rounded-full flex items-center justify-center font-bold text-sm
                          ${
                            lecture.freePreview
                              ? "bg-blue-100 text-blue-600"
                              : "bg-gray-100 text-gray-500"
                          }
                       `}
                    >
                      {lecture.freePreview ? (
                        <PlayCircle className="h-4 w-4" />
                      ) : (
                        <Lock className="h-4 w-4" />
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-800 group-hover:text-indigo-700 transition-colors">
                        {lecture.title}
                      </span>
                    </div>
                  </div>
                  {lecture.freePreview && (
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded uppercase">
                      Free
                    </span>
                  )}
                </div>
              ))}

              {/* Final Quiz Item (Displayed at the end of curriculum) */}
              {finalQuiz && (
                <div className="flex items-center justify-between p-4 bg-indigo-50 hover:bg-indigo-100 transition-colors cursor-pointer border-t border-indigo-100">
                  <div className="flex items-center gap-4">
                    <div className="h-8 w-8 rounded-full flex items-center justify-center font-bold text-sm bg-indigo-600 text-white">
                      <HelpCircle className="h-4 w-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-indigo-900">
                        Final Quiz: {finalQuiz.title || "Course Assessment"}
                      </span>
                      <span className="text-xs text-indigo-600">
                        {finalQuiz.questions?.length || 0} Questions • Passing:{" "}
                        {finalQuiz.passingMarks || 70}%
                      </span>
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-indigo-200 text-indigo-800 text-xs font-bold rounded uppercase">
                    Required
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between p-4 bg-white hover:bg-indigo-50/50 transition-colors group cursor-pointer">
                <div className="flex items-center gap-4">
                  <div
                    className={`
                          h-8 w-8 rounded-full flex items-center justify-center font-bold text-sm
                          'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'
                       `}
                  >
                    <Lock className="h-4 w-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-800 group-hover:text-indigo-700 transition-colors">
                      Certificate of Completion
                    </span>
                    <span className="font-medium mt-2 text-red-500 bg-red-200 rounded-2xl px-2 text-sm">
                      Note: {auth?.user?.name || "Student Name"}, will be
                      displayed on certificate
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Sticky Sidebar Card */}
        <div className="lg:col-span-1 relative">
          <div className="sticky top-24 lg:-mt-[200px] z-20 space-y-6">
            {/* Purchase Card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-xl overflow-hidden">
              <div className="h-52 bg-gray-200 relative group cursor-pointer">
                <img
                  src={image}
                  alt={title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <PlayCircle className="h-16 w-16 text-white opacity-90 group-hover:scale-110 transition-transform drop-shadow-lg" />
                </div>
              </div>

              <div className="p-6">
                <div className="mb-6 flex items-end gap-3">
                  <span className="text-4xl font-extrabold text-gray-900">
                    ${pricing}
                  </span>
                  <span className="text-lg text-gray-400 line-through mb-1">
                    ${(pricing * 1.5).toFixed(2)}
                  </span>
                </div>

                <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-6 text-lg shadow-lg shadow-indigo-200 transition-all mb-3 rounded-lg cursor-pointer">
                  {localStorage.getItem("accessToken")
                    ? "Buy Now"
                    : "Login to Enroll"}
                </Button>

                <div className="mt-6 space-y-4 pt-6 border-t border-gray-100">
                  <h4 className="font-bold text-sm text-gray-900 uppercase tracking-wide">
                    This course includes:
                  </h4>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Video className="h-4 w-4 text-indigo-500" />
                    <span>{curriculum?.length || 0} Video Lectures</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <HelpCircle className="h-4 w-4 text-indigo-500" />
                    <span>{finalQuiz ? "1 Final Quiz" : "No Quiz"}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Award className="h-4 w-4 text-indigo-500" />
                    <span>Completion Certificate</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Globe className="h-4 w-4 text-indigo-500" />
                    <span>Full Lifetime Access</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
