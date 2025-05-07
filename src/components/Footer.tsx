// src/components/Footer.tsx
import { motion } from "framer-motion";

const Footer: React.FC = () => {
  return (
    <motion.footer
      className="bg-gray-900 text-white py-6 w-full relative z-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 px-4">
        {/* Links */}
        <div className="flex flex-wrap justify-center md:justify-start gap-4">
          <a
            href="/privacy"
            className="text-gray-300 hover:text-blue-500 transition duration-300"
          >
            Privacy
          </a>
          <a
            href="/terms"
            className="text-gray-300 hover:text-blue-500 transition duration-300"
          >
            Terms
          </a>
          <a
            href="/contact"
            className="text-gray-300 hover:text-blue-500 transition duration-300"
          >
            Contact
          </a>
          <a
            href="https://github.com/your-github"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-300 hover:text-blue-500 transition duration-300"
          >
            GitHub
          </a>
        </div>

        {/* Copyright */}
        <div className="text-sm text-gray-400 text-center md:text-right">
          &copy; {new Date().getFullYear()} DSFS. All rights reserved.
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
