import { FaRocket } from "react-icons/fa6";
import { HiShieldCheck } from "react-icons/hi";
import { FaRobot } from "react-icons/fa6";
import { LuTrendingUp } from "react-icons/lu";
import { FaArrowRight } from "react-icons/fa6";
import { Link } from 'react-router-dom'


const courses = [
  {
    title: "Full Stack Web Development",
    description: "Master HTML, CSS, JS, React, Node, and MongoDB to build complete web applications.",
    icon: <FaRocket className="w-6 h-6" />,
    tags: ["React", "Node.js", "MongoDB"]
  },
  {
    title: "Cybersecurity Fundamentals",
    description: "Learn networking essentials, security basics, and ethical hacking techniques.",
    icon: <HiShieldCheck className="w-6 h-6" />,
    tags: ["Ethical Hacking", "Network Security"]
  },
  {
    title: "AI & Machine Learning",
    description: "Dive into Python, mathematical foundations, and building advanced ML models.",
    icon: <FaRobot className="w-6 h-6" />
,
    tags: ["Python", "TensorFlow", "Math"]
  },
  {
    title: "Career & Productivity Skills",
    description: "Enhance your professional life with time management, focus, and communication strategies.",
    icon: <LuTrendingUp className="w-6 h-6" />,
    tags: ["Soft Skills", "Management"]
  }
];

export const PopularCourses = () => {
  return (
    <section className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
            Popular Learning Paths
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our most sought-after curriculums designed to take you from beginner to job-ready expert.
          </p>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {courses.map((course, index) => (
            <div 
              key={index} 
              className="group flex flex-col bg-white border border-gray-200 rounded-2xl p-6 hover:border-indigo-600 hover:shadow-xl transition-all duration-300 cursor-pointer"
            >
              {/* Icon */}
              <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                {course.icon}
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors">
                {course.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-6 grow">
                {course.description}
              </p>

              {/* Tags/Footer */}
              <div className="mt-auto">
                <div className="flex flex-wrap gap-2 mb-4">
                  {course.tags.map((tag, i) => (
                    <span key={i} className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
         <Link to='/courses'>
         <button className="inline-flex items-center justify-center px-8 py-3 text-base font-semibold text-white transition-all duration-200 bg-indigo-600 rounded-full hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600">
            View All Learning Paths
          </button></Link> 
        </div>

      </div>
    </section>
  );
};