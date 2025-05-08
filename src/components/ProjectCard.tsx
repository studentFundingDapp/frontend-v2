import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { Button } from "./ui/button";
import CommentModal from "./CommentModal";

interface Comment {
  user: string;
  text: string;
  avatar?: string;
}

interface ProjectCardProps {
  avatarUrl: string;
  projectName: string;
  username: string;
  timestamp: string;
  location?: string;
  imageUrl: string;
  description: string;
  tags: string[];
  likesCount: number;
  comments: Comment[];
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  avatarUrl,
  projectName,
  username,
  timestamp,
  location,
  imageUrl,
  description,
  tags,
  likesCount,
  comments,
}) => {
  const [liked, setLiked] = useState(false);
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [newComments, setNewComments] = useState(comments);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleAddComment = (text: string) => {
    setNewComments((prev) => [...prev, { user: "You", text }]);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 space-y-6 max-w-md w-full hover:shadow-xl transition-shadow duration-300 border border-gray-200 dark:border-gray-700 relative z-10"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={avatarUrl}
              alt="avatar"
              className="w-12 h-12 rounded-full object-cover border-2 border-blue-500"
            />
            <div>
              <p className="font-semibold text-gray-800 dark:text-gray-200">
                {username || projectName}
              </p>
              <p className="text-xs text-gray-500">{timestamp}</p>
            </div>
          </div>
          {location && (
            <span className="text-xs bg-blue-100 text-blue-600 px-3 py-1 rounded-full">
              {location}
            </span>
          )}
        </div>

        {/* Image */}
        <div className="relative">
          <img
            src={imageUrl}
            alt="project"
            className="w-full aspect-square object-cover rounded-lg hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => setLiked(!liked)}
              className="text-gray-600 dark:text-gray-300 hover:text-blue-500"
            >
              {liked ? "💖" : "🤍"} {likesCount + (liked ? 1 : 0)}
            </Button>
            <Button
              variant="ghost"
              onClick={() => setIsCommentOpen(true)}
              className="text-gray-600 dark:text-gray-300 hover:text-blue-500"
            >
              💬 Comment
            </Button>
          </div>
          <Button
            variant="ghost"
            className="text-gray-600 dark:text-gray-300 hover:text-blue-500"
          >
            📤 Share
          </Button>
        </div>

        {/* Description */}
        <div className="text-sm text-gray-700 dark:text-gray-300">
          <p>
            <span className="font-semibold">{username || projectName}</span>{" "}
            {description.length > 200
              ? `${description.slice(0, 200)}...`
              : description}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {tags.map((tag, i) => (
              <span
                key={i}
                className="bg-blue-100 text-blue-600 text-xs font-medium px-2 py-1 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Comment Preview */}
        {newComments.length > 0 && (
          <div className="text-sm text-gray-700 dark:text-gray-300">
            <p
              className="text-xs text-blue-500 cursor-pointer mt-1"
              onClick={() => setIsCommentOpen(true)}
            >
              View all {newComments.length} comments
            </p>
          </div>
        )}

        {/* Timestamp */}
        <p className="text-xs text-gray-500">Posted {timestamp}</p>
      </motion.div>

      {/* Comment Modal */}
      {isCommentOpen &&
        ReactDOM.createPortal(
          <CommentModal
            isOpen={isCommentOpen}
            onClose={() => setIsCommentOpen(false)}
            comments={newComments}
            onAddComment={handleAddComment}
            className="z-50 fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          />,
          document.body
        )}
    </>
  );
};

export default ProjectCard;