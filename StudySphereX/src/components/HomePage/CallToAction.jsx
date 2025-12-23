import { FaArrowRight } from "react-icons/fa";
import { Link } from 'react-router-dom'

export const CallToAction = () => {
  return (
    <section className="bg-white py-24 px-4 sm:px-6 lg:px-8 border-t border-gray-100">
      <div className="max-w-4xl mx-auto text-center">
        {/* Main Heading */}
        <h2 className="text-4xl sm:text-5xl font-extrabold text-indigo-900 tracking-tight mb-6">
          Start Your Learning Journey Today
        </h2>

        {/* Subtext */}
        <p className="text-xl sm:text-2xl text-gray-600 mb-10 max-w-2xl mx-auto font-medium">
          No confusion. No distractions. Just focused learning.
        </p>

        {/* CTA Button */}
        <div className="flex justify-center">
          <Link to="/courses">
            <button className="group inline-flex items-center justify-center px-10 py-4 text-lg font-bold text-white transition-all duration-200 bg-indigo-600 rounded-full hover:bg-indigo-700 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 transform hover:-translate-y-1">
              Join Now
              <FaArrowRight className="ml-3 transition-transform duration-200 group-hover:translate-x-1" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};
