import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { StudentContext } from "@/context/StudentContext";
import { fetchStudentViewCourseDetailsService } from "@/services/StudentViewService";
import { Button } from "../UI/button";
import { VideoPlayer } from "../UI/VideoPlayer";
import {
  PlayCircle,
  Lock,
  Globe,
  CheckCircle,
  Clock,
  User,
  Video,
  HelpCircle,
  Award,
  X,
} from "lucide-react";
import { AuthContext } from "@/context/AuthContext";
import { useLoader } from "@/context/LoaderContext";
import { Play } from "lucide-react";

export const CoursesDetails = () => {
  const { auth } = useContext(AuthContext);
  const [isPlaying, setIsPlaying] = useState(false);
  const [displayVideoUrl, setDisplayVideoUrl] = useState(null);

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
  }, [id, setStudentViewCourseDetails, setLoading]);

  
  useEffect(() => {
    if (studentViewCourseDetails?.curriculum) {
      const freeLecture = studentViewCourseDetails.curriculum.find(
        (item) => item.freePreview
      );
      if (freeLecture?.videoUrl) {
        setDisplayVideoUrl(freeLecture.videoUrl);
      }
    }
  }, [studentViewCourseDetails]);

  if (!studentViewCourseDetails) {
    return (
      <div className="p-20 text-center text-gray-500">
        No Course Details Found
      </div>
    );
  }

    const handleCourseNavigate = (courseId) => {
    
    const token = localStorage.getItem("accessToken"); 

    if (token) {
      
      navigate('');
    } else {
      
      navigate('/auth');
    }
  };

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

  const handlePreviewStart = () => {
    if (displayVideoUrl) {
      setIsPlaying(true);
    } else {
        alert("No preview video available for this course.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 1. HERO HEADER */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-900 text-white py-12 md:py-20">
        <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
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
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-8 mt-8 lg:mt-0">
          {/* Objectives */}
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

          {/* Curriculum */}
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
              {curriculum?.map((lecture, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-white hover:bg-indigo-50/50 transition-colors group cursor-pointer"
                  onClick={() => {
                     if(lecture.freePreview && lecture.videoUrl) {
                        setDisplayVideoUrl(lecture.videoUrl);
                        setIsPlaying(true);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                     }
                  }}
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
                  <div className="h-8 w-8 rounded-full flex items-center justify-center font-bold text-sm bg-gray-100 text-gray-500">
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
            <div className="bg-white rounded-xl border border-gray-200 shadow-2xl overflow-hidden">
              <div className="aspect-video bg-gray-900 relative group">
                
                {/* 1. THE VIDEO PLAYER (Using Custom Component) */}
                <div className={`${isPlaying ? "block" : "hidden"} w-full h-full relative`}>
                  <VideoPlayer
                    src={displayVideoUrl}
                    width="100%"
                    height="100%"
                    isEnded={() => setIsPlaying(false)}
                  />
                  {/* Close Video Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsPlaying(false);
                    }}
                    className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 transition-colors z-50"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* 2. THE THUMBNAIL */}
                <div
                  onClick={handlePreviewStart}
                  className={`${isPlaying ? "hidden" : "block"} w-full h-full relative cursor-pointer`}
                >
                  <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-75"
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="bg-white/90 rounded-full p-4 mb-3 shadow-lg group-hover:scale-110 transition-transform">
                       <Play className="h-10 w-10 text-indigo-600 fill-indigo-100" />
                    </div>
                    <span className="font-bold text-white text-sm uppercase tracking-wider drop-shadow-md">
                      Preview this course
                    </span>
                  </div>
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
                  <span className="text-sm text-green-600 font-bold mb-2 ml-auto">
                    33% OFF
                  </span>
                </div>

                <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-6 text-lg shadow-lg shadow-indigo-200 transition-all mb-3 rounded-lg cursor-pointer" onClick={handleCourseNavigate}>
                  {localStorage.getItem("accessToken")
                    ? "Buy Now"
                    : "Login to Enroll"}
                </Button>
                
                <p className="text-center text-xs text-gray-500 mb-6">
                    30-Day Money-Back Guarantee
                </p>

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