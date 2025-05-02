// import React, { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import {
//   FaUserGraduate,
//   FaHome,
//   FaBook,
//   FaRobot,
//   FaEnvelope,
//   FaSignOutAlt,
//   FaSearch,
//   FaCheck,
//   FaUserEdit,
//   FaTasks,
// } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import { toast } from "sonner";
// import { useAuth } from "../Store/auth";

// const StudentDashboard = () => {
//   const [activeTab, setActiveTab] = useState("home");
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const navigate = useNavigate();
//   const { user, logoutUser, isLoading, authorizationToken, role, isLoggedIn, isLoggingOut } = useAuth();

//   useEffect(() => {
//     if (!isLoading && role !== "student" && isLoggedIn && !isLoggingOut) {
//       toast.error("Access denied. Students only.");
//       navigate("/student-login");
//     }
//   }, [isLoading, role, navigate, isLoggedIn, isLoggingOut]);

//   const NavItem = ({ icon, label, active, onClick }) => (
//     <motion.div whileHover={{ x: 3 }} whileTap={{ scale: 0.98 }}>
//       <button
//         onClick={onClick}
//         className={`flex items-center gap-3 w-full text-left p-3 rounded-lg transition-all duration-200 font-medium ${
//           active
//             ? "bg-blue-100 text-blue-700 font-semibold"
//             : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
//         }`}
//       >
//         <span className={`w-5 h-5 flex items-center justify-center ${active ? "text-blue-600" : "text-gray-500"}`}>
//           {icon}
//         </span>
//         {label}
//       </button>
//     </motion.div>
//   );

//   const StatCard = ({ icon, value, label, change, onClick }) => (
//     <motion.div
//       className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 cursor-pointer"
//       whileHover={{ y: -5 }}
//       whileTap={{ scale: 0.98 }}
//       onClick={onClick}
//     >
//       <div className="flex items-center justify-between">
//         <div>
//           <p className="text-2xl font-bold text-gray-800">{value}</p>
//           <p className="text-gray-600 text-sm">{label}</p>
//         </div>
//         <div className="p-3 rounded-lg bg-opacity-10 bg-blue-200">{icon}</div>
//       </div>
//       <p className={`text-xs mt-2 ${change.startsWith("+") ? "text-green-500" : "text-blue-500"}`}>{change}</p>
//     </motion.div>
//   );

//   const DashboardHome = ({ user, setActiveTab }) => {
//     const stats = [
//       {
//         icon: <FaBook className="text-blue-500" />,
//         value: "4",
//         label: "Active Projects",
//         change: "+1 new this week",
//         onClick: () => setActiveTab("projects"),
//       },
//       {
//         icon: <FaRobot className="text-purple-500" />,
//         value: "3",
//         label: "AI Recommendations",
//         change: "Updated today",
//         onClick: () => setActiveTab("chatbot"),
//       },
//       {
//         icon: <FaEnvelope className="text-green-500" />,
//         value: "2",
//         label: "Parent Updates",
//         change: "+1 new message",
//         onClick: () => setActiveTab("parent"),
//       },
//       {
//         icon: <FaUserEdit className="text-orange-500" />,
//         value: "1",
//         label: "Profile Actions",
//         change: "Update photo",
//         onClick: () => setActiveTab("profile"),
//       },
//     ];

//     return (
//       <div className="space-y-8">
//         {/* Welcome Card */}
//         <motion.div
//           className="bg-gradient-to-r from-blue-500 to-teal-500 rounded-xl shadow-lg p-6 text-white"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.1 }}
//         >
//           <div className="flex justify-between items-start">
//             <div>
//               <h2 className="text-2xl font-bold mb-2">Hello, {user?.childrenName || "Young Learner"}!</h2>
//               <p className="opacity-90 max-w-lg">
//                 Explore fun projects, chat with our AI helper, or check messages from your parents.
//               </p>
//             </div>
//             <div className="bg-white/20 p-3 rounded-lg">
//               <FaUserGraduate className="text-xl" />
//             </div>
//           </div>
//         </motion.div>

