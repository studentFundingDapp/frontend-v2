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
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  return (
    <PageWrapper>
      {/* Background pattern overlay */}
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-blue-50 to-white opacity-70">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231e40af' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
            backgroundSize: "60px 60px",
          }}
        ></div>
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
            We're building a digital donation platform to support impactful
            causes across the ecosystem. DSFS empowers students, communities,
            and techies by connecting donors to transparent and verifiable
            causes through blockchain and modern digital solutions.
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
      </section>

      {/* Mission Section */}
      <section className="py-20 px-6 bg-white relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: {
                duration: 0.6,
                staggerChildren: 0.2,
              },
            },
          }}
          className="max-w-6xl mx-auto text-center"
        >
          <motion.h2
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            className="text-4xl font-extrabold text-gray-900"
          >
            Our Mission
          </motion.h2>
          <motion.p
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            className="text-lg text-gray-600 mt-4"
          >
            Empowering students and communities through transparent and verifiable funding solutions.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.2,
              },
            },
          }}
          className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {/* Mission Card 1 */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            className="bg-gray-100 rounded-lg shadow-md p-6 text-center"
          >
            <div className="flex justify-center items-center w-16 h-16 mx-auto bg-blue-600 text-white rounded-full mb-4">
              🎓
            </div>
            <h3 className="text-xl font-semibold text-gray-800">
              Education for All
            </h3>
            <p className="text-gray-600 mt-2">
              Providing access to quality education for students in underserved communities.
            </p>
          </motion.div>

          {/* Mission Card 2 */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            className="bg-gray-100 rounded-lg shadow-md p-6 text-center"
          >
            <div className="flex justify-center items-center w-16 h-16 mx-auto bg-blue-600 text-white rounded-full mb-4">
              🌍
            </div>
            <h3 className="text-xl font-semibold text-gray-800">
              Global Impact
            </h3>
            <p className="text-gray-600 mt-2">
              Connecting donors worldwide to causes that create meaningful change.
            </p>
          </motion.div>

          {/* Mission Card 3 */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            className="bg-gray-100 rounded-lg shadow-md p-6 text-center"
          >
            <div className="flex justify-center items-center w-16 h-16 mx-auto bg-blue-600 text-white rounded-full mb-4">
              🔗
            </div>
            <h3 className="text-xl font-semibold text-gray-800">
              Blockchain Transparency
            </h3>
            <p className="text-gray-600 mt-2">
              Leveraging blockchain technology to ensure transparency and trust in funding.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* Additional Project Section */}
      <section className="py-20 px-6 bg-gray-100 relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: {
                duration: 0.6,
                staggerChildren: 0.2,
              },
            },
          }}
          className="max-w-6xl mx-auto text-center mb-12"
        >
          <motion.h2
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            className="text-4xl font-extrabold text-gray-900"
          >
            Featured Projects
            <span className="block mx-auto mt-2 w-44 h-1 bg-blue-600 rounded"></span>
          </motion.h2>
          <motion.p
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            className="text-lg text-gray-600 mt-4"
          >
            Explore innovative initiatives that are making a real difference in the educational landscape.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.2,
              },
            },
          }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-items-center gap-4 mx-auto z-10"
        >
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <ProjectCard
              avatarUrl="public/profile.jpg"
              projectName="Blockchain Scholarship Program"
              username="John Doe"
              timestamp="2 hours ago"
              location="New York, USA"
              imageUrl="public/project3.jpg"
              description="A blockchain-based scholarship program to empower students."
              tags={["blockchain", "education", "scholarship"]}
              likesCount={120}
              comments={[
                { user: "Alice", text: "Great initiative!" },
                { user: "Bob", text: "How can I contribute?" },
              ]}
            />
          </motion.div>
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <ProjectCard
              avatarUrl="public/profile.jpg"
              projectName="Tech for Good"
              username="Jane Smith"
              timestamp="1 day ago"
              location="San Francisco, USA"
              imageUrl="public/project3.jpg"
              description="Leveraging technology to create sustainable solutions for underprivileged communities."
              tags={["technology", "sustainability", "community"]}
              likesCount={95}
              comments={[
                { user: "Charlie", text: "This is amazing!" },
                { user: "Diana", text: "How can I support this?" },
              ]}
            />
          </motion.div>
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <ProjectCard
              avatarUrl="public/profile.jpg"
              projectName="Education for All"
              username="Michael Lee"
              timestamp="3 days ago"
              location="London, UK"
              imageUrl="public/project3.jpg"
              description="Providing access to quality education for children in remote areas."
              tags={["education", "accessibility", "children"]}
              likesCount={150}
              comments={[
                { user: "Eve", text: "Such a noble cause!" },
                { user: "Frank", text: "Count me in!" },
              ]}
            />
          </motion.div>
        </motion.div>
      </section>
    </PageWrapper>
  );
}
