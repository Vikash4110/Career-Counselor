// import React, { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { FaLightbulb, FaProjectDiagram, FaCamera, FaTimes, FaSpinner, FaEdit, FaImages } from "react-icons/fa";
// import { toast } from "sonner";
// import { useDebounce } from "use-debounce";
// import { GoogleGenerativeAI } from "@google/generative-ai";
// import { useAuth } from "../Store/auth";

// const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_API_KEY);
// const backendUrl = import.meta.env.VITE_BACKEND_URL;

// const StudentProject = () => {
//   const { user, authorizationToken, role, isLoggedIn, setUser } = useAuth();
//   const [student, setStudent] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isChatOpen, setIsChatOpen] = useState(false);
//   const [chatMessages, setChatMessages] = useState([]);
//   const [chatInput, setChatInput] = useState("");
//   const [isChatLoading, setIsChatLoading] = useState(false);
//   const [lastRequestTime, setLastRequestTime] = useState(0);
//   const [conversationCache, setConversationCache] = useState({});
//   const [selectedProject, setSelectedProject] = useState(null);
//   const [selectedSubmittedPhotos, setSelectedSubmittedPhotos] = useState(null);
//   const [photoFile, setPhotoFile] = useState(null);
//   const [photoPreview, setPhotoPreview] = useState(null);
//   const [isSubmittingPhoto, setIsSubmittingPhoto] = useState(false);
//   const [imageCache, setImageCache] = useState({});
//   const [debouncedChatInput] = useDebounce(chatInput, 300);

//   const localProjectSuggestions = {
//     science: "Create a science experiment demonstrating [concept]",
//     art: "Produce an art piece exploring [theme]",
//     sports: "Develop a training program for [sport]",
//     technology: "Build a simple [technology] project",
//     math: "Design a math puzzle about [topic]",
//     history: "Create a timeline of [historical event]",
//     music: "Compose a short piece in [genre] style",
//   };

//   // Fetch student profile
//   useEffect(() => {
//     const fetchProfile = async () => {
//       setIsLoading(true);
//       try {
//         const response = await fetch(`${backendUrl}/api/students/profile`, {
//           headers: { Authorization: authorizationToken },
//         });
//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }
//         const data = await response.json();
//         setStudent(data);
//         setUser(data);
//         // Fetch images for profile picture and submitted photos
//         if (data.profilePicture) {
//           await fetchImage(data.profilePicture);
//         }
//         if (data.submittedPhotos?.length > 0) {
//           await Promise.all(data.submittedPhotos.map((photoId) => fetchImage(photoId)));
//         }
//       } catch (error) {
//         console.error("Fetch profile error:", error);
//         toast.error("Failed to load profile");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     if (isLoggedIn && role === "student") {
//       fetchProfile();
//     } else {
//       toast.error("Please log in as a student");
//     }
//   }, [isLoggedIn, role, authorizationToken, setUser]);

//   // Fetch image from GridFS
//   const fetchImage = async (fileId) => {
//     if (imageCache[fileId]) return;
//     try {
//       const response = await fetch(`${backendUrl}/api/students/files/${fileId}`, {
//         headers: { Authorization: authorizationToken },
//       });
//       if (response.ok) {
//         const blob = await response.blob();
//         const imageUrl = URL.createObjectURL(blob);
//         setImageCache((prev) => ({ ...prev, [fileId]: imageUrl }));
//       }
//     } catch (error) {
//       console.error(`Error fetching image ${fileId}:`, error);
//     }
//   };

//   // Save project to backend
//   const saveProject = async (title, description) => {
//     try {
//       const response = await fetch(`${backendUrl}/api/students/project`, {
//         method: "PUT",
//         headers: {
//           Authorization: authorizationToken,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ projectTitle: title, projectDescription: description }),
//       });
//       const data = await response.json();
//       if (response.ok) {
//         setStudent((prev) => ({ ...prev, project: { title, description } }));
//         setUser((prev) => ({ ...prev, project: { title, description } }));
//         toast.success("Project saved successfully!");
//       } else {
//         toast.error(data.message || "Failed to save project");
//       }
//     } catch (error) {
//       console.error("Save project error:", error);
//       toast.error("Error saving project");
//     }
//   };

//   // Get local project suggestion
//   const getLocalSuggestion = (input) => {
//     const lowerInput = input.toLowerCase();
//     for (const [key, suggestion] of Object.entries(localProjectSuggestions)) {
//       if (lowerInput.includes(key)) {
//         return suggestion
//           .replace("[concept]", input.split(" ")[0])
//           .replace("[theme]", input.split(" ")[0])
//           .replace("[sport]", input.split(" ")[0])
//           .replace("[technology]", input.split(" ")[0])
//           .replace("[topic]", input.split(" ")[0])
//           .replace("[historical event]", input.split(" ")[0] + " " + (input.split(" ")[1] || ""))
//           .replace("[genre]", input.split(" ")[0]);
//       }
//     }
//     return `Create a project exploring ${input}`;
//   };

//   // Handle chatbot message
//   const handleSendMessage = async () => {
//     if (!chatInput.trim() || isChatLoading) return;

//     const now = Date.now();
//     const timeSinceLastRequest = now - lastRequestTime;
//     const MIN_DELAY = 2000;