//         {/* Quick Stats */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//           {stats.map((stat, index) => (
//             <StatCard
//               key={index}
//               icon={stat.icon}
//               value={stat.value}
//               label={stat.label}
//               change={stat.change}
//               onClick={stat.onClick}
//             />
//           ))}
//         </div>

//         {/* Recent Activity */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
//           <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
//           <div className="space-y-4">
//             <div className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
//               <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
//                 <FaTasks />
//               </div>
//               <div className="flex-1">
//                 <h4 className="font-medium text-gray-800">New Project Added</h4>
//                 <p className="text-sm text-gray-600">"Build a Solar System Model" assigned</p>
//               </div>
//               <span className="text-xs text-gray-400 whitespace-nowrap">2 hours ago</span>
//             </div>
//             <div className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
//               <div className="p-2 rounded-lg bg-green-100 text-green-600">
//                 <FaCheck />
//               </div>
//               <div className="flex-1">
//                 <h4 className="font-medium text-gray-800">Parent Message Read</h4>
//                 <p className="text-sm text-gray-600">"Great job on your last project!"</p>
//               </div>
//               <span className="text-xs text-gray-400 whitespace-nowrap">Yesterday</span>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   const handleLogout = () => {
//     logoutUser();
//     toast.success("Logged out successfully");
//     navigate("/student-login");
//   };

//   const tabConfig = [
//     { id: "home", label: "Dashboard", icon: <FaHome className="w-4 h-4" /> },
//     { id: "projects", label: "Projects", icon: <FaTasks className="w-4 h-4" /> },
//     { id: "chatbot", label: "AI Helper", icon: <FaRobot className="w-4 h-4" /> },
//     { id: "parent", label: "Parent Updates", icon: <FaEnvelope className="w-4 h-4" /> },
//     { id: "profile", label: "Profile", icon: <FaUserEdit className="w-4 h-4" /> },
//   ];

