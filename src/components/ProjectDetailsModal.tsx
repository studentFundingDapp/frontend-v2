
import { motion } from "framer-motion";
import { Dialog, DialogContent } from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Clock, Heart, MessageSquare, Share2, ChevronRight, AlertCircle } from "lucide-react";
import type { Project } from "../pages/Projects";

interface ProjectDetailsModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
}

const ProjectDetailsModal = ({ project, isOpen, onClose }: ProjectDetailsModalProps) => {
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate funding progress percentage
  const progressPercentage = project.currentFunding 
    ? Math.min(Math.round((project.currentFunding / project.fundingGoal) * 100), 100)
    : 0;

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }).format(date);
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'approved': return 'bg-green-500 text-white';
      case 'pending': return 'bg-yellow-500 text-white';
      case 'rejected': return 'bg-red-500 text-white';
      case 'completed': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto p-0 gap-0 backdrop-blur-lg bg-white/90 dark:bg-gray-900/90 border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {/* Left side - Project Image */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="relative h-full"
          >
            <div className="aspect-square overflow-hidden">
              {project.mediaUrls && project.mediaUrls[0] ? (
                <motion.img 
                  src={project.mediaUrls[0]} 
                  alt={project.title}
                  className="w-full h-full object-cover"
                  initial={{ scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.5 }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-800/30">
                  <AlertCircle className="text-blue-500 h-20 w-20" />
                </div>
              )}
            </div>
            
            {/* Status badge */}
            <Badge className={`absolute top-4 right-4 ${getStatusColor(project.status)}`}>
              {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
            </Badge>
          </motion.div>
          
          {/* Right side - Project Details */}
          <motion.div 
            className="p-6 flex flex-col h-full"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <div className="mb-4">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="mb-2">{project.category}</Badge>
                <span className="text-sm text-gray-500 flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {formatDate(project.createdAt)}
                </span>
              </div>
              <h2 className="text-2xl font-bold mb-2">{project.title}</h2>
            </div>
            
            <div className="flex items-center mb-6">
              <Avatar className="h-10 w-10 border border-gray-200 dark:border-gray-700">
                <AvatarImage src={project.studentAvatar} alt={project.studentName} />
                <AvatarFallback className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {project.studentName?.charAt(0) || "S"}
                </AvatarFallback>
              </Avatar>
              <div className="ml-3">
                <p className="font-medium">{project.studentName}</p>
                <p className="text-sm text-gray-500">{project.university}</p>
              </div>
            </div>
            
            <div className="mb-6 flex-grow">
              <h3 className="font-medium mb-2">Project Description</h3>
              <p className="text-gray-600 dark:text-gray-400">{project.description}</p>
            </div>
            
            <div className="mb-6">
              <h3 className="font-medium mb-2">Funding Goal</h3>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xl font-bold">{formatCurrency(project.fundingGoal)}</span>
                {project.currentFunding !== undefined && (
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {formatCurrency(project.currentFunding)} raised
                  </span>
                )}
              </div>
              {project.currentFunding !== undefined && (
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full" 
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex space-x-3">
                <Button size="icon" variant="outline">
                  <Heart className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="outline">
                  <MessageSquare className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="outline">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
              <Button className="rounded-full bg-blue-600 hover:bg-blue-700">
                Support Project <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectDetailsModal;
