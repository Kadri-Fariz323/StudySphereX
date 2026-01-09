import { CourseLandingPage } from "@/components/Instructor/AddCourseUI/CourseLandingPage";
import { CourseSettings } from "@/components/Instructor/AddCourseUI/CourseSettings";
import { Curriculum } from "@/components/Instructor/AddCourseUI/Curriculum";
import { Card, CardContent } from "@/components/UI/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AuthContext } from "@/context/AuthContext";

import { addNewCourseService } from "@/services";
import { CourseContext } from "@/context/CourseContext";
import { useContext } from "react";

export const CreateCourse = () => {
  const { auth } = useContext(AuthContext);

  const {
    courseLandingFormData,
    courseCurriculumFormData,
    setCourseLandingFormData,
    setCourseCurriculumFormData,
    courseLandingInitialFormData,
    courseCurriculumInitialFormData,
  } = useContext(CourseContext);

  function isEmpty(value) {
    if (Array.isArray(value)) {
      return value.length === 0;
    }

    return value === "" || value === null || value === undefined;
  }

  function ValidateFormData() {
    for (const key in courseLandingFormData) {
      if (isEmpty(courseLandingFormData[key])) {
        return false;
      }
    }

    if (!Array.isArray(courseCurriculumFormData)) {
      return false;
    }

    let hasFreePreview = false;

    for (const item of courseCurriculumFormData) {
      if (
        isEmpty(item.title) ||
        isEmpty(item.videoUrl) ||
        isEmpty(item.public_id)
      ) {
        return false;
      }

      if (item.freePreview) {
        hasFreePreview = true; //found at least one free preview
      }
    }

    return hasFreePreview;
  }

  async function handleCreateCourse() {
    const courseFinalFormData = {
      instructorId: auth?.user?._id,
      instructorName: auth?.user?.name,
      date: new Date(),
      ...courseLandingFormData,
      students: [],
      curriculum: courseCurriculumFormData,
      isPublished: true,
    };
    console.log(courseFinalFormData);

    // try {
    //   const response = await addNewCourseService(courseFinalFormData);

    //   if (response?.success) {
    //     setCourseLandingFormData(courseLandingInitialFormData || {});
    //     setCourseCurriculumFormData(courseCurriculumInitialFormData || []);

    //     // navigate('/instructor/courses');
    //     console.log("Course created successfully");
    //   }
    // } catch (error) {
    //   console.error("Create course failed", error);
    // }
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between">
        <h1 className="text-xl sm:text-3xl font-extrabold">
          Create a new Course
        </h1>

        <button
          className="px-8 py-2 rounded-full relative bg-slate-900 text-white text-sm hover:shadow-2xl hover:shadow-white/[0.4] disabled:bg-slate-500 transition cursor-pointer duration-200 border border-slate-800"
          disabled={!ValidateFormData()}
          onClick={handleCreateCourse}
        >
          <div className="absolute inset-x-0 h-px w-1/2 mx-auto -top-px shadow-4xl  bg-gradient-to-r from-transparent via-teal-300 to-transparent" />
          <span className="relative z-20">Submit </span>
        </button>
      </div>
      <div className="mt-5 w-fit">
        <CardContent>
          <div className=" ">
            <Tabs defaultValue="Curriculum">
              <TabsList>
                <TabsTrigger value="Curriculum">Curriculum</TabsTrigger>
                <TabsTrigger value="Course-Landing-Page">
                  Course Landing Page
                </TabsTrigger>
                <TabsTrigger value="Course-Settings">
                  Course Thumbnail
                </TabsTrigger>
                <TabsTrigger value="Course-Settings">
                  Course Thumbnail
                </TabsTrigger>
              </TabsList>
              <TabsContent value="Curriculum">
                <Curriculum />
              </TabsContent>

              <TabsContent value="Course-Landing-Page">
                <CourseLandingPage />
              </TabsContent>

              <TabsContent value="Course-Settings">
                <CourseSettings />
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </div>
    </div>
  );
};