//   const renderTabContent = () => {
//     switch (activeTab) {
//       case "home":
//         return <DashboardHome user={user} setActiveTab={setActiveTab} />;
//       case "projects":
//         return (
//           <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
//             <h3 className="text-xl font-semibold text-gray-800 mb-4">Your Projects</h3>
//             <p className="text-gray-600 mb-6">Explore fun and educational projects to spark your creativity!</p>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div className="p-4 bg-gray-50 rounded-lg">
//                 <h4 className="font-medium text-gray-800">Build a Solar System Model</h4>
//                 <p className="text-sm text-gray-600 mt-1">Learn about planets and create a 3D model.</p>
//                 <button className="mt-3 text-blue-600 hover:text-blue-700 text-sm font-medium">View Details</button>
//               </div>
//               <div className="p-4 bg-gray-50 rounded-lg">
//                 <h4 className="font-medium text-gray-800">Plant Growth Experiment</h4>
//                 <p className="text-sm text-gray-600 mt-1">Study how plants grow under different conditions.</p>
//                 <button className="mt-3 text-blue-600 hover:text-blue-700 text-sm font-medium">View Details</button>
//               </div>
//             </div>
//           </div>
//         );
//       case "chatbot":
//         return (
//           <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
//             <h3 className="text-xl font-semibold text-gray-800 mb-4">AI Helper</h3>
//             <p className="text-gray-600 mb-6">Ask our AI chatbot for project ideas or help with your studies!</p>
//             <div className="bg-gray-50 p-4 rounded-lg">
//               <p className="text-sm text-gray-700">Try asking: "Suggest a fun science project for kids!"</p>
//               <button className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
//                 Start Chatting
//               </button>
//             </div>
//           </div>
//         );
//       case "parent":
//         return (
//           <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
//             <h3 className="text-xl font-semibold text-gray-800 mb-4">Parent Updates</h3>
//             <p className="text-gray-600 mb-6">Stay connected with messages and updates from your parents.</p>
//             <div className="space-y-4">
//               <div className="p-4 bg-gray-50 rounded-lg">
//                 <h4 className="font-medium text-gray-800">Message from {user?.parentName || "Parent"}</h4>
//                 <p className="text-sm text-gray-600 mt-1">"Great job on your last project!"</p>
//                 <button className="mt-3 text-blue-600 hover:text-blue-700 text-sm font-medium">Reply</button>
//               </div>
//             </div>
//           </div>
//         );
//       case "profile":
//         return (
//           <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
//             <h3 className="text-xl font-semibold text-gray-800 mb-4">Your Profile</h3>
//             <p className="text-gray-600 mb-6">Update your details to keep your account current.</p>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Name</label>
//                 <p className="mt-1 text-gray-800">{user?.childrenName || "Not set"}</p>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Email</label>
//                 <p className="mt-1 text-gray-800">{user?.email || "Not set"}</p>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Parent Name</label>
//                 <p className="mt-1 text-gray-800">{user?.parentName || "Not set"}</p>
//               </div>
//             </div>
//             <button className="mt-6 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
//               Edit Profile
//             </button>
//           </div>
//         );
//       default:
//         return <DashboardHome user={user} setActiveTab={setActiveTab} />;
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center h-screen bg-gray-50">
//         <div className="animate-pulse flex flex-col items-center">
//           <div className="h-16 w-16 bg-blue-400 rounded-full mb-4"></div>
//           <div className="h-4 w-32 bg-gray-200 rounded"></div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex min-h-screen bg-gray-50">
//       {/* Mobile Menu Button */}
//       <button
//         className="md:hidden fixed top-4 left-4 z-50 bg-blue-600 text-white p-2 rounded-lg shadow-lg"
//         onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//       >
//         {isMobileMenuOpen ? "✕" : "☰"}
//       </button>

//       {/* Sidebar */}
//       <motion.aside
//         className={`w-64 bg-white shadow-lg p-6 flex flex-col justify-between fixed h-full border-r border-gray-200 z-20 transform ${
//           isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
//         } md:translate-x-0 transition-transform duration-300 ease-in-out`}
//         initial={{ x: -100, opacity: 0 }}
//         animate={{ x: 0, opacity: 1 }}
//         transition={{ duration: 0.5 }}
//       >
//         <div>
//           {/* Logo/Branding */}
//           <div className="mb-10 flex flex-col items-start">
//             <div className="flex items-center gap-3 mb-2">
//               <div className="bg-blue-600 p-2 rounded-lg">
//                 <FaUserGraduate className="text-white text-xl" />
//               </div>
//               <h2 className="text-2xl font-bold text-gray-800">EduKids</h2>
//             </div>
//             <p className="text-xs text-gray-500 bg-blue-50 px-2 py-1 rounded-full">Learning Dashboard</p>
//           </div>

//           {/* Navigation */}
//           <nav className="space-y-2">
//             {tabConfig.map((tab) => (
//               <NavItem
//                 key={tab.id}
//                 icon={tab.icon}
//                 label={tab.label}
//                 active={activeTab === tab.id}
//                 onClick={() => {
//                   setActiveTab(tab.id);
//                   setIsMobileMenuOpen(false);
//                 }}
//               />
//             ))}
//           </nav>
//         </div>

//         {/* Bottom Section */}
//         <div className="space-y-4">
//           <button
//             onClick={handleLogout}
//             className="flex items-center gap-3 w-full text-left p-3 rounded-lg transition-all duration-300 font-medium text-red-500 hover:bg-red-50"
//           >
//             <FaSignOutAlt className="w-4 h-4" /> Logout
//           </button>

