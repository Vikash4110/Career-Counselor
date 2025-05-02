const Teacher = require("../models/teacher-model");
const Student = require("../models/student-model");
const mongoose = require("mongoose");
const multer = require("multer");
const { Readable } = require("stream");
const { registerSchema } = require("../validators/teacher-validator");
const { sendEmail } = require("../utils/email");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
}).single("profilePicture");

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const registerTeacher = [
  async (req, res, next) => {
    try {
      await new Promise((resolve, reject) => {
        upload(req, res, (err) => {
          if (err instanceof multer.MulterError) {
            return reject(new Error(`Multer error: ${err.message}`));
          } else if (err) {
            return reject(new Error(`Upload error: ${err.message}`));
          }
          console.log("Uploaded file:", req.file ? req.file.originalname : "None");
          resolve();
        });
      });
      next();
    } catch (error) {
      console.error("File upload failed:", error.message);
      res.status(400).json({ status: 400, message: "File upload failed", extraDetails: error.message });
    }
  },
  async (req, res, next) => {
    try {
      console.log("Incoming registration data:", JSON.stringify(req.body, null, 2));

      const validatedData = await registerSchema.parseAsync(req.body);
      const { email } = validatedData;

      const existingTeacher = await Teacher.findOne({ $or: [{ email }, { username: validatedData.username }] });
      if (existingTeacher) {
        console.log(`Duplicate found: ${email} or ${validatedData.username}`);
        return res.status(400).json({ status: 400, message: "Email or username already registered", extraDetails: "" });
      }

      const gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: "uploads" });
      let profilePictureId = null;

      if (req.file) {
        const uploadStream = gfs.openUploadStream(`${Date.now()}-${req.file.originalname}`);
        const bufferStream = Readable.from(req.file.buffer);
        profilePictureId = uploadStream.id;

        await new Promise((resolve, reject) => {
          bufferStream
            .pipe(uploadStream)
            .on("error", (err) => reject(err))
            .on("finish", () => resolve());
        });
        console.log("Profile picture uploaded with ID:", profilePictureId);
      }

      const otp = generateOTP();
      await sendEmail(email, "Verify Your Email", `Your OTP for registration is: ${otp}`);
      console.log(`OTP sent to ${email}: ${otp}`);

      const tempTeacher = {
        ...validatedData,
        profilePicture: profilePictureId,
        otp,
        expiresAt: Date.now() + 10 * 60 * 1000, // 10-minute expiration
      };

      req.app.locals.tempTeachers = req.app.locals.tempTeachers || {};
      req.app.locals.tempTeachers[email] = tempTeacher;
      console.log("Stored tempTeacher:", JSON.stringify(tempTeacher, null, 2));

      res.status(200).json({ status: 200, message: "OTP sent to your email. Please verify.", extraDetails: "" });
    } catch (error) {
      if (error.name === "ZodError") {
        const status = 422;
        const message = "Validation failed";
        const extraDetails = error.errors.map((err) => `${err.path.join(".")}: ${err.message}`).join(", ");
        console.error(`[${status}] ${message}: ${extraDetails}`);
        return res.status(status).json({ status, message, extraDetails });
      }
      next(error); // Pass other errors to error middleware
    }
  },
];

const verifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const tempTeachers = req.app.locals.tempTeachers || {};
    const tempTeacher = tempTeachers[email];

    if (!tempTeacher || tempTeacher.otp !== otp || Date.now() > tempTeacher.expiresAt) {
      console.log(`Invalid OTP attempt for ${email}: ${otp}`);
      return res.status(400).json({ status: 400, message: "Invalid or expired OTP", extraDetails: "" });
    }

    const teacher = new Teacher({
      teacherName: tempTeacher.teacherName,
      username: tempTeacher.username,
      email: tempTeacher.email,
      password: tempTeacher.password,
      phoneNumber: tempTeacher.phoneNumber,
      profilePicture: tempTeacher.profilePicture,
      subject: tempTeacher.subject,
      classGrade: tempTeacher.classGrade,
      section: tempTeacher.section,
    });
    await teacher.save();
    const token = teacher.generateToken();

    delete req.app.locals.tempTeachers[email];
    console.log(`Teacher registered: ${email}, Token: ${token}`);

    res.status(201).json({ status: 201, message: "Teacher registered successfully", token });
  } catch (error) {
    next(error);
  }
};

