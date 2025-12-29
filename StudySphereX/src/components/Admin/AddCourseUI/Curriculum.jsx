import { Card, CardContent, CardHeader, CardTitle } from "@/components/UI/Card";
import { Switch } from "@/components/UI/switch";
import { courseCurriculumInitialFormData } from "@/config";

import { CourseContext } from "@/context/CourseContext";
import { useContext } from "react";

export const Curriculum = () => {
  const { courseCurriculumFormData, setCourseCurriculumFormData } =
    useContext(CourseContext);

    function handleNewLecture(){
      setCourseCurriculumFormData([
        ...courseCurriculumFormData,
        {
          ...courseCurriculumInitialFormData[0]
        }
      ])
      console.log(courseCurriculumFormData);
      
    }
  return (
    <div>
     
        <Card className="p-5 w-[400px] md:w-[600px] lg:w-[680px] ">
          <CardTitle className="mb-5 text-xl">
            Create Course Curriculum
          </CardTitle>

          <button className="px-8 py-2 rounded-full relative bg-slate-900 text-white text-sm hover:shadow-2xl hover:shadow-white/[0.4] transition duration-200 border border-slate-800" onClick={handleNewLecture}>
            <div className="absolute inset-x-0 h-px w-1/2 mx-auto -top-px shadow-4xl  bg-gradient-to-r from-transparent via-teal-300 to-transparent" />
            <span className="relative z-20">Add Lecture</span>
          </button>

          <div className="mt-4 space gap-y-4 ">
            {courseCurriculumFormData.map((CurriculumItem, index) => (
              <div className=" mb-5 border p-5 border-indigo-200 rounded-md">
                <div className=" xl:flex items-center gap-4">
                  <div className="flex gap-5 items-center">
                    <h3 className="font-semibold text-md text-nowrap">
                      Lecture {index + 1}
                    </h3>
                    <input
                      className="w-[300px] px-4 py-3 rounded-lg border border-gray-300 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ease-in-out"
                      type="text"
                      name={`title-${index + 1}`}
                      placeholder="Enter Lecture Title"
                    />
                  </div>
                  <div className="flex items-center space-x-2 mt-5 lg:mt-0">
                    <Switch checked={true} id={`freePreview-${index + 1}`} />
                    <label htmlFor={`freePreview-${index + 1}`}>
                      Free Preview
                    </label>
                  </div>
                </div>
              <input type="file" accept="video/*" className="mt-5" />
              </div>
            ))}
          </div>
        </Card>
      
    </div>
  );
};
