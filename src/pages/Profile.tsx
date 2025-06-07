import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Edit, Github, Linkedin, Loader2, LogOut, Share, Twitter } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";

import { useNavigate } from "react-router-dom";
import * as z from "zod";

// Import API client and types
import { studentApi, projectApi } from "../lib/api"; // Adjust path
import type { StudentProfile, Project} from "../lib/api";

// Import Components and Hooks
import NewProjectModal from "../components/NewProjectModal";
import PageWrapper from "../components/PageWrapper";
import ProjectDetailsModal from "../components/ProjectDetailsModal";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../components/ui/form";
import { Input } from "../components/ui/input";
import { useLoading } from "../context/LoadingContext";
import { useToast } from "../hooks/use-toast";

const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

// Form schema for profile editing (assuming API accepts these fields)
const profileFormSchema = z.object({
  full_name: z.string().min(2, "Full name must be at least 2 characters"),
  // These fields are not in the current updateProfile API but are kept for UI demonstration.
  // In a real app, the API endpoint would need to be updated to accept them.
  // bio: z.string().max(300).optional(),
  // githubUrl: z.string().url().optional().or(z.literal("")),
});
type ProfileFormValues = z.infer<typeof profileFormSchema>;

const PROJECTS_PER_PAGE = 6;
const PLACEHOLDER_IMG = "https://placehold.co/600x400?text=Project";

