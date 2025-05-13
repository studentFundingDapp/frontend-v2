import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import ProjectCard from "../components/ProjectCard";
import NewProjectModal from "../components/NewProjectModal";
import ProjectDetailsModal from "../components/ProjectDetailsModal";
import ProjectCardSkeleton from "../components/ProjectCardSkeleton";
import { Button } from "../components/ui/button";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "../components/ui/pagination";

// Types for project data
export interface Project {
  id: string;
  studentId: string;
  title: string;
  description: string;
  category: string;
  status: "pending" | "approved" | "rejected" | "completed";
  fundingGoal: number;
  currentFunding?: number;
  mediaUrls: string[];
  createdAt: string;
  studentName?: string;
  studentAvatar?: string;
  university?: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100 },
  },
};

const Projects = () => {
  const navigate = useNavigate();
  const [myProjects, setMyProjects] = useState<Project[]>([]);
  const [publicProjects, setPublicProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isLoadingMyProjects, setIsLoadingMyProjects] = useState(true);
  const [isLoadingPublicProjects, setIsLoadingPublicProjects] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [publicProjectsPage, setPublicProjectsPage] = useState(1);

  // Check if user is logged in
  // useEffect(() => {
    // const token = localStorage.getItem("token");
    // if (!token) {
      // toast.error("You must be logged in to view your projects");
      // navigate("/login");
    // }
  // }, [navigate]);

  // Fetch student's projects (mock data)
  useEffect(() => {
    const fetchMyProjects = async () => {
      setIsLoadingMyProjects(true);
      try {
        // Mock data for "My Projects"
        const mockData = getMockProjects(3, true); // Generate 3 mock projects
        setMyProjects(mockData);
        setTotalPages(2); // Set a mock total page count
      } catch (error) {
        console.error("Error fetching projects:", error);
        toast.error("Failed to load your projects");
      } finally {
        setIsLoadingMyProjects(false);
      }
    };

    fetchMyProjects();
  }, [currentPage]);

  // Fetch public projects (mock data)
  useEffect(() => {
    const fetchPublicProjects = async () => {
      setIsLoadingPublicProjects(true);
      try {
        // Mock data for "Public Projects"
        const mockData = getMockProjects(6, false); // Generate 6 mock projects
        setPublicProjects(mockData);
      } catch (error) {
        console.error("Error fetching public projects:", error);
        toast.error("Failed to load public projects");
      } finally {
        setIsLoadingPublicProjects(false);
      }
    };

    fetchPublicProjects();
  }, [publicProjectsPage]);

  const handleOpenProjectDetails = (project: Project) => {
    setSelectedProject(project);
    setIsDetailsModalOpen(true);
  };

  const handleLoadMorePublicProjects = () => {
    setPublicProjectsPage((prev) => prev + 1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Mock data for development
  const getMockProjects = (count: number, isOwn: boolean): Project[] => {
    return Array.from({ length: count }, (_, i) => ({
      id: `proj-${isOwn ? "my" : "pub"}-${i}`,
      studentId: isOwn ? "current-user-id" : `student-${i}`,
      title: isOwn
        ? [`My Medical Research Project`, `Engineering Innovation`, `Business Plan Competition`][i % 3]
        : [`AI in Healthcare`, `Sustainable Energy`, `Financial Tech Innovation`, `Ocean Cleanup Tech`][i % 4],
      description:
        "This project aims to revolutionize the field through innovative approaches and cutting-edge technology. We are seeking funding to continue our research and development.",
      category: ["Medical", "Technology", "Business", "Environment", "Education"][i % 5],
      status: ["pending", "approved", "completed", "rejected"][i % 4] as any,
      fundingGoal: Math.floor(Math.random() * 50000) + 5000,
      currentFunding: Math.floor(Math.random() * 30000),
      mediaUrls: [`https://picsum.photos/seed/${i}/600/400`],
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
      studentName: isOwn ? "You" : `Student ${i}`,
      studentAvatar: `https://i.pravatar.cc/150?u=${i}`,
      university: ["Harvard University", "MIT", "Stanford University", "Oxford University"][i % 4],
    }));
  };


  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <motion.h1 
          className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-900 dark:from-blue-400 dark:to-blue-600"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          My Projects
        </motion.h1>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button 
            onClick={() => setIsNewProjectModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6"
          >
            <Plus className="mr-2 h-4 w-4" /> New Project
          </Button>
        </motion.div>
      </div>

      {/* My Projects Section */}
      <section className="mb-12">
        {isLoadingMyProjects ? (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <motion.div key={i} variants={itemVariants}>
                <ProjectCardSkeleton />
              </motion.div>
            ))}
          </motion.div>
        ) : myProjects.length === 0 ? (
          <motion.div 
            className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 backdrop-blur-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-xl font-medium mb-2">No projects yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">Create your first project to get started</p>
            <Button 
              onClick={() => setIsNewProjectModalOpen(true)}
              variant="outline"
              className="bg-white dark:bg-gray-900"
            >
              <Plus className="mr-2 h-4 w-4" /> Create Project
            </Button>
          </motion.div>
        ) : (
          <>
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {myProjects.map((project) => (
                <motion.div key={project.id} variants={itemVariants}>
                  <ProjectCard
                    projectName={project.title}
                    description={project.description}
                    imageUrl={project.mediaUrls[0]}
                    timestamp={new Date(project.createdAt).toLocaleDateString()}
                    location={project.university}
                    tags={[project.category, project.status]}
                    likesCount={Math.floor(Math.random() * 50)}
                    student={{
                      name: "You",
                      degree: "Student",
                      university: project.university,
                      avatarUrl: project.studentAvatar
                    }}
                    buttonText="View Details"
                    onClick={() => handleOpenProjectDetails(project)}
                  />
                </motion.div>
              ))}
            </motion.div>
            
            {totalPages > 1 && (
              <motion.div 
                className="mt-8 flex justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Pagination>
                  <PaginationContent>
                    {currentPage > 1 && (
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => handlePageChange(currentPage - 1)}
                          className="cursor-pointer"
                        />
                      </PaginationItem>
                    )}
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <PaginationItem key={page}>
                        <PaginationLink 
                          isActive={page === currentPage}
                          onClick={() => handlePageChange(page)}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    
                    {currentPage < totalPages && (
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => handlePageChange(currentPage + 1)}
                          className="cursor-pointer"
                        />
                      </PaginationItem>
                    )}
                  </PaginationContent>
                </Pagination>
              </motion.div>
            )}
          </>
        )}
      </section>

      {/* Public Projects Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-2xl font-semibold mb-6">Explore Other Projects</h2>
        
        {isLoadingPublicProjects && publicProjectsPage === 1 ? (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <motion.div key={i} variants={itemVariants}>
                <ProjectCardSkeleton />
              </motion.div>
            ))}
          </motion.div>
        ) : publicProjects.length === 0 ? (
          <motion.div 
            className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h3 className="text-xl font-medium">No public projects available</h3>
            <p className="text-gray-600 dark:text-gray-400">Check back later for updates</p>
          </motion.div>
        ) : (
          <>
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {publicProjects.map((project) => (
                <motion.div key={project.id} variants={itemVariants}>
                  <ProjectCard
                    projectName={project.title}
                    description={project.description}
                    imageUrl={project.mediaUrls[0]}
                    timestamp={new Date(project.createdAt).toLocaleDateString()}
                    location={project.university}
                    tags={[project.category, project.status]}
                    likesCount={Math.floor(Math.random() * 100)}
                    student={{
                      name: project.studentName || "Student",
                      degree: "Student",
                      university: project.university,
                      avatarUrl: project.studentAvatar
                    }}
                    buttonText="View Details"
                    onClick={() => handleOpenProjectDetails(project)}
                  />
                </motion.div>
              ))}
            </motion.div>
            
            <motion.div 
              className="mt-8 flex justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <Button
                variant="outline"
                className="rounded-full px-8"
                disabled={isLoadingPublicProjects}
                onClick={handleLoadMorePublicProjects}
              >
                {isLoadingPublicProjects && publicProjectsPage > 1 ? (
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Load More Projects
              </Button>
            </motion.div>
          </>
        )}
      </motion.div>

      {/* New Project Modal */}
      <AnimatePresence>
        {isNewProjectModalOpen && (
          <NewProjectModal
            isOpen={isNewProjectModalOpen}
            onClose={() => setIsNewProjectModalOpen(false)}
            onProjectCreated={(project) => {
              setMyProjects(prev => [project, ...prev]);
              toast.success("Project created successfully");
            }}
          />
        )}
      </AnimatePresence>

      {/* Project Details Modal */}
      <AnimatePresence>
        {isDetailsModalOpen && selectedProject && (
          <ProjectDetailsModal
            project={selectedProject}
            isOpen={isDetailsModalOpen}
            onClose={() => setIsDetailsModalOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Projects;
