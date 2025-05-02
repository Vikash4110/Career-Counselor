import React, { useState, useEffect } from "react";
import { useAuth } from "../Store/auth";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEnvelope,
  faLock,
  faPhone,
  faImage,
  faBook,
  faChalkboard,
  faKey,
  faArrowLeft,
  faArrowRight,
  faUserCircle,
  faCheckCircle,
  faGraduationCap,
} from "@fortawesome/free-solid-svg-icons";
import { RotatingLines } from "react-loader-spinner";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const TeacherRegister = () => {
  const [formData, setFormData] = useState({
    teacherName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    profilePicture: null,
    subject: "",
    classGrade: "",
    section: "",
  });
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(25);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [profilePreview, setProfilePreview] = useState(null);
  const { storeTokenInLS } = useAuth();
  const navigate = useNavigate();

  const stepTitles = [
    "Personal Information",
    "Contact Details",
    "Teaching Information",
    "Verification",
  ];

  const stepIcons = [
    <FontAwesomeIcon icon={faUser} className="text-blue-500" />,
    <FontAwesomeIcon icon={faPhone} className="text-blue-500" />,
    <FontAwesomeIcon icon={faChalkboard} className="text-blue-500" />,
    <FontAwesomeIcon icon={faKey} className="text-blue-500" />,
  ];

  // Update progress bar and password strength
  useEffect(() => {
    setProgress((step / 4) * 100);
  }, [step]);

  useEffect(() => {
    if (formData.password) {
      let strength = 0;
      if (formData.password.length >= 6) strength += 1;
      if (formData.password.match(/[A-Z]/)) strength += 1;
      if (formData.password.match(/[0-9]/)) strength += 1;
      if (formData.password.match(/[^A-Za-z0-9]/)) strength += 1;
      setPasswordStrength(strength);
    } else {
      setPasswordStrength(0);
    }
  }, [formData.password]);

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      const file = files[0];
      setFormData((prev) => ({ ...prev, [name]: file }));
      if (file) {
        setProfilePreview(URL.createObjectURL(file));
      } else {
        setProfilePreview(null);
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateStep = () => {
    if (step === 1) {
      if (!formData.teacherName || !formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
        toast.error("Please fill all required fields");
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        toast.error("Passwords do not match");
        return false;
      }
      if (passwordStrength < 2) {
        toast.error("Please choose a stronger password (at least 6 characters with uppercase, number, or special character)");
        return false;
      }
    } else if (step === 2) {
      if (!formData.phoneNumber) {
        toast.error("Phone number is required");
        return false;
      }
      if (!/^\d{10}$/.test(formData.phoneNumber)) {
        toast.error("Phone number must be 10 digits");
        return false;
      }
    } else if (step === 3) {
      if (!formData.subject || !formData.classGrade || !formData.section) {
        toast.error("Please fill all teaching information");
        return false;
      }
    }
    return true;
  };

  const handleNextStep = () => {
    if (validateStep()) {
      setStep(step + 1);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;

    setLoading(true);

    const data = new FormData();
    for (const key in formData) {
      if (key === "profilePicture" && formData[key]) {
        data.append(key, formData[key]);
      } else {
        data.append(key, formData[key]);
      }
    }

    try {
      const response = await fetch(`${backendUrl}/api/teachers/register`, {
        method: "POST",
        body: data,
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.extraDetails || result.message || "Registration failed");
      }

      toast.success("OTP sent to your email. Please verify.");
      setStep(4);
    } catch (error) {
      console.error("Registration error:", error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }
    setLoading(true);

    try {
      const response = await fetch(`${backendUrl}/api/teachers/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, otp }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.extraDetails || data.message || "OTP verification failed");
      }

      storeTokenInLS(data.token);
      toast.success("Registration successful! Redirecting...");
      setTimeout(() => navigate("/teacher-dashboard"), 1000);
    } catch (error) {
      console.error("OTP verification error:", error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 0: return "bg-gray-200";
      case 1: return "bg-red-500";
      case 2: return "bg-yellow-500";
      case 3: return "bg-blue-500";
      case 4: return "bg-green-500";
      default: return "bg-gray-200";
    }
  };

  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case 0: return "Very Weak";
      case 1: return "Weak";
      case 2: return "Moderate";
      case 3: return "Strong";
      case 4: return "Very Strong";
      default: return "";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
      <motion.div
        className="w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header with progress bar */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white relative">
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
            <motion.div
              className="h-full bg-white transition-all duration-500 ease-out"
              initial={{ width: "25%" }}
              animate={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex items-center justify-between relative z-10">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
                <FontAwesomeIcon icon={faGraduationCap} className="text-2xl" />
                Teacher Registration
              </h1>
              <p className="text-blue-100 mt-1">Join our educational platform in just a few steps</p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
              <FontAwesomeIcon icon={faUserCircle} className="text-xl" />
            </div>
          </div>
        </div>

        {/* Step indicators */}
        <div className="px-6 pt-6 pb-2 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -translate-y-1/2 z-0"></div>
            {stepTitles.map((title, index) => (
              <motion.div
                key={index}
                className={`flex flex-col items-center relative z-10 cursor-pointer ${index < step - 1 ? "text-blue-600" : "text-gray-400"}`}
                onClick={() => step > index + 1 && setStep(index + 1)}
                whileHover={{ scale: index < step - 1 ? 1.05 : 1 }}
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all ${
                    index < step - 1
                      ? "bg-blue-100 border-2 border-blue-500"
                      : step === index + 1
                      ? "bg-blue-600 text-white border-2 border-blue-700 shadow-lg"
                      : "bg-gray-100 border-2 border-gray-300"
                  }`}
                >
                  {index < step - 1 ? (
                    <FontAwesomeIcon icon={faCheckCircle} className="text-blue-600 text-xl" />
                  ) : (
                    stepIcons[index]
                  )}
                </div>
                <span className="text-xs font-medium text-center hidden sm:block">{title}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Form content */}
        <div className="p-6 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: step > 1 ? 50 : -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: step > 1 ? -50 : 50 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-xl md:text-2xl font-semibold text-gray-800 flex items-center gap-3">
                  {stepIcons[step - 1]}
                  {stepTitles[step - 1]}
                </h2>
                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  Step {step} of 4
                </span>
              </div>

              {step === 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    icon={<FontAwesomeIcon icon={faUser} className="text-gray-500" />}
                    type="text"
                    name="teacherName"
                    value={formData.teacherName}
                    onChange={handleInputChange}
                    placeholder="Full Name"
                    required
                  />
                  <InputField
                    icon={<FontAwesomeIcon icon={faUser} className="text-gray-500" />}
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="Username"
                    required
                  />
                  <InputField
                    icon={<FontAwesomeIcon icon={faEnvelope} className="text-gray-500" />}
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Email Address"
                    required
                  />
                  <div className="space-y-1">
                    <InputField
                      icon={<FontAwesomeIcon icon={faLock} className="text-gray-500" />}
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Password (min 6 characters)"
                      required
                      minLength={6}
                    />
                    {formData.password && (
                      <div className="flex items-center justify-between px-2">
                        <span className={`text-xs font-medium ${getPasswordStrengthColor().replace('bg-', 'text-')}`}>
                          {getPasswordStrengthText()}
                        </span>
                        <div className="flex gap-1 w-20">
                          {[1, 2, 3, 4].map((i) => (
                            <div
                              key={i}
                              className={`h-1 rounded-full w-full ${i <= passwordStrength ? getPasswordStrengthColor() : "bg-gray-200"}`}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <InputField
                    icon={<FontAwesomeIcon icon={faLock} className="text-gray-500" />}
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm Password"
                    required
                    minLength={6}
                  />
                </div>
              )}

              {step === 2 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    icon={<FontAwesomeIcon icon={faPhone} className="text-gray-500" />}
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="Phone Number (10 digits)"
                    required
                    pattern="\d{10}"
                    title="Phone number must be 10 digits"
                    className="py-2 h-10"
                  />
                  <FileUpload
                    icon={<FontAwesomeIcon icon={faImage} className="text-blue-500" />}
                    label="Profile Picture"
                    name="profilePicture"
                    onChange={handleInputChange}
                    profilePreview={profilePreview}
                  />
                </div>
              )}

              {step === 3 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <InputField
                    icon={<FontAwesomeIcon icon={faBook} className="text-gray-500" />}
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="Subject (e.g., Mathematics)"
                    required
                  />
                  <SelectField
                    icon={<FontAwesomeIcon icon={faChalkboard} className="text-gray-500" />}
                    name="classGrade"
                    value={formData.classGrade}
                    onChange={handleInputChange}
                    options={["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"]}
                    placeholder="Class Grade"
                    required
                  />
                  <SelectField
                    icon={<FontAwesomeIcon icon={faChalkboard} className="text-gray-500" />}
                    name="section"
                    value={formData.section}
                    onChange={handleInputChange}
                    options={["A", "B", "C", "D"]}
                    placeholder="Section"
                    required
                  />
                </div>
              )}

              {step === 4 && (
                <div className="space-y-6">
                  <motion.div
                    className="bg-blue-50 p-6 rounded-lg border border-blue-100 text-center"
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                      <FontAwesomeIcon icon={faEnvelope} className="text-blue-600 text-2xl" />
                    </div>
                    <h3 className="font-semibold text-blue-800 text-lg">Verify Your Email</h3>
                    <p className="text-blue-600 mt-2">
                      We've sent a 6-digit verification code to <br />
                      <span className="font-medium">{formData.email}</span>
                    </p>
                    <p className="text-sm text-blue-500 mt-2">
                      Didn't receive the code?{" "}
                      <button className="text-blue-700 font-medium hover:underline">Resend</button>
                    </p>
                  </motion.div>

                  <div className="space-y-4">
                    <InputField
                      icon={<FontAwesomeIcon icon={faKey} className="text-gray-500" />}
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      placeholder="Enter 6-digit OTP"
                      required
                      maxLength={6}
                    />
                    <div className="flex justify-center gap-2">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <div
                          key={i}
                          className={`w-10 h-12 flex items-center justify-center border-b-2 text-xl font-mono ${
                            i < otp.length
                              ? "border-blue-600 text-blue-600"
                              : "border-gray-300 text-gray-400"
                          }`}
                        >
                          {otp[i] || "•"}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-between gap-4 pt-6">
                {step > 1 ? (
                  <motion.button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all font-medium"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FontAwesomeIcon icon={faArrowLeft} />
                    Back
                  </motion.button>
                ) : (
                  <div></div>
                )}

                {step < 4 ? (
                  <motion.button
                    type="button"
                    onClick={step === 3 ? handleRegisterSubmit : handleNextStep}
                    disabled={loading}
                    className={`flex items-center justify-center gap-2 w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium shadow-md ${
                      loading ? "opacity-80 cursor-not-allowed" : "hover:from-blue-700 hover:to-indigo-700"
                    } transition-all`}
                    whileHover={{ scale: loading ? 1 : 1.02 }}
                    whileTap={{ scale: loading ? 1 : 0.98 }}
                  >
                    {loading ? (
                      <>
                        <RotatingLines
                          strokeColor="white"
                          strokeWidth="5"
                          animationDuration="0.75"
                          width="20"
                          visible={true}
                        />
                        Processing...
                      </>
                    ) : step === 3 ? (
                      "Complete Registration"
                    ) : (
                      <>
                        Next Step
                        <FontAwesomeIcon icon={faArrowRight} />
                      </>
                    )}
                  </motion.button>
                ) : (
                  <motion.button
                    onClick={handleOtpSubmit}
                    disabled={loading}
                    className={`flex items-center justify-center gap-2 w-full py-3 px-4 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg font-medium shadow-md ${
                      loading ? "opacity-80 cursor-not-allowed" : "hover:from-green-700 hover:to-teal-700"
                    } transition-all`}
                    whileHover={{ scale: loading ? 1 : 1.02 }}
                    whileTap={{ scale: loading ? 1 : 0.98 }}
                  >
                    {loading ? (
                      <>
                        <RotatingLines
                          strokeColor="white"
                          strokeWidth="5"
                          animationDuration="0.75"
                          width="20"
                          visible={true}
                        />
                        Verifying...
                      </>
                    ) : (
                      <>
                        Verify & Complete
                        <FontAwesomeIcon icon={faCheckCircle} />
                      </>
                    )}
                  </motion.button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex flex-col sm:flex-row justify-between items-center mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-2 sm:mb-0">
              Already have an account?{" "}
              <Link to="/teacher-login" className="text-blue-600 font-semibold hover:underline transition-all">
                Sign in here
              </Link>
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-sm text-gray-600 hover:text-blue-600">Terms of Service</a>
              <a href="#" className="text-sm text-gray-600 hover:text-blue-600">Privacy Policy</a>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const InputField = ({ icon, className = "p-3", ...props }) => (
  <motion.div
    className={`flex items-center gap-3 border border-gray-300 rounded-lg ${className} focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all bg-white`}
    whileHover={{ y: -2 }}
  >
    <div className="text-gray-500 w-5 flex justify-center">{icon}</div>
    <input
      {...props}
      className="w-full focus:outline-none bg-transparent text-gray-700 placeholder-gray-400"
    />
  </motion.div>
);

const SelectField = ({ icon, options, ...props }) => (
  <motion.div
    className="flex items-center gap-3 border border-gray-300 rounded-lg p-3 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all bg-white relative"
    whileHover={{ y: -2 }}
  >
    <div className="text-gray-500 w-5 flex justify-center">{icon}</div>
    <select
      {...props}
      className="w-full focus:outline-none bg-transparent text-gray-700 appearance-none pr-8"
    >
      <option value="">{props.placeholder}</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  </motion.div>
);

const FileUpload = ({ icon, label, name, onChange, profilePreview }) => (
  <motion.div
    className="border border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-400 transition-all bg-white flex items-center gap-4"
    whileHover={{ y: -2 }}
  >
    <div className="flex-shrink-0">
      {profilePreview ? (
        <img
          src={profilePreview}
          alt="Profile Preview"
          className="w-16 h-16 object-cover rounded-full border-2 border-blue-500"
        />
      ) : (
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
          <FontAwesomeIcon icon={faImage} className="text-gray-400 text-2xl" />
        </div>
      )}
    </div>
    <div className="flex-1">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="flex items-center gap-2">
        <motion.label
          className="cursor-pointer bg-blue-600 text-white py-1.5 px-4 rounded-md hover:bg-blue-700 transition-all text-sm font-medium"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          Choose File
          <input
            type="file"
            name={name}
            onChange={onChange}
            className="hidden"
            accept="image/*"
          />
        </motion.label>
      </div>
      <p className="text-xs text-gray-500 mt-1">JPEG, PNG (Max 2MB)</p>
    </div>
  </motion.div>
);

export default TeacherRegister;