import { FaClock, FaLeaf, FaMedal, FaBriefcase } from 'react-icons/fa';

export const BenefitsSection = () => {
  const benefits = [
    {
      id: 1,
      text: "Learn at your own pace",
      icon: <FaClock />,
      description: "No deadlines. You define your own schedule."
    },
    {
      id: 2,
      text: "Stay consistent without burnout",
      icon: <FaLeaf />,
      description: "Bite-sized lessons designed for steady progress."
    },
    {
      id: 3,
      text: "Build confidence with real skills",
      icon: <FaMedal />,
      description: "Hands-on projects that prove your ability."
    },
    {
      id: 4,
      text: "Prepare for jobs & internships",
      icon: <FaBriefcase />,
      description: "Career-focused curriculum for the real world."
    }
  ];

  return (
    <section className="bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">
            Why Join Us?
          </h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Designed for your success
          </p>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((item) => (
            <div 
              key={item.id} 
              className="flex flex-col items-center text-center p-6 rounded-xl hover:bg-blue-50 transition-colors duration-300"
            >
              {/* Icon Container */}
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600 text-2xl mb-6 shadow-sm">
                {item.icon}
              </div>
              
              {/* Text */}
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {item.text}
              </h3>
              
              <p className="text-sm text-gray-500">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
