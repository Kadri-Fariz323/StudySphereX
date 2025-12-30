import { courseLandingPageFormControls } from "@/config";
import { useContext } from "react";
import { CourseContext } from '../../context/CourseContext'

export const CourseLandingPageForm = () => {
  const { courseLandingFormData, setCourseLandingFormData } =
    useContext(CourseContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourseLandingFormData({
      ...courseLandingFormData,
      [name]: value,
    });
  };
  

  return (
    <div className="bg-white w-[380px] sm:w-[450px] md:w-[900px] p-6 sm:p-8 rounded-xl shadow-lg  border border-gray-100">
      <div className="mb-6 border-b border-gray-200 pb-4">
       
        <p className="text-sm text-gray-500 mt-1">
          Create a compelling overview to attract students.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {courseLandingPageFormControls.map((control) => {
          const isFullWidth =
            control.componentType === "textarea" ||
            control.name === "title" ||
            control.name === "subtitle";

          return (
            <div
              key={control.name}
              className={`flex flex-col gap-2 ${
                isFullWidth ? "md:col-span-2" : "md:col-span-1"
              }`}
            >
              <label
                htmlFor={control.name}
                className="text-sm font-semibold text-gray-700"
              >
                {control.label}
              </label>

              {/* Render Select Element */}
              {control.componentType === "select" ? (
                <div className="relative">
                  <select
                    name={control.name}
                    id={control.name}
                    value={courseLandingFormData[control.name] || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ease-in-out appearance-none cursor-pointer"
                  >
                    <option value="" disabled>
                      {control.placeholder || "Select an option"}
                    </option>
                    {control.options &&
                      control.options.map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.label}
                        </option>
                      ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-500">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      ></path>
                    </svg>
                  </div>
                </div>
              ) : control.componentType === "textarea" ? (
                <textarea
                  name={control.name}
                  id={control.name}
                  placeholder={control.placeholder}
                  value={courseLandingFormData[control.name] || ""}
                  onChange={handleChange}
                  rows="5"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ease-in-out resize-y"
                />
              ) : (
                /* Render Standard Input Element */
                <input
                  type={control.type}
                  name={control.name}
                  id={control.name}
                  placeholder={control.placeholder}
                  value={courseLandingFormData[control.name] || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ease-in-out"
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
