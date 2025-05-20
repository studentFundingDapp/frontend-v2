import React, { createContext, useContext, useState, useEffect } from "react";
import { Loader } from "lucide-react";
import { Progress } from "../components/ui/progress";

interface LoadingContextType {
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (loading) {
      // Reset progress when loading starts
      setProgress(0);
      
      // Simulate progress
      interval = setInterval(() => {
        setProgress((prevProgress) => {
          // Slowly increase progress, slowing down toward the end to seem realistic
          const increment = 100 - prevProgress > 50 ? 12 : 5;
          const newProgress = Math.min(prevProgress + increment, 95);
          return newProgress;
        });
      }, 200);
    } else if (progress > 0) {
      // Complete the progress bar when loading finishes
      setProgress(100);
      const timeout = setTimeout(() => setProgress(0), 500);
      return () => clearTimeout(timeout);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [loading, progress]);

  return (
    <LoadingContext.Provider value={{ loading, setLoading }}>
      {loading && (
        <>
          <Progress 
            value={progress} 
            className="fixed top-0 left-0 right-0 z-50 h-1 bg-blue-100 dark:bg-blue-900" 
          />
          <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm z-40 flex flex-col items-center justify-center">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-2xl flex flex-col items-center max-w-sm w-full">
              <Loader className="h-10 w-10 text-blue-600 dark:text-blue-400 animate-spin mb-4" />
              <p className="text-blue-900 dark:text-blue-100 font-medium">Loading DSFS Platform...</p>
              <p className="text-blue-600 dark:text-blue-400 text-sm mt-1">{Math.round(progress)}%</p>
            </div>
          </div>
        </>
      )}
      {children}
    </LoadingContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
};
