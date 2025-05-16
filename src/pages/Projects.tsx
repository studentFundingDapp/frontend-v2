import { AnimatePresence, motion } from "framer-motion";
import { Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import NewProjectModal from "../components/NewProjectModal";
import ProjectCard from "../components/ProjectCard";
import ProjectCardSkeleton from "../components/ProjectCardSkeleton";
import ProjectDetailsModal from "../components/ProjectDetailsModal";
import { Button } from "../components/ui/button";
import { useLoading } from "../context/LoadingContext";

// Types for project data based on API specs
export interface Project {
  id: string;
  title: string;
  description: string;
  objectives: string;
  deliverables: string;
  category: string;
  target_amount: number;
  current_amount: number;
  wallet_address: string;
  deadline: string;
  status: "pending" | "approved" | "rejected" | "completed";
  created_at: string;
  updated_at: string;
  image_url?: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const ProjectsPage = () => {
  const navigate = useNavigate();
  const { setLoading } = useLoading();
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [myProjects, setMyProjects] = useState<Project[]>([]);
  const [publicProjects, setPublicProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("recent");
  const [search, setSearch] = useState<string>("");

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error("You must be logged in to view your projects");
      navigate("/login");
    }
  }, [navigate]);

  // Fetch user's wallet address
  useEffect(() => {
    const wallet = localStorage.getItem("wallet_address");
    if (wallet) setWalletAddress(wallet);
  }, []);

  // Fetch all projects
  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await fetch("http://studybae.online:8000/api/projects", {
          method: "GET",
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error("Failed to fetch projects");
        const data = await response.json();
        setAllProjects(data);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        toast.error("Failed to load projects");
        setAllProjects([]);
      } finally {
        setIsLoading(false);
        setLoading(false);
      }
    };
    fetchProjects();
  }, [setLoading]);

  // Split projects into "My Projects" and "Public Projects"
  useEffect(() => {
    if (!walletAddress) {
      setMyProjects([]);
      setPublicProjects(allProjects);
      return;
    }
    setMyProjects(allProjects.filter(p => p.wallet_address === walletAddress));
    setPublicProjects(allProjects.filter(p => p.wallet_address !== walletAddress));
  }, [allProjects, walletAddress]);

  // Filtering and sorting for public projects
  const filteredPublicProjects = publicProjects
    .filter(project =>
      (categoryFilter === "all" || project.category === categoryFilter) &&
      (statusFilter === "all" || project.status === statusFilter) &&
      (search === "" ||
        project.title.toLowerCase().includes(search.toLowerCase()) ||
        project.description.toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortBy === "recent") {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      if (sortBy === "amount") {
        return (b.current_amount || 0) - (a.current_amount || 0);
      }
      if (sortBy === "deadline") {
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      }
      return 0;
    });

  // Filtering and sorting for my projects
  const filteredMyProjects = myProjects
    .filter(project =>
      (categoryFilter === "all" || project.category === categoryFilter) &&
      (statusFilter === "all" || project.status === statusFilter) &&
      (search === "" ||
        project.title.toLowerCase().includes(search.toLowerCase()) ||
        project.description.toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortBy === "recent") {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      if (sortBy === "amount") {
        return (b.current_amount || 0) - (a.current_amount || 0);
      }
      if (sortBy === "deadline") {
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      }
      return 0;
    });

  // Delete project
  const handleDeleteProject = async (projectId: string) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://studybae.online:8000/api/projects/${projectId}`, {
        method: "DELETE",
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error("Failed to delete project");
      toast.success("Project deleted!");
      setAllProjects(prev => prev.filter(p => p.id !== projectId));
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Failed to delete project");
    }
  };

  const handleOpenProjectDetails = (project: Project) => {
    setSelectedProject(project);
    setIsDetailsModalOpen(true);
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
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <Button 
            onClick={() => setIsNewProjectModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white rounded-full px-6 shadow-sm"
          >
            <Plus className="mr-2 h-4 w-4" /> Create New Project
          </Button>
        </motion.div>
      </div>

      {/* Filter & Sort Controls */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Search projects..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border rounded px-3 py-2"
        />
        <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
          <option value="all">All Categories</option>
          <option value="Medical">Medical</option>
          <option value="Technology">Technology</option>
          <option value="Business">Business</option>
          <option value="Environment">Environment</option>
          <option value="Education">Education</option>
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="completed">Completed</option>
          <option value="rejected">Rejected</option>
        </select>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="recent">Most Recent</option>
          <option value="amount">Amount Raised</option>
          <option value="deadline">Deadline</option>
        </select>
      </div>

      {/* My Projects Section */}
      <section className="mb-10">
        {isLoading ? (
          <motion.div 
            className="grid gap-4 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {[1, 2, 3].map((i) => (
              <ProjectCardSkeleton key={i} />
            ))}
          </motion.div>
        ) : filteredMyProjects.length === 0 ? (
          <motion.div 
            className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-xl font-medium mb-2 text-gray-800 dark:text-gray-200">No projects yet</h3>
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
              className="grid gap-4 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filteredMyProjects.map((project) => (
                <motion.div key={project.id} variants={containerVariants}>
                  <ProjectCard
                    projectName={project.title}
                    description={project.description}
                    imageUrl={project.image_url}
                    timestamp={new Date(project.created_at).toLocaleDateString()}
                    location={undefined}
                    tags={[project.category, project.status]}
                    likesCount={Math.floor(Math.random() * 50)}
                    student={{
                      name: "You",
                      degree: "Student",
                      university: "",
                      avatarUrl: ""
                    }}
                    buttonText="View Details"
                    onClick={() => handleOpenProjectDetails(project)}
                  />
                  <Button
                    variant="destructive"
                    className="mt-2"
                    onClick={() => handleDeleteProject(project.id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                  </Button>
                </motion.div>
              ))}
            </motion.div>
          </>
        )}
      </section>

      {/* Public Projects Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-gray-900"
      >
        <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-gray-900 dark:text-gray-100">Explore Other Projects</h2>
        
        {isLoading ? (
          <motion.div 
            className="grid gap-4 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {[1, 2, 3].map((i) => (
              <ProjectCardSkeleton key={i} />
            ))}
          </motion.div>
        ) : filteredPublicProjects.length === 0 ? (
          <motion.div 
            className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200">No public projects available</h3>
            <p className="text-gray-600 dark:text-gray-400">Check back later for updates</p>
          </motion.div>
        ) : (
          <>
            <motion.div 
              className="grid gap-4 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filteredPublicProjects.map((project) => (
                <motion.div key={project.id} variants={containerVariants}>
                  <ProjectCard
                    projectName={project.title}
                    description={project.description}
                    imageUrl={project.image_url}
                    timestamp={new Date(project.created_at).toLocaleDateString()}
                    location={undefined}
                    tags={[project.category, project.status]}
                    likesCount={Math.floor(Math.random() * 100)}
                    student={{
                      name: "Student",
                      degree: "Student",
                      university: "",
                      avatarUrl: ""
                    }}
                    buttonText="View Details"
                    onClick={() => handleOpenProjectDetails(project)}
                  />
                </motion.div>
              ))}
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
              setAllProjects(prev => [project, ...prev]);
              toast.success("Project created successfully");
            }}
            defaultWalletAddress={walletAddress}
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

export default ProjectsPage;
