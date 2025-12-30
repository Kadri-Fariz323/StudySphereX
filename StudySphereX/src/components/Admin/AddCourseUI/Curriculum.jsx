import { Card, CardContent, CardHeader, CardTitle } from "@/components/UI/Card";
import { Switch } from "@/components/UI/switch";
import { courseCurriculumInitialFormData } from "@/config";

import { CourseContext } from "@/context/CourseContext";
import { mediaUploadService } from "@/services";
import { useContext } from "react";

import { FiVideo, FiPlayCircle, FiUpload } from 'react-icons/fi';

export const Curriculum = () => {
  const {
    courseCurriculumFormData,
    setCourseCurriculumFormData,
    mediaUploadProgress,
    setMediaUploadProgress,
  } = useContext(CourseContext);

  function handleNewLecture() {
    setCourseCurriculumFormData([
      ...courseCurriculumFormData,
      {
        ...courseCurriculumInitialFormData[0],
      },
    ]);
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

  async function handleSingleLectureUpload(event, currIndex) {
    const selectedFile = event.target.files[0];
    const videoFormData = new FormData();
    if (selectedFile) {
      videoFormData.append("file", selectedFile);
    }
    try {
      setMediaUploadProgress(true);
      const res = await mediaUploadService(videoFormData);
      if (res.success) {
        let CopyCourseCurriculumFormData = [...courseCurriculumFormData];
        CopyCourseCurriculumFormData[currIndex] = {
          ...CopyCourseCurriculumFormData[currIndex],
          videoUrl: res?.data?.url,
          public_id: res?.data.public_id
        }
        setCourseCurriculumFormData(CopyCourseCurriculumFormData);
        setMediaUploadProgress(false);
      }
    } catch (error) {
      console.log(error);
    }
  }
  
  return (
    <div>
      <Card className="p-5 w-[400px] lg:w-[650px] xl:w-[900px] ">
        <CardTitle className="mb-5 text-xl">Create Course Curriculum</CardTitle>

        <button
          className="px-8 py-2 rounded-full relative bg-slate-900 text-white text-sm hover:shadow-2xl hover:shadow-white/[0.4] transition cursor-pointer duration-200 border border-slate-800"
          onClick={handleNewLecture}
        >
          <div className="absolute inset-x-0 h-px w-1/2 mx-auto -top-px shadow-4xl  bg-gradient-to-r from-transparent via-teal-300 to-transparent" />
          <span className="relative z-20">Add Lecture</span>
        </button>

       <div className="mt-6 space-y-6">
      {courseCurriculumFormData.map((CurriculumItem, index) => (
        <div 
            key={index} 
            className="group relative border border-indigo-100 bg-white rounded-xl p-5 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all duration-300"
        >
          {/* --- Grid Layout for Responsiveness --- */}
          <div className="flex flex-col md:flex-row md:items-start gap-5">
            
            {/* 1. Lecture Number Badge (Left Side) */}
            <div className="flex-shrink-0 mt-2">
                <span className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 font-bold text-sm border border-indigo-100">
                    {index + 1}
                </span>
            </div>

            {/* 2. Main Input Area */}
            <div className="flex-grow space-y-4 w-full">
                
                {/* Title Input */}
                <div className="w-full">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">
                        Lecture Title
                    </label>
                    <input
                        type="text"
                        name={`title-${index + 1}`}
                        placeholder="e.g. Introduction to React Hooks"
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50/50 text-gray-700 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-200"
                        onChange={(event) => handleCourseTitleChange(event, index)}
                        value={courseCurriculumFormData[index]?.title || ''}
                    />
                </div>

                {/* Video Upload & Switch Row */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    
                    {/* Custom Video File Input */}
                    <div className="flex-grow">
                        <label 
                            htmlFor={`video-upload-${index}`}
                            className="flex items-center justify-center sm:justify-start gap-3 w-full px-4 py-3 border border-dashed border-indigo-300 rounded-lg bg-indigo-50/30 text-indigo-700 cursor-pointer hover:bg-indigo-50 hover:border-indigo-500 transition-colors"
                        >
                            {/* Icon changes based on if a video might be there (optional visual cue) */}
                            <div className="bg-white p-1.5 rounded-md shadow-sm">
                                <FiVideo className="w-4 h-4 text-indigo-600" />
                            </div>
                            <span className="text-sm font-medium">
                                {courseCurriculumFormData[index]?.video 
                                    ? "Replace Video Content" 
                                    : "Upload Video Content"}
                            </span>
                            
                            {/* Hidden Actual Input */}
                            <input
                                id={`video-upload-${index}`}
                                type="file"
                                accept="video/*"
                                onChange={(event) => handleSingleLectureUpload(event, index)}
                                className="hidden"
                            />
                        </label>
                    </div>

                    {/* Free Preview Switch */}
                    <div className="flex items-center gap-3 sm:border-l sm:border-gray-200 sm:pl-4 pt-2 sm:pt-0">
                        <Switch
                            id={`freePreview-${index + 1}`}
                            checked={courseCurriculumFormData[index]?.freePreview}
                            onCheckedChange={(value) => handleFreePreviewChange(value, index)}
                        />
                        <label 
                            htmlFor={`freePreview-${index + 1}`} 
                            className="text-sm font-medium text-gray-600 cursor-pointer select-none flex items-center gap-2"
                        >
                            <FiPlayCircle className="text-gray-400" />
                            Free Preview
                        </label>
                    </div>

                </div>
            </div>
          </div>
        </div>
      ))}
    </div>
      </Card>
    </div>
  );
};