const Profile = () => {
  const { setLoading, loading } = useLoading();
  // Use loading directly from the context
  const navigate = useNavigate();
  const { toast } = useToast();

  const [userProfile, setUserProfile] = useState<StudentProfile | null>(null);
  const [userProjects, setUserProjects] = useState<Project[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [showProjectDetails, setShowProjectDetails] = useState<{ open: boolean; project: Project | null }>({ open: false, project: null });
  const [currentPage, setCurrentPage] = useState(1);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: { full_name: "" },
  });
  
  // Fetch all necessary data from the backend
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [profileResponse, projectsResponse] = await Promise.all([
        studentApi.getProfile(),
        projectApi.list(),
      ]);

      if (profileResponse.success) {
        setUserProfile(profileResponse.data);
        // Pre-fill the form with fetched data
        form.reset({
          full_name: profileResponse.data.full_name,
        });
      } else {
        toast({ title: "Error", description: "Could not load your profile.", variant: "destructive" });
        navigate('/login'); // Redirect if profile can't be fetched
      }

      if (projectsResponse.success && profileResponse.success) {
        const studentId = profileResponse.data.id;
        setUserProjects(projectsResponse.data.filter(p => p.student_id === studentId));
      } else {
         toast({ title: "Warning", description: "Could not load your projects.", variant: "default" });
      }
    } catch (error) {
      toast({ title: "Network Error", description: "Failed to connect to the server.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [setLoading, toast, navigate, form]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle form submission to update profile
  const onSubmit = async (data: ProfileFormValues) => {
    setLoading(true);
    try {
      // Update profile
      const updateResponse = await studentApi.updateProfile({ full_name: data.full_name });
      if (!updateResponse.success) {
        throw new Error(updateResponse.error);
      }

      // Refresh profile data from server
      const refreshResponse = await studentApi.getProfile();
      if (!refreshResponse.success) {
        throw new Error(refreshResponse.error);
      }

      setUserProfile(refreshResponse.data);
      setIsEditing(false);
      toast({ title: "Profile Updated", description: "Your changes have been saved." });
    } catch (error) {
      toast({ 
        title: "Update Failed", 
        description: error instanceof Error ? error.message : "Failed to update profile",
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleProjectCreated = (newProject: Project) => {
    setUserProjects(prev => [newProject, ...prev]);
    setShowNewProjectModal(false);
  };
  
  const handleLogout = () => {
    // In a real app, this would be handled by an auth context
    localStorage.removeItem("access_token");
    toast({ title: "Logged Out", description: "You have been successfully logged out." });
    navigate("/login");
  };

  const totalProjects = userProjects.length;
  const totalPages = Math.ceil(totalProjects / PROJECTS_PER_PAGE);
  const paginatedProjects = userProjects.slice((currentPage - 1) * PROJECTS_PER_PAGE, currentPage * PROJECTS_PER_PAGE);

  if (!userProfile) {
    // Render a loading state or skeleton screen while the profile is being fetched
    return <PageWrapper><div className="text-center py-20">Loading profile...</div></PageWrapper>;
  }

  return (
    <PageWrapper>
      <div className="container max-w-5xl mx-auto py-10 px-4">
        {loading && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <Loader2 className="animate-spin h-12 w-12 text-primary" />
          </div>
        )}
        <motion.div initial="hidden" animate="show" variants={containerVariants} className="space-y-10">
          
          <motion.section variants={itemVariants} className="bg-gradient-to-br from-blue-100/60 via-indigo-100/60 to-transparent dark:from-slate-900/80 dark:via-indigo-950/80 dark:to-transparent rounded-2xl shadow-xl p-8 flex flex-col md:flex-row items-center gap-8">
            <Avatar className="h-32 w-32 ring-4 ring-primary ring-offset-2 shadow-lg"><AvatarImage src={"/placeholder.svg"} alt={userProfile.full_name} /><AvatarFallback>{userProfile.full_name.slice(0, 2).toUpperCase()}</AvatarFallback></Avatar>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{userProfile.full_name}</h1>
              <p className="text-muted-foreground text-lg">@{userProfile.username}</p>
              <p className="text-sm mt-2 text-gray-600 dark:text-gray-300">Student at {userProfile.institution}</p>
            </div>
            <div className="flex flex-col gap-3"><Button variant="outline" onClick={() => setIsEditing(!isEditing)} className="flex items-center gap-2 hover:bg-primary/10 transition"><Edit className="h-5 w-5" /><span>{isEditing ? "Cancel" : "Edit Profile"}</span></Button><Button variant="outline" className="flex items-center gap-2 hover:bg-primary/10 transition"><Share className="h-5 w-5" /><span>Share</span></Button></div>
          </motion.section>
          
          <motion.section variants={itemVariants}>
            <h2 className="text-xl font-semibold mb-4">Dashboard</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatsCard title="Projects Submitted" value={userProjects.length} icon="📁" />
              <StatsCard title="Total Raised" value={userProjects.reduce((sum, p) => sum + p.current_amount, 0)} prefix="$" icon="💰" />
              <StatsCard title="Field of Study" value={userProfile.field_of_study} isText icon="📚" />
              <StatsCard title="Year of Study" value={userProfile.year_of_study} isText icon="📅" />
            </div>
          </motion.section>
          
          {isEditing && (
            <motion.section variants={itemVariants} className="bg-card rounded-2xl shadow-lg p-8" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
              <h2 className="text-xl font-semibold mb-6">Edit Profile</h2>
              <Form {...form}><form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8"><FormField control={form.control} name="full_name" render={({ field }) => (<FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="Your name" {...field} /></FormControl><FormMessage /></FormItem>)} /><div className="flex justify-end"><Button type="submit" className="w-full md:w-auto">Save Changes</Button></div></form></Form>
            </motion.section>
          )}

          <motion.section variants={itemVariants}>
            <div className="flex justify-between items-center mb-4"><h2 className="text-xl font-semibold">My Projects</h2><Button className="rounded-full px-6 py-2 shadow-md" onClick={() => setShowNewProjectModal(true)}>Create New Project</Button></div>
            {paginatedProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {paginatedProjects.map((project) => (<LocalProjectCard key={project.project_id} project={project} onView={() => setShowProjectDetails({ open: true, project })} />))}
              </div>
            ) : <div className="text-center py-10 bg-muted rounded-lg"><p>You haven't created any projects yet.</p></div>}
            {totalPages > 1 && (
              <div className="flex justify-center mt-6 gap-2">
                <Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>Prev</Button>
                {[...Array(totalPages)].map((_, idx) => (<Button key={idx} variant={currentPage === idx + 1 ? "default" : "outline"} size="sm" onClick={() => setCurrentPage(idx + 1)}>{idx + 1}</Button>))}
                <Button variant="outline" size="sm" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>Next</Button>
              </div>
            )}
          </motion.section>
          
          <motion.section variants={itemVariants} className="bg-card rounded-2xl shadow-lg p-8">
            <h2 className="text-xl font-semibold mb-6">Security & Account Info</h2>
            <div className="space-y-6"><div><h3 className="text-sm font-medium text-muted-foreground">Email Address</h3><p className="font-mono text-sm bg-muted p-2 rounded mt-1">{userProfile.email}</p></div><div className="pt-6 border-t"><Button variant="destructive" onClick={handleLogout} className="flex items-center gap-2 w-full md:w-auto"><LogOut className="h-5 w-5" /><span>Log out</span></Button></div></div>
          </motion.section>
        </motion.div>

        {showNewProjectModal && <NewProjectModal isOpen={showNewProjectModal} onClose={() => setShowNewProjectModal(false)} onProjectCreated={handleProjectCreated} />}
        {showProjectDetails.open && showProjectDetails.project && <ProjectDetailsModal isOpen={showProjectDetails.open} project={showProjectDetails.project} onClose={() => setShowProjectDetails({ open: false, project: null })} />}
      </div>
    </PageWrapper>
  );
};

const StatsCard = ({ title, value, icon, prefix = "", isText = false }: { title: string; value: number | string; icon: string; prefix?: string; isText?: boolean; }) => (
  <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium flex items-center gap-2"><span className="text-xl">{icon}</span>{title}</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{isText ? value : prefix + value.toLocaleString()}</div></CardContent></Card>
);

const LocalProjectCard = ({ project, onView }: { project: Project; onView: () => void; }) => {
  const percentFunded = project.target_amount > 0 ? (project.current_amount / project.target_amount) * 100 : 0;
  return (
    <Card className="overflow-hidden flex flex-col h-full"><div className="relative h-48"><img src={project.media_urls?.[0] || PLACEHOLDER_IMG} alt={project.title} className="w-full h-full object-cover" /><div className="absolute top-2 right-2"><Badge variant={project.status === "funded" || project.status === "completed" ? "default" : "secondary"}>{project.status}</Badge></div></div><CardHeader><CardTitle className="line-clamp-1">{project.title}</CardTitle><CardDescription className="line-clamp-2 min-h-[40px]">{project.description}</CardDescription></CardHeader><CardContent className="flex-grow space-y-2"><div><div className="flex justify-between text-sm"><span className="text-muted-foreground">Progress</span><span className="font-medium">${project.current_amount.toLocaleString()} / ${project.target_amount.toLocaleString()}</span></div><div className="h-2 bg-secondary rounded-full overflow-hidden mt-1"><div className="h-full bg-primary" style={{ width: `${Math.min(percentFunded, 100)}%` }}></div></div></div></CardContent><CardFooter><Button variant="secondary" className="w-full" onClick={onView}>View Details</Button></CardFooter></Card>
  );
};

export default Profile;