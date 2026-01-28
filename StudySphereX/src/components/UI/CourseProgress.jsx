import { motion } from "framer-motion";

export const CourseProgress = ({ value, isCompleted }) => {
  return (
    <div className="w-full mt-4">
      {/* Label and Percentage */}
      <div className="flex justify-between items-center mb-2 text-sm font-medium text-gray-600">
        <span>{isCompleted ? "Completed" : "In Progress"}</span>
        <span>{Math.round(value)}%</span>
      </div>

      {/* Progress Track */}
      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden relative shadow-inner">
        {/* Gradient Bar */}
        <motion.div
          className={`h-full rounded-full relative ${
            isCompleted
              ? "bg-gradient-to-r from-green-500 to-emerald-400" // Green for completion
              : "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
          }`}
          initial={{ width: 0 }}
          animate={{
            width: `${value}%`,
            boxShadow: isCompleted
              ? "0px 0px 10px rgba(52, 211, 153, 0.5)"
              : "0px 0px 10px rgba(167, 139, 250, 0.5)",
          }}
          transition={{ ease: "circOut", duration: 1 }}
        >
          {/* Shimmer Effect (Only if not completed to reduce visual noise) */}
          {!isCompleted && (
            <motion.div
              className="absolute top-0 bottom-0 left-0 w-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-20deg]"
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
};