//     if (timeSinceLastRequest < MIN_DELAY) {
//       setChatMessages((prev) => [
//         ...prev,
//         {
//           role: "ai",
//           content: `Please wait ${((MIN_DELAY - timeSinceLastRequest) / 1000).toFixed(1)} seconds before sending another message.`,
//         },
//       ]);
//       return;
//     }

//     setLastRequestTime(now);
//     const userMessage = { role: "student", content: chatInput };
//     setChatMessages((prev) => [...prev, userMessage]);
//     setChatInput("");
//     setIsChatLoading(true);

//     const messagesForApi = [...chatMessages, userMessage].map((msg) => ({
//       role: msg.role === "ai" ? "model" : "user",
//       parts: [{ text: msg.content }],
//     }));

//     const cacheKey = JSON.stringify(messagesForApi);
//     if (conversationCache[cacheKey]) {
//       setChatMessages((prev) => [...prev, { role: "ai", content: conversationCache[cacheKey] }]);
//       setIsChatLoading(false);
//       return;
//     }

//     try {
//       const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
//       const exchangeCount = messagesForApi.filter((msg) => msg.role === "user").length;

//       const systemInstruction = `
//         You are a project assignment assistant for school students.
//         The student is ${student?.childrenName || "Student"}.
//         Your goal is to suggest a personalized project based on their hobbies and interests within 5-8 exchanges.
//         Keep responses concise (1-2 sentences max).
//         If this is the first message (exchangeCount = 1), start with: "Hello ${student?.childrenName || "Student"}! What do you enjoy doing in your free time?"
//         For subsequent messages, do NOT repeat the initial greeting; instead, ask a relevant follow-up question based on the chat history (e.g., "What kind of [interest] do you like?").
//         If the user gives vague answers (e.g., "hello"), prompt them with "Tell me more about what you like to do!"
//         By exchanges 5-8, suggest a project with a title and 1-sentence description (e.g., "Project: Cricket Batting Trainer - Design a practice tool to improve your batting skills.").
//         Current exchange count: ${exchangeCount}.
//         Chat history: ${JSON.stringify(messagesForApi)}.
//       `;

//       const chatHistory = messagesForApi.filter((msg, index) => {
//         if (exchangeCount === 1) return false;
//         return index > 0 || msg.role === "user";
//       });

//       const chat = model.startChat({
//         history: chatHistory,
//         generationConfig: { temperature: 0.7, maxOutputTokens: 150 },
//       });

//       const result = await chat.sendMessage(`${systemInstruction}`);
//       const aiResponse = result.response.text();

//       if (aiResponse) {
//         setConversationCache((prev) => ({ ...prev, [cacheKey]: aiResponse }));
//         setChatMessages((prev) => [...prev, { role: "ai", content: aiResponse }]);

//         if (exchangeCount >= 5 && aiResponse.includes("Project:")) {
//           const [title, description] = aiResponse.split(" - ");
//           const projectTitle = title.replace("Project: ", "").trim();
//           const projectDescription = description.trim();
//           await saveProject(projectTitle, projectDescription);
//           setIsChatOpen(false);
//         }
//       }
//     } catch (error) {
//       console.error("Gemini API error:", error);
//       const localSuggestion = getLocalSuggestion(chatInput);
//       setChatMessages((prev) => [
//         ...prev,
//         { role: "ai", content: `Having trouble connecting to Gemini. Try this: ${localSuggestion}` },
//       ]);
//       toast.error("Error with Gemini API");
//     } finally {
//       setIsChatLoading(false);
//     }
//   };