//           {/* User Profile Mini */}
//           <div className="flex items-center gap-3 mt-6 p-3 bg-gray-50 rounded-lg">
//             <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
//               {user?.childrenName?.charAt(0) || "S"}
//             </div>
//             <span className="font-medium text-gray-700 text-sm">{user?.childrenName || "Student"}</span>
//           </div>
//         </div>
//       </motion.aside>

//       {/* Main Content */}
//       <main className="flex-1 md:ml-64">
//         {/* Top Navigation Bar */}
//         <div className="bg-white shadow-sm border-b border-gray-200 p-4 flex justify-between items-center sticky top-0 z-10">
//           <h1 className="text-2xl font-bold text-gray-800">
//             {tabConfig.find((tab) => tab.id === activeTab)?.label || "Dashboard"}
//           </h1>

//           <div className="flex items-center gap-4">
//             <div className="relative">
//               <input
//                 type="text"
//                 placeholder="Search projects..."
//                 className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
//               />
//               <FaSearch className="absolute left-3 top-3 text-gray-400" />
//             </div>

//             <div className="flex items-center gap-2">
//               <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
//                 {user?.childrenName?.charAt(0) || "S"}
//               </div>
//               <span className="font-medium text-gray-700 hidden md:inline">{user?.childrenName || "Student"}</span>
//             </div>
//           </div>
//         </div>

//         {/* Content Area */}
//         <div className="p-6">
//           {activeTab !== "home" && (
//             <div className="mb-6 flex items-center justify-between">
//               <div className="text-sm text-gray-500">
//                 Last updated: {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
//               </div>
//             </div>
//           )}

