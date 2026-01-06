import { CourseLandingPage } from "@/components/Admin/AddCourseUI/CourseLandingPage";
import { CourseSettings } from "@/components/Admin/AddCourseUI/CourseSettings";
import { Curriculum } from "@/components/Admin/AddCourseUI/Curriculum";
import { Card, CardContent } from "@/components/UI/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


export const CreateCourse = () => {
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between">
        <h1 className="text-xl sm:text-3xl font-extrabold">
          Create a new Course
        </h1>

        <button className="px-8 py-2 rounded-full relative bg-slate-900 text-white text-sm hover:shadow-2xl hover:shadow-white/[0.4] transition cursor-pointer duration-200 border border-slate-800">
          <div className="absolute inset-x-0 h-px w-1/2 mx-auto -top-px shadow-4xl  bg-gradient-to-r from-transparent via-teal-300 to-transparent" />
          <span className="relative z-20">Submit </span>
        </button>
        
      </div>
      <div className="mt-5 w-fit">
        <CardContent>
          <div className=" ">
            <Tabs defaultValue="Curriculum"  >
              <TabsList>
                <TabsTrigger value="Curriculum">Curriculum</TabsTrigger>
                <TabsTrigger value="Course-Landing-Page">Course Landing Page</TabsTrigger>
                <TabsTrigger value="Course-Settings">Course Thumbnail</TabsTrigger>
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
