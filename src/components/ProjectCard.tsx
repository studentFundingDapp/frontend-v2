import { motion } from "framer-motion";
import { ArrowRight, Star, User } from "lucide-react";
import { Button } from "./ui/button";

interface StudentDetails {
  name: string;
  degree: string;
  university: string;
}

interface ProjectCardProps {
  name: string;
  description: string;
  buttonText: string;
  image?: string;
  rating?: number;
  student?: StudentDetails;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ 
  name, 
  description, 
  buttonText, 
  image, 
  rating = 0,
  student 
}) => {
  // Generate stars based on rating
  const renderRating = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`star-${i}`} className="w-4 h-4 fill-blue-500 text-blue-500" />);
    }
    
    // Add half star if needed
    if (hasHalfStar) {
      stars.push(<Star key="half-star" className="w-4 h-4 text-blue-500" />);
    }
    
    // Add empty stars to reach 5
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />);
    }
    
    return stars;
  };

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col h-full border border-gray-100 w-84"
    >
      <div className="h-40 overflow-hidden bg-gradient-to-br from-blue-600 to-blue-900">
        {image ? (
          <img src={image} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="flex items-center justify-center h-full text-white font-bold text-xl">
            {name[0]}
          </div>
        )}
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-semibold">{name}</h3>
          <div className="flex">{renderRating()}</div>
        </div>
        
        <p className="text-gray-600 mb-4 flex-grow">{description}</p>
        
        {student && (
          <div className="mb-4 flex p-3 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center mr-3">
              <User className="w-4 h-4" />
            </div>
            <div>
              <p className="font-medium text-sm">{student.name}</p>
              <p className="text-xs text-gray-500">{student.degree}, {student.university}</p>
            </div>
          </div>
        )}
        
        <motion.div 
          whileHover={{ x: 5 }}
          className="mt-auto"
        >
          <Button 
            className="ghost text-blue-700 hover:text-blue-900 hover:bg-blue-50 p-0 flex items-center group w-56"
          >
            {buttonText}
            <ArrowRight className="ml-2 h-4 w-4 transition-all duration-300 group-hover:translate-x-1" />
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;