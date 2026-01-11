import { Card, CardTitle } from "@/components/UI/Card";
import { ProgressLoading } from "@/components/UI/ProgressLoading";
import { Switch } from "@/components/UI/switch";
import { VideoPlayer } from "@/components/UI/videoPlayer";
import { courseCurriculumInitialFormData } from "@/config";
import { CourseContext } from "@/context/CourseContext";
import { mediaUploadService, mediaDeleteService } from "@/services";
import { useContext, useRef, useEffect, useState } from "react";
import { AddQuiz } from "../AddQuiz";
import {
  FiVideo,
  FiFileText,
  FiCopy,
  FiTrash2,
  FiEdit,
  FiPlusCircle,
  FiAward, // Added icon for Final Quiz
} from "react-icons/fi";

export const Curriculum = () => {
  // State to manage if the Final Quiz Modal is open
  const [isFinalQuizOpen, setIsFinalQuizOpen] = useState(false);

  const {
    courseCurriculumFormData,
    setCourseCurriculumFormData,
    // NEW: Get Final Quiz State from Context
    courseFinalQuiz, 
    setCourseFinalQuiz,
    mediaUploadProgressPercentage,
    setMediaUploadProgressPercentage,
    mediaUploadProgress,
    setMediaUploadProgress,
  } = useContext(CourseContext);

  // --- Lecture Management Functions ---

  function handleNewLecture() {
    setCourseCurriculumFormData((prev = []) => [
      ...prev,
      { ...courseCurriculumInitialFormData[0] },
    ]);
  }

  function handleCopyLecture(currentIndex) {
    const copyFormData = [...courseCurriculumFormData];
    const itemToCopy = { ...copyFormData[currentIndex] };
    itemToCopy.title = itemToCopy.title ? `${itemToCopy.title} (Copy)` : "";
    copyFormData.splice(currentIndex + 1, 0, itemToCopy);
    setCourseCurriculumFormData(copyFormData);
  }

  async function handleRemoveLecture(currentIndex) {
    let copyFormData = [...courseCurriculumFormData];
    const getCurrentSelectedVideoId = copyFormData[currentIndex].public_id;
    
    // Optimistic UI update could happen here, but safety first:
    if (getCurrentSelectedVideoId) {
      const response = await mediaDeleteService(getCurrentSelectedVideoId);
      if (!response?.success) {
         console.error("Failed to delete video from cloud");
         // Optional: return or alert user
      }
    }
    
    copyFormData = copyFormData.filter((_, index) => index !== currentIndex);
    setCourseCurriculumFormData(copyFormData);
  }

  function handleCourseTitleChange(event, currIndex) {
    let CopyCourseCurriculumFormData = [...courseCurriculumFormData];
    CopyCourseCurriculumFormData[currIndex] = {
      ...CopyCourseCurriculumFormData[currIndex],
      title: event.target.value,
    };
    setCourseCurriculumFormData(CopyCourseCurriculumFormData);
  }

  function handleFreePreviewChange(currValue, currIndex) {
    let CopyCourseCurriculumFormData = [...courseCurriculumFormData];
    CopyCourseCurriculumFormData[currIndex] = {
      ...CopyCourseCurriculumFormData[currIndex],
      freePreview: currValue,
    };
    setCourseCurriculumFormData(CopyCourseCurriculumFormData);
  }

  // --- Media Upload Functions ---

  async function handleSingleLectureUpload(event, currIndex) {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    const videoFormData = new FormData();
    videoFormData.append("file", selectedFile);

    const oldPublicId = courseCurriculumFormData[currIndex]?.public_id || null;
    setMediaUploadProgress(true);

    try {
      const res = await mediaUploadService(
        videoFormData,
        setMediaUploadProgressPercentage
      );

      if (!res.success) return;

      if (oldPublicId) {
        await mediaDeleteService(oldPublicId);
      }

      const copy = [...courseCurriculumFormData];
      copy[currIndex] = {
        ...copy[currIndex],
        videoUrl: res.data.url,
        public_id: res.data.public_id,
      };

      setCourseCurriculumFormData(copy);
    } catch (error) {
      console.error("Video replace failed", error);
    } finally {
      setMediaUploadProgress(false);
    }
  }

  async function handlePdfUpload(event, currIndex) {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    const pdfFormData = new FormData();
    pdfFormData.append("file", selectedFile);

    const oldPdfPublicId = courseCurriculumFormData[currIndex]?.pdfPublicId || null;

    setMediaUploadProgress(true);

    try {
      const res = await mediaUploadService(
        pdfFormData,
        setMediaUploadProgressPercentage
      );

      if (!res.success) return;

      if (oldPdfPublicId) {
        await mediaDeleteService(oldPdfPublicId);
      }

      const copy = [...courseCurriculumFormData];
      copy[currIndex] = {
        ...copy[currIndex],
        pdfUrl: res.data.url,
        pdfPublicId: res.data.public_id,
      };

      setCourseCurriculumFormData(copy);
    } catch (err) {
      console.error("PDF replace failed", err);
    } finally {
      setMediaUploadProgress(false);
    }
  }

  // --- Validation & Scrolling ---

  function isCourseCurriculumFormDataValid() {
    if (!Array.isArray(courseCurriculumFormData)) return false;
    return courseCurriculumFormData.every((item) => {
      return (
        item &&
        typeof item === "object" &&
        item.title?.trim() !== "" &&
        item.videoUrl?.trim() !== ""
      );
    });
  }

  const bottomRef = useRef(null);
  
  useEffect(() => {
    if (courseCurriculumFormData.length > 1) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [courseCurriculumFormData.length]);

  if (!Array.isArray(courseCurriculumFormData)) {
    return <div className="p-5 text-red-500">Error: Data is not an array</div>;
  }

  // --- FINAL QUIZ LOGIC (The Fix) ---

  const handleSaveFinalQuiz = (quizData) => {
    // Save to the standalone state, not the array
    setCourseFinalQuiz(quizData);
    setIsFinalQuizOpen(false);
  };

  const handleRemoveFinalQuiz = () => {
    if(window.confirm("Are you sure you want to remove the Final Quiz?")) {
        setCourseFinalQuiz(null);
    }
  };

  return (
    <>
      <div>
        <Card className="p-5 w-[400px] lg:w-[650px] xl:w-[900px]">
          <CardTitle className="mb-5 text-xl">
            Create Course Curriculum
          </CardTitle>

          <button
            className="px-8 py-2 rounded-full relative bg-slate-900 text-white text-sm hover:shadow-2xl hover:shadow-white/[0.4] disabled:bg-slate-400 transition cursor-pointer duration-200 border border-slate-800"
            onClick={handleNewLecture}
            disabled={!isCourseCurriculumFormDataValid() || mediaUploadProgress}
          >
            <div className="absolute inset-x-0 h-px w-1/2 mx-auto -top-px shadow-4xl bg-gradient-to-r from-transparent via-teal-300 to-transparent" />
            <span className="relative z-20">Add Lecture</span>
          </button>

          {mediaUploadProgress ? (
            <ProgressLoading
              isMediaUploading={mediaUploadProgress}
              progress={mediaUploadProgressPercentage}
            />
          ) : null}

          {/* --- Lecture List --- */}
          <div className="mt-6 space-y-6">
            {courseCurriculumFormData.map((CurriculumItem, index) => (
              <div
                key={CurriculumItem._id || CurriculumItem.public_id || index}
                className="group relative border border-indigo-100 bg-white rounded-xl p-5 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row md:items-start gap-5">
                  <div className="flex-shrink-0 mt-2">
                    <span className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 font-bold text-sm border border-indigo-100">
                      {index + 1}
                    </span>
                  </div>

                  <div className="flex-grow space-y-4 w-full">
                    <div className="w-full">
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">
                        Lecture Title
                      </label>
                      <div className="flex gap-4">
                        <input
                          type="text"
                          placeholder="e.g. Introduction to React Hooks"
                          className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50/50 text-gray-700 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-200"
                          onChange={(event) =>
                            handleCourseTitleChange(event, index)
                          }
                          value={courseCurriculumFormData[index]?.title || ""}
                        />
                        <div className="flex items-center gap-3 sm:border-l sm:border-gray-200 sm:pl-4 pt-2 sm:pt-0">
                          <Switch
                            id={`freePreview-${index + 1}`}
                            checked={courseCurriculumFormData[index]?.freePreview}
                            onCheckedChange={(value) =>
                              handleFreePreviewChange(value, index)
                            }
                          />
                          <label
                            htmlFor={`freePreview-${index + 1}`}
                            className="text-sm text-nowrap font-medium text-gray-600 cursor-pointer select-none"
                          >
                            Free Preview
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Media Uploads */}
                    <div className="flex flex-col gap-4">
                      {/* Video */}
                      <div className="w-full">
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">
                          Lecture Video
                        </label>
                        <label
                          htmlFor={`video-upload-${index}`}
                          className="flex items-center justify-center sm:justify-start gap-3 w-full px-4 py-3 border border-dashed border-indigo-300 rounded-lg bg-indigo-50/30 text-indigo-700 cursor-pointer hover:bg-indigo-50 hover:border-indigo-500 transition-colors"
                        >
                          <div className="bg-white p-1.5 rounded-md shadow-sm">
                            <FiVideo className="w-4 h-4 text-indigo-600" />
                          </div>
                          <span className="text-sm font-medium">
                            {courseCurriculumFormData[index]?.videoUrl
                              ? "Replace Video Content"
                              : "Upload Video Content"}
                          </span>
                          <input
                            id={`video-upload-${index}`}
                            type="file"
                            accept="video/*"
                            onChange={(event) =>
                              handleSingleLectureUpload(event, index)
                            }
                            className="hidden"
                          />
                        </label>
                      </div>

                      {/* PDF */}
                      <div className="w-full">
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">
                          Lecture Notes / PDF
                        </label>
                        <label
                          htmlFor={`pdf-upload-${index}`}
                          className="flex items-center justify-center sm:justify-start gap-3 w-full px-4 py-3 border border-dashed border-teal-300 rounded-lg bg-teal-50/30 text-teal-700 cursor-pointer hover:bg-teal-50 hover:border-teal-500 transition-colors"
                        >
                          <div className="bg-white p-1.5 rounded-md shadow-sm">
                            <FiFileText className="w-4 h-4 text-teal-600" />
                          </div>
                          <span className="text-sm font-medium">
                            {courseCurriculumFormData[index]?.pdfUrl
                              ? "Replace PDF Notes"
                              : "Upload PDF Notes"}
                          </span>
                          <input
                            id={`pdf-upload-${index}`}
                            type="file"
                            accept="application/pdf"
                            onChange={(event) => handlePdfUpload(event, index)}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>

                    {/* Lecture Buttons */}
                    <div className="flex items-center justify-end gap-3 mt-2">
                      <button
                        onClick={() => handleCopyLecture(index)}
                        className="inline-flex items-center px-3 py-2 bg-slate-100 text-slate-700 text-sm font-medium rounded-md hover:bg-slate-200 transition-colors"
                        title="Duplicate Lecture"
                      >
                        <FiCopy className="w-4 h-4 mr-2" />
                        Duplicate
                      </button>
                      <button
                        onClick={() => handleRemoveLecture(index)}
                        className="inline-flex items-center px-3 py-2 bg-red-100 text-red-700 text-sm font-medium rounded-md hover:bg-red-200 transition-colors"
                      >
                        <FiTrash2 className="w-4 h-4 mr-2" />
                        Delete
                      </button>
                    </div>

                    {courseCurriculumFormData[index]?.videoUrl ? (
                      <div className="mt-4 rounded-lg overflow-hidden border border-indigo-100">
                        <VideoPlayer
                          src={courseCurriculumFormData[index]?.videoUrl}
                        />
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div ref={bottomRef} />

          {/* --- FINAL QUIZ SECTION (Placed after all lectures) --- */}
          <div className="mt-10 pt-10 border-t-2 border-dashed border-gray-200">
             <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 rounded-lg text-indigo-700">
                        <FiAward size={24} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-800">Final Course Assessment</h3>
                        <p className="text-sm text-gray-500">
                            This quiz will appear after the last lecture. Students must pass this to complete the course.
                        </p>
                    </div>
                </div>

                <button
                  onClick={() => setIsFinalQuizOpen(true)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold transition-all shadow-sm ${
                    courseFinalQuiz
                      ? "bg-green-100 text-green-700 hover:bg-green-200 border border-green-200"
                      : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200"
                  }`}
                >
                  {courseFinalQuiz ? <FiEdit size={16} /> : <FiPlusCircle size={16} />}
                  {courseFinalQuiz ? "Edit Final Quiz" : "Create Final Quiz"}
                </button>
             </div>

             {/* Visual Confirmation of Attached Quiz */}
             {courseFinalQuiz && (
                <div className="bg-gradient-to-r from-indigo-50 to-white p-5 rounded-xl border border-indigo-100 flex justify-between items-center animate-in fade-in slide-in-from-bottom-2">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-indigo-900 text-lg">{courseFinalQuiz.title}</span>
                            <span className="text-xs font-semibold bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full">
                                {courseFinalQuiz.questions.length} Questions
                            </span>
                        </div>
                        <p className="text-sm text-gray-600">
                            Passing Score: <span className="font-bold text-gray-800">{courseFinalQuiz.passingMarks}%</span>
                        </p>
                    </div>
                    
                    <button 
                        onClick={handleRemoveFinalQuiz}
                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                        title="Remove Final Quiz"
                    >
                        <FiTrash2 size={20} />
                    </button>
                </div>
             )}
          </div>

        </Card>
      </div>

      {/* --- MODAL FOR FINAL QUIZ --- */}
      {isFinalQuizOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-2xl p-6">
            <AddQuiz
              // Load the Final Quiz data from Context if it exists
              existingQuizData={courseFinalQuiz}
              onSave={handleSaveFinalQuiz}
              onCancel={() => setIsFinalQuizOpen(false)}
            />
          </div>
        </div>
      )}
    </>
  );
};