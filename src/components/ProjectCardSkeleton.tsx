import { motion } from "framer-motion";
import { Card } from "../components/ui/card";
import { Skeleton } from "../components/ui/skeleton";

const ProjectCardSkeleton = () => {
  return (
    <Card className="overflow-hidden border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 transition-all duration-300 hover:shadow-md max-w-md w-full mx-auto">
      {/* Card Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div>
            <Skeleton className="h-4 w-24 mb-1" />
            <Skeleton className="h-3 w-32" />
          </div>
        </div>
        <Skeleton className="h-3 w-16" />
      </div>
      
      {/* Media Content */}
      <Skeleton className="w-full aspect-square" />
      
      {/* Action Buttons */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex space-x-4">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-6 w-6 rounded-full" />
        </div>
        <Skeleton className="h-6 w-6 rounded-full" />
      </div>
      
      {/* Likes Count */}
      <div className="px-4 pt-2">
        <Skeleton className="h-4 w-16" />
      </div>
      
      {/* Description */}
      <div className="px-4 py-2">
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-3/4" />
      </div>
      
      {/* Tags */}
      <div className="px-4 py-2 flex flex-wrap">
        <Skeleton className="h-3 w-16 mr-2" />
        <Skeleton className="h-3 w-12" />
      </div>
      
      {/* Timestamp */}
      <div className="px-4 pb-3 pt-1">
        <Skeleton className="h-3 w-24" />
      </div>
      
      {/* View Project Button */}
      <div className="px-4 pb-4">
        <Skeleton className="h-9 w-full" />
      </div>
    </Card>
  );
};

export default ProjectCardSkeleton;
