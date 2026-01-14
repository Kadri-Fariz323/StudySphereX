import { useContext, useEffect } from "react";
import { StudentContext } from "@/context/StudentContext";
import { fetchStudentViewCourseListService } from "../../services/StudentViewService"; 
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useLoader } from "@/context/LoaderContext";

export const FeaturedCourses = () => {
     const { setLoading } = useLoader();
  
  const { studentViewCoursesList, setStudentViewCoursesList } = useContext(StudentContext);

  useEffect(() => {
    const fetchCourses = async () => {
      
  setLoading(true)   
const response = await fetchStudentViewCourseListService("limit=4&sortBy=date"); 

      if (response?.success) {
        setStudentViewCoursesList(response.data);
        setLoading(false)
      }
    };

    fetchCourses();
  }, [setStudentViewCoursesList]);

  const displayCourses = studentViewCoursesList ? studentViewCoursesList.slice(0, 4) : [];
   const navigate = useNavigate()
  return (
    <section className="py-12 container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
            Featured Courses
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our Latest Courses designed to take you from beginner to job-ready expert.
          </p>
        </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayCourses.map((course) => (
          <div 
            key={course._id} 
            className="relative flex w-full flex-col rounded-xl bg-white bg-clip-border text-gray-700 shadow-md hover:shadow-xl transition-shadow duration-300"
          >
            {/* Image Section */}
            <div className="relative mx-4 -mt-6 h-40 overflow-hidden rounded-xl bg-blue-gray-500 bg-clip-border text-white shadow-lg shadow-blue-gray-500/40">
              <img 
                src={course.image} 
                alt={course.title} 
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-black/60"></div>
            </div>

            {/* Content Section */}
            <div className="p-6">
              <div className="mb-2 flex items-center justify-between">
                <p className="block font-sans text-sm font-medium leading-relaxed text-blue-500 antialiased uppercase">
                  {course.category}
                </p>
              </div>
              <h5 className="mb-2 block font-sans text-xl font-semibold leading-snug tracking-normal text-blue-gray-900 antialiased truncate">
                {course.title}
              </h5>
              <p className="block font-sans text-base font-light leading-relaxed text-gray-700 antialiased line-clamp-2">
                {course.subtitle || "No description available."}
              </p>
            </div>

            {/* Button Section */}
            <div className="p-6 pt-0 mt-auto">
              <button
                type="button"
                className="select-none rounded-lg bg-blue-500 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none w-full"
                  onClick={() => navigate(`/course/details/${course?._id}`)}>
                Read More
              </button>
            </div>
          </div>
        ))}
      </div>

          <div className="text-center mt-15" >
               <Link to='/courses'>
               <button className="inline-flex items-center justify-center px-8 py-3 text-base font-semibold text-white transition-all duration-200 bg-indigo-600 rounded-full hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600">
                  View All Courses
                </button></Link> 
              </div>
    </section>
  );
};