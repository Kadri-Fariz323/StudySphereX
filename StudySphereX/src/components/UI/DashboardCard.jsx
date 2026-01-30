export const DashboardCard = ({ icon, title, value, color = "blue" }) => {
  const colorClasses = {
    blue: {
      bg: "from-blue-500/10 to-blue-500/5",
      iconBg: "bg-blue-500/20",
      text: "text-blue-600",
      ring: "ring-blue-500/20",
    },
    green: {
      bg: "from-green-500/10 to-green-500/5",
      iconBg: "bg-green-500/20",
      text: "text-green-600",
      ring: "ring-green-500/20",
    },
    orange: {
      bg: "from-orange-500/10 to-orange-500/5",
      iconBg: "bg-orange-500/20",
      text: "text-orange-600",
      ring: "ring-orange-500/20",
    },
    purple: {
      bg: "from-purple-500/10 to-purple-500/5",
      iconBg: "bg-purple-500/20",
      text: "text-purple-600",
      ring: "ring-purple-500/20",
    },
  };

  const selectedColor = colorClasses[color] || colorClasses.blue;

  return (
    <div
      className={`
        relative overflow-hidden
        bg-gradient-to-br ${selectedColor.bg}
        backdrop-blur-xl
        p-6 rounded-2xl
        shadow-lg shadow-black/5
        ring-1 ${selectedColor.ring}
        transition-all duration-300
        hover:-translate-y-1 hover:shadow-xl
        group
      `}
    >
      {/* glow blob */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />

      <div className="relative z-10 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">
            {title}
          </p>
          <p className="text-3xl font-bold text-gray-800 tracking-tight">
            {value}
          </p>
        </div>

        <div
          className={`
            p-4 rounded-2xl ${selectedColor.iconBg}
            ${selectedColor.text}
            text-2xl
            transition-all duration-300
            group-hover:scale-110 group-hover:rotate-6
          `}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};
