import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaChalkboardTeacher, FaUserGraduate, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../Store/auth";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalTeachers: 0,
    totalStudents: 0,
    totalClasses: 0,
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { logoutUser, token } = useAuth();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch("/api/admin/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error("Failed to fetch dashboard data");
        const data = await response.json();
        setStats({
          totalTeachers: data.totalTeachers,
          totalStudents: data.totalStudents,
          totalClasses: data.totalClasses,
        });
      } catch (error) {
        toast.error("Error loading dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token]);

  const handleLogout = () => {
    logoutUser();
    toast.success("Logged out successfully");
    navigate("/admin-login");
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <motion.div
        className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="flex items-center px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            <FaSignOutAlt className="mr-2" />
            Logout
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              title: "Total Teachers",
              value: stats.totalTeachers,
              icon: <FaChalkboardTeacher className="text-blue-500 text-2xl" />,
            },
            {
              title: "Total Students",
              value: stats.totalStudents,
              icon: <FaUserGraduate className="text-green-500 text-2xl" />,
            },
            {
              title: "Total Classes",
              value: stats.totalClasses,
              icon: <FaChalkboardTeacher className="text-purple-500 text-2xl" />,
            },
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-lg p-4 flex items-center space-x-4 border border-gray-200"
            >
              {stat.icon}
              <div>
                <h3 className="text-sm font-medium text-gray-600">{stat.title}</h3>
                <p className="text-xl font-semibold text-gray-800">
                  {loading ? "Loading..." : stat.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;