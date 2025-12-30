import { Card, CardContent, CardHeader, CardTitle } from "@/components/UI/Card";
import { Switch } from "@/components/UI/switch";
import { courseCurriculumInitialFormData } from "@/config";

import { CourseContext } from "@/context/CourseContext";
import { mediaUploadService } from "@/services";
import { useContext } from "react";

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
  console.log(courseCurriculumFormData);
  
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

        <div className="mt-4 space gap-y-4 ">
          {courseCurriculumFormData.map((CurriculumItem, index) => (
            <div className=" mb-5 border p-5 border-indigo-200 rounded-md">
              <div className="xl:flex items-center gap-4">
                <div className="flex items-center gap-5">
                  <h3 className="font-semibold text-md text-nowrap m-0">
                    Lecture {index + 1}
                  </h3>

                  <input
                    className="w-[300px] lg:w-[500px] px-4 py-3 rounded-lg border border-gray-300 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ease-in-out"
                    type="text"
                    name={`title-${index + 1}`}
                    placeholder="Enter Lecture Title"
                    onChange={(event) => handleCourseTitleChange(event, index)}
                    value={courseCurriculumFormData[index]?.title}
                  />
                </div>

                <div className="flex items-center space-x-2 mt-5 lg:mt-0">
                  <Switch
                    onCheckedChange={(value) =>
                      handleFreePreviewChange(value, index)
                    }
                    checked={courseCurriculumFormData[index]?.freePreview}
                    id={`freePreview-${index + 1}`} className='cursor-pointer'
                  />
                  <label htmlFor={`freePreview-${index + 1}`}>
                    Free Preview
                  </label>
                </div>
              </div>
              <input
                type="file"
                accept="video/*"
                onChange={(event) => handleSingleLectureUpload(event, index)}
                className="mt-5"
              />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