const loginTeacher = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const teacher = await Teacher.findOne({ email });
    if (!teacher || !(await teacher.comparePassword(password))) {
      console.log(`Login failed for ${email}`);
      return res.status(401).json({ status: 401, message: "Invalid credentials", extraDetails: "" });
    }
    const token = teacher.generateToken();
    console.log(`Login successful for ${email}, Token: ${token}`);
    res.json({ status: 200, message: "Login successful", token });
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const teacher = await Teacher.findOne({ email });
    if (!teacher) {
      console.log(`Email not found: ${email}`);
      return res.status(404).json({ status: 404, message: "Email not found", extraDetails: "" });
    }

    const otp = generateOTP();
    await sendEmail(email, "Password Reset OTP", `Your OTP to reset your password is: ${otp}`);
    console.log(`Reset OTP sent to ${email}: ${otp}`);

    req.app.locals.resetOTPs = req.app.locals.resetOTPs || {};
    req.app.locals.resetOTPs[email] = {
      otp,
      expiresAt: Date.now() + 10 * 60 * 1000,
    };

    res.status(200).json({ status: 200, message: "OTP sent to your email for password reset.", extraDetails: "" });
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;
    const resetOTPs = req.app.locals.resetOTPs || {};
    const resetData = resetOTPs[email];

    if (!resetData || resetData.otp !== otp || Date.now() > resetData.expiresAt) {
      console.log(`Invalid reset OTP attempt for ${email}: ${otp}`);
      return res.status(400).json({ status: 400, message: "Invalid or expired OTP", extraDetails: "" });
    }

    const teacher = await Teacher.findOne({ email });
    if (!teacher) {
      console.log(`Teacher not found for reset: ${email}`);
      return res.status(404).json({ status: 404, message: "Teacher not found", extraDetails: "" });
    }

    teacher.password = newPassword;
    await teacher.save();
    delete req.app.locals.resetOTPs[email];
    console.log(`Password reset successful for ${email}`);

    res.status(200).json({ status: 200, message: "Password reset successfully", extraDetails: "" });
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const teacher = await Teacher.findById(req.user.userId).select("-password");
    if (!teacher) {
      console.log(`Profile not found for userId: ${req.user.userId}`);
      return res.status(404).json({ status: 404, message: "Teacher not found", extraDetails: "" });
    }
    console.log("Fetched profile data:", JSON.stringify(teacher.toObject(), null, 2));
    res.json(teacher);
  } catch (error) {
    next(error);
  }
};


const getFile = async (req, res, next) => {
  try {
    const gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: "uploads" });
    const fileId = new mongoose.Types.ObjectId(req.params.fileId);
    const files = await gfs.find({ _id: fileId }).toArray();

    if (!files || files.length === 0) {
      console.log(`File not found for ID: ${fileId}`);
      return res.status(404).json({ status: 404, message: "File not found", extraDetails: "" });
    }

    const file = files[0];
    console.log(`Serving file: ${file.filename}, ID: ${fileId}`);
    res.set("Content-Type", file.contentType || "application/octet-stream");
    res.set("Content-Disposition", `inline; filename="${file.filename}"`);
    gfs.openDownloadStream(fileId).pipe(res).on("error", (err) => {
      console.error(`Error streaming file ${fileId}:`, err);
      res.status(500).end();
    });
  } catch (error) {
    console.error("Error in getFile:", error);
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { teacherName, email, phoneNumber, subject, classGrade, section } = req.body;
    const teacher = await Teacher.findById(req.user.userId);

    if (!teacher) {
      console.log(`Teacher not found for update: ${req.user.userId}`);
      return res.status(404).json({ status: 404, message: "Teacher not found", extraDetails: "" });
    }

    teacher.teacherName = teacherName || teacher.teacherName;
    teacher.email = email || teacher.email;
    teacher.phoneNumber = phoneNumber || teacher.phoneNumber;
    teacher.subject = subject || teacher.subject;
    teacher.classGrade = classGrade || teacher.classGrade;
    teacher.section = section || teacher.section;

    await teacher.save();
    console.log(`Profile updated for ${teacher.email}`);
    res.status(200).json({ status: 200, message: "Profile updated successfully", data: teacher });
  } catch (error) {
    next(error);
  }
};


