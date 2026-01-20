import { AuthContext } from "@/context/AuthContext";
import { StudentContext } from "@/context/StudentContext";
import { getCurrentCourseProgressService } from "@/services/StudentViewService";
import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";
import { useState } from "react";
import { useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from "../../components/UI/dialog";
import { Label } from "@/components/UI/label";
import { Button } from "@/components/UI/button";
import ReactConfetti from "react-confetti";

export const StudentCourseProgress = () => {
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  const { studentCurrentCourseProgress, setStudentCurrentCourseProgress } =
    useContext(StudentContext);
  const { id } = useParams();
  const [lockCourse, setLockCourse] = useState(false);
  const [currentLecture, setCurrentLecture] = useState(null);
  const [showCourseCompleteDialog, setShowCourseCompleteDialog] =
    useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  
  async function fetchCurrentCourseProgress() {
    const response = await getCurrentCourseProgressService(auth?.user?._id, id);
    console.log(response);
    if (response?.success) {
      if (!response?.data?.isPurchased) {
        setLockCourse(true);
      } else { setStudentCurrentCourseProgress({
          courseDetails: response?.data?.courseDetails,
          progress: response?.data?.progress,
        });

         if (response?.data?.completed) {
          setCurrentLecture(response?.data?.courseDetails?.curriculum[0]);
          setShowCourseCompleteDialog(true);
          setShowConfetti(true);

          return;
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
                <Button onClick={() => navigate("/student-courses")}>
                  My Courses Page
                </Button>
                <Button>Rewatch Course</Button>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      </>
    );
  }
