
import { useState } from "react";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { UploadCloud, Loader } from "lucide-react";
import { toast } from "sonner";
import type { Project } from "../pages/Projects";


interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectCreated: (project: Project) => void;
}

const NewProjectModal = ({ isOpen, onClose, onProjectCreated }: NewProjectModalProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [fundingGoal, setFundingGoal] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description || !category || !fundingGoal) {
      toast.error("Please fill all required fields");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error("You need to be logged in");
        setIsSubmitting(false);
        return;
      }
      
      // For file upload, you would typically:
      // 1. Upload the image to your server/storage
      // 2. Get the URL of the uploaded image
      // 3. Include that URL in the project creation request
      
      // Simulating file upload
      let mediaUrl = "https://picsum.photos/seed/new/600/400";
      
      // Create a new project
      const projectData = {
        title,
        description,
        category,
        status: "pending",
        fundingGoal: parseFloat(fundingGoal),
        mediaUrls: [mediaUrl]
      };
      
      // For development purposes, we'll skip the actual API call and simulate a response
      // In production, uncomment the fetch call below
      
      /*
      const response = await fetch('http://studybae.online:8000/api/auth/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(projectData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to create project');
      }
      
      const data = await response.json();
      onProjectCreated(data.project);
      */
      
      // Mock response
      setTimeout(() => {
        const mockProject: Project = {
          id: `new-${Date.now()}`,
          studentId: 'current-user-id',
          title,
          description,
          category,
          status: "pending",
          fundingGoal: parseFloat(fundingGoal),
          currentFunding: 0,
          mediaUrls: [imagePreview || mediaUrl],
          createdAt: new Date().toISOString(),
          studentName: "You",
          university: "Your University",
        };
        
        onProjectCreated(mockProject);
        setIsSubmitting(false);
        onClose();
        
        // Reset form
        setTitle("");
        setDescription("");
        setCategory("");
        setFundingGoal("");
        setImageFile(null);
        setImagePreview(null);
      }, 1500);
      
    } catch (error) {
      console.error("Error creating project:", error);
      toast.error("Failed to create project");
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg backdrop-blur-lg bg-white/95 dark:bg-gray-900/95 border border-gray-200 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Create New Project</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Project Title</Label>
            <Input 
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter project title"
              className="rounded-md"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your project"
              className="rounded-md min-h-[100px]"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger className="rounded-md">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Technology">Technology</SelectItem>
                  <SelectItem value="Medical">Medical</SelectItem>
                  <SelectItem value="Education">Education</SelectItem>
                  <SelectItem value="Business">Business</SelectItem>
                  <SelectItem value="Environment">Environment</SelectItem>
                  <SelectItem value="Arts">Arts</SelectItem>
                  <SelectItem value="Social">Social</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="fundingGoal">Funding Goal ($)</Label>
              <Input 
                id="fundingGoal"
                type="number"
                value={fundingGoal}
                onChange={(e) => setFundingGoal(e.target.value)}
                placeholder="1000"
                className="rounded-md"
                min="1"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Project Image</Label>
            <div className="border-2 border-dashed rounded-lg p-4 border-gray-300 dark:border-gray-700">
              {imagePreview ? (
                <div className="relative">
                  <img 
                    src={imagePreview} 
                    alt="Project preview" 
                    className="mx-auto max-h-[200px] rounded-md"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview(null);
                    }}
                    className="absolute top-2 right-2 bg-white dark:bg-gray-800"
                  >
                    Change
                  </Button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center h-40 cursor-pointer">
                  <UploadCloud className="h-10 w-10 text-gray-400 mb-2" />
                  <span className="text-gray-600 dark:text-gray-400">Click to upload image</span>
                  <span className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</span>
                  <input 
                    type="file" 
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              )}
            </div>
          </div>
          
          <div className="flex justify-end space-x-4 pt-4">
            <Button 
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Project"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewProjectModal;
