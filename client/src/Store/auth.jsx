// import { createContext, useContext, useState, useEffect } from "react";
// import { jwtDecode } from "jwt-decode";
// import { toast } from "sonner";

// const backendUrl = import.meta.env.VITE_BACKEND_URL;

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [token, setToken] = useState(localStorage.getItem("token") || "");
//   const [user, setUser] = useState(null);
//   const [role, setRole] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isLoggingOut, setIsLoggingOut] = useState(false);
//   const [subscribed, setSubscribed] = useState(false);
//   const authorizationToken = token ? `Bearer ${token}` : "";

//   const storeTokenInLS = (serverToken) => {
//     setToken(serverToken);
//     localStorage.setItem("token", serverToken);
//   };

//   const logoutUser = () => {
//     setIsLoggingOut(true);
//     setToken("");
//     setUser(null);
//     setRole(null);
//     setSubscribed(false);
//     localStorage.removeItem("token");
//     setIsLoading(false);
//     toast.success("Logged out successfully");
//     setTimeout(() => setIsLoggingOut(false), 1000);
//   };

//   const refreshProfile = async () => {
//     if (role === "student") {
//       await studentAuthentication();
//     } else if (role === "teacher") {
//       await teacherAuthentication();
//     }
//   };

//   const getUserRoleFromToken = () => {
//     if (!token) return null;
//     try {
//       const decoded = jwtDecode(token);
//       setSubscribed(decoded.subscribed || false);
//       return decoded.role;
//     } catch (error) {
//       console.error("Error decoding token:", error);
//       setSubscribed(false);
//       return null;
//     }
//   };

//   const handleUpdateProfile = async (updatedData) => {
//     try {
//       const response = await fetch(`${backendUrl}/api/students/profile`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: authorizationToken,
//         },
//         body: JSON.stringify(updatedData),
//       });
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
//       await refreshProfile();
//     } catch (error) {
//       console.error("Update profile failed:", error.message);
//       throw error;
//     }
//   };

//   const handleUpdateProfilePicture = async (formData) => {
//     try {
//       const response = await fetch(`${backendUrl}/api/students/profile/picture`, {
//         method: "PUT",
//         headers: { Authorization: authorizationToken },
//         body: formData,
//       });
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
//       await refreshProfile();
//     } catch (error) {
//       console.error("Update profile picture failed:", error.message);
//       throw error;
//     }
//   };

//   const getSubscriptionStatus = async () => {
//     if (!token || role !== "student") {
//       setSubscribed(false);
//       return false;
//     }
//     try {
//       const response = await fetch(`${backendUrl}/api/students/get-subscription-status`, {
//         method: "GET",
//         headers: { Authorization: authorizationToken },
//       });
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
//       const data = await response.json();
//       setSubscribed(data.subscribed);
//       return data.subscribed;
//     } catch (error) {
//       console.error("Subscription status check failed:", error.message);
//       setSubscribed(false);
//       return false;
//     }
//   };

//   const teacherAuthentication = async () => {
//     try {
//       const response = await fetch(`${backendUrl}/api/teachers/profile`, {
//         method: "GET",
//         headers: { Authorization: authorizationToken },
//       });
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
//       const data = await response.json();
//       setUser(data);
//       console.log("Authenticated teacher:", data);
//     } catch (error) {
//       console.error("Teacher authentication failed:", error.message);
//       setUser(null);
//     }
//   };

//   const studentAuthentication = async () => {
//     try {
//       const response = await fetch(`${backendUrl}/api/students/profile`, {
//         method: "GET",
//         headers: { Authorization: authorizationToken },
//       });
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
//       const data = await response.json();
//       setUser(data);
//       console.log("Authenticated student:", data);
//       await getSubscriptionStatus();
//     } catch (error) {
//       console.error("Student authentication failed:", error.message);
//       setUser(null);
//       setSubscribed(false);
//     }
//   };

//   useEffect(() => {
//     const authenticate = async () => {
//       setIsLoading(true);
//       const tokenRole = getUserRoleFromToken();
//       setRole(tokenRole);

//       if (!token) {
//         setUser(null);
//         setRole(null);
//         setSubscribed(false);
//         setIsLoading(false);
//         return;
//       }

//       if (tokenRole === "teacher") {
//         await teacherAuthentication();
//       } else if (tokenRole === "student") {
//         await studentAuthentication();
//       } else {
//         setUser(null);
//         setSubscribed(false);
//       }
//       setIsLoading(false);
//     };

//     authenticate();
//   }, [token]);

//   const login = (userData, serverToken) => {
//     storeTokenInLS(serverToken);
//     setUser(userData);
//     const decoded = jwtDecode(serverToken);
//     setRole(decoded.role || "student");
//     setSubscribed(decoded.subscribed || false);
//     // Removed setIsLoggedIn(true) as isLoggedIn is derived from token
//     if (decoded.role === "student") {
//       getSubscriptionStatus();
//     }
//   };

//   const isLoggedIn = !!token;