//   // Handle photo selection
//   const handlePhotoChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       if (file.size > 5 * 1024 * 1024) {
//         toast.error("Image size must be less than 5MB");
//         return;
//       }
//       setPhotoFile(file);
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setPhotoPreview(reader.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   // Submit project photo
//   const handlePhotoSubmit = async () => {
//     if (!photoFile) {
//       toast.error("Please select an image to upload");
//       return;
//     }
//     setIsSubmittingPhoto(true);
//     try {
//       const formData = new FormData();
//       formData.append("profilePicture", photoFile); // Reusing field name for consistency
//       const response = await fetch(`${backendUrl}/api/students/photo`, {
//         method: "PUT",
//         headers: { Authorization: authorizationToken },
//         body: formData,
//       });
//       const data = await response.json();
//       if (response.ok) {
//         setStudent((prev) => ({
//           ...prev,
//           submittedPhotos: [...(prev.submittedPhotos || []), data.photoId],
//         }));
//         setUser((prev) => ({
//           ...prev,
//           submittedPhotos: [...(prev.submittedPhotos || []), data.photoId],
//         }));
//         await fetchImage(data.photoId);
//         setPhotoFile(null);
//         setPhotoPreview(null);
//         toast.success("Project photo submitted successfully");
//       } else {
//         toast.error(data.message || "Failed to submit photo");
//       }
//     } catch (error) {
//       console.error("Submit photo error:", error);
//       toast.error("Error submitting photo");
//     } finally {
//       setIsSubmittingPhoto(false);
//     }
//   };

//   // Close chatbot
//   const closeChat = () => {
//     setIsChatOpen(false);
//     setChatMessages([]);
//     setChatInput("");
//   };

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex justify-center items-center">
//         <FaSpinner className="w-12 h-12 text-indigo-600 animate-spin" />
//       </div>
//     );
//   }

//   if (!student) {
//     return (
//       <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex justify-center items-center">
//         <div className="bg-white rounded-2xl shadow-lg p-10 text-center">
//           <h3 className="text-2xl font-semibold text-gray-900 mb-3">Profile Not Found</h3>
//           <p className="text-gray-600">Please log in to access your projects.</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-8">
//       <div className="max-w-4xl mx-auto">
//         <div className="flex flex-col items-center mb-10">
//           <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Your Project</h1>
//           <p className="mt-2 text-gray-600 text-lg">Manage your assigned project and submit photos</p>
//         </div>

//         <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
//           <div className="flex items-center space-x-4 mb-6">
//             {student.profilePicture && imageCache[student.profilePicture] ? (
//               <img
//                 src={imageCache[student.profilePicture]}
//                 alt={student.childrenName}
//                 className="w-16 h-16 rounded-full object-cover border-2 border-indigo-100 shadow-sm"
//                 onError={(e) => {
//                   e.target.src = `https://ui-avatars.com/api/?name=${student.childrenName}&background=random&size=64`;
//                 }}
//               />
//             ) : (
//               <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-xl font-semibold shadow-sm">
//                 {student.childrenName.charAt(0)}
//               </div>
//             )}
//             <div>
//               <h2 className="text-2xl font-semibold text-gray-900">{student.childrenName}</h2>
//               <p className="text-gray-600">{student.email}</p>
//             </div>
//           </div>

//           <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
//             <motion.button
//               onClick={() => setIsChatOpen(true)}
//               className="flex items-center justify-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//             >
//               <FaLightbulb className="mr-2" />
//               {student.project?.title ? "Update Project with AI" : "Chat with AI for Project"}
//             </motion.button>
//             {student.project?.title && (
//               <>
//                 <motion.button
//                   onClick={() => setSelectedProject(student)}
//                   className="flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md"
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                 >
//                   <FaProjectDiagram className="mr-2" />
//                   View Assigned Project
//                 </motion.button>
//                 <motion.button
//                   onClick={() => {
//                     setSelectedProject(null);
//                     setIsChatOpen(true);
//                   }}
//                   className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                 >
//                   <FaEdit className="mr-2" />
//                   Update Project
//                 </motion.button>
//               </>
//             )}
//             {student.submittedPhotos?.length > 0 && (
//               <motion.button
//                 onClick={() => setSelectedSubmittedPhotos(student)}
//                 className="flex items-center justify-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-md"
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//               >
//                 <FaImages className="mr-2" />
//                 View Submitted Photos
//               </motion.button>
//             )}
//           </div>

//           <div className="border-t border-gray-200 pt-6">
//             <h3 className="text-xl font-semibold text-gray-900 mb-4">Submit Project Photos</h3>
//             <div className="flex flex-col items-center">
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={handlePhotoChange}
//                 className="hidden"
//                 id="projectPhoto"
//               />
//               <div className="flex space-x-4 mb-4">
//                 <label
//                   htmlFor="projectPhoto"
//                   className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
//                 >
//                   <FaCamera className="mr-2" />
//                   Choose Photo
//                 </label>
//                 {photoFile && (
//                   <motion.button
//                     onClick={handlePhotoSubmit}
//                     disabled={isSubmittingPhoto}
//                     className={`flex items-center px-4 py-2 ${
//                       isSubmittingPhoto ? "bg-green-400" : "bg-green-600 hover:bg-green-700"
//                     } text-white rounded-lg transition-colors`}
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                   >
//                     {isSubmittingPhoto ? (
//                       <FaSpinner className="mr-2 animate-spin" />
//                     ) : (
//                       <FaCamera className="mr-2" />
//                     )}
//                     {isSubmittingPhoto ? "Submitting..." : "Submit Photo"}
//                   </motion.button>
//                 )}
//               </div>
//               {photoPreview && (
//                 <img
//                   src={photoPreview}
//                   alt="Preview"
//                   className="w-48 h-48 object-cover rounded-lg border border-gray-200 shadow-sm mb-4"
//                 />
//               )}
//             </div>
//             {student.submittedPhotos?.length > 0 && (
//               <div className="mt-6">
//                 <h4 className="text-lg font-semibold text-gray-900 mb-2">Submitted Photos</h4>
//                 <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
//                   {student.submittedPhotos.map((photoId) => (
//                     imageCache[photoId] && (
//                       <img
//                         key={photoId}
//                         src={imageCache[photoId]}
//                         alt="Submitted project"
//                         className="w-full h-32 object-cover rounded-lg border border-gray-200 shadow-sm"
//                         onError={(e) => {
//                           e.target.style.display = "none";
//                         }}
//                       />
//                     )
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Chatbot Modal */}
//         <AnimatePresence>
//           {isChatOpen && (
//             <motion.div
//               initial={{ opacity: 0, y: 50 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: 50 }}
//               transition={{ duration: 0.3 }}
//               className="fixed inset-0 md:inset-auto md:bottom-6 md:right-6 md:w-96 md:max-h-[80vh] bg-white rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden border border-gray-100"
//             >
//               <div className="bg-indigo-600 text-white p-5 flex justify-between items-center rounded-t-2xl">
//                 <h2 className="text-lg font-semibold">
//                   {student.project?.title ? `Update Project - ${student.childrenName}` : `Assign Project - ${student.childrenName}`}
//                 </h2>
//                 <button onClick={closeChat} className="text-white hover:text-gray-200">
//                   <FaTimes className="w-5 h-5" />
//                 </button>
//               </div>
//               <div className="flex-1 p-5 overflow-y-auto space-y-4">
//                 {chatMessages.length === 0 && (
//                   <div className="text-center text-gray-600 py-4">
//                     {student.project?.title
//                       ? "Let’s refine your project—what would you like to change?"
//                       : "Let’s find a project for you—tell me about your interests!"}
//                   </div>
//                 )}
//                 {chatMessages.map((message, index) => (
//                   <div
//                     key={index}
//                     className={`flex ${message.role === "student" ? "justify-end" : "justify-start"}`}
//                   >
//                     <div
//                       className={`max-w-[75%] p-3 rounded-lg shadow-sm ${
//                         message.role === "student"
//                           ? "bg-indigo-100 text-indigo-800"
//                           : "bg-gray-100 text-gray-800"
//                       }`}
//                     >
//                       {message.content}
//                     </div>
//                   </div>
//                 ))}
//                 {isChatLoading && (
//                   <div className="flex justify-start">
//                     <div className="bg-gray-100 text-gray-800 p-3 rounded-lg max-w-[75%] shadow-sm">
//                       <div className="flex items-center space-x-2">
//                         <FaSpinner className="w-4 h-4 animate-spin" />
//                         <span>Processing...</span>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>
//               <div className="p-5 border-t border-gray-200">
//                 <div className="flex space-x-2">
//                   <input
//                     type="text"
//                     value={chatInput}
//                     onChange={(e) => setChatInput(e.target.value)}
//                     onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
//                     disabled={isChatLoading}
//                     className="flex-1 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
//                     placeholder="Type your message..."
//                   />
//                   <motion.button
//                     onClick={handleSendMessage}
//                     disabled={!chatInput.trim() || isChatLoading}
//                     className="px-5 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 transition-colors"
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                   >
//                     Send
//                   </motion.button>
//                 </div>
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>

