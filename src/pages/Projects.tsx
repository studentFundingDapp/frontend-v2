import { AnimatePresence, motion } from "framer-motion";
import { Plus, Trash2 } from "lucide-react";
import { useEffect, useState, useCallback, useMemo } from "react";
import { toast } from "sonner";

// Components and Hooks
import NewProjectModal from "../components/NewProjectModal";
import ProjectCard from "../components/ProjectCard";
import ProjectDetailsModal from "../components/ProjectDetailsModal";
import { Button } from "../components/ui/button";
import { useLoading } from "../context/LoadingContext";
import { projectApi, studentApi, type Project } from "../lib/api";

// Import your type-safe API client and types
// Adjust the path as needed

// Animation variants for the project grid
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const ProjectsPage = () => {
  const { setLoading } = useLoading();
  const [myProjects, setMyProjects] = useState<Project[]>([]);
  const [otherProjects, setOtherProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // State for filtering and sorting controls
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("recent");
  const [search, setSearch] = useState<string>("");

  // Centralized data fetching function
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch user profile and all projects concurrently for efficiency
      const [profileResponse, projectsResponse] = await Promise.all([
        studentApi.getProfile(),
        projectApi.list(),
      ]);

      if (!profileResponse.success) {
        toast.error("Could not fetch your profile. Please log in again.");
        // Optional: redirect to login
        return;
      }
      
      if (!projectsResponse.success) {
        toast.error("Failed to fetch projects.");
        return;
      }

      const studentId = profileResponse.data.id;
      const allProjects = projectsResponse.data;

      // Filter projects into two distinct lists
      setMyProjects(allProjects.filter((p: { student_id: any; }) => p.student_id === studentId));
      setOtherProjects(allProjects.filter((p: { student_id: any; }) => p.student_id !== studentId));

    } catch (error) {
      toast.error("A network error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [setLoading]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Memoized filtering and sorting to prevent re-calculation on every render
  const useFilteredProjects = (projects: Project[]) => {
    return useMemo(() => {
      return projects
        .filter(project =>
          (categoryFilter === "all" || project.category === categoryFilter) &&
          (statusFilter === "all" || project.status === statusFilter) &&
          (search === "" ||
            project.title.toLowerCase().includes(search.toLowerCase()) ||
            project.description.toLowerCase().includes(search.toLowerCase()))
        )
        .sort((a, b) => {
          if (sortBy === "recent") return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          if (sortBy === "amount") return (b.current_amount || 0) - (a.current_amount || 0);
          if (sortBy === "deadline") return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
          return 0;
        });
    }, [projects, categoryFilter, statusFilter, search, sortBy]);
  };

  const filteredMyProjects = useFilteredProjects(myProjects);
  const filteredOtherProjects = useFilteredProjects(otherProjects);

  // Delete project using the API client
  const handleDeleteProject = async (projectId: string) => {
    if (!window.confirm("Are you sure you want to delete this project? This action cannot be undone.")) return;
    
    setLoading(true);
    const response = await projectApi.delete(projectId);
    setLoading(false);

    if (response.success) {
      toast.success("Project deleted successfully!");
      setMyProjects(prev => prev.filter(p => p.project_id !== projectId));
    } else {
      toast.error(response.error);
    }
  };

  const handleOpenProjectDetails = (project: Project) => {
    setSelectedProject(project);
    setIsDetailsModalOpen(true);
  };
  
  // Add a newly created project to the state
  const handleProjectCreated = (newProject: Project) => {
    setMyProjects(prev => [newProject, ...prev]);
    toast.success("Project created successfully!");
  };

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8 min-h-screen bg-white dark:bg-gray-900">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 sm:mb-8">
        <motion.h1 
          className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-900 dark:from-blue-400 dark:to-blue-600"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          My Projects
        </motion.h1>
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          <Button onClick={() => setIsNewProjectModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white rounded-full px-6 shadow-sm">
            <Plus className="mr-2 h-4 w-4" /> Create New Project
          </Button>
        </motion.div>
      </div>

      {/* Filter & Sort Controls */}
      <div className="flex flex-wrap gap-4 mb-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border dark:border-gray-700">
        <input type="text" placeholder="Search projects..." value={search} onChange={e => setSearch(e.target.value)} className="flex-grow border rounded px-3 py-2 bg-white dark:bg-gray-800 dark:border-gray-600"/>
        <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="border rounded px-3 py-2 bg-white dark:bg-gray-800 dark:border-gray-600">
          <option value="all">All Categories</option>
          <option value="Medical">Medical</option><option value="Technology">Technology</option><option value="Business">Business</option><option value="Environment">Environment</option><option value="Education">Education</option>
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="border rounded px-3 py-2 bg-white dark:bg-gray-800 dark:border-gray-600">
          <option value="all">All Statuses</option>
          <option value="open">Open</option><option value="funded">Funded</option><option value="completed">Completed</option><option value="closed">Closed</option>
        </select>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="border rounded px-3 py-2 bg-white dark:bg-gray-800 dark:border-gray-600">
          <option value="recent">Most Recent</option><option value="amount">Amount Raised</option><option value="deadline">Deadline</option>
        </select>
      </div>

      {/* My Projects Section */}
      <section className="mb-10">
        {filteredMyProjects.length === 0 ? (
          <motion.div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <h3 className="text-xl font-medium mb-2 text-gray-800 dark:text-gray-200">You haven't created any projects yet.</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">Click the button below to get started!</p>
            <Button onClick={() => setIsNewProjectModalOpen(true)} variant="outline" className="bg-white dark:bg-gray-900"><Plus className="mr-2 h-4 w-4" /> Create Project</Button>
          </motion.div>
        ) : (
          <motion.div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" variants={containerVariants} initial="hidden" animate="visible">
            {filteredMyProjects.map((project) => (
              <motion.div key={project.project_id} variants={containerVariants}>
    <ProjectCard project={project} onButtonClick={() => handleOpenProjectDetails(project)} />
                <Button variant="destructive" size="sm" className="w-full mt-2" onClick={() => handleDeleteProject(project.project_id)}>
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </Button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>

      {/* Explore Other Projects Section */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="bg-white dark:bg-gray-900">
        <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-gray-900 dark:text-gray-100 border-t dark:border-gray-700 pt-6">Explore Other Projects</h2>
        {filteredOtherProjects.length === 0 ? (
          <motion.div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200">No other projects found.</h3>
            <p className="text-gray-600 dark:text-gray-400">Check back later for new funding opportunities!</p>
          </motion.div>
        ) : (
          <motion.div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" variants={containerVariants} initial="hidden" animate="visible">
            {filteredOtherProjects.map((project) => (
              <motion.div key={project.project_id} variants={containerVariants}>
 <ProjectCard project={project} onButtonClick={() => handleOpenProjectDetails(project)} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>

      {/* Modals */}
      <AnimatePresence>
        {isNewProjectModalOpen && <NewProjectModal isOpen={isNewProjectModalOpen} onClose={() => setIsNewProjectModalOpen(false)} onProjectCreated={handleProjectCreated} />}
        {isDetailsModalOpen && selectedProject && <ProjectDetailsModal project={selectedProject} isOpen={isDetailsModalOpen} onClose={() => setIsDetailsModalOpen(false)} />}
      </AnimatePresence>
    </div>
  );
};

export default ProjectsPage;