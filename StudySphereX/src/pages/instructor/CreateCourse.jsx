import { CourseLandingPage } from "@/components/Instructor/AddCourseUI/CourseLandingPage";
import { CourseSettings } from "@/components/Instructor/AddCourseUI/CourseSettings";
import { Curriculum } from "@/components/Instructor/AddCourseUI/Curriculum";
import { Card, CardContent } from "@/components/UI/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AuthContext } from "@/context/AuthContext";

import {
  addNewCourseService,
  fetchInstructorCourseDetailsService,
  updateCourseByIdService,
} from "@/services";
import { CourseContext } from "@/context/CourseContext";
import { useContext } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";

export const CreateCourse = () => {
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();

  const params = useParams();
  console.log(params);

  const {
    courseLandingFormData,
    courseCurriculumFormData,
    setCourseLandingFormData,
    setCourseCurriculumFormData,
    courseLandingInitialFormData,
    courseCurriculumInitialFormData,
    currentEditedCourseId,
    setCurrentEditedCourseId,
    setCourseFinalQuiz,
    courseFinalQuiz,
  } = useContext(CourseContext);

  function isEmpty(value) {
    if (Array.isArray(value)) {
      return value.length === 0;
    }

    return value === "" || value === null || value === undefined;
  }

  function ValidateFormData() {
    // 1. Validate Landing Page Data
    for (const key in courseLandingFormData) {
      // FIX: Skip system fields or arrays that shouldn't block submission
      if (
        [
          "students",
          "curriculum",
          "instructorId",
          "instructorName",
          "_id",
          "date",
          "__v",
          "isPublished",
        ].includes(key) ||
        typeof courseLandingFormData[key] === "object"
      ) {
        continue;
      }

      if (isEmpty(courseLandingFormData[key])) {
        return false;
      }
    }

    // 2. Validate Curriculum
    if (
      !Array.isArray(courseCurriculumFormData) ||
      courseCurriculumFormData.length === 0
    ) {
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
        hasFreePreview = true;
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
      finalQuiz: courseFinalQuiz,
    };

    try {
      const response =
        currentEditedCourseId !== null
          ? await updateCourseByIdService(
              currentEditedCourseId,
              courseFinalFormData
            )
          : await addNewCourseService(courseFinalFormData);

      if (response?.success) {
        setCourseLandingFormData(courseLandingInitialFormData || {});
        setCourseCurriculumFormData(courseCurriculumInitialFormData || []);
        setCourseFinalQuiz(courseFinalQuiz);
        setCourseFinalQuiz(null);
        navigate("/instructor/my-courses");
        setCurrentEditedCourseId(null);
        console.log("Course created successfully");
      }
    } catch (error) {
      console.error("Create course failed", error);
    }
    console.log(courseFinalFormData);
  }

  async function fetchCurrentCourseDetails() {
    try {
      const response = await fetchInstructorCourseDetailsService(
        currentEditedCourseId
      );

      if (response?.success) {
        console.log("Full Course Data:", response.data);

        // 1. Set Landing Page Data
        setCourseLandingFormData({
          ...courseLandingInitialFormData,
          ...response.data,
        });

        // 2. Set Curriculum Data
        if (response?.data?.curriculum) {
          console.log("Setting Curriculum Data to:", response.data.curriculum);
          setCourseCurriculumFormData(response.data.curriculum);
        }

        // 3. 🚨 THE MISSING PART: Set Final Quiz Data 🚨
        // This ensures the green "Edit Quiz" button appears
        setCourseFinalQuiz(response?.data?.finalQuiz || null);
      }
    } catch (err) {
      console.error("Failed to fetch course", err);
    }
  }

  useEffect(() => {
    if (currentEditedCourseId !== null) fetchCurrentCourseDetails();
  }, [currentEditedCourseId]);

  useEffect(() => {
    if (params?.courseId) setCurrentEditedCourseId(params?.courseId);
  }, [params?.courseId]);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between">
        <h1 className="text-xl sm:text-3xl font-extrabold">
          {currentEditedCourseId ? "Edit Course" : "Create a New Course"}
        </h1>

        <button
          className="px-8 py-2 rounded-full relative bg-slate-900 text-white text-sm hover:shadow-2xl hover:shadow-white/[0.4] disabled:bg-slate-500 transition cursor-pointer duration-200 border border-slate-800"
          disabled={!ValidateFormData()}
          onClick={handleCreateCourse}
        >
          <div className="absolute inset-x-0 h-px w-1/2 mx-auto -top-px shadow-4xl  bg-gradient-to-r from-transparent via-teal-300 to-transparent" />
          <span className="relative z-20">
            {" "}
            {currentEditedCourseId ? "Update" : "Create"}{" "}
          </span>
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
              </TabsList>
              <TabsContent value="Curriculum">
                <Curriculum key={currentEditedCourseId ? "loaded" : "new"} />
              </TabsContent>

              <TabsContent value="Course-Landing-Page">
                <CourseLandingPage
                  key={currentEditedCourseId ? "loaded" : "new"}
                />
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
