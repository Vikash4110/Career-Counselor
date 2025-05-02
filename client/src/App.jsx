import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom"; // Added Navigate
import { AuthProvider } from "./Store/auth";
import Home from "./Pages/Home";
import Navbar from "./Components/Navbar";
import Loader from "./Components/Loader";
import NotFoundPage from "./Pages/NotFoundPage";
import TeacherLogin from "./Pages/TeacherLogin";
import TeacherRegister from "./Pages/TeacherRegister";
import StudentLogin from "./Pages/StudentLogin";
import StudentRegister from "./Pages/StudentRegister";
import AdminLogin from "./Pages/AdminLogin";
import AdminRegister from "./Pages/AdminRegister";
import AdminDashboard from "./Pages/AdminDashboard";
import StudentDashboard from "./Pages/StudentDashboard";
import TeacherDashboard from "./Pages/TeacherDashboard";
import TeacherProfile from "./Pages/TeacherProfile";
import About from "./Pages/About";
import Contact from "./Pages/Contact";
import SubscriptionPage from "./Pages/SubscriptionPage";
import StudentProfile from "./Components/StudentProfile";
import StudentProject from './Pages/StudentProject'
import { useAuth } from "./Store/auth";

function App() {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const hasLoaded = sessionStorage.getItem("hasLoaded");

    if (!hasLoaded) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
        sessionStorage.setItem("hasLoaded", "true");
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, []);

  // ProtectedRoute component
  const ProtectedRoute = ({ children, allowedRole }) => {
    const { isLoggedIn, role } = useAuth();
    if (!isLoggedIn || (allowedRole && role !== allowedRole)) {
      return <Navigate to="/student-login" replace />;
    }
    return children;
  };

  return (
    <AuthProvider>
      {isLoading && <Loader />}
      <div className={`${isLoading ? "hidden" : "block"}`}>
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/teacher-login" element={<TeacherLogin />} />
          <Route path="/teacher-register" element={<TeacherRegister />} />
          <Route path="/student-login" element={<StudentLogin />} />
          <Route path="/student-register" element={<StudentRegister />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin-register" element={<AdminRegister />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/subscription" element={<SubscriptionPage />} />
          {/* Protected Routes */}
          <Route
            path="/teacher-dashboard"
            element={
              <ProtectedRoute allowedRole="teacher">
                <TeacherDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher-profile"
            element={
              <ProtectedRoute allowedRole="teacher">
                <TeacherProfile />
              </ProtectedRoute>
            }
          />
             <Route
            path="/student-project"
            element={
              <ProtectedRoute>
                <StudentProject />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student-dashboard"
            element={
              <ProtectedRoute allowedRole="student">
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student-profile"
            element={
              <ProtectedRoute allowedRole="student">
                <StudentProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute allowedRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* 404 Error Page */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;