//         {/* Assigned Project Modal */}
//         <AnimatePresence>
//           {selectedProject && (
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               transition={{ duration: 0.3 }}
//               className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
//             >
//               <motion.div
//                 initial={{ scale: 0.9, opacity: 0 }}
//                 animate={{ scale: 1, opacity: 1 }}
//                 exit={{ scale: 0.9, opacity: 0 }}
//                 transition={{ duration: 0.2 }}
//                 className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg border border-gray-100"
//               >
//                 <div className="flex justify-between items-center mb-6">
//                   <h2 className="text-2xl font-semibold text-gray-900">Assigned Project</h2>
//                   <button
//                     onClick={() => setSelectedProject(null)}
//                     className="text-gray-500 hover:text-gray-700"
//                   >
//                     <FaTimes className="w-6 h-6" />
//                   </button>
//                 </div>
//                 <h3 className="text-xl font-medium text-gray-900">{selectedProject.childrenName}</h3>
//                 <p className="text-sm text-gray-500 mb-4">{selectedProject.email}</p>
//                 <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
//                   <h4 className="text-lg font-semibold text-indigo-600">{selectedProject.project.title}</h4>
//                   <p className="text-gray-700 mt-1">{selectedProject.project.description}</p>
//                 </div>
//                 <div className="mt-6 flex justify-end">
//                   <motion.button
//                     onClick={() => {
//                       setSelectedProject(null);
//                       setIsChatOpen(true);
//                     }}
//                     className="px-5 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                   >
//                     Update Project
//                   </motion.button>
//                 </div>
//               </motion.div>
//             </motion.div>
//           )}
//         </AnimatePresence>

