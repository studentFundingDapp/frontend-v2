// src/components/Loader.tsx
import React from "react";
import { motion } from "framer-motion";

const Loader: React.FC = () => {
  return (
    <motion.div
      className="fixed top-0 left-0 w-full h-full bg-white flex justify-center items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-2xl font-semibold text-blue-600">
        DSFS... Loading...
      </div>
    </motion.div>
  );
};

export default Loader;
