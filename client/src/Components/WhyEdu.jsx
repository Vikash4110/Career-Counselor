import React from 'react';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaUsers, FaClock, FaRocket } from 'react-icons/fa';
import timetableImg from '../assets/vecteezy_magnificent-abstract-modern-classroom-with-students-and_57453370.png'; // Placeholder for new image

const WhyTimetableGenerator = () => {
  const pillars = [
    {
      icon: <FaCalendarAlt className="text-indigo-600 text-3xl" />,
      title: "Conflict-Free Schedules",
      description: "Automatically generate timetables that eliminate clashes for faculty, students, and rooms."
    },
    {
      icon: <FaUsers className="text-indigo-600 text-3xl" />,
      title: "Stakeholder Satisfaction",
      description: "Ensure faculty availability and student preferences are met with optimized schedules."
    },
    {
      icon: <FaClock className="text-indigo-600 text-3xl" />,
      title: "Time Efficiency",
      description: "Save hours of manual planning with intelligent automation powered by Genetic Algorithms."
    },
    {
      icon: <FaRocket className="text-indigo-600 text-3xl" />,
      title: "Scalable Solution",
      description: "Adaptable to universities of all sizes, from small colleges to large campuses."
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why <span className="text-indigo-600">Intelligent Timetabling</span> Matters
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Automated scheduling isn't just convenient—it's the key to efficient resource management and academic success in universities.
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <motion.div 
            className="lg:w-1/2"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative rounded-xl overflow-hidden shadow-2xl">
              <img 
                src={timetableImg} 
                alt="University timetable interface" 
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/30 to-transparent"></div>
            </div>
          </motion.div>

          <motion.div 
            className="lg:w-1/2"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {pillars.map((pillar, index) => (
                <motion.div
                  key={index}
                  className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-indigo-100 p-3 rounded-full">
                      {pillar.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{pillar.title}</h3>
                  </div>
                  <p className="text-gray-600">{pillar.description}</p>
                </motion.div>
              ))}
            </div>

            <motion.div 
              className="mt-12 bg-indigo-50 p-6 rounded-xl border-l-4 border-indigo-600"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <p className="text-lg text-gray-800">
                "Our platform empowers universities to create optimized timetables effortlessly, ensuring seamless coordination for faculty, students, and administrators."
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default WhyTimetableGenerator;