//         {/* Submitted Photos Modal */}
//         <AnimatePresence>
//           {selectedSubmittedPhotos && (
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               transition={{ duration: 0.3 }}
//               className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
//             >
//               <motion.div
//                 initial={{ scale: 0.9, opacity: 0 }}
//                 animate={{ scale: 1, opacity: 1 }}
//                 exit={{ scale: 0.9, opacity: 0 }}
//                 transition={{ duration: 0.2 }}
//                 className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg border border-gray-100"
//               >
//                 <div className="flex justify-between items-center mb-6">
//                   <h2 className="text-2xl font-semibold text-gray-900">Submitted Photos</h2>
//                   <button
//                     onClick={() => setSelectedSubmittedPhotos(null)}
//                     className="text-gray-500 hover:text-gray-700"
//                   >
//                     <FaTimes className="w-6 h-6" />
//                   </button>
//                 </div>
//                 <h3 className="text-xl font-medium text-gray-900">{selectedSubmittedPhotos.childrenName}</h3>
//                 <p className="text-sm text-gray-500 mb-4">{selectedSubmittedPhotos.email}</p>
//                 {selectedSubmittedPhotos.project?.title && (
//                   <div className="bg-gray-50 p-4 rounded-lg shadow-sm mb-4">
//                     <h4 className="text-lg font-semibold text-indigo-600">{selectedSubmittedPhotos.project.title}</h4>
//                     <p className="text-gray-700 mt-1">{selectedSubmittedPhotos.project.description}</p>
//                   </div>
//                 )}
//                 {selectedSubmittedPhotos.submittedPhotos?.length > 0 ? (
//                   <div className="mt-4">
//                     <h4 className="text-lg font-semibold text-gray-900 mb-2">Submitted Photos</h4>
//                     <div className="grid grid-cols-2 gap-4">
//                       {selectedSubmittedPhotos.submittedPhotos.map((photoId) => (
//                         imageCache[photoId] && (
//                           <img
//                             key={photoId}
//                             src={imageCache[photoId]}
//                             alt="Submitted project"
//                             className="w-full h-32 object-cover rounded-lg border border-gray-200 shadow-sm"
//                             onError={(e) => {
//                               e.target.style.display = "none";
//                             }}
//                           />
//                         )
//                       ))}
//                     </div>
//                   </div>
//                 ) : (
//                   <p className="text-gray-600">No photos submitted yet.</p>
//                 )}
//                 <div className="mt-6 flex justify-end">
//                   <motion.button
//                     onClick={() => setSelectedSubmittedPhotos(null)}
//                     className="px-5 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                   >
//                     Close
//                   </motion.button>
//                 </div>
//               </motion.div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>
//     </div>
//   );
// };

