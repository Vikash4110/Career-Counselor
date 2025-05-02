// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../Store/auth";
// import { toast } from "sonner";
// import { format } from "date-fns";
// import {
//   FaUser,
//   FaEnvelope,
//   FaCalendarAlt,
//   FaVenusMars,
//   FaUserTie,
//   FaPhone,
//   FaEdit,
//   FaSave,
//   FaTimes,
//   FaUpload,
//   FaSpinner,
//   FaGraduationCap,
//   FaIdCard
// } from "react-icons/fa";

// const backendUrl = import.meta.env.VITE_BACKEND_URL;

// const StudentProfile = () => {
//   const {
//     user,
//     authorizationToken,
//     role,
//     isLoggedIn,
//     setUser,
//     handleUpdateProfile,
//     handleUpdateProfilePicture,
//   } = useAuth();
//   const navigate = useNavigate();
//   const [profile, setProfile] = useState({
//     childrenName: "",
//     email: "",
//     dob: "",
//     gender: "",
//     parentName: "",
//     parentMobileNumber: "",
//     profilePicture: null,
//   });
//   const [isEditing, setIsEditing] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [profilePicFile, setProfilePicFile] = useState(null);
//   const [profilePicPreview, setProfilePicPreview] = useState(null);
//   const [isImageLoaded, setIsImageLoaded] = useState(false);
//   const [isSavingProfile, setIsSavingProfile] = useState(false);
//   const [isSavingPicture, setIsSavingPicture] = useState(false);

//   // Redirect if not logged in or not a student
//   useEffect(() => {
//     if (!isLoggedIn || role !== "student") {
//       toast.error("Please log in as a student to access this page");
//       navigate("/student-login");
//     }
//   }, [isLoggedIn, role, navigate]);

//   // Fetch profile data
//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const response = await fetch(`${backendUrl}/api/students/profile`, {
//           method: "GET",
//           headers: { Authorization: authorizationToken },
//         });
//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }
//         const data = await response.json();
//         setProfile({
//           childrenName: data.childrenName || "",
//           email: data.email || "",
//           dob: data.dob ? format(new Date(data.dob), "yyyy-MM-dd") : "",
//           gender: data.gender || "",
//           parentName: data.parentName || "",
//           parentMobileNumber: data.parentMobileNumber || "",
//           profilePicture: data.profilePicture || null,
//         });
//         setUser(data);
//         setLoading(false);
//       } catch (error) {
//         console.error("Fetch profile failed:", error.message);
//         setLoading(false);
//       }
//     };