//   return (
//     <AuthContext.Provider
//       value={{
//         isLoggedIn,
//         storeTokenInLS,
//         login,
//         logoutUser,
//         user,
//         role,
//         authorizationToken,
//         isLoading,
//         isLoggingOut,
//         subscribed,
//         setSubscribed,
//         getSubscriptionStatus,
//         refreshProfile,
//         handleUpdateProfile,
//         handleUpdateProfilePicture,
//         setUser,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const authContextValue = useContext(AuthContext);
//   if (!authContextValue) {
//     throw new Error("useAuth used outside of the Provider");
//   }
//   return authContextValue;
// };

import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [planType, setPlanType] = useState(null);
  const authorizationToken = token ? `Bearer ${token}` : "";

  const storeTokenInLS = (serverToken) => {
    setToken(serverToken);
    localStorage.setItem("token", serverToken);
  };

  const logoutUser = () => {
    setIsLoggingOut(true);
    setToken("");
    setUser(null);
    setRole(null);
    setSubscribed(false);
    setPlanType(null);
    localStorage.removeItem("token");
    setIsLoading(false);
    toast.success("Logged out successfully");
    setTimeout(() => setIsLoggingOut(false), 1000);
  };

  const refreshProfile = async () => {
    if (role === "student") {
      await studentAuthentication();
    } else if (role === "teacher") {
      await teacherAuthentication();
    }
  };

  const getUserRoleFromToken = () => {
    if (!token) return null;
    try {
      const decoded = jwtDecode(token);
      setSubscribed(decoded.subscribed || false);
      setPlanType(decoded.planType || null);
      return decoded.role;
    } catch (error) {
      console.error("Error decoding token:", error);
      setSubscribed(false);
      setPlanType(null);
      return null;
    }
  };

  const handleUpdateProfile = async (updatedData) => {
    try {
      const response = await fetch(`${backendUrl}/api/students/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: authorizationToken,
        },
        body: JSON.stringify(updatedData),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      await refreshProfile();
    } catch (error) {
      console.error("Update profile failed:", error.message);
      throw error;
    }
  };

  const handleUpdateProfilePicture = async (formData) => {
    try {
      const response = await fetch(`${backendUrl}/api/students/profile/picture`, {
        method: "PUT",
        headers: { Authorization: authorizationToken },
        body: formData,
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      await refreshProfile();
    } catch (error) {
      console.error("Update profile picture failed:", error.message);
      throw error;
    }
  };

  const getSubscriptionStatus = async () => {
    if (!token || role !== "student") {
      setSubscribed(false);
      setPlanType(null);
      return false;
    }
    try {
      const response = await fetch(`${backendUrl}/api/students/get-subscription-status`, {
        method: "GET",
        headers: { Authorization: authorizationToken },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setSubscribed(data.subscribed);
      setPlanType(data.planType);
      return data.subscribed;
    } catch (error) {
      console.error("Subscription status check failed:", error.message);
      setSubscribed(false);
      setPlanType(null);
      return false;
    }
  };

  const teacherAuthentication = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/teachers/profile`, {
        method: "GET",
        headers: { Authorization: authorizationToken },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setUser(data);
      console.log("Authenticated teacher:", data);
    } catch (error) {
      console.error("Teacher authentication failed:", error.message);
      setUser(null);
    }
  };

  const studentAuthentication = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/students/profile`, {
        method: "GET",
        headers: { Authorization: authorizationToken },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setUser(data);
      console.log("Authenticated student:", data);
      await getSubscriptionStatus();
    } catch (error) {
      console.error("Student authentication failed:", error.message);
      setUser(null);
      setSubscribed(false);
      setPlanType(null);
    }
  };

  useEffect(() => {
    const authenticate = async () => {
      setIsLoading(true);
      const tokenRole = getUserRoleFromToken();
      setRole(tokenRole);

      if (!token) {
        setUser(null);
        setRole(null);
        setSubscribed(false);
        setPlanType(null);
        setIsLoading(false);
        return;
      }

      if (tokenRole === "teacher") {
        await teacherAuthentication();
      } else if (tokenRole === "student") {
        await studentAuthentication();
      } else {
        setUser(null);
        setSubscribed(false);
        setPlanType(null);
      }
      setIsLoading(false);
    };

    authenticate();
  }, [token]);

  const login = (userData, serverToken) => {
    storeTokenInLS(serverToken);
    setUser(userData);
    const decoded = jwtDecode(serverToken);
    setRole(decoded.role || "student");
    setSubscribed(decoded.subscribed || false);
    setPlanType(decoded.planType || null);
    if (decoded.role === "student") {
      getSubscriptionStatus();
    }
  };

  const isLoggedIn = !!token;

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        storeTokenInLS,
        login,
        logoutUser,
        user,
        role,
        authorizationToken,
        isLoading,
        isLoggingOut,
        subscribed,
        setSubscribed,
        planType,
        setPlanType,
        getSubscriptionStatus,
        refreshProfile,
        handleUpdateProfile,
        handleUpdateProfilePicture,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const authContextValue = useContext(AuthContext);
  if (!authContextValue) {
    throw new Error("useAuth used outside of the Provider");
  }
  return authContextValue;
};