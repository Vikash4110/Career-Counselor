import React from 'react';
import { motion } from 'framer-motion';
import { 
  FaRobot,
  FaLightbulb,
  FaProjectDiagram,
  FaUserGraduate,
  FaPhone,
  FaEnvelope,
  FaArrowRight,
  FaMapMarkerAlt,
  FaGithub,
  FaTwitter,
  FaLinkedin,
  FaDiscord
} from 'react-icons/fa';

const Footer = () => {
  const footerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const linkVariants = {
    hover: {
      y: -3,
      color: '#6366f1', // indigo-500
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    }
  };

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-800 text-gray-300 pt-20 pb-10">
      <div className="container mx-auto px-4 max-w-7xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={footerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16"
        >
          {/* Platform Description */}
          <motion.div variants={itemVariants} className="space-y-6">
            <div className="flex items-center gap-3">
              <FaRobot className="text-indigo-500 text-3xl" />
              
              <h3 className="text-2xl font-bold text-white">CareerCounsellor</h3>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Empowering students with AI-curated learning paths and personalized project recommendations to accelerate skill development.
            </p>
            <div className="flex space-x-5 pt-2">
              <motion.a 
                href="#" 
                whileHover={{ y: -3, color: '#6366f1' }}
                className="text-gray-400 hover:text-indigo-500 transition-colors"
                aria-label="GitHub"
              >
                <FaGithub className="text-xl" />
              </motion.a>
              <motion.a 
                href="#" 
                whileHover={{ y: -3, color: '#6366f1' }}
                className="text-gray-400 hover:text-indigo-500 transition-colors"
                aria-label="Twitter"
              >
                <FaTwitter className="text-xl" />
              </motion.a>
              <motion.a 
                href="#" 
                whileHover={{ y: -3, color: '#6366f1' }}
                className="text-gray-400 hover:text-indigo-500 transition-colors"
                aria-label="LinkedIn"
              >
                <FaLinkedin className="text-xl" />
              </motion.a>
              <motion.a 
                href="#" 
                whileHover={{ y: -3, color: '#6366f1' }}
                className="text-gray-400 hover:text-indigo-500 transition-colors"
                aria-label="Discord"
              >
                <FaDiscord className="text-xl" />
              </motion.a>
            </div>
          </motion.div>

          {/* Learning Paths */}
          <motion.div variants={itemVariants}>
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
              <FaLightbulb className="text-indigo-500" />
              Learning Paths
            </h3>
            <ul className="space-y-4">
              <motion.li variants={linkVariants} whileHover="hover">
                <a href="#" className="flex items-center gap-3 text-gray-400 hover:text-indigo-500 transition-colors">
                  <FaArrowRight className="text-xs opacity-70" />
                  Web Development
                </a>
              </motion.li>
              <motion.li variants={linkVariants} whileHover="hover">
                <a href="#" className="flex items-center gap-3 text-gray-400 hover:text-indigo-500 transition-colors">
                  <FaArrowRight className="text-xs opacity-70" />
                  Data Science
                </a>
              </motion.li>
              <motion.li variants={linkVariants} whileHover="hover">
                <a href="#" className="flex items-center gap-3 text-gray-400 hover:text-indigo-500 transition-colors">
                  <FaArrowRight className="text-xs opacity-70" />
                  Mobile Apps
                </a>
              </motion.li>
              <motion.li variants={linkVariants} whileHover="hover">
                <a href="#" className="flex items-center gap-3 text-gray-400 hover:text-indigo-500 transition-colors">
                  <FaArrowRight className="text-xs opacity-70" />
                  Game Development
                </a>
              </motion.li>
              <motion.li variants={linkVariants} whileHover="hover">
                <a href="#" className="flex items-center gap-3 text-gray-400 hover:text-indigo-500 transition-colors">
                  <FaArrowRight className="text-xs opacity-70" />
                  AI & Machine Learning
                </a>
              </motion.li>
            </ul>
          </motion.div>

          {/* Resources */}
          <motion.div variants={itemVariants}>
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
              <FaProjectDiagram className="text-indigo-500" />
              Resources
            </h3>
            <ul className="space-y-4">
              <motion.li variants={linkVariants} whileHover="hover">
                <a href="#" className="flex items-center gap-3 text-gray-400 hover:text-indigo-500 transition-colors">
                  <FaArrowRight className="text-xs opacity-70" />
                  Project Templates
                </a>
              </motion.li>
              <motion.li variants={linkVariants} whileHover="hover">
                <a href="#" className="flex items-center gap-3 text-gray-400 hover:text-indigo-500 transition-colors">
                  <FaArrowRight className="text-xs opacity-70" />
                  Learning Guides
                </a>
              </motion.li>
              <motion.li variants={linkVariants} whileHover="hover">
                <a href="#" className="flex items-center gap-3 text-gray-400 hover:text-indigo-500 transition-colors">
                  <FaArrowRight className="text-xs opacity-70" />
                  AI Assistant Docs
                </a>
              </motion.li>
              <motion.li variants={linkVariants} whileHover="hover">
                <a href="#" className="flex items-center gap-3 text-gray-400 hover:text-indigo-500 transition-colors">
                  <FaArrowRight className="text-xs opacity-70" />
                  Community Projects
                </a>
              </motion.li>
              <motion.li variants={linkVariants} whileHover="hover">
                <a href="#" className="flex items-center gap-3 text-gray-400 hover:text-indigo-500 transition-colors">
                  <FaArrowRight className="text-xs opacity-70" />
                  Educator Resources
                </a>
              </motion.li>
            </ul>
          </motion.div>

          {/* Contact & Newsletter */}
          <motion.div variants={itemVariants} className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <FaUserGraduate className="text-indigo-500" />
                Contact Us
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <FaMapMarkerAlt className="text-indigo-500 mt-1 flex-shrink-0" />
                  <span className="text-gray-400">123 Learning Lane, Tech City, TC 10101</span>
                </li>
                <li className="flex items-center gap-3">
                  <FaPhone className="text-indigo-500" />
                  <span className="text-gray-400">+1 (555) 123-4567</span>
                </li>
                <li className="flex items-center gap-3">
                  <FaEnvelope className="text-indigo-500" />
                  <span className="text-gray-400">hello@learnwithai.com</span>
                </li>
              </ul>
            </div>

            <div className="pt-4">
              <h4 className="text-lg font-medium text-white mb-3">Subscribe to Updates</h4>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="px-4 py-2 w-full rounded-l-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-r-lg transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Copyright & Bottom Links */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center"
        >
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} LearnWithAI. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            <motion.a 
              href="#" 
              whileHover={{ y: -2, color: '#6366f1' }}
              className="text-gray-500 hover:text-indigo-500 text-sm transition-colors"
            >
              Privacy Policy
            </motion.a>
            <motion.a 
              href="#" 
              whileHover={{ y: -2, color: '#6366f1' }}
              className="text-gray-500 hover:text-indigo-500 text-sm transition-colors"
            >
              Terms of Service
            </motion.a>
            <motion.a 
              href="#" 
              whileHover={{ y: -2, color: '#6366f1' }}
              className="text-gray-500 hover:text-indigo-500 text-sm transition-colors"
            >
              Cookie Policy
            </motion.a>
            <motion.a 
              href="#" 
              whileHover={{ y: -2, color: '#6366f1' }}
              className="text-gray-500 hover:text-indigo-500 text-sm transition-colors"
            >
              GDPR
            </motion.a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;