//     if (isLoggedIn && role === "student") {
//       fetchProfile();
//     }
//   }, [isLoggedIn, role, authorizationToken, setUser]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setProfile((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleProfilePicChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       if (file.size > 5 * 1024 * 1024) {
//         toast.error("Image size must be less than 5MB");
//         return;
//       }
//       setProfilePicFile(file);
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setProfilePicPreview(reader.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleUpdateProfileSubmit = async (e) => {
//     e.preventDefault();
//     setIsSavingProfile(true);
//     try {
//       await handleUpdateProfile(profile);
//       setProfile({
//         ...profile,
//         dob: profile.dob ? format(new Date(profile.dob), "yyyy-MM-dd") : "",
//       });
//       toast.success("Profile updated successfully");
//       setIsEditing(false);
//     } catch (error) {
//       console.error("Update profile failed:", error.message);
//       toast.error("Failed to update profile");
//     } finally {
//       setIsSavingProfile(false);
//     }
//   };

//   const handleUpdateProfilePictureSubmit = async () => {
//     if (!profilePicFile) {
//       toast.error("Please select an image to upload");
//       return;
//     }
//     setIsSavingPicture(true);
//     try {
//       const formData = new FormData();
//       formData.append("profilePicture", profilePicFile);
//       await handleUpdateProfilePicture(formData);
//       setProfilePicFile(null);
//       setProfilePicPreview(null);
//       setIsImageLoaded(false);
//       toast.success("Profile picture updated successfully");
//     } catch (error) {
//       console.error("Update profile picture failed:", error.message);
//       toast.error("Failed to update profile picture");
//     } finally {
//       setIsSavingPicture(false);
//     }
//   };

//   const handleImageLoad = () => {
//     setIsImageLoaded(true);
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
//         <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
//       </div>
//     );
//   }

//   const profilePicUrl = profile.profilePicture
//     ? `${backendUrl}/api/students/files/${profile.profilePicture}?t=${Date.now()}`
//     : null;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-6xl mx-auto">
//         <div className="mb-10 text-center">
//           <h1 className="text-4xl font-bold text-gray-800 mb-2">
//             Student Profile
//           </h1>
//           <p className="text-lg text-gray-600">
//             Manage your personal information and settings
//           </p>
//         </div>

//         <div className="bg-white rounded-xl shadow-xl overflow-hidden">
//           {/* Header Section */}
//           <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-6 text-white">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center">
//                 <FaGraduationCap className="text-3xl mr-3" />
//                 <div>
//                   <h2 className="text-2xl font-semibold">{profile.childrenName || "Student Profile"}</h2>
//                   <p className="text-blue-100">{profile.email || "student@example.com"}</p>
//                 </div>
//               </div>
//               <div className="hidden md:block">
//                 <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
//                   Active Student
//                 </span>
//               </div>
//             </div>
//           </div>

//           {/* Main Content */}
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8">
//             {/* Left Column - Profile Picture */}
//             <div className="lg:col-span-1">
//               <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200">
//                 <div className="flex flex-col items-center">
//                   <div className="relative w-40 h-40 rounded-full overflow-hidden mb-6 border-4 border-white shadow-lg">
//                     {profilePicPreview ? (
//                       <img
//                         src={profilePicPreview}
//                         alt="Preview"
//                         className="w-full h-full object-cover"
//                       />
//                     ) : profilePicUrl ? (
//                       <img
//                         src={profilePicUrl}
//                         alt="Profile"
//                         className="w-full h-full object-cover"
//                         onLoad={handleImageLoad}
//                         onError={(e) => {
//                           if (!isImageLoaded) {
//                             e.target.style.display = "none";
//                           }
//                         }}
//                       />
//                     ) : (
//                       <div className="w-full h-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white text-5xl font-semibold">
//                         {profile.childrenName.charAt(0).toUpperCase() || "S"}
//                       </div>
//                     )}
//                   </div>

//                   <div className="w-full space-y-4">
//                     <input
//                       type="file"
//                       accept="image/*"
//                       onChange={handleProfilePicChange}
//                       className="hidden"
//                       id="profilePicture"
//                     />
//                     <label
//                       htmlFor="profilePicture"
//                       className="block w-full text-center px-4 py-2 bg-white border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer font-medium"
//                     >
//                       <FaUpload className="inline mr-2" />
//                       Change Photo
//                     </label>
//                     {profilePicFile && (
//                       <button
//                         onClick={handleUpdateProfilePictureSubmit}
//                         disabled={isSavingPicture}
//                         className={`w-full flex justify-center items-center px-4 py-2 ${
//                           isSavingPicture ? "bg-green-500" : "bg-green-600 hover:bg-green-700"
//                         } text-white rounded-lg transition-colors font-medium`}
//                       >
//                         {isSavingPicture ? (
//                           <FaSpinner className="animate-spin mr-2" />
//                         ) : (
//                           <FaSave className="mr-2" />
//                         )}
//                         {isSavingPicture ? "Uploading..." : "Save Photo"}
//                       </button>
//                     )}
//                   </div>

//                   <div className="mt-8 w-full">
//                     <div className="border-t border-gray-200 pt-6">
//                       <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
//                         <FaIdCard className="mr-2 text-blue-600" />
//                         Student ID
//                       </h3>
//                       <div className="bg-blue-50 p-4 rounded-lg">
//                         <p className="text-sm text-gray-600">Student ID Number</p>
//                         <p className="font-mono text-lg font-bold text-blue-700">
//                           {user?.studentId || "STU-XXXXXX"}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Right Column - Profile Details */}
//             <div className="lg:col-span-2">
//               <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
//                 {/* Profile Details Header */}
//                 <div className="border-b border-gray-200 px-6 py-4 bg-gray-50 flex justify-between items-center">
//                   <h3 className="text-xl font-semibold text-gray-800">
//                     Personal Information
//                   </h3>
//                   {!isEditing && (
//                     <button
//                       onClick={() => setIsEditing(true)}
//                       className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
//                     >
//                       <FaEdit className="mr-2" />
//                       Edit Profile
//                     </button>
//                   )}
//                 </div>

//                 {/* Profile Details Content */}
//                 <div className="p-6">
//                   {isEditing ? (
//                     <form onSubmit={handleUpdateProfileSubmit} className="space-y-6">
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-1">
//                             <FaUser className="inline mr-2 text-blue-600" />
//                             Student Name
//                           </label>
//                           <input
//                             type="text"
//                             name="childrenName"
//                             value={profile.childrenName}
//                             onChange={handleInputChange}
//                             className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-150 px-4 py-2 border"
//                             required
//                           />
//                         </div>
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-1">
//                             <FaEnvelope className="inline mr-2 text-blue-600" />
//                             Email Address
//                           </label>
//                           <input
//                             type="email"
//                             name="email"
//                             value={profile.email}
//                             onChange={handleInputChange}
//                             className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-150 px-4 py-2 border"
//                             required
//                           />
//                         </div>
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-1">
//                             <FaCalendarAlt className="inline mr-2 text-blue-600" />
//                             Date of Birth
//                           </label>
//                           <input
//                             type="date"
//                             name="dob"
//                             value={profile.dob}
//                             onChange={handleInputChange}
//                             className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-150 px-4 py-2 border"
//                             required
//                           />
//                         </div>
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-1">
//                             <FaVenusMars className="inline mr-2 text-blue-600" />
//                             Gender
//                           </label>
//                           <select
//                             name="gender"
//                             value={profile.gender}
//                             onChange={handleInputChange}
//                             className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-150 px-4 py-2 border"
//                             required
//                           >
//                             <option value="">Select Gender</option>
//                             <option value="Male">Male</option>
//                             <option value="Female">Female</option>
//                             <option value="Other">Other</option>
//                           </select>
//                         </div>
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-1">
//                             <FaUserTie className="inline mr-2 text-blue-600" />
//                             Parent/Guardian Name
//                           </label>
//                           <input
//                             type="text"
//                             name="parentName"
//                             value={profile.parentName}
//                             onChange={handleInputChange}
//                             className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-150 px-4 py-2 border"
//                             required
//                           />
//                         </div>
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-1">
//                             <FaPhone className="inline mr-2 text-blue-600" />
//                             Parent/Guardian Phone
//                           </label>
//                           <input
//                             type="tel"
//                             name="parentMobileNumber"
//                             value={profile.parentMobileNumber}
//                             onChange={handleInputChange}
//                             className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-150 px-4 py-2 border"
//                             required
//                           />
//                         </div>
//                       </div>
//                       <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
//                         <button
//                           type="button"
//                           onClick={() => setIsEditing(false)}
//                           className="flex items-center px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium"
//                         >
//                           <FaTimes className="mr-2" />
//                           Cancel
//                         </button>
//                         <button
//                           type="submit"
//                           disabled={isSavingProfile}
//                           className={`flex items-center px-5 py-2.5 rounded-lg text-white ${
//                             isSavingProfile ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
//                           } transition-colors text-sm font-medium`}
//                         >
//                           {isSavingProfile ? (
//                             <FaSpinner className="animate-spin mr-2" />
//                           ) : (
//                             <FaSave className="mr-2" />
//                           )}
//                           {isSavingProfile ? "Saving..." : "Save Changes"}
//                         </button>
//                       </div>
//                     </form>
//                   ) : (
//                     <div className="space-y-6">
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                         <div>
//                           <label className="block text-sm font-medium text-gray-500 mb-1">
//                             <FaUser className="inline mr-2 text-blue-600" />
//                             Student Name
//                           </label>
//                           <p className="text-lg font-medium text-gray-800">
//                             {profile.childrenName || "Not provided"}
//                           </p>
//                         </div>
//                         <div>
//                           <label className="block text-sm font-medium text-gray-500 mb-1">
//                             <FaEnvelope className="inline mr-2 text-blue-600" />
//                             Email Address
//                           </label>
//                           <p className="text-lg font-medium text-gray-800">
//                             {profile.email || "Not provided"}
//                           </p>
//                         </div>
//                         <div>
//                           <label className="block text-sm font-medium text-gray-500 mb-1">
//                             <FaCalendarAlt className="inline mr-2 text-blue-600" />
//                             Date of Birth
//                           </label>
//                           <p className="text-lg font-medium text-gray-800">
//                             {profile.dob ? format(new Date(profile.dob), "MMMM do, yyyy") : "Not provided"}
//                           </p>
//                         </div>
//                         <div>
//                           <label className="block text-sm font-medium text-gray-500 mb-1">
//                             <FaVenusMars className="inline mr-2 text-blue-600" />
//                             Gender
//                           </label>
//                           <p className="text-lg font-medium text-gray-800">
//                             {profile.gender || "Not provided"}
//                           </p>
//                         </div>
//                         <div>
//                           <label className="block text-sm font-medium text-gray-500 mb-1">
//                             <FaUserTie className="inline mr-2 text-blue-600" />
//                             Parent/Guardian Name
//                           </label>
//                           <p className="text-lg font-medium text-gray-800">
//                             {profile.parentName || "Not provided"}
//                           </p>
//                         </div>
//                         <div>
//                           <label className="block text-sm font-medium text-gray-500 mb-1">
//                             <FaPhone className="inline mr-2 text-blue-600" />
//                             Parent/Guardian Phone
//                           </label>
//                           <p className="text-lg font-medium text-gray-800">
//                             {profile.parentMobileNumber || "Not provided"}
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default StudentProfile;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Store/auth";
import { toast } from "sonner";
import { format, differenceInDays } from "date-fns";
import {
  FaUser,
  FaEnvelope,
  FaCalendarAlt,
  FaVenusMars,
  FaUserTie,
  FaPhone,
  FaEdit,
  FaSave,
  FaTimes,
  FaUpload,
  FaSpinner,
  FaGraduationCap,
  FaIdCard,
  FaClock,
} from "react-icons/fa";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const StudentProfile = () => {
  const {
    user,
    authorizationToken,
    role,
    isLoggedIn,
    setUser,
    handleUpdateProfile,
    handleUpdateProfilePicture,
    subscribed,
    planType,
  } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    childrenName: "",
    email: "",
    dob: "",
    gender: "",
    parentName: "",
    parentMobileNumber: "",
    profilePicture: null,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [profilePicPreview, setProfilePicPreview] = useState(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPicture, setIsSavingPicture] = useState(false);

  // Redirect if not logged in or not a student
  useEffect(() => {
    if (!isLoggedIn || role !== "student") {
      toast.error("Please log in as a student to access this page");
      navigate("/student-login");
    }
  }, [isLoggedIn, role, navigate]);

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/students/profile`, {
          method: "GET",
          headers: { Authorization: authorizationToken },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProfile({
          childrenName: data.childrenName || "",
          email: data.email || "",
          dob: data.dob ? format(new Date(data.dob), "yyyy-MM-dd") : "",
          gender: data.gender || "",
          parentName: data.parentName || "",
          parentMobileNumber: data.parentMobileNumber || "",
          profilePicture: data.profilePicture || null,
        });
        setUser(data);
        setLoading(false);
      } catch (error) {
        console.error("Fetch profile failed:", error.message);
        setLoading(false);
      }
    };

    if (isLoggedIn && role === "student") {
      fetchProfile();
    }
  }, [isLoggedIn, role, authorizationToken, setUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }
      setProfilePicFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfileSubmit = async (e) => {
    e.preventDefault();
    setIsSavingProfile(true);
    try {
      await handleUpdateProfile(profile);
      setProfile({
        ...profile,
        dob: profile.dob ? format(new Date(profile.dob), "yyyy-MM-dd") : "",
      });
      toast.success("Profile updated successfully");
      setIsEditing(false);
    } catch (error) {
      console.error("Update profile failed:", error.message);
      toast.error("Failed to update profile");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleUpdateProfilePictureSubmit = async () => {
    if (!profilePicFile) {
      toast.error("Please select an image to upload");
      return;
    }
    setIsSavingPicture(true);
    try {
      const formData = new FormData();
      formData.append("profilePicture", profilePicFile);
      await handleUpdateProfilePicture(formData);
      setProfilePicFile(null);
      setProfilePicPreview(null);
      setIsImageLoaded(false);
      toast.success("Profile picture updated successfully");
    } catch (error) {
      console.error("Update profile picture failed:", error.message);
      toast.error("Failed to update profile picture");
    } finally {
      setIsSavingPicture(false);
    }
  };

  const handleImageLoad = () => {
    setIsImageLoaded(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  const profilePicUrl = profile.profilePicture
    ? `${backendUrl}/api/students/files/${profile.profilePicture}?t=${Date.now()}`
    : null;

  // Calculate remaining subscription days
  const subscriptionDaysLeft = subscribed && user?.subscriptionEndDate
    ? planType === "one-time"
      ? "Lifetime"
      : differenceInDays(new Date(user.subscriptionEndDate), new Date())
    : "Not Subscribed";

  const planName = planType
    ? planType === "one-time"
      ? "One-Time Resource Access"
      : planType === "monthly"
      ? "Monthly Plan"
      : "Quarterly Plan"
    : "None";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Student Profile
          </h1>
          <p className="text-lg text-gray-600">
            Manage your personal information and settings
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FaGraduationCap className="text-3xl mr-3" />
                <div>
                  <h2 className="text-2xl font-semibold">{profile.childrenName || "Student Profile"}</h2>
                  <p className="text-blue-100">{profile.email || "student@example.com"}</p>
                </div>
              </div>
              <div className="hidden md:block">
                <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Active Student
                </span>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8">
            {/* Left Column - Profile Picture & Subscription */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex flex-col items-center">
                  <div className="relative w-40 h-40 rounded-full overflow-hidden mb-6 border-4 border-white shadow-lg">
                    {profilePicPreview ? (
                      <img
                        src={profilePicPreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : profilePicUrl ? (
                      <img
                        src={profilePicUrl}
                        alt="Profile"
                        className="w-full h-full object-cover"
                        onLoad={handleImageLoad}
                        onError={(e) => {
                          if (!isImageLoaded) {
                            e.target.style.display = "none";
                          }
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white text-5xl font-semibold">
                        {profile.childrenName.charAt(0).toUpperCase() || "S"}
                      </div>
                    )}
                  </div>

                  <div className="w-full space-y-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePicChange}
                      className="hidden"
                      id="profilePicture"
                    />
                    <label
                      htmlFor="profilePicture"
                      className="block w-full text-center px-4 py-2 bg-white border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer font-medium"
                    >
                      <FaUpload className="inline mr-2" />
                      Change Photo
                    </label>
                    {profilePicFile && (
                      <button
                        onClick={handleUpdateProfilePictureSubmit}
                        disabled={isSavingPicture}
                        className={`w-full flex justify-center items-center px-4 py-2 ${
                          isSavingPicture ? "bg-green-500" : "bg-green-600 hover:bg-green-700"
                        } text-white rounded-lg transition-colors font-medium`}
                      >
                        {isSavingPicture ? (
                          <FaSpinner className="animate-spin mr-2" />
                        ) : (
                          <FaSave className="mr-2" />
                        )}
                        {isSavingPicture ? "Uploading..." : "Save Photo"}
                      </button>
                    )}
                  </div>

                  <div className="mt-8 w-full">
                    <div className="border-t border-gray-200 pt-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <FaIdCard className="mr-2 text-blue-600" />
                        Student ID
                      </h3>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600">Student ID Number</p>
                        <p className="font-mono text-lg font-bold text-blue-700">
                          {user?.studentId || "STU-XXXXXX"}
                        </p>
                      </div>
                    </div>
                    <div className="border-t border-gray-200 pt-6 mt-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <FaClock className="mr-2 text-blue-600" />
                        Subscription Details
                      </h3>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600">Plan Type</p>
                        <p className="text-lg font-bold text-blue-700">{planName}</p>
                        <p className="text-sm text-gray-600 mt-2">Days Remaining</p>
                        <p className="text-lg font-bold text-blue-700">
                          {subscriptionDaysLeft === "Lifetime"
                            ? "Lifetime Access"
                            : subscriptionDaysLeft > 0
                            ? `${subscriptionDaysLeft} Day${subscriptionDaysLeft > 1 ? "s" : ""}`
                            : "Expired"}
                        </p>
                        {!subscribed && (
                          <button
                            onClick={() => navigate("/subscription")}
                            className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                          >
                            Subscribe Now
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Profile Details */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {/* Profile Details Header */}
                <div className="border-b border-gray-200 px-6 py-4 bg-gray-50 flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-gray-800">
                    Personal Information
                  </h3>
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      <FaEdit className="mr-2" />
                      Edit Profile
                    </button>
                  )}
                </div>

                {/* Profile Details Content */}
                <div className="p-6">
                  {isEditing ? (
                    <form onSubmit={handleUpdateProfileSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            <FaUser className="inline mr-2 text-blue-600" />
                            Student Name
                          </label>
                          <input
                            type="text"
                            name="childrenName"
                            value={profile.childrenName}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-150 px-4 py-2 border"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            <FaEnvelope className="inline mr-2 text-blue-600" />
                            Email Address
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={profile.email}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-150 px-4 py-2 border"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            <FaCalendarAlt className="inline mr-2 text-blue-600" />
                            Date of Birth
                          </label>
                          <input
                            type="date"
                            name="dob"
                            value={profile.dob}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-150 px-4 py-2 border"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            <FaVenusMars className="inline mr-2 text-blue-600" />
                            Gender
                          </label>
                          <select
                            name="gender"
                            value={profile.gender}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-150 px-4 py-2 border"
                            required
                          >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            <FaUserTie className="inline mr-2 text-blue-600" />
                            Parent/Guardian Name
                          </label>
                          <input
                            type="text"
                            name="parentName"
                            value={profile.parentName}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-150 px-4 py-2 border"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            <FaPhone className="inline mr-2 text-blue-600" />
                            Parent/Guardian Phone
                          </label>
                          <input
                            type="tel"
                            name="parentMobileNumber"
                            value={profile.parentMobileNumber}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-150 px-4 py-2 border"
                            required
                          />
                        </div>
                      </div>
                      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                        <button
                          type="button"
                          onClick={() => setIsEditing(false)}
                          className="flex items-center px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium"
                        >
                          <FaTimes className="mr-2" />
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isSavingProfile}
                          className={`flex items-center px-5 py-2.5 rounded-lg text-white ${
                            isSavingProfile ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
                          } transition-colors text-sm font-medium`}
                        >
                          {isSavingProfile ? (
                            <FaSpinner className="animate-spin mr-2" />
                          ) : (
                            <FaSave className="mr-2" />
                          )}
                          {isSavingProfile ? "Saving..." : "Save Changes"}
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-500 mb-1">
                            <FaUser className="inline mr-2 text-blue-600" />
                            Student Name
                          </label>
                          <p className="text-lg font-medium text-gray-800">
                            {profile.childrenName || "Not provided"}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-500 mb-1">
                            <FaEnvelope className="inline mr-2 text-blue-600" />
                            Email Address
                          </label>
                          <p className="text-lg font-medium text-gray-800">
                            {profile.email || "Not provided"}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-500 mb-1">
                            <FaCalendarAlt className="inline mr-2 text-blue-600" />
                            Date of Birth
                          </label>
                          <p className="text-lg font-medium text-gray-800">
                            {profile.dob ? format(new Date(profile.dob), "MMMM do, yyyy") : "Not provided"}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-500 mb-1">
                            <FaVenusMars className="inline mr-2 text-blue-600" />
                            Gender
                          </label>
                          <p className="text-lg font-medium text-gray-800">
                            {profile.gender || "Not provided"}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-500 mb-1">
                            <FaUserTie className="inline mr-2 text-blue-600" />
                            Parent/Guardian Name
                          </label>
                          <p className="text-lg font-medium text-gray-800">
                            {profile.parentName || "Not provided"}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-500 mb-1">
                            <FaPhone className="inline mr-2 text-blue-600" />
                            Parent/Guardian Phone
                          </label>
                          <p className="text-lg font-medium text-gray-800">
                            {profile.parentMobileNumber || "Not provided"}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;