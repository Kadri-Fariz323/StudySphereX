import { Card, CardContent, CardHeader, CardTitle } from "../../components/UI/Card";
import { CourseTable } from "../../components/UI/CourseTable";

import { Navigate, useNavigate } from "react-router-dom";


export const MyCourses = () => {
  const navigate = useNavigate();

  return (
    <div><Card>
          <CardHeader className="flex justify-between flex-row items-center">
            <CardTitle className="text-2xl sm:text-3xl font-extrabold">All Courses</CardTitle>
       <button  className="px-8 py-2 rounded-full cursor-pointer relative bg-slate-900 text-white text-sm hover:shadow-2xl hover:shadow-white/[0.4] transition duration-200 border border-slate-800" onClick={() => navigate('/instructor/add-course')}>
      <div className="absolute inset-x-0 h-px w-1/2 mx-auto -top-px shadow-4xl  bg-gradient-to-r from-transparent via-teal-300 to-transparent" />
      <span className="relative z-20">
        Create a New Course
      </span>
    </button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto ">
              <CourseTable />
            </div>
          </CardContent>
        </Card></div>
  )
}
