import { useState } from "react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Heart, MessageSquare, Share2, Bookmark } from "lucide-react";
import { Badge } from "./ui/badge";
import { cn } from "../lib/utils";

interface Comment {
  user: string;
  text: string;
}

interface StudentDetails {
  name: string;
  degree?: string;
  university?: string;
  avatarUrl?: string;
}

interface ProjectCardProps {
  projectName: string;
  description: string;
  imageUrl?: string;
  timestamp: string;
  location?: string;
  tags?: string[];
  likesCount: number;
  comments?: Comment[];
  student?: StudentDetails;
  buttonText?: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  projectName,
  description,
  imageUrl,
  timestamp,
  location,
  tags = [],
  likesCount = 0,
  comments = [],
  student,
  buttonText = "View Project",
}) => {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [currentLikes, setCurrentLikes] = useState(likesCount);

  // Handle like toggle
  const handleLike = () => {
    setLiked(!liked);
    setCurrentLikes(liked ? currentLikes - 1 : currentLikes + 1);
  };

  // Handle save toggle
  const handleSave = () => {
    setSaved(!saved);
  };

  // Handle share
  const handleShare = () => {
    // In a real app, this would open a share dialog or copy a link
    alert("Share functionality would open here");
  };

  // Handle comment
  const handleComment = () => {
    // In a real app, this would open a comment modal or focus a comment input
    alert("Comment functionality would open here");
  };

  // Get student initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  // Truncate description
  const truncateDescription = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return expanded ? text : `${text.substring(0, maxLength)}...`;
  };

  return (
    <Card className="overflow-hidden border border-gray-200 bg-white transition-all duration-300 hover:shadow-md max-w-md w-full mx-auto">
      {/* Card Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10 border border-gray-200">
            <AvatarImage src={student?.avatarUrl} alt={student?.name || projectName} />
            <AvatarFallback className="bg-blue-100 text-blue-800">
              {student ? getInitials(student.name) : projectName[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div>
            <div className="flex items-center">
              <h3 className="font-semibold text-sm">{student?.name || projectName}</h3>
              {location && (
                <span className="mx-1 text-gray-500 text-xs">•</span>
              )}
              {location && (
                <Badge variant="outline" className="text-xs font-normal px-1.5 py-0 h-5">
                  {location}
                </Badge>
              )}
            </div>
            {student && (
              <p className="text-xs text-gray-500">
                {student.degree}{student.university && `, ${student.university}`}
              </p>
            )}
          </div>
        </div>
        
        <span className="text-xs text-gray-500">{timestamp}</span>
      </div>
      
      {/* Media Content */}
      <div className="aspect-square overflow-hidden bg-gray-100 relative">
        {imageUrl ? (
          <motion.img 
            src={imageUrl} 
            alt={projectName} 
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-50">
            <span className="text-4xl font-bold text-blue-300">{projectName[0]}</span>
          </div>
        )}
      </div>
      
      {/* Action Buttons */}
      <div className="p-4 flex items-center justify-between border-b border-gray-100">
        <div className="flex space-x-4">
          <motion.button 
            className="focus:outline-none" 
            onClick={handleLike}
            whileTap={{ scale: 1.2 }}
          >
            <Heart 
              className={cn("h-6 w-6 transition-colors", 
                liked ? "fill-red-500 text-red-500" : "text-gray-700"
              )} 
            />
          </motion.button>
          
          <motion.button 
            className="focus:outline-none" 
            onClick={handleComment}
            whileTap={{ scale: 1.2 }}
          >
            <MessageSquare className="h-6 w-6 text-gray-700" />
          </motion.button>
          
          <motion.button 
            className="focus:outline-none" 
            onClick={handleShare}
            whileTap={{ scale: 1.2 }}
          >
            <Share2 className="h-6 w-6 text-gray-700" />
          </motion.button>
        </div>
        
        <motion.button 
          className="focus:outline-none" 
          onClick={handleSave}
          whileTap={{ scale: 1.2 }}
        >
          <Bookmark 
            className={cn("h-6 w-6 transition-colors", 
              saved ? "fill-blue-500 text-blue-500" : "text-gray-700"
            )} 
          />
        </motion.button>
      </div>
      
      {/* Likes Count */}
      <div className="px-4 pt-2">
        <p className="font-semibold text-sm">{currentLikes} {currentLikes === 1 ? 'like' : 'likes'}</p>
      </div>
      
      {/* Description */}
      <div className="px-4 py-2">
        <p className="text-sm">
          <span className="font-semibold">{projectName} </span>
          {truncateDescription(description, 100)}
          
          {description.length > 100 && !expanded && (
            <button 
              className="text-gray-500 ml-1 focus:outline-none" 
              onClick={() => setExpanded(true)}
            >
              more
            </button>
          )}
        </p>
        
        {/* Tags */}
        {tags.length > 0 && (
          <div className="mt-2 flex flex-wrap">
            {tags.map((tag, index) => (
              <span key={index} className="text-blue-600 text-sm mr-1">
                #{tag.replace(/\s+/g, '')}
              </span>
            ))}
          </div>
        )}
      </div>
      
      {/* Comments */}
      {comments.length > 0 && (
        <div className="px-4 py-2">
          {comments.length > 2 && (
            <button className="text-gray-500 text-sm block mb-2 focus:outline-none">
              View all {comments.length} comments
            </button>
          )}
          
          {comments.slice(0, 2).map((comment, index) => (
            <p key={index} className="text-sm mb-1">
              <span className="font-semibold">{comment.user} </span>
              {comment.text}
            </p>
          ))}
        </div>
      )}
      
      {/* Timestamp */}
      <div className="px-4 pb-3 pt-1">
        <p className="text-gray-500 text-xs uppercase tracking-wide">
          Posted {timestamp}
        </p>
      </div>
      
      {/* View Project Button */}
      <div className="px-4 pb-4">
        <Button 
          variant="outline" 
          className="w-full text-blue-700 border-blue-700 hover:bg-blue-50"
        >
          {buttonText}
        </Button>
      </div>
    </Card>
  );
};

export default ProjectCard;
