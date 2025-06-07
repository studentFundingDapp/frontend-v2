import { motion } from "framer-motion";
import { Bookmark, DollarSign, Eye, Heart, Share2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Tooltip from "@radix-ui/react-tooltip";

// Local Imports
import { cn } from "../lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";

// Import the single source of truth for the Project type
// import { Project } from "../api/client"; // Adjust path to your API client
import { Card } from "./ui/card";
import type { Project } from "../lib/api";

// The component's props are simplified to just the project and an optional handler
export interface ProjectCardProps {
  project: Project;
  onButtonClick?: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onButtonClick,
}) => {
  const navigate = useNavigate();
  
  // State for UI interactions (likes, saves)
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  // Use a placeholder for likes since it's not on the Project type from the backend
  const [likesCount, setLikesCount] = useState(Math.floor(Math.random() * 100));

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLiked(!liked);
    setLikesCount(liked ? likesCount - 1 : likesCount + 1);
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSaved(!saved);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    // In a real app, this would trigger the Web Share API or a share modal
    navigator.clipboard.writeText(`${window.location.origin}/projects/${project.project_id}`);
    alert("Project link copied to clipboard!");
  };

  const getInitials = (name: string) => {
    return name?.split(" ").map((n) => n[0]).join("").toUpperCase() || "S";
  };
  
  // Utility for tag styling
  const getTagColor = (tag: string) => {
    const lowerTag = tag?.toLowerCase();
    if (lowerTag === "funded" || lowerTag === "completed") return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
    if (lowerTag === "open") return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
    if (lowerTag === "closed") return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
    if (lowerTag === "technology") return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300";
    if (lowerTag === "medical") return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
    return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
  };
  
  // Calculate funding progress
  const progress = project.target_amount > 0 
    ? Math.min((project.current_amount / project.target_amount) * 100, 100) 
    : 0;

  // Assume student info might be attached to the project object in the future
  const studentName = "Student User"; // Replace with project.student.name if available
  const studentAvatar = ""; // Replace with project.student.avatar if available

  // Use the project's media_urls array for the image, defaulting to the first one
  const imageUrl = project.media_urls?.[0];

  return (
    <motion.div
      className="h-full group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <Card 
        className="h-full flex flex-col cursor-pointer shadow-sm hover:shadow-lg dark:shadow-gray-900/20 dark:bg-gray-800/80 dark:border-gray-700 transition-shadow duration-300" 
        onClick={onButtonClick}
      >
        <div className="p-3 flex items-center justify-between border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center space-x-2 overflow-hidden">
            <Avatar className="h-8 w-8 ring-2 ring-white dark:ring-gray-800 shadow-sm flex-shrink-0">
              <AvatarImage src={studentAvatar} alt={studentName} />
              <AvatarFallback className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                {getInitials(studentName)}
              </AvatarFallback>
            </Avatar>
            <div className="truncate">
              <p className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate">{studentName}</p>
            </div>
          </div>
          <span className="text-xs text-gray-400 dark:text-gray-500 flex-shrink-0 ml-2">
            {new Date(project.created_at).toLocaleDateString()}
          </span>
        </div>
        
        <div className="aspect-video w-full relative overflow-hidden bg-gray-100 dark:bg-gray-800">
          {imageUrl ? (
            <img src={imageUrl} alt={project.title} className="w-full h-full object-cover" loading="lazy" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-800/20">
              <span className="text-4xl font-bold text-blue-300 dark:text-blue-700">{getInitials(project.title)}</span>
            </div>
          )}
          <div className="absolute inset-0 bg-black bg-opacity-0 flex items-center justify-center opacity-0 group-hover:bg-opacity-30 group-hover:opacity-100 transition-all">
            <Button variant="secondary" size="sm" className="bg-white/90 text-gray-800 hover:bg-white dark:bg-gray-800/90 dark:text-gray-100 dark:hover:bg-gray-800 shadow-md rounded-full">
              <Eye className="h-4 w-4 mr-1" /> View Details
            </Button>
          </div>
        </div>
        
        <div className="p-4 flex-grow flex flex-col">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1 line-clamp-1">{project.title}</h3>
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-3 line-clamp-2 min-h-[40px]">{project.description}</p>
          
          <div className="mt-auto mb-3 flex flex-wrap gap-1">
            {[project.category, project.status].filter(Boolean).map((tag, index) => (
              <span key={index} className={cn("text-xs font-medium px-2 py-0.5 rounded-full", getTagColor(tag))}>{tag}</span>
            ))}
          </div>
          
          <Tooltip.Provider delayDuration={100}>
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <div className="relative w-full cursor-pointer">
                  <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div className="h-full bg-blue-500 rounded-full" style={{ width: `${progress}%` }} initial={{ width: 0 }} animate={{ width: `${progress}%` }} />
                  </div>
                </div>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content side="top" align="center" className="px-2 py-1 bg-gray-900 text-white text-xs rounded shadow-lg z-50" sideOffset={6}>
                  {`${project.current_amount.toLocaleString()} / ${project.target_amount.toLocaleString()} XLM Raised`}
                  <Tooltip.Arrow className="fill-gray-900" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </Tooltip.Provider>

          <div className="mt-4 flex items-center justify-between border-t border-gray-100 dark:border-gray-700 pt-3">
            <div className="flex space-x-4">
              <button className="flex items-center text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 text-sm transition-colors" onClick={handleLike}>
                <Heart className={cn("h-4 w-4 mr-1.5 transition-all", liked ? "fill-red-500 text-red-500" : "")} />
                {likesCount}
              </button>
              <button className="flex items-center text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 text-sm transition-colors" onClick={(e) => { e.stopPropagation(); navigate(`/donate/${project.project_id}`); }}>
                <DollarSign className="h-4 w-4 mr-1.5" />
                Fund
              </button>
              <button className="flex items-center text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 text-sm transition-colors" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-1.5" />
                Share
              </button>
            </div>
            <button className="text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors" onClick={handleSave}>
              <Bookmark className={cn("h-5 w-5 transition-all", saved ? "fill-blue-500 text-blue-500" : "")} />
            </button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default ProjectCard;