//           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
//             {renderTabContent()}
//           </motion.div>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default StudentDashboard;

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaUserGraduate,
  FaHome,
  FaBook,
  FaRobot,
  FaEnvelope,
  FaSignOutAlt,
  FaSearch,
  FaCheck,
  FaUserEdit,
  FaTasks,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../Store/auth";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user, logoutUser, isLoading, authorizationToken, role, isLoggedIn, isLoggingOut, setSubscribed } = useAuth();

  useEffect(() => {
    if (!isLoading && role !== "student" && isLoggedIn && !isLoggingOut) {
      toast.error("Access denied. Students only.");
      navigate("/student-login");
      return;
    }

    const fetchDashboardData = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/students/dashboard`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: authorizationToken,
          },
        });
        const data = await response.json();

        if (!response.ok) {
          if (data.status === 403) {
            setSubscribed(false);
            toast.error("Access denied: Please purchase a subscription.");
            navigate("/subscription");
            return;
          }
          if (data.status === 404) {
            toast.error("User not found. Please log in again.");
            logoutUser();
            navigate("/student-login");
            return;
          }
          throw new Error(data.extraDetails || data.message || "Failed to load dashboard");
        }

        setDashboardData(data.data);
        setSubscribed(true);
      } catch (error) {
        console.error("Dashboard fetch error:", error);
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (isLoggedIn && authorizationToken) {
      fetchDashboardData();
    } else if (!isLoading) {
      navigate("/student-login");
    }
  }, [isLoading, role, isLoggedIn, isLoggingOut, authorizationToken, navigate, logoutUser, setSubscribed]);

  const NavItem = ({ icon, label, active, onClick }) => (
    <motion.div whileHover={{ x: 3 }} whileTap={{ scale: 0.98 }}>
      <button
        onClick={onClick}
        className={`flex items-center gap-3 w-full text-left p-3 rounded-lg transition-all duration-200 font-medium ${
          active
            ? "bg-blue-100 text-blue-700 font-semibold"
            : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
        }`}
      >
        <span className={`w-5 h-5 flex items-center justify-center ${active ? "text-blue-600" : "text-gray-500"}`}>
          {icon}
        </span>
        {label}
      </button>
    </motion.div>
  );

  const StatCard = ({ icon, value, label, change, onClick }) => (
    <motion.div
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 cursor-pointer"
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
          <p className="text-gray-600 text-sm">{label}</p>
        </div>
        <div className="p-3 rounded-lg bg-opacity-10 bg-blue-200">{icon}</div>
      </div>
      <p className={`text-xs mt-2 ${change.startsWith("+") ? "text-green-500" : "text-blue-500"}`}>{change}</p>
    </motion.div>
  );

  const DashboardHome = ({ user, setActiveTab }) => {
    const stats = [
      {
        icon: <FaBook className="text-blue-500" />,
        value: "4",
        label: "Active Projects",
        change: "+1 new this week",
        onClick: () => setActiveTab("projects"),
      },
      {
        icon: <FaRobot className="text-purple-500" />,
        value: "3",
        label: "AI Recommendations",
        change: "Updated today",
        onClick: () => setActiveTab("chatbot"),
      },
      {
        icon: <FaEnvelope className="text-green-500" />,
        value: "2",
        label: "Parent Updates",
        change: "+1 new message",
        onClick: () => setActiveTab("parent"),
      },
      {
        icon: <FaUserEdit className="text-orange-500" />,
        value: "1",
        label: "Profile Actions",
        change: "Update photo",
        onClick: () => setActiveTab("profile"),
      },
    ];

    return (
      <div className="space-y-8">
        {/* Welcome Card */}
        <motion.div
          className="bg-gradient-to-r from-blue-500 to-teal-500 rounded-xl shadow-lg p-6 text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold mb-2">Hello, {user?.childrenName || "Young Learner"}!</h2>
              <p className="opacity-90 max-w-lg">
                Explore fun projects, chat with our AI helper, or check messages from your parents.
              </p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <FaUserGraduate className="text-xl" />
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              icon={stat.icon}
              value={stat.value}
              label={stat.label}
              change={stat.change}
              onClick={stat.onClick}
            />
          ))}
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                <FaTasks />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-800">New Project Added</h4>
                <p className="text-sm text-gray-600">"Build a Solar System Model" assigned</p>
              </div>
              <span className="text-xs text-gray-400 whitespace-nowrap">2 hours ago</span>
            </div>
            <div className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="p-2 rounded-lg bg-green-100 text-green-600">
                <FaCheck />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-800">Parent Message Read</h4>
                <p className="text-sm text-gray-600">"Great job on your last project!"</p>
              </div>
              <span className="text-xs text-gray-400 whitespace-nowrap">Yesterday</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const handleLogout = () => {
    logoutUser();
    toast.success("Logged out successfully");
    navigate("/student-login");
  };

  const tabConfig = [
    { id: "home", label: "Dashboard", icon: <FaHome className="w-4 h-4" /> },
    { id: "projects", label: "Projects", icon: <FaTasks className="w-4 h-4" /> },
    { id: "chatbot", label: "AI Helper", icon: <FaRobot className="w-4 h-4" /> },
    { id: "parent", label: "Parent Updates", icon: <FaEnvelope className="w-4 h-4" /> },
    { id: "profile", label: "Profile", icon: <FaUserEdit className="w-4 h-4" /> },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "home":
        return <DashboardHome user={dashboardData || user} setActiveTab={setActiveTab} />;
      case "projects":
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Your Projects</h3>
            <p className="text-gray-600 mb-6">Explore fun and educational projects to spark your creativity!</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-800">Build a Solar System Model</h4>
                <p className="text-sm text-gray-600 mt-1">Learn about planets and create a 3D model.</p>
                <button className="mt-3 text-blue-600 hover:text-blue-700 text-sm font-medium">View Details</button>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-800">Plant Growth Experiment</h4>
                <p className="text-sm text-gray-600 mt-1">Study how plants grow under different conditions.</p>
                <button className="mt-3 text-blue-600 hover:text-blue-700 text-sm font-medium">View Details</button>
              </div>
            </div>
          </div>
        );
      case "chatbot":
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">AI Helper</h3>
            <p className="text-gray-600 mb-6">Ask our AI chatbot for project ideas or help with your studies!</p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-700">Try asking: "Suggest a fun science project for kids!"</p>
              <button className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                Start Chatting
              </button>
            </div>
          </div>
        );
      case "parent":
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Parent Updates</h3>
            <p className="text-gray-600 mb-6">Stay connected with messages and updates from your parents.</p>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-800">Message from {dashboardData?.parentName || user?.parentName || "Parent"}</h4>
                <p className="text-sm text-gray-600 mt-1">"Great job on your last project!"</p>
                <button className="mt-3 text-blue-600 hover:text-blue-700 text-sm font-medium">Reply</button>
              </div>
            </div>
          </div>
        );
      case "profile":
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Your Profile</h3>
            <p className="text-gray-600 mb-6">Update your details to keep your account current.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <p className="mt-1 text-gray-800">{dashboardData?.childrenName || user?.childrenName || "Not set"}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="mt-1 text-gray-800">{dashboardData?.email || user?.email || "Not set"}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Parent Name</label>
                <p className="mt-1 text-gray-800">{dashboardData?.parentName || user?.parentName || "Not set"}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Subscription End Date</label>
                <p className="mt-1 text-gray-800">
                  {dashboardData?.subscriptionEndDate
                    ? new Date(dashboardData.subscriptionEndDate).toLocaleDateString()
                    : "Not subscribed"}
                </p>
              </div>
            </div>
            <button className="mt-6 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
              Edit Profile
            </button>
          </div>
        );
      default:
        return <DashboardHome user={dashboardData || user} setActiveTab={setActiveTab} />;
    }
  };

  if (loading || isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-16 w-16 bg-blue-400 rounded-full mb-4"></div>
          <div className="h-4 w-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return null; // Redirects handled in useEffect
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile Menu Button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-blue-600 text-white p-2 rounded-lg shadow-lg"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? "✕" : "☰"}
      </button>

      {/* Sidebar */}
      <motion.aside
        className={`w-64 bg-white shadow-lg p-6 flex flex-col justify-between fixed h-full border-r border-gray-200 z-20 transform ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 ease-in-out`}
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          {/* Logo/Branding */}
          <div className="mb-10 flex flex-col items-start">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-blue-600 p-2 rounded-lg">
                <FaUserGraduate className="text-white text-xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">EduKids</h2>
            </div>
            <p className="text-xs text-gray-500 bg-blue-50 px-2 py-1 rounded-full">Learning Dashboard</p>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            {tabConfig.map((tab) => (
              <NavItem
                key={tab.id}
                icon={tab.icon}
                label={tab.label}
                active={activeTab === tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setIsMobileMenuOpen(false);
                }}
              />
            ))}
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="space-y-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full text-left p-3 rounded-lg transition-all duration-300 font-medium text-red-500 hover:bg-red-50"
          >
            <FaSignOutAlt className="w-4 h-4" /> Logout
          </button>

          {/* User Profile Mini */}
          <div className="flex items-center gap-3 mt-6 p-3 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
              {dashboardData?.childrenName?.charAt(0) || "S"}
            </div>
            <span className="font-medium text-gray-700 text-sm">{dashboardData?.childrenName || "Student"}</span>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64">
        {/* Top Navigation Bar */}
        <div className="bg-white shadow-sm border-b border-gray-200 p-4 flex justify-between items-center sticky top-0 z-10">
          <h1 className="text-2xl font-bold text-gray-800">
            {tabConfig.find((tab) => tab.id === activeTab)?.label || "Dashboard"}
          </h1>

          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search projects..."
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                {dashboardData?.childrenName?.charAt(0) || "S"}
              </div>
              <span className="font-medium text-gray-700 hidden md:inline">{dashboardData?.childrenName || "Student"}</span>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6">
          {activeTab !== "home" && (
            <div className="mb-6 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Last updated: {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
              </div>
            </div>
          )}

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            {renderTabContent()}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;