// export default StudentProject;

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaLightbulb, FaProjectDiagram, FaCamera, FaTimes, FaSpinner, FaEdit, FaImages } from "react-icons/fa";
import { toast } from "sonner";
import { useDebounce } from "use-debounce";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useAuth } from "../Store/auth";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_API_KEY);
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const StudentProject = () => {
  const { user, authorizationToken, role, isLoggedIn, setUser } = useAuth();
  const [student, setStudent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [lastRequestTime, setLastRequestTime] = useState(0);
  const [conversationCache, setConversationCache] = useState({});
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedSubmittedPhotos, setSelectedSubmittedPhotos] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isSubmittingPhoto, setIsSubmittingPhoto] = useState(false);
  const [imageCache, setImageCache] = useState({});
  const [debouncedChatInput] = useDebounce(chatInput, 300);

  const localProjectSuggestions = {
    science: "Create a science experiment demonstrating [concept]",
    art: "Produce an art piece exploring [theme]",
    sports: "Develop a training program for [sport]",
    technology: "Build a simple [technology] project",
    math: "Design a math puzzle about [topic]",
    history: "Create a timeline of [historical event]",
    music: "Compose a short piece in [genre] style",
  };

  // Fetch student profile
  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${backendUrl}/api/students/profile`, {
          headers: { Authorization: authorizationToken },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setStudent(data);
        setUser(data);
        // Fetch images for profile picture and submitted photos
        if (data.profilePicture) {
          await fetchImage(data.profilePicture);
        }
        if (data.submittedPhotos?.length > 0) {
          await Promise.all(data.submittedPhotos.map((photoId) => fetchImage(photoId)));
        }
      } catch (error) {
        console.error("Fetch profile error:", error);
        toast.error("Failed to load profile");
      } finally {
        setIsLoading(false);
      }
    };

    if (isLoggedIn && role === "student") {
      fetchProfile();
    } else {
      toast.error("Please log in as a student");
    }
  }, [isLoggedIn, role, authorizationToken, setUser]);

  // Fetch image from GridFS
  const fetchImage = async (fileId) => {
    if (imageCache[fileId]) return;
    try {
      const response = await fetch(`${backendUrl}/api/students/files/${fileId}`, {
        headers: { Authorization: authorizationToken },
      });
      if (response.ok) {
        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        setImageCache((prev) => ({ ...prev, [fileId]: imageUrl }));
      }
    } catch (error) {
      console.error(`Error fetching image ${fileId}:`, error);
    }
  };

  // Save project to backend
  const saveProject = async (title, description) => {
    try {
      const response = await fetch(`${backendUrl}/api/students/project`, {
        method: "PUT",
        headers: {
          Authorization: authorizationToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ projectTitle: title, projectDescription: description }),
      });
      const data = await response.json();
      if (response.ok) {
        setStudent((prev) => ({ ...prev, project: { title, description } }));
        setUser((prev) => ({ ...prev, project: { title, description } }));
        toast.success("Project saved successfully!");
      } else {
        toast.error(data.message || "Failed to save project");
      }
    } catch (error) {
      console.error("Save project error:", error);
      toast.error("Error saving project");
    }
  };

  // Get local project suggestion
  const getLocalSuggestion = (input) => {
    const lowerInput = input.toLowerCase();
    for (const [key, suggestion] of Object.entries(localProjectSuggestions)) {
      if (lowerInput.includes(key)) {
        return suggestion
          .replace("[concept]", input.split(" ")[0])
          .replace("[theme]", input.split(" ")[0])
          .replace("[sport]", input.split(" ")[0])
          .replace("[technology]", input.split(" ")[0])
          .replace("[topic]", input.split(" ")[0])
          .replace("[historical event]", input.split(" ")[0] + " " + (input.split(" ")[1] || ""))
          .replace("[genre]", input.split(" ")[0]);
      }
    }
    return `Create a project exploring ${input}`;
  };

  // Handle chatbot message
  const handleSendMessage = async () => {
    if (!chatInput.trim() || isChatLoading) return;

    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime;
    const MIN_DELAY = 2000;

    if (timeSinceLastRequest < MIN_DELAY) {
      setChatMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content: `Please wait ${((MIN_DELAY - timeSinceLastRequest) / 1000).toFixed(1)} seconds before sending another message.`,
        },
      ]);
      return;
    }

    setLastRequestTime(now);
    const userMessage = { role: "student", content: chatInput };
    setChatMessages((prev) => [...prev, userMessage]);
    setChatInput("");
    setIsChatLoading(true);

    const messagesForApi = [...chatMessages, userMessage].map((msg) => ({
      role: msg.role === "ai" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    const cacheKey = JSON.stringify(messagesForApi);
    if (conversationCache[cacheKey]) {
      setChatMessages((prev) => [...prev, { role: "ai", content: conversationCache[cacheKey] }]);
      setIsChatLoading(false);
      return;
    }

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const exchangeCount = messagesForApi.filter((msg) => msg.role === "user").length;

      const systemInstruction = `
        You are a project assignment assistant for school students.
        The student is ${student?.childrenName || "Student"}.
        Your goal is to suggest a personalized project based on their hobbies and interests within 5-8 exchanges.
        Keep responses concise (1-2 sentences max).
        If this is the first message (exchangeCount = 1), start with: "Hello ${student?.childrenName || "Student"}! What do you enjoy doing in your free time?"
        For subsequent messages, do NOT repeat the initial greeting; instead, ask a relevant follow-up question based on the chat history (e.g., "What kind of [interest] do you like?").
        If the user gives vague answers (e.g., "hello"), prompt them with "Tell me more about what you like to do!"
        By exchanges 5-8, suggest a project with a title and 1-sentence description (e.g., "Project: Cricket Batting Trainer - Design a practice tool to improve your batting skills.").
        Current exchange count: ${exchangeCount}.
        Chat history: ${JSON.stringify(messagesForApi)}.
      `;

      const chatHistory = messagesForApi.filter((msg, index) => {
        if (exchangeCount === 1) return false;
        return index > 0 || msg.role === "user";
      });

      const chat = model.startChat({
        history: chatHistory,
        generationConfig: { temperature: 0.7, maxOutputTokens: 150 },
      });

      const result = await chat.sendMessage(`${systemInstruction}`);
      const aiResponse = result.response.text();

      if (aiResponse) {
        setConversationCache((prev) => ({ ...prev, [cacheKey]: aiResponse }));
        setChatMessages((prev) => [...prev, { role: "ai", content: aiResponse }]);

        if (exchangeCount >= 5 && aiResponse.includes("Project:")) {
          const [title, description] = aiResponse.split(" - ");
          const projectTitle = title.replace("Project: ", "").trim();
          const projectDescription = description.trim();
          await saveProject(projectTitle, projectDescription);
          setIsChatOpen(false);
        }
      }
    } catch (error) {
      console.error("Gemini API error:", error);
      const localSuggestion = getLocalSuggestion(chatInput);
      setChatMessages((prev) => [
        ...prev,
        { role: "ai", content: `Having trouble connecting to Gemini. Try this: ${localSuggestion}` },
      ]);
      toast.error("Error with Gemini API");
    } finally {
      setIsChatLoading(false);
    }
  };

  // Handle photo selection
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit project photo
  const handlePhotoSubmit = async () => {
    if (!photoFile) {
      toast.error("Please select an image to upload");
      return;
    }
    setIsSubmittingPhoto(true);
    try {
      const formData = new FormData();
      formData.append("profilePicture", photoFile); // Reusing field name for consistency
      const response = await fetch(`${backendUrl}/api/students/photo`, {
        method: "PUT",
        headers: { Authorization: authorizationToken },
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        setStudent((prev) => ({
          ...prev,
          submittedPhotos: [...(prev.submittedPhotos || []), data.photoId],
        }));
        setUser((prev) => ({
          ...prev,
          submittedPhotos: [...(prev.submittedPhotos || []), data.photoId],
        }));
        await fetchImage(data.photoId);
        setPhotoFile(null);
        setPhotoPreview(null);
        toast.success("Project photo submitted successfully");
      } else {
        toast.error(data.message || "Failed to submit photo");
      }
    } catch (error) {
      console.error("Submit photo error:", error);
      toast.error("Error submitting photo");
    } finally {
      setIsSubmittingPhoto(false);
    }
  };

  // Close chatbot
  const closeChat = () => {
    setIsChatOpen(false);
    setChatMessages([]);
    setChatInput("");
  };
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 flex justify-center items-center">
        <div className="flex flex-col items-center">
          <FaSpinner className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
          <p className="text-indigo-700 font-medium">Loading your project dashboard...</p>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 flex justify-center items-center">
        <div className="bg-white rounded-xl shadow-xl p-8 text-center max-w-md">
          <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaProjectDiagram className="text-indigo-600 text-2xl" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">Profile Not Found</h3>
          <p className="text-gray-600 mb-6">Please log in to access your projects.</p>
          <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
              Project Dashboard
            </h1>
            <p className="mt-2 text-gray-600 text-lg">
              Manage your assigned project and track progress
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-3">
            {student.profilePicture && imageCache[student.profilePicture] ? (
              <img
                src={imageCache[student.profilePicture]}
                alt={student.childrenName}
                className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold shadow-md">
                {student.childrenName.charAt(0)}
              </div>
            )}
            <div>
              <h2 className="font-semibold text-gray-900">{student.childrenName}</h2>
              <p className="text-sm text-gray-500">{student.email}</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Project Info Card */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 lg:col-span-2">
            <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 p-5 text-white">
              <h2 className="text-xl font-bold flex items-center">
                <FaProjectDiagram className="mr-2" />
                {student.project?.title ? "Your Project" : "Get Started"}
              </h2>
            </div>
            <div className="p-6">
              {student.project?.title ? (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{student.project.title}</h3>
                  <p className="text-gray-600 mb-4">{student.project.description}</p>
                  <div className="flex space-x-3">
                    <motion.button
                      onClick={() => setIsChatOpen(true)}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <FaEdit className="inline mr-2" />
                      Update Project
                    </motion.button>
                    <motion.button
                      onClick={() => setSelectedProject(student)}
                      className="px-4 py-2 bg-white text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors text-sm font-medium"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      View Details
                    </motion.button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaLightbulb className="text-indigo-600 text-2xl" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No Project Assigned Yet
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Let's find the perfect project for you based on your interests
                  </p>
                  <motion.button
                    onClick={() => setIsChatOpen(true)}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaLightbulb className="inline mr-2" />
                    Get Project Suggestions
                  </motion.button>
                </div>
              )}
            </div>
          </div>

          {/* Photo Submission Card */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
            <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 p-5 text-white">
              <h2 className="text-xl font-bold flex items-center">
                <FaCamera className="mr-2" />
                Project Photos
              </h2>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Submit New Photo</h3>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                  id="projectPhoto"
                />
                <label
                  htmlFor="projectPhoto"
                  className="block w-full px-4 py-3 bg-indigo-50 text-indigo-700 rounded-lg border border-indigo-200 hover:bg-indigo-100 transition-colors cursor-pointer text-center font-medium"
                >
                  <FaCamera className="inline mr-2" />
                  Select Image
                </label>
                {photoPreview && (
                  <div className="mt-4">
                    <img
                      src={photoPreview}
                      alt="Preview"
                      className="w-full h-40 object-contain rounded-lg border border-gray-200 shadow-sm"
                    />
                    <motion.button
                      onClick={handlePhotoSubmit}
                      disabled={isSubmittingPhoto}
                      className={`w-full mt-3 px-4 py-2 ${
                        isSubmittingPhoto ? "bg-green-500" : "bg-green-600 hover:bg-green-700"
                      } text-white rounded-lg transition-colors font-medium`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {isSubmittingPhoto ? (
                        <FaSpinner className="inline mr-2 animate-spin" />
                      ) : (
                        <FaCamera className="inline mr-2" />
                      )}
                      {isSubmittingPhoto ? "Uploading..." : "Submit Photo"}
                    </motion.button>
                  </div>
                )}
              </div>

              {student.submittedPhotos?.length > 0 && (
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">Your Submissions</h3>
                    <button
                      onClick={() => setSelectedSubmittedPhotos(student)}
                      className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                    >
                      View All
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {student.submittedPhotos.slice(0, 3).map((photoId) => (
                      imageCache[photoId] && (
                        <motion.div
                          key={photoId}
                          whileHover={{ scale: 1.05 }}
                          className="aspect-square overflow-hidden rounded-lg border border-gray-200 shadow-sm cursor-pointer"
                          onClick={() => setSelectedSubmittedPhotos(student)}
                        >
                          <img
                            src={imageCache[photoId]}
                            alt="Submitted project"
                            className="w-full h-full object-cover"
                          />
                        </motion.div>
                      )
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats/Progress Section */}
        {student.project?.title && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
              <div className="flex items-center">
                <div className="bg-indigo-100 p-3 rounded-full mr-4">
                  <FaLightbulb className="text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Project Status</p>
                  <p className="font-semibold text-gray-900">In Progress</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
              <div className="flex items-center">
                <div className="bg-green-100 p-3 rounded-full mr-4">
                  <FaImages className="text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Photos Submitted</p>
                  <p className="font-semibold text-gray-900">
                    {student.submittedPhotos?.length || 0}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
              <div className="flex items-center">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <FaProjectDiagram className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Project Type</p>
                  <p className="font-semibold text-gray-900">
                    {student.project.title.split(":")[0] || "Custom"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Chatbot Modal - Keep the existing modal code but with updated styling */}
        <AnimatePresence>
          {isChatOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 md:inset-auto md:bottom-8 md:right-8 md:w-96 md:h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden border border-gray-200"
            >
              <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 text-white p-4 flex justify-between items-center">
                <div className="flex items-center">
                  <div className="bg-indigo-100 bg-opacity-20 p-2 rounded-full mr-3">
                    <FaLightbulb className="text-white" />
                  </div>
                  <h2 className="text-lg font-semibold">
                    {student.project?.title ? "Project Assistant" : "Find Your Project"}
                  </h2>
                </div>
                <button
                  onClick={closeChat}
                  className="text-white hover:text-indigo-200 p-1 rounded-full"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50">
                {chatMessages.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full text-center p-6 text-gray-500">
                    <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                      <FaLightbulb className="text-indigo-600 text-2xl" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-700 mb-2">
                      {student.project?.title
                        ? "How can I help improve your project?"
                        : "Let's find your perfect project!"}
                    </h3>
                    <p>
                      {student.project?.title
                        ? "Tell me what you'd like to change or improve."
                        : "Share your interests to get personalized suggestions."}
                    </p>
                  </div>
                )}
                {chatMessages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.role === "student" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-xl ${
                        message.role === "student"
                          ? "bg-indigo-600 text-white rounded-br-none"
                          : "bg-white text-gray-800 rounded-bl-none shadow-sm"
                      }`}
                    >
                      {message.content}
                    </div>
                  </motion.div>
                ))}
                {isChatLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white text-gray-800 p-3 rounded-xl rounded-bl-none shadow-sm max-w-[80%]">
                      <div className="flex items-center space-x-2">
                        <FaSpinner className="w-4 h-4 animate-spin text-indigo-600" />
                        <span>Thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="p-4 border-t border-gray-200 bg-white">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    disabled={isChatLoading}
                    className="flex-1 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    placeholder="Type your message..."
                  />
                  <motion.button
                    onClick={handleSendMessage}
                    disabled={!chatInput.trim() || isChatLoading}
                    className="px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 transition-colors flex items-center justify-center"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Project Details Modal - Updated styling */}
        <AnimatePresence>
          {selectedProject && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden"
              >
                <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 p-5 text-white">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold">Project Details</h2>
                    <button
                      onClick={() => setSelectedProject(null)}
                      className="text-white hover:text-indigo-200"
                    >
                      <FaTimes className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center mb-6">
                    {selectedProject.profilePicture && imageCache[selectedProject.profilePicture] ? (
                      <img
                        src={imageCache[selectedProject.profilePicture]}
                        alt={selectedProject.childrenName}
                        className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm mr-4"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold shadow-sm mr-4">
                        {selectedProject.childrenName.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-gray-900">{selectedProject.childrenName}</h3>
                      <p className="text-sm text-gray-500">{selectedProject.email}</p>
                    </div>
                  </div>
                  <div className="bg-indigo-50 p-5 rounded-lg border border-indigo-100">
                    <div className="flex items-start">
                      <div className="bg-indigo-100 p-2 rounded-full mr-4">
                        <FaProjectDiagram className="text-indigo-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-indigo-700 mb-1">
                          {selectedProject.project.title}
                        </h4>
                        <p className="text-gray-700">{selectedProject.project.description}</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end space-x-3">
                    <motion.button
                      onClick={() => setSelectedProject(null)}
                      className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      Close
                    </motion.button>
                    <motion.button
                      onClick={() => {
                        setSelectedProject(null);
                        setIsChatOpen(true);
                      }}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <FaEdit className="inline mr-2" />
                      Update
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Photos Modal - Updated styling */}
        <AnimatePresence>
          {selectedSubmittedPhotos && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden"
              >
                <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 p-5 text-white">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold">Submitted Photos</h2>
                    <button
                      onClick={() => setSelectedSubmittedPhotos(null)}
                      className="text-white hover:text-indigo-200"
                    >
                      <FaTimes className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center mb-6">
                    {selectedSubmittedPhotos.profilePicture &&
                    imageCache[selectedSubmittedPhotos.profilePicture] ? (
                      <img
                        src={imageCache[selectedSubmittedPhotos.profilePicture]}
                        alt={selectedSubmittedPhotos.childrenName}
                        className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm mr-4"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold shadow-sm mr-4">
                        {selectedSubmittedPhotos.childrenName.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {selectedSubmittedPhotos.childrenName}
                      </h3>
                      <p className="text-sm text-gray-500">{selectedSubmittedPhotos.email}</p>
                    </div>
                  </div>

                  {selectedSubmittedPhotos.project?.title && (
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
                      <h4 className="font-semibold text-gray-900 mb-1">
                        {selectedSubmittedPhotos.project.title}
                      </h4>
                      <p className="text-gray-600">{selectedSubmittedPhotos.project.description}</p>
                    </div>
                  )}

                  {selectedSubmittedPhotos.submittedPhotos?.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {selectedSubmittedPhotos.submittedPhotos.map((photoId) => (
                        imageCache[photoId] && (
                          <motion.div
                            key={photoId}
                            whileHover={{ scale: 1.02 }}
                            className="aspect-square overflow-hidden rounded-lg border border-gray-200 shadow-sm"
                          >
                            <img
                              src={imageCache[photoId]}
                              alt="Submitted project"
                              className="w-full h-full object-cover"
                            />
                          </motion.div>
                        )
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <FaImages className="mx-auto text-3xl text-gray-300 mb-3" />
                      <p>No photos submitted yet</p>
                    </div>
                  )}

                  <div className="mt-6 flex justify-end">
                    <motion.button
                      onClick={() => setSelectedSubmittedPhotos(null)}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      Close Gallery
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default StudentProject;