const addStudent = [
  async (req, res, next) => {
    try {
      await new Promise((resolve, reject) => {
        upload(req, res, (err) => {
          if (err instanceof multer.MulterError) {
            return reject(new Error(`Multer error: ${err.message}`));
          } else if (err) {
            return reject(new Error(`Upload error: ${err.message}`));
          }
          console.log("Student profile picture uploaded:", req.file ? req.file.originalname : "No file");
          resolve();
        });
      });
      next();
    } catch (error) {
      console.error("File upload failed:", error.message);
      res.status(400).json({ status: 400, message: "File upload failed", extraDetails: error.message });
    }
  },
  async (req, res, next) => {
    try {
      const { name, rollNo, classGrade, section } = req.body;
      const teacherId = req.user.userId;

      const existingStudent = await Student.findOne({ rollNo });
      if (existingStudent) {
        return res.status(400).json({ status: 400, message: "Roll number already exists", extraDetails: "" });
      }

      const gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: "uploads" });
      let profilePictureId = null;

      if (req.file) {
        const uploadStream = gfs.openUploadStream(`${Date.now()}-${req.file.originalname}`);
        const bufferStream = Readable.from(req.file.buffer);
        profilePictureId = uploadStream.id;

        await new Promise((resolve, reject) => {
          bufferStream
            .pipe(uploadStream)
            .on("error", (err) => reject(err))
            .on("finish", () => {
              console.log(`Student profile picture saved with ID: ${profilePictureId}`);
              resolve();
            });
        });
      }

      const student = new Student({
        name,
        rollNo,
        classGrade,
        section,
        profilePicture: profilePictureId,
        teacher: teacherId,
        project: { title: "", description: "" }, // Initialize empty project
      });

      await student.save();
      console.log(`Student added: ${name}, Profile Picture ID: ${profilePictureId || "None"}`);
      res.status(201).json(student);
    } catch (error) {
      console.error("Error adding student:", error);
      next(error);
    }
  },
];

const getStudents = async (req, res, next) => {
  try {
    const teacherId = req.user.userId;
    const students = await Student.find({ teacher: teacherId });
    console.log(`Fetched ${students.length} students for teacher ${teacherId}`);
    res.json(students);
  } catch (error) {
    console.error("Error fetching students:", error);
    next(error);
  }
};

const updateStudentProject = async (req, res, next) => {
  try {
    const { studentId, projectTitle, projectDescription } = req.body;
    const teacherId = req.user.userId;

    const student = await Student.findOne({ _id: studentId, teacher: teacherId });
    if (!student) {
      return res.status(404).json({ status: 404, message: "Student not found or not assigned to you", extraDetails: "" });
    }

    student.project = {
      title: projectTitle,
      description: projectDescription,
    };
    await student.save();

    console.log(`Project updated for student ${student.name}: ${projectTitle}`);
    res.status(200).json({ status: 200, message: "Project updated successfully", data: student });
  } catch (error) {
    console.error("Error updating student project:", error);
    next(error);
  }
};

module.exports = {
  registerTeacher,
  verifyOTP,
  loginTeacher,
  forgotPassword,
  resetPassword,
  getProfile,
  getFile,
  updateProfile,
  addStudent,
  getStudents,
  updateStudentProject
};