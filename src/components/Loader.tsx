// src/components/Loader.tsx
import { motion } from "framer-motion";
import React from "react";

const Loader: React.FC = () => {
  return (
    <motion.div
      className="fixed top-0 left-0 w-full h-full bg-gray-900 flex flex-col justify-center items-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Animated "DSFS" */}
      <motion.div
        className="text-5xl font-bold text-blue-500"
        initial={{ scale: 0.8 }}
        animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          repeatType: "loop",
        }}
      >
        DSFS
      </motion.div>

      {/* Animated "Loading..." */}
      <motion.div
        className="mt-4 text-xl text-gray-300"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          repeatType: "loop",
        }}
      >
        Loading...
      </motion.div>
    </motion.div>
  );
};

export default Loader;

