import { motion } from "framer-motion";
import { ArrowRight, Heart, Rocket } from "lucide-react";
import { useEffect } from "react";
import PageWrapper from "../components/PageWrapper";
import ProjectCard from "../components/ProjectCard";
import { Button } from "../components/ui/button";
import { useLoading } from "../context/LoadingContext";
import { useToast } from "../hooks/use-toast";

export default function Index() {
  const { setLoading } = useLoading();
  const { toast } = useToast();

  useEffect(() => {
    // Simulate loading
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false); // Stop loading after 2 seconds
    }, 2000);

    return () => clearTimeout(timer); // Cleanup timer
  }, [setLoading]);

  const showNotification = (action: string) => {
    toast({
      title: `${action} clicked!`,
      description: "This feature will be available soon.",
      duration: 3000,
    });
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <PageWrapper>
      {/* Background pattern overlay */}
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-blue-50 to-white opacity-70">
        <div className="absolute inset-0" style={{ 
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231e40af' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          backgroundSize: "60px 60px"
        }}></div>
      </div>

      {/* Hero Section with blue/black color scheme */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-900 via-blue-700 to-blue-500 text-white py-24 px-6 text-center w-full shadow-xl">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMjk4LjUgNTAwQzE0OS43MTQgNTAwIDI4LjU3MTQgMzg5Ljc4NiAyOC41NzE0IDI1MFMxNDkuNzE0IDAgMjk4LjUgMCA1NjguNDI5IDExMC4yMTQgNTY4LjQyOSAyNTAgNDQ3LjI4NiA1MDAgMjk4LjUgNTAweiIgZmlsbC1ydWxlPSJldmVub2RkIiBvcGFjaXR5PSIuMDUiIGZpbGw9IiNGRkYiLz48L3N2Zz4=')] bg-repeat opacity-10 mix-blend-overlay"></div>
        
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="relative z-10 max-w-4xl mx-auto"
        >
          <motion.h1 
            variants={itemVariants}
            className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200"
          >
            DSFS - Decentralized Students Funding System
          </motion.h1>
          
          <motion.p 
            variants={itemVariants}
            className="text-xl md:text-2xl mb-8 font-light"
          >
            Revolutionizing Donations.
          </motion.p>
          
          <motion.p 
            variants={itemVariants}
            className="max-w-3xl mx-auto text-base md:text-lg mb-10 leading-relaxed font-light"
          >
            We're building a digital donation platform to support impactful causes across the ecosystem. 
            DSFS empowers students, communities, and techies by connecting donors to transparent and 
            verifiable causes through blockchain and modern digital solutions.
          </motion.p>
          
          <motion.div 
            variants={itemVariants}
            className="flex flex-wrap justify-center gap-4"
          >
            <Button 
              onClick={() => showNotification("Join Us")}
              className="bg-white text-blue-700 hover:bg-gray-100 hover:text-blue-800 font-medium px-8 py-2.5 rounded-full transform transition-all duration-300 hover:scale-105 shadow-lg"
            >
              Join Us <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            
            <Button 
              onClick={() => showNotification("Explore Projects")}
              className="bg-blue-800 bg-opacity-60 backdrop-blur-sm text-white hover:bg-blue-900 font-medium px-8 py-2.5 rounded-full transform transition-all duration-300 hover:scale-105 shadow-lg"
            >
              <Rocket className="mr-2 h-4 w-4" /> Explore Projects
            </Button>
            
            <Button 
              onClick={() => showNotification("Donate")}
              className="bg-black bg-opacity-60 backdrop-blur-sm text-white hover:bg-black font-medium px-8 py-2.5 rounded-full transform transition-all duration-300 hover:scale-105 shadow-lg"
            >
              <Heart className="mr-2 h-4 w-4" /> Donate
            </Button>
          </motion.div>
        </motion.div>
        
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-6"
        >
          <Button 
            onClick={() => console.log("Learn More clicked")}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Learn More
          </Button>
        </motion.div>
        
        {/* Decorative elements */}
        <div className="hidden md:block absolute bottom-0 left-0 w-full overflow-hidden">
          <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-16 text-white fill-current opacity-20">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
          </svg>
        </div>
      </section>

      {/* About/Mission Section with parallax effect */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="py-20 px-6 bg-white text-gray-800 relative z-10 shadow-md"
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2 
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-6 relative inline-block"
          >
            Our Mission
            <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-blue-600 rounded-full"></span>
          </motion.h2>
          
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-lg md:text-xl mb-10 leading-relaxed"
          >
            DSFS is an open-source platform built to create a transparent and impactful ecosystem for donations. 
            By leveraging blockchain and community-driven solutions, we aim to empower students and communities 
            to achieve their goals with trust and accountability.
          </motion.p>
          
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative rounded-xl overflow-hidden shadow-2xl"
          >
            <img
              src="https://undraw.co/api/illustrations/random"
              alt="Mission Illustration"
              className="w-full max-w-md mx-auto rounded-xl hover:transform hover:scale-105 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent pointer-events-none"></div>
          </motion.div>
        </div>
      </motion.section>

      {/* Featured Projects Section with card animations */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-20 px-6 bg-gradient-to-b from-white to-gray-50 relative z-10"
      >
        <div className="max-w-6xl mx-auto text-center">
          <motion.h2 
            initial={{ y: -20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-center mb-4 relative inline-block mx-auto"
          >
            Featured Projects
            <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-40 h-1 bg-yellow-600 rounded-full"></span>
          </motion.h2>
          
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-center text-gray-600 mb-12 max-w-2xl mx-auto"
          >
            Discover innovative initiatives that are making a real difference in the educational landscape.
          </motion.p>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            <motion.div variants={itemVariants}>
              <ProjectCard
                name="Project A"
                description="A blockchain-based scholarship program."
                buttonText="View"
                rating={4.5}
                student={{
                  name: "Alex Johnson",
                  degree: "Computer Science",
                  university: "MIT"
                }}
              />
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <ProjectCard
                name="Project B"
                description="Empowering underprivileged students with tech."
                buttonText="View"
                rating={3.8}
                student={{
                  name: "Sarah Williams",
                  degree: "Educational Technology",
                  university: "Stanford"
                }}
              />
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <ProjectCard
                name="Project C"
                description="Building sustainable education systems."
                buttonText="View"
                rating={5}
                student={{
                  name: "Michael Chen",
                  degree: "Social Innovation",
                  university: "Harvard"
                }}
              />
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <ProjectCard
                name="Project D"
                description="Connecting donors to impactful causes."
                buttonText="View"
                rating={4.2}
                student={{
                  name: "Priya Sharma",
                  degree: "Finance",
                  university: "Columbia"
                }}
              />
            </motion.div>
          </motion.div>
        </div>
      </motion.section>
    </PageWrapper>
  );
}
