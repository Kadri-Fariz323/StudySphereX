import { AuthContext } from "@/context/AuthContext";
import { StudentContext } from "@/context/StudentContext";
import { getCurrentCourseProgressService } from "@/services/StudentViewService";
import { 
  ArrowLeft, 
  Menu, 
  ChevronRight, 
  Play, 
  Lock, 
  FileQuestion, 
  Award,
  Download,
  FileText
} from "lucide-react";
import { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/UI/dialog";
import { Label } from "@/components/UI/label";
import { Button } from "@/components/UI/button";
import ReactConfetti from "react-confetti";
import { VideoPlayer } from "@/components/UI/VideoPlayer";
import { useLoader } from "@/context/LoaderContext";

export const StudentCourseProgress = () => {
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  const { studentCurrentCourseProgress, setStudentCurrentCourseProgress } =
    useContext(StudentContext);
  const { id } = useParams();
    const { setLoading } = useLoader();
  
  const [lockCourse, setLockCourse] = useState(false);
  const [currentLecture, setCurrentLecture] = useState(null);
  const [showCourseCompleteDialog, setShowCourseCompleteDialog] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isSideBarOpen, setIsSideBarOpen] = useState(true);

  async function fetchCurrentCourseProgress() {
    const response = await getCurrentCourseProgressService(auth?.user?._id, id);
    if (response?.success) {
      if (!response?.data?.isPurchased) {
        setLockCourse(true);
      } else {
        setStudentCurrentCourseProgress({
          courseDetails: response?.data?.courseDetails,
          progress: response?.data?.progress,
        });

        if (response?.data?.completed) {
          setCurrentLecture(response?.data?.courseDetails?.curriculum[0]);
          setShowCourseCompleteDialog(true);
          setShowConfetti(true);
          return;
        }
        
        if (response?.data?.courseDetails?.curriculum?.length > 0) {
             setCurrentLecture(response?.data?.courseDetails?.curriculum[0]);
        }
      }
    }
  }

  useEffect(() => {
    fetchCurrentCourseProgress();
  }, [id]);

  useEffect(() => {
    if (showConfetti) setTimeout(() => setShowConfetti(false), 15000);
  }, [showConfetti]);

 const handleLectureClick = (lecture) => {
  setCurrentLecture(lecture);
  // Auto close on mobile
  if (window.innerWidth < 1024) {
    setIsSideBarOpen(false);
  }
};


  const courseTitle = studentCurrentCourseProgress?.courseDetails?.title || "Course Progress";
  const curriculum = studentCurrentCourseProgress?.courseDetails?.curriculum || [];

  return (
    <div className="flex flex-col h-screen bg-white font-inter text-slate-800">
      {/* --- Header --- */}
      <div className="flex items-center justify-between p-4 bg-indigo-600 text-white border-b border-indigo-700 shadow-sm h-16 flex-shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/user/student-courses")}
            className="p-2 hover:bg-indigo-700 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-bold truncate max-w-[200px] sm:max-w-md">
            {courseTitle}
          </h1>
        </div>
        <button
          onClick={() => setIsSideBarOpen(!isSideBarOpen)}
          className="p-2 hover:bg-indigo-700 rounded-md transition-colors"
        >
           {isSideBarOpen ? <ChevronRight className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* --- Main Content Area --- */}
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* Left: Video Player & Resources Section */}
        <div className={`flex-1 flex flex-col overflow-y-auto transition-all duration-300 ${isSideBarOpen ? 'mr-0 lg:mr-0' : ''}`}>
           {/* Video Player Container */}
           <div className="bg-black flex items-center justify-center relative min-h-[400px] lg:min-h-[500px]">
              {currentLecture ? (
                <VideoPlayer
                  src={currentLecture?.videoUrl}
                  onProgressUpdate={() => {}}
                  progressData={currentLecture}
                />
              ) : (
                <div className="text-gray-400">Select a lecture to start</div>
              )}
           </div>
           
           {/* Lecture Details & Resources */}
           <div className="p-6 max-w-4xl">
              <h2 className="text-2xl font-bold mb-4 text-gray-900">
                {currentLecture?.title || "Course Introduction"}
              </h2>

              {/* --- NEW: Resources Section --- */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mt-6">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                   <FileText className="w-4 h-4 text-indigo-600" />
                   Course Material
                </h3>
                
                {/* TODO: Replace `currentLecture?.pdfUrl` with your actual data field name 
                  (e.g., lectureMaterialUrl, attachmentUrl, public_id, etc.)
                */}
                {currentLecture?.pdfUrl ? (
                  <a
                    href={currentLecture?.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                      flex items-center justify-between w-full sm:w-auto
                      bg-white border border-gray-200 p-3 rounded-md
                      hover:border-indigo-300 hover:shadow-sm hover:bg-indigo-50
                      transition-all group cursor-pointer
                    "
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-indigo-100 p-2 rounded-full group-hover:bg-indigo-200 transition-colors">
                        <Download className="w-4 h-4 text-indigo-600" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900">Lecture Notes / Assets</span>
                        <span className="text-xs text-gray-500">Click to download resource</span>
                      </div>
                    </div>
                  </a>
                ) : (
                  <p className="text-sm text-gray-500 italic pl-1">
                    No downloadable materials available for this lecture.
                  </p>
                )}
              </div>
              {/* --- End Resources Section --- */}

           </div>
        </div>

        {/* Right: Sidebar Navigation */}
        <div 
          className={`
            fixed inset-y-0 right-0 z-50 w-80 bg-gray-50 border-l border-gray-200 transform transition-transform duration-300 ease-in-out pt-16 lg:pt-0 lg:static
            ${isSideBarOpen ? 'translate-x-0' : 'translate-x-full'} 
            ${isSideBarOpen ? 'lg:w-[350px] lg:block' : 'lg:w-0 lg:hidden'}
          `}
        >
          <div className="flex flex-col h-full">
            <div className="p-4 border-b border-gray-200 bg-white">
               <h3 className="font-bold text-lg text-indigo-900">Course Content</h3>
            </div>
            
            {/* Scrollable Curriculum List */}
            <div className="flex-1 overflow-y-auto">
              <div className="space-y-1 p-2">
                {curriculum.map((item, index) => {
                  const isActive = currentLecture?._id === item?._id;
                  return (
                    <div 
                      key={item._id || index}
                      onClick={() => handleLectureClick(item)}
                      className={`
                        flex items-center gap-3 p-3 rounded-md cursor-pointer transition-all
                        ${isActive 
                           ? 'bg-indigo-50 border-l-4 border-indigo-600 text-indigo-900' 
                           : 'hover:bg-gray-100 text-gray-700 border-l-4 border-transparent'}
                      `}
                    >
                      <div className="mt-1">
                         {isActive ? <Play className="w-4 h-4 fill-indigo-600 text-indigo-600" /> : <span className="font-medium text-sm text-gray-400">#{index + 1}</span>}
                      </div>
                      <span className="text-sm font-medium line-clamp-2">
                        {item?.title}
                      </span>
                    </div>
                  )
                })}
              </div>

              <hr className="my-2 border-gray-200" />

              {/* Locked Final Sections */}
              <div className="space-y-1 p-2 pb-10">
                 {/* Final Assessment */}
                 <div className="flex items-center gap-3 p-3 rounded-md bg-gray-100 opacity-60 cursor-not-allowed text-gray-500">
                    <FileQuestion className="w-5 h-5 flex-shrink-0" />
                    <div className="flex-1">
                      <span className="text-sm font-medium block">Final Assessment</span>
                      <span className="text-xs">Complete all lectures to unlock</span>
                    </div>
                    <Lock className="w-4 h-4" />
                 </div>

                 {/* Certificate */}
                 <div className="flex items-center gap-3 p-3 rounded-md bg-gray-100 opacity-60 cursor-not-allowed text-gray-500">
                    <Award className="w-5 h-5 flex-shrink-0" />
                    <div className="flex-1">
                      <span className="text-sm font-medium block">Course Certificate</span>
                      <span className="text-xs">Pass assessment to unlock</span>
                    </div>
                    <Lock className="w-4 h-4" />
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- Overlays & Dialogs --- */}
      {showConfetti && <ReactConfetti />}
      
      <Dialog open={lockCourse}>
        <DialogContent className="sm:w-[425px]">
          <DialogHeader>
            <DialogTitle>You can't view this page</DialogTitle>
            <DialogDescription>
              Please purchase this course to get access
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Dialog open={showCourseCompleteDialog}>
        <DialogContent showOverlay={false} className="sm:w-[425px]">
          <DialogHeader>
            <DialogTitle>Congratulations!</DialogTitle>
            <DialogDescription className="flex flex-col gap-3">
              <Label>You have completed the course</Label>
              <div className="flex flex-row gap-3">
                <Button onClick={() => navigate("/user/student-courses")}>
                  My Courses Page
                </Button>
                <Button onClick={() => setShowCourseCompleteDialog(false)}>Rewatch Course</Button>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}