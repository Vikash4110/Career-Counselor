import React from 'react';
import { motion } from 'framer-motion';
import { 
  FaRobot,
  FaLightbulb,
  FaUserGraduate,
  FaChartLine,
  FaHandsHelping,
  FaCode
} from 'react-icons/fa';
import teamImage from '../assets/vecteezy_young-learners-enjoying-hands-on-programming-lessons_55545013.png'; 
import platformScreenshot from '../assets/vecteezy_magnificent-abstract-modern-classroom-with-students-and_57453370.png';
const AboutPage = () => {
  const stats = [
    { value: '10K+', label: 'Students Empowered', icon: <FaUserGraduate className="text-indigo-600 text-3xl" /> },
    { value: '5K+', label: 'Projects Recommended', icon: <FaCode className="text-indigo-600 text-3xl" /> },
    { value: '95%', label: 'Satisfaction Rate', icon: <FaChartLine className="text-indigo-600 text-3xl" /> },
    { value: '24/7', label: 'AI Support', icon: <FaRobot className="text-indigo-600 text-3xl" /> },
  ];

  const features = [
    {
      title: "AI-Powered Recommendations",
      description: "Our Gemini AI analyzes student profiles to suggest perfect projects matching their skills and interests.",
      icon: <FaRobot className="text-indigo-500 text-2xl" />
    },
    {
      title: "Personalized Learning Paths",
      description: "Each student gets a customized roadmap to develop their skills progressively.",
      icon: <FaLightbulb className="text-indigo-500 text-2xl" />
    },
    {
      title: "Skill Tracking",
      description: "Visual progress tracking helps students see their growth and stay motivated.",
      icon: <FaChartLine className="text-indigo-500 text-2xl" />
    }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-indigo-600 to-purple-500 text-white overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-t from-indigo-900 to-transparent"></div>
        </div>
        
        <div className="container mx-auto px-4 py-24 md:py-32 relative z-10">
          <motion.div 
            className="max-w-3xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
              Transforming Learning Through AI
            </h1>
            <p className="text-xl text-indigo-100 mb-8">
              We're revolutionizing education by providing personalized project recommendations that help students learn by building.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-indigo-600 font-semibold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all"
            >
              Discover Our Approach
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ staggerChildren: 0.1 }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="bg-white p-6 rounded-xl shadow-md text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              >
                <div className="flex justify-center mb-4">
                  {stat.icon}
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</h3>
                <p className="text-gray-600">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <motion.div 
              className="lg:w-1/2"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative rounded-xl overflow-hidden shadow-xl">
                <img 
                  src={teamImage} 
                  alt="Our team collaborating" 
                  className="w-full h-auto object-cover"
                />
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-indigo-100 rounded-full opacity-20 blur-xl"></div>
              </div>
            </motion.div>
            
            <motion.div 
              className="lg:w-1/2"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our <span className="text-indigo-600">Mission</span> to Transform Learning
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Founded in 2024 by educators and technologists, we recognized a critical gap in project-based learning. Students often struggle to find projects that match their skill level and interests.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                Our platform solves this by using AI to analyze each student's unique profile and recommend the perfect projects to accelerate their learning journey.
              </p>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="bg-indigo-600 text-white font-semibold py-3 px-8 rounded-lg hover:bg-indigo-700 transition-all shadow-md"
              >
                Meet Our Team
              </motion.button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-indigo-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <motion.div 
              className="lg:w-1/2 order-2 lg:order-1"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                How Our <span className="text-indigo-600">AI Works</span>
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Our platform uses Google's Gemini AI to analyze student profiles through an interactive chat interface.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-4">
                  <div className="bg-indigo-100 p-2 rounded-full mt-1">
                    <FaUserGraduate className="text-indigo-600" />
                  </div>
                  <span className="text-gray-700">Students complete a brief profile about their skills and interests</span>
                </li>
                <li className="flex items-start gap-4">
                  <div className="bg-indigo-100 p-2 rounded-full mt-1">
                    <FaRobot className="text-indigo-600" />
                  </div>
                  <span className="text-gray-700">Our AI analyzes this data through conversational interaction</span>
                </li>
                <li className="flex items-start gap-4">
                  <div className="bg-indigo-100 p-2 rounded-full mt-1">
                    <FaLightbulb className="text-indigo-600" />
                  </div>
                  <span className="text-gray-700">Personalized project recommendations are generated</span>
                </li>
                <li className="flex items-start gap-4">
                  <div className="bg-indigo-100 p-2 rounded-full mt-1">
                    <FaChartLine className="text-indigo-600" />
                  </div>
                  <span className="text-gray-700">Progress is tracked and new recommendations are made as skills develop</span>
                </li>
              </ul>
            </motion.div>
            
            <motion.div 
              className="lg:w-1/2 order-1 lg:order-2"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative rounded-xl overflow-hidden shadow-xl border-8 border-white">
                <img 
                  src={platformScreenshot} 
                  alt="Platform dashboard with AI chat" 
                  className="w-full h-auto object-cover"
                />
                {/* Floating chat bubble */}
                <div className="absolute bottom-8 left-8 bg-white p-4 rounded-xl shadow-lg max-w-xs animate-float border border-gray-200">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                      <FaRobot className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">Learning Assistant</div>
                      <div className="mt-1 text-sm text-gray-600">
                        Based on your interests in games and JavaScript skills, I recommend building a 2D platformer!
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Students <span className="text-indigo-600">Love Our Platform</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We combine advanced AI with educational best practices to create the perfect learning experience.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-gray-50 p-8 rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-100"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-indigo-100 p-3 rounded-full">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{feature.title}</h3>
                </div>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Discover Your Perfect Project?
            </h2>
            <p className="text-xl text-indigo-100 mb-8 max-w-3xl mx-auto">
              Join thousands of students accelerating their learning with our AI-powered recommendations.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-indigo-600 font-semibold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all"
              >
                Get Started for Free
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-transparent border-2 border-white text-white font-semibold py-3 px-8 rounded-lg hover:bg-white hover:bg-opacity-10 transition-all"
              >
                Try Demo
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;