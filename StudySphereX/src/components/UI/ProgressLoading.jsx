import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const ProgressLoading = ({ isMediaUploading, progress }) => {
  const [showProgress, setShowProgress] = useState(false);
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    if (isMediaUploading) {
      setShowProgress(true);
    }
    setAnimatedProgress(progress);
  }, [isMediaUploading, progress]);

  useEffect(() => {
    if (!isMediaUploading && animatedProgress === progress) {
      const timer = setTimeout(() => {
        setShowProgress(false);
      }, 1000); // Wait 1s before hiding

      return () => clearTimeout(timer);
    }
  }, [isMediaUploading, animatedProgress, progress]);

  return (
    <AnimatePresence>
      {showProgress && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="w-full max-w-md mx-auto mt-6 mb-6"
        >
          {/* Label and Percentage */}
          <div className="flex justify-between items-center mb-2 text-sm font-medium text-gray-600">
            <span>{progress === 100 ? "Completed" : "Uploading..."}</span>
            <span>{Math.round(animatedProgress)}%</span>
          </div>

          {/* Progress Track */}
          <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden relative shadow-inner">
            {/* Gradient Bar */}
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 relative"
              initial={{ width: 0 }}
              animate={{
                width: `${animatedProgress}%`,
                boxShadow: "0px 0px 10px rgba(167, 139, 250, 0.5)", // Glowing effect
              }}
              transition={{ ease: "circOut", duration: 0.5 }}
            >
              {/* Shimmer/Gloss Effect Overlay */}
              <motion.div
                className="absolute top-0 bottom-0 left-0 w-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-20deg]"
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};