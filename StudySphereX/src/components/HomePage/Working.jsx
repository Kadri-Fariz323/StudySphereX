import { FaUserPlus } from "react-icons/fa6";
import { FaSitemap } from "react-icons/fa6";
import { IoMdTrendingUp } from "react-icons/io";
export const Working = () => {
  const steps = [
    {
      id: 1,
      title: 'Create Your Account',
      description: 'Sign up and choose your learning goal.',
      icon: <FaUserPlus   className="w-8 h-8 text-indigo-600" />,
    },
    {
      id: 2,
      title: 'Follow Your Roadmap',
      description: 'Learn with structured lessons and daily tasks.',
      icon: <FaSitemap className="w-8 h-8 text-indigo-600" />,
    },
    {
      id: 3,
      title: 'Build & Track Progress',
      description: 'Complete projects and track improvement.',
      icon: <IoMdTrendingUp className="w-8 h-8 text-indigo-600" />,
    },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold leading-tight text-gray-900 sm:text-4xl lg:text-5xl">
            How It Works
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            Simple onboarding explanation to get you started.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="relative grid grid-cols-1 gap-12 lg:grid-cols-3">
          
          {/* Decorative connecting line for desktop */}
          <div className="hidden lg:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-indigo-100 -z-10" />

          {steps.map((step) => (
            <div key={step.id} className="relative flex flex-col items-center text-center">
              {/* Icon Circle */}
              <div className="flex items-center justify-center w-24 h-24 mb-8 bg-white border-2 border-indigo-100 rounded-full shadow-sm">
                <div className="flex items-center justify-center w-20 h-20 bg-indigo-50 rounded-full">
                  {step.icon}
                </div>
              </div>
              
              {/* Text Content */}
              <h3 className="text-xl font-bold text-gray-900">
                {step.title}
              </h3>
              <p className="mt-3 text-base text-gray-500 max-w-xs">
                {step.description}
              </p>
            </div>
          ))}
        </div>
        
      </div>
    </section>
  );
};