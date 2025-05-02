// const express = require('express');
// const Student = require('../models/student-model');
// const mongoose = require('mongoose');
// const multer = require('multer');
// const { Readable } = require('stream');
// const { registerSchema } = require('../validators/student-validator');
// const { sendEmail } = require('../utils/email');
// const { authMiddleware, validate } = require('../middlewares/student-middleware');
// const Razorpay = require('razorpay');
// const crypto = require('crypto');

// const upload = multer({
//   storage: multer.memoryStorage(),
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
// }).single('profilePicture');

// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_KEY_SECRET,
// });

// const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// const registerStudent = [
//   async (req, res, next) => {
//     try {
//       await new Promise((resolve, reject) => {
//         upload(req, res, (err) => {
//           if (err instanceof multer.MulterError) {
//             return reject(new Error(`Multer error: ${err.message}`));
//           } else if (err) {
//             return reject(new Error(`Upload error: ${err.message}`));
//           }
//           console.log('Uploaded file:', req.file ? req.file.originalname : 'None');
//           resolve();
//         });
//       });
//       next();
//     } catch (error) {
//       console.error('File upload failed:', error.message);
//       res.status(400).json({ status: 400, message: 'File upload failed', extraDetails: error.message });
//     }
//   },
//   async (req, res, next) => {
//     try {
//       console.log('Incoming registration data:', JSON.stringify(req.body, null, 2));

//       const validatedData = await registerSchema.parseAsync(req.body);
//       const { email } = validatedData;

//       const existingStudent = await Student.findOne({ email });
//       if (existingStudent) {
//         console.log(`Duplicate email found: ${email}`);
//         return res.status(400).json({ status: 400, message: 'Email already registered', extraDetails: '' });
//       }

//       const gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: 'Uploads' });
//       let profilePictureId = null;

//       if (req.file) {
//         const uploadStream = gfs.openUploadStream(`${Date.now()}-${req.file.originalname}`);
//         const bufferStream = Readable.from(req.file.buffer);
//         profilePictureId = uploadStream.id;

//         await new Promise((resolve, reject) => {
//           bufferStream
//             .pipe(uploadStream)
//             .on('error', (err) => reject(err))
//             .on('finish', () => resolve());
//         });
//         console.log('Profile picture uploaded with ID:', profilePictureId);
//       }

//       const otp = generateOTP();
//       await sendEmail(email, 'Verify Your Email', `Your OTP for registration is: ${otp}`);
//       console.log(`OTP sent to ${email}: ${otp}`);

//       const tempStudent = {
//         ...validatedData,
//         profilePicture: profilePictureId,
//         otp,
//         expiresAt: Date.now() + 10 * 60 * 1000,
//       };

//       req.app.locals.tempStudents = req.app.locals.tempStudents || {};
//       req.app.locals.tempStudents[email] = tempStudent;
//       console.log('Stored tempStudent:', JSON.stringify(tempStudent, null, 2));

//       res.status(200).json({ status: 200, message: 'OTP sent to your email. Please verify.', extraDetails: '' });
//     } catch (error) {
//       if (error.name === 'ZodError') {
//         const status = 422;
//         const message = 'Validation failed';
//         const extraDetails = error.errors.map((err) => `${err.path.join('.')}: ${err.message}`).join(', ');
//         console.error(`[${status}] ${message}: ${extraDetails}`);
//         return res.status(status).json({ status, message, extraDetails });
//       }
//       next(error);
//     }
//   },
// ];

// const verifyOTP = async (req, res, next) => {
//   try {
//     const { email, otp } = req.body;
//     const tempStudents = req.app.locals.tempStudents || {};
//     const tempStudent = tempStudents[email];

//     if (!tempStudent || tempStudent.otp !== otp || Date.now() > tempStudent.expiresAt) {
//       console.log(`Invalid OTP attempt for ${email}: ${otp}`);
//       return res.status(400).json({ status: 400, message: 'Invalid or expired OTP', extraDetails: '' });
//     }

//     const student = new Student({
//       childrenName: tempStudent.childrenName,
//       email: tempStudent.email,
//       dob: tempStudent.dob,
//       gender: tempStudent.gender,
//       password: tempStudent.password,
//       profilePicture: tempStudent.profilePicture,
//       parentName: tempStudent.parentName,
//       parentMobileNumber: tempStudent.parentMobileNumber,
//       subscribed: false,
//     });
//     await student.save();
//     const token = student.generateToken();

//     delete req.app.locals.tempStudents[email];
//     console.log(`Student registered: ${email}, Token: ${token}`);

//     res.status(201).json({ status: 201, message: 'Student registered successfully', token });
//   } catch (error) {
//     next(error);
//   }
// };

// const loginStudent = async (req, res, next) => {
//   try {
//     const { email, password } = req.body;
//     const student = await Student.findOne({ email });
//     if (!student || !(await student.comparePassword(password))) {
//       console.log(`Login failed for ${email}`);
//       return res.status(401).json({ status: 401, message: 'Invalid credentials', extraDetails: '' });
//     }
//     const token = student.generateToken();
//     console.log(`Login successful for ${email}, Token: ${token}`);
//     res.json({ status: 200, message: 'Login successful', token, subscribed: student.subscribed, data: student });
//   } catch (error) {
//     next(error);
//   }
// };

// const forgotPassword = async (req, res, next) => {
//   try {
//     const { email } = req.body;
//     const student = await Student.findOne({ email });
//     if (!student) {
//       console.log(`Email not found: ${email}`);
//       return res.status(404).json({ status: 404, message: 'Email not found', extraDetails: '' });
//     }

//     const otp = generateOTP();
//     await sendEmail(email, 'Password Reset OTP', `Your OTP to reset your password is: ${otp}`);
//     console.log(`Reset OTP sent to ${email}: ${otp}`);

//     req.app.locals.resetOTPs = req.app.locals.resetOTPs || {};
//     req.app.locals.resetOTPs[email] = {
//       otp,
//       expiresAt: Date.now() + 10 * 60 * 1000,
//     };

//     res.status(200).json({ status: 200, message: 'OTP sent to your email for password reset.', extraDetails: '' });
//   } catch (error) {
//     next(error);
//   }
// };

// const resetPassword = async (req, res, next) => {
//   try {
//     const { email, otp, newPassword } = req.body;
//     const resetOTPs = req.app.locals.resetOTPs || {};
//     const resetData = resetOTPs[email];

//     if (!resetData || resetData.otp !== otp || Date.now() > resetData.expiresAt) {
//       console.log(`Invalid reset OTP attempt for ${email}: ${otp}`);
//       return res.status(400).json({ status: 400, message: 'Invalid or expired OTP', extraDetails: '' });
//     }

//     const student = await Student.findOne({ email });
//     if (!student) {
//       console.log(`Student not found for reset: ${email}`);
//       return res.status(404).json({ status: 404, message: 'Student not found', extraDetails: '' });
//     }

//     student.password = newPassword;
//     await student.save();
//     delete req.app.locals.resetOTPs[email];
//     console.log(`Password reset successful for ${email}`);

//     res.status(200).json({ status: 200, message: 'Password reset successfully', extraDetails: '' });
//   } catch (error) {
//     next(error);
//   }
// };

// const getProfile = async (req, res, next) => {
//   try {
//     const student = await Student.findById(req.user.userId).select('-password');
//     if (!student) {
//       console.log(`Profile not found for userId: ${req.user.userId}`);
//       return res.status(404).json({ status: 404, message: 'Student not found', extraDetails: '' });
//     }
//     console.log('Fetched profile data:', JSON.stringify(student.toObject(), null, 2));
//     res.json(student);
//   } catch (error) {
//     next(error);
//   }
// };

// const updateProfile = async (req, res, next) => {
//   try {
//     const { childrenName, email, dob, gender, parentName, parentMobileNumber } = req.body;
//     const student = await Student.findById(req.user.userId);

//     if (!student) {
//       console.log(`Student not found for update: ${req.user.userId}`);
//       return res.status(404).json({ status: 404, message: 'Student not found', extraDetails: '' });
//     }

//     student.childrenName = childrenName || student.childrenName;
//     student.email = email || student.email;
//     student.dob = dob || student.dob;
//     student.gender = gender || student.gender;
//     student.parentName = parentName || student.parentName;
//     student.parentMobileNumber = parentMobileNumber || student.parentMobileNumber;

//     await student.save();
//     console.log(`Profile updated for ${student.email}`);
//     res.status(200).json({ status: 200, message: 'Profile updated successfully', data: student });
//   } catch (error) {
//     next(error);
//   }
// };

// const createOrder = async (req, res, next) => {
//   try {
//     console.log("Creating order for user:", req.user);
//     const student = await Student.findById(req.user.userId);
//     if (!student) {
//       console.log(`Student not found for userId: ${req.user.userId}`);
//       return res.status(404).json({ status: 404, message: 'Student not found', extraDetails: '' });
//     }
//     if (student.subscribed && student.subscriptionEndDate > new Date()) {
//       console.log(`Already subscribed: ${student.email}`);
//       return res.status(400).json({ status: 400, message: 'Already subscribed', extraDetails: '' });
//     }

//     const shortId = student._id.toString().slice(0, 8);
//     const timestamp = Date.now().toString().slice(-6);
//     const receipt = `rcpt_${shortId}_${timestamp}`;

//     const options = {
//       amount: 10000, // ₹100 in paise
//       currency: 'INR',
//       receipt: receipt,
//     };
//     console.log("Order options:", options);

//     let order;
//     const maxRetries = 3;
//     for (let attempt = 1; attempt <= maxRetries; attempt++) {
//       try {
//         order = await razorpay.orders.create(options);
//         console.log(`Order created for ${student.email}: ${order.id}`);
//         break;
//       } catch (error) {
//         console.error(`Attempt ${attempt} failed:`, {
//           statusCode: error.statusCode,
//           error: error.error,
//           message: error.message,
//         });
//         if (error.statusCode === 500 && attempt < maxRetries) {
//           console.warn(`Attempt ${attempt} failed with SERVER_ERROR. Retrying...`);
//           await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
//           continue;
//         }
//         throw error;
//       }
//     }

//     res.json({ status: 200, orderId: order.id, amount: options.amount, currency: options.currency });
//   } catch (error) {
//     console.error("Order creation failed:", {
//       message: error.message,
//       stack: error.stack,
//       statusCode: error.statusCode,
//       errorDetails: error.error,
//     });
//     const statusCode = error.statusCode || 500;
//     const errorMessage = error.error?.description || error.message || 'Unknown error';
//     res.status(statusCode).json({
//       status: statusCode,
//       message: 'Failed to create order',
//       extraDetails: errorMessage,
//       errorDetails: error.error || error,
//     });
//   }
// };

// const verifyPayment = async (req, res, next) => {
//   try {
//     const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
//     const student = await Student.findById(req.user.userId);
//     if (!student) {
//       console.log(`Student not found for userId: ${req.user.userId}`);
//       return res.status(404).json({ status: 404, message: 'Student not found', extraDetails: '' });
//     }

//     const body = razorpay_order_id + '|' + razorpay_payment_id;
//     const expectedSignature = crypto
//       .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
//       .update(body.toString())
//       .digest('hex');

//     if (expectedSignature !== razorpay_signature) {
//       console.log(`Invalid payment signature for ${student.email}`);
//       return res.status(400).json({ status: 400, message: 'Invalid payment signature', extraDetails: '' });
//     }

//     student.subscribed = true;
//     const endDate = new Date();
//     endDate.setMonth(endDate.getMonth() + 1);
//     student.subscriptionEndDate = endDate;
//     await student.save();

//     console.log(`Payment verified and subscription activated for ${student.email}`);
//     res.json({ status: 200, message: 'Payment verified and subscription activated' });
//   } catch (error) {
//     console.error('Payment verification failed:', error.message);
//     res.status(500).json({ status: 500, message: 'Payment verification failed', extraDetails: error.message });
//   }
// };

// const getSubscriptionStatus = async (req, res, next) => {
//   try {
//     const student = await Student.findById(req.user.userId);
//     if (!student) {
//       console.log(`Student not found for userId: ${req.user.userId}`);
//       return res.status(404).json({ status: 404, message: 'Student not found', extraDetails: '' });
//     }
//     const isSubscribed = student.subscribed && student.subscriptionEndDate > new Date();
//     res.json({ status: 200, subscribed: isSubscribed, subscriptionEndDate: student.subscriptionEndDate });
//   } catch (error) {
//     console.error('Subscription status check failed:', error.message);
//     res.status(500).json({ status: 500, message: 'Failed to check subscription status', extraDetails: error.message });
//   }
// };

// const dashboard = async (req, res, next) => {
//   try {
//     const student = await Student.findById(req.user.userId).select('childrenName email parentName subscribed subscriptionEndDate');
//     if (!student) {
//       console.log(`Student not found for userId: ${req.user.userId}`);
//       return res.status(404).json({ status: 404, message: 'Student not found', extraDetails: '' });
//     }

//     const isSubscribed = student.subscribed && student.subscriptionEndDate > new Date();
//     if (!isSubscribed) {
//       console.log(`Unauthorized dashboard access attempt by ${student.email}: No active subscription`);
//       return res.status(403).json({
//         status: 403,
//         message: 'Access denied: Active subscription required',
//         extraDetails: 'Please purchase a subscription to access the dashboard.',
//       });
//     }

//     console.log(`Dashboard access granted for ${student.email}`);
//     res.json({
//       status: 200,
//       message: 'Welcome to the Student Dashboard',
//       data: {
//         childrenName: student.childrenName,
//         email: student.email,
//         parentName: student.parentName,
//         subscriptionEndDate: student.subscriptionEndDate,
//       },
//     });
//   } catch (error) {
//     console.error('Dashboard access failed:', error.message);
//     res.status(500).json({ status: 500, message: 'Failed to access dashboard', extraDetails: error.message });
//   }
// };

// const updateProfilePicture = [
//   async (req, res, next) => {
//     try {
//       await new Promise((resolve, reject) => {
//         upload(req, res, (err) => {
//           if (err instanceof multer.MulterError) {
//             return reject(new Error(`Multer error: ${err.message}`));
//           } else if (err) {
//             return reject(new Error(`Upload error: ${err.message}`));
//           }
//           console.log('Uploaded file:', req.file ? req.file.originalname : 'None');
//           resolve();
//         });
//       });
//       next();
//     } catch (error) {
//       console.error('File upload failed:', error.message);
//       res.status(400).json({ status: 400, message: 'File upload failed', extraDetails: error.message });
//     }
//   },
//   async (req, res, next) => {
//     try {
//       const student = await Student.findById(req.user.userId);
//       if (!student) {
//         console.log(`Student not found for userId: ${req.user.userId}`);
//         return res.status(404).json({ status: 404, message: 'Student not found', extraDetails: '' });
//       }

//       const gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: 'Uploads' });
//       let profilePictureId = student.profilePicture;

//       if (req.file) {
//         if (profilePictureId) {
//           await gfs.delete(new mongoose.Types.ObjectId(profilePictureId)).catch((err) => {
//             console.warn(`Failed to delete old profile picture ${profilePictureId}:`, err.message);
//           });
//         }

//         const uploadStream = gfs.openUploadStream(`${Date.now()}-${req.file.originalname}`);
//         const bufferStream = Readable.from(req.file.buffer);
//         profilePictureId = uploadStream.id;

//         await new Promise((resolve, reject) => {
//           bufferStream
//             .pipe(uploadStream)
//             .on('error', (err) => reject(err))
//             .on('finish', () => resolve());
//         });
//         console.log('New profile picture uploaded with ID:', profilePictureId);

//         student.profilePicture = profilePictureId;
//         await student.save();
//       } else {
//         return res.status(400).json({ status: 400, message: 'No file uploaded', extraDetails: '' });
//       }

//       res.status(200).json({
//         status: 200,
//         message: 'Profile picture updated successfully',
//         data: { profilePicture: profilePictureId },
//       });
//     } catch (error) {
//       console.error('Profile picture update failed:', error.message);
//       res.status(500).json({ status: 500, message: 'Failed to update profile picture', extraDetails: error.message });
//     }
//   },
// ];

// const getProfilePicture = async (req, res, next) => {
//   try {
//     const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: 'Uploads' });
//     const fileId = new mongoose.Types.ObjectId(req.params.id);
//     const file = await mongoose.connection.db.collection('Uploads.files').findOne({ _id: fileId });
//     if (!file) {
//       console.log(`Profile picture not found: ${req.params.id}`);
//       return res.status(404).json({ status: 404, message: 'File not found' });
//     }
//     res.set('Content-Type', file.contentType);
//     const downloadStream = bucket.openDownloadStream(fileId);
//     downloadStream.pipe(res).on('error', (err) => {
//       console.error(`Error streaming file ${req.params.id}:`, err.message);
//       res.status(500).json({ status: 500, message: 'Error streaming file' });
//     });
//   } catch (error) {
//     console.error(`Error fetching profile picture ${req.params.id}:`, error.message);
//     res.status(500).json({ status: 500, message: 'Server error', extraDetails: error.message });
//   }
// };

// const updateStudentProject = async (req, res, next) => {
//   try {
//     const { projectTitle, projectDescription } = req.body;
//     const studentId = req.user.userId;

//     const student = await Student.findById(studentId);
//     if (!student) {
//       console.log(`Student not found: ${studentId}`);
//       return res.status(404).json({ status: 404, message: "Student not found", extraDetails: "" });
//     }

//     const updatedStudent = await Student.findByIdAndUpdate(
//       studentId,
//       {
//         $set: {
//           project: {
//             title: projectTitle,
//             description: projectDescription,
//           },
//         },
//       },
//       { new: true }
//     );

//     await sendEmail(
//       student.email,
//       "Project Assigned",
//       `Dear ${student.childrenName},\n\nYou have been assigned a new project:\n\nTitle: ${projectTitle}\nDescription: ${projectDescription}\n\nPlease review it in your dashboard.\n\nBest regards,\nEducationForAll Team`
//     );
//     console.log(`Project assigned and email sent to student ${student.email}`);

//     console.log(`Project updated for student ${student.childrenName}: ${projectTitle}`);
//     res.status(200).json({ status: 200, message: "Project updated successfully", data: updatedStudent });
//   } catch (error) {
//     console.error("Error updating student project:", error);
//     res.status(500).json({ status: 500, message: "Server error", extraDetails: error.message });
//   }
// };

// const uploadStudentPhoto = [
//   async (req, res, next) => {
//     try {
//       await new Promise((resolve, reject) => {
//         upload(req, res, (err) => {
//           if (err instanceof multer.MulterError) {
//             return reject(new Error(`Multer error: ${err.message}`));
//           } else if (err) {
//             return reject(new Error(`Upload error: ${err.message}`));
//           }
//           console.log('Uploaded project photo:', req.file ? req.file.originalname : 'None');
//           resolve();
//         });
//       });
//       next();
//     } catch (error) {
//       console.error('Project photo upload failed:', error.message);
//       res.status(400).json({ status: 400, message: 'File upload failed', extraDetails: error.message });
//     }
//   },
//   async (req, res, next) => {
//     try {
//       const student = await Student.findById(req.user.userId);
//       if (!student) {
//         console.log(`Student not found for userId: ${req.user.userId}`);
//         return res.status(404).json({ status: 404, message: 'Student not found', extraDetails: '' });
//       }

//       const gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: 'Uploads' });
//       let photoId = null;

//       if (req.file) {
//         const uploadStream = gfs.openUploadStream(`${Date.now()}-${req.file.originalname}`);
//         const bufferStream = Readable.from(req.file.buffer);
//         photoId = uploadStream.id;

//         await new Promise((resolve, reject) => {
//           bufferStream
//             .pipe(uploadStream)
//             .on('error', (err) => reject(err))
//             .on('finish', () => resolve());
//         });
//         console.log('Project photo uploaded with ID:', photoId);

//         student.submittedPhotos = student.submittedPhotos || [];
//         student.submittedPhotos.push(photoId);
//         await student.save();

//         await sendEmail(
//           student.email,
//           "Project Photo Submitted",
//           `Dear ${student.childrenName},\n\nYou have submitted a new photo for your project "${student.project?.title || 'Untitled'}".\n\nYou can view it in your dashboard.\n\nBest regards,\nEducationForAll Team`
//         );
//         console.log(`Photo submitted and email sent to student ${student.email}`);
//       } else {
//         return res.status(400).json({ status: 400, message: 'No file uploaded', extraDetails: '' });
//       }

//       res.status(200).json({
//         status: 200,
//         message: 'Project photo uploaded successfully',
//         photoId,
//       });
//     } catch (error) {
//       console.error('Project photo upload failed:', error.message);
//       res.status(500).json({ status: 500, message: 'Failed to upload project photo', extraDetails: error.message });
//     }
//   },
// ];

// module.exports = {
//   registerStudent,
//   verifyOTP,
//   loginStudent,
//   forgotPassword,
//   resetPassword,
//   getProfile,
//   updateProfile,
//   uploadStudentPhoto,
//   updateProfilePicture,
//   createOrder,
//   verifyPayment,
//   getSubscriptionStatus,
//   dashboard,
//   getProfilePicture,
//   updateStudentProject,
// };

const express = require('express');
const Student = require('../models/student-model');
const mongoose = require('mongoose');
const multer = require('multer');
const { Readable } = require('stream');
const { registerSchema } = require('../validators/student-validator');
const { sendEmail } = require('../utils/email');
const { authMiddleware, validate } = require('../middlewares/student-middleware');
const Razorpay = require('razorpay');
const crypto = require('crypto');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
}).single('profilePicture');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const registerStudent = [
  async (req, res, next) => {
    try {
      await new Promise((resolve, reject) => {
        upload(req, res, (err) => {
          if (err instanceof multer.MulterError) {
            return reject(new Error(`Multer error: ${err.message}`));
          } else if (err) {
            return reject(new Error(`Upload error: ${err.message}`));
          }
          console.log('Uploaded file:', req.file ? req.file.originalname : 'None');
          resolve();
        });
      });
      next();
    } catch (error) {
      console.error('File upload failed:', error.message);
      res.status(400).json({ status: 400, message: 'File upload failed', extraDetails: error.message });
    }
  },
  async (req, res, next) => {
    try {
      console.log('Incoming registration data:', JSON.stringify(req.body, null, 2));

      const validatedData = await registerSchema.parseAsync(req.body);
      const { email } = validatedData;

      const existingStudent = await Student.findOne({ email });
      if (existingStudent) {
        console.log(`Duplicate email found: ${email}`);
        return res.status(400).json({ status: 400, message: 'Email already registered', extraDetails: '' });
      }

      const gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: 'Uploads' });
      let profilePictureId = null;

      if (req.file) {
        const uploadStream = gfs.openUploadStream(`${Date.now()}-${req.file.originalname}`);
        const bufferStream = Readable.from(req.file.buffer);
        profilePictureId = uploadStream.id;

        await new Promise((resolve, reject) => {
          bufferStream
            .pipe(uploadStream)
            .on('error', (err) => reject(err))
            .on('finish', () => resolve());
        });
        console.log('Profile picture uploaded with ID:', profilePictureId);
      }

      const otp = generateOTP();
      await sendEmail(email, 'Verify Your Email', `Your OTP for registration is: ${otp}`);
      console.log(`OTP sent to ${email}: ${otp}`);

      const tempStudent = {
        ...validatedData,
        profilePicture: profilePictureId,
        otp,
        expiresAt: Date.now() + 10 * 60 * 1000,
      };

      req.app.locals.tempStudents = req.app.locals.tempStudents || {};
      req.app.locals.tempStudents[email] = tempStudent;
      console.log('Stored tempStudent:', JSON.stringify(tempStudent, null, 2));

      res.status(200).json({ status: 200, message: 'OTP sent to your email. Please verify.', extraDetails: '' });
    } catch (error) {
      if (error.name === 'ZodError') {
        const status = 422;
        const message = 'Validation failed';
        const extraDetails = error.errors.map((err) => `${err.path.join('.')}: ${err.message}`).join(', ');
        console.error(`[${status}] ${message}: ${extraDetails}`);
        return res.status(status).json({ status, message, extraDetails });
      }
      next(error);
    }
  },
];

const verifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const tempStudents = req.app.locals.tempStudents || {};
    const tempStudent = tempStudents[email];

    if (!tempStudent || tempStudent.otp !== otp || Date.now() > tempStudent.expiresAt) {
      console.log(`Invalid OTP attempt for ${email}: ${otp}`);
      return res.status(400).json({ status: 400, message: 'Invalid or expired OTP', extraDetails: '' });
    }

    const student = new Student({
      childrenName: tempStudent.childrenName,
      email: tempStudent.email,
      dob: tempStudent.dob,
      gender: tempStudent.gender,
      password: tempStudent.password,
      profilePicture: tempStudent.profilePicture,
      parentName: tempStudent.parentName,
      parentMobileNumber: tempStudent.parentMobileNumber,
      subscribed: false,
      planType: null,
    });
    await student.save();
    const token = student.generateToken();

    delete req.app.locals.tempStudents[email];
    console.log(`Student registered: ${email}, Token: ${token}`);

    res.status(201).json({ status: 201, message: 'Student registered successfully', token });
  } catch (error) {
    next(error);
  }
};

const loginStudent = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const student = await Student.findOne({ email });
    if (!student || !(await student.comparePassword(password))) {
      console.log(`Login failed for ${email}`);
      return res.status(401).json({ status: 401, message: 'Invalid credentials', extraDetails: '' });
    }
    const token = student.generateToken();
    console.log(`Login successful for ${email}, Token: ${token}`);
    res.json({ status: 200, message: 'Login successful', token, subscribed: student.subscribed, planType: student.planType, data: student });
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const student = await Student.findOne({ email });
    if (!student) {
      console.log(`Email not found: ${email}`);
      return res.status(404).json({ status: 404, message: 'Email not found', extraDetails: '' });
    }

    const otp = generateOTP();
    await sendEmail(email, 'Password Reset OTP', `Your OTP to reset your password is: ${otp}`);
    console.log(`Reset OTP sent to ${email}: ${otp}`);

    req.app.locals.resetOTPs = req.app.locals.resetOTPs || {};
    req.app.locals.resetOTPs[email] = {
      otp,
      expiresAt: Date.now() + 10 * 60 * 1000,
    };

    res.status(200).json({ status: 200, message: 'OTP sent to your email for password reset.', extraDetails: '' });
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
      return res.status(400).json({ status: 400, message: 'Invalid or expired OTP', extraDetails: '' });
    }

    const student = await Student.findOne({ email });
    if (!student) {
      console.log(`Student not found for reset: ${email}`);
      return res.status(404).json({ status: 404, message: 'Student not found', extraDetails: '' });
    }

    student.password = newPassword;
    await student.save();
    delete req.app.locals.resetOTPs[email];
    console.log(`Password reset successful for ${email}`);

    res.status(200).json({ status: 200, message: 'Password reset successfully', extraDetails: '' });
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const student = await Student.findById(req.user.userId).select('-password');
    if (!student) {
      console.log(`Profile not found for userId: ${req.user.userId}`);
      return res.status(404).json({ status: 404, message: 'Student not found', extraDetails: '' });
    }
    console.log('Fetched profile data:', JSON.stringify(student.toObject(), null, 2));
    res.json(student);
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { childrenName, email, dob, gender, parentName, parentMobileNumber } = req.body;
    const student = await Student.findById(req.user.userId);

    if (!student) {
      console.log(`Student not found for update: ${req.user.userId}`);
      return res.status(404).json({ status: 404, message: 'Student not found', extraDetails: '' });
    }

    student.childrenName = childrenName || student.childrenName;
    student.email = email || student.email;
    student.dob = dob || student.dob;
    student.gender = gender || student.gender;
    student.parentName = parentName || student.parentName;
    student.parentMobileNumber = parentMobileNumber || student.parentMobileNumber;

    await student.save();
    console.log(`Profile updated for ${student.email}`);
    res.status(200).json({ status: 200, message: 'Profile updated successfully', data: student });
  } catch (error) {
    next(error);
  }
};

const createOrder = async (req, res, next) => {
  try {
    const { planType, amount } = req.body;
    console.log("Creating order for user:", req.user, "with plan:", planType);
    const student = await Student.findById(req.user.userId);
    if (!student) {
      console.log(`Student not found for userId: ${req.user.userId}`);
      return res.status(404).json({ status: 404, message: 'Student not found', extraDetails: '' });
    }
    if (student.subscribed && student.subscriptionEndDate > new Date() && student.planType === planType) {
      console.log(`Already subscribed to ${planType}: ${student.email}`);
      return res.status(400).json({ status: 400, message: 'Already subscribed to this plan', extraDetails: '' });
    }

    const validPlans = ['one-time', 'monthly', 'quarterly'];
    if (!validPlans.includes(planType)) {
      console.log(`Invalid plan type: ${planType}`);
      return res.status(400).json({ status: 400, message: 'Invalid plan type', extraDetails: '' });
    }

    const planAmounts = {
      'one-time': 100000, // ₹1000 in paise
      'monthly': 150000,  // ₹1500 in paise
      'quarterly': 400000 // ₹4000 in paise
    };

    if (amount !== planAmounts[planType]) {
      console.log(`Invalid amount for ${planType}: received ${amount}, expected ${planAmounts[planType]}`);
      return res.status(400).json({ status: 400, message: 'Invalid amount for selected plan', extraDetails: '' });
    }

    const shortId = student._id.toString().slice(0, 8);
    const timestamp = Date.now().toString().slice(-6);
    const receipt = `rcpt_${shortId}_${timestamp}_${planType}`;

    const options = {
      amount: amount,
      currency: 'INR',
      receipt: receipt,
    };
    console.log("Order options:", options);

    let order;
    const maxRetries = 3;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        order = await razorpay.orders.create(options);
        console.log(`Order created for ${student.email}: ${order.id}`);
        break;
      } catch (error) {
        console.error(`Attempt ${attempt} failed:`, {
          statusCode: error.statusCode,
          error: error.error,
          message: error.message,
        });
        if (error.statusCode === 500 && attempt < maxRetries) {
          console.warn(`Attempt ${attempt} failed with SERVER_ERROR. Retrying...`);
          await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
          continue;
        }
        throw error;
      }
    }

    res.json({ status: 200, orderId: order.id, amount: options.amount, currency: options.currency });
  } catch (error) {
    console.error("Order creation failed:", {
      message: error.message,
      stack: error.stack,
      statusCode: error.statusCode,
      errorDetails: error.error,
    });
    const statusCode = error.statusCode || 500;
    const errorMessage = error.error?.description || error.message || 'Unknown error';
    res.status(statusCode).json({
      status: statusCode,
      message: 'Failed to create order',
      extraDetails: errorMessage,
      errorDetails: error.error || error,
    });
  }
};

const verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, planType } = req.body;
    const student = await Student.findById(req.user.userId);
    if (!student) {
      console.log(`Student not found for userId: ${req.user.userId}`);
      return res.status(404).json({ status: 404, message: 'Student not found', extraDetails: '' });
    }

    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      console.log(`Invalid payment signature for ${student.email}`);
      return res.status(400).json({ status: 400, message: 'Invalid payment signature', extraDetails: '' });
    }

    student.subscribed = true;
    student.planType = planType;
    const endDate = new Date();
    if (planType === 'one-time') {
      student.subscriptionEndDate = null; // Lifetime access
    } else if (planType === 'monthly') {
      endDate.setMonth(endDate.getMonth() + 1);
      student.subscriptionEndDate = endDate;
    } else if (planType === 'quarterly') {
      endDate.setMonth(endDate.getMonth() + 3);
      student.subscriptionEndDate = endDate;
    }
    await student.save();

    console.log(`Payment verified and subscription activated for ${student.email} with plan ${planType}`);
    res.json({ status: 200, message: 'Payment verified and subscription activated', planType });
  } catch (error) {
    console.error('Payment verification failed:', error.message);
    res.status(500).json({ status: 500, message: 'Payment verification failed', extraDetails: error.message });
  }
};

const getSubscriptionStatus = async (req, res, next) => {
  try {
    const student = await Student.findById(req.user.userId);
    if (!student) {
      console.log(`Student not found for userId: ${req.user.userId}`);
      return res.status(404).json({ status: 404, message: 'Student not found', extraDetails: '' });
    }
    const isSubscribed = student.subscribed && (student.planType === 'one-time' || student.subscriptionEndDate > new Date());
    res.json({ 
      status: 200, 
      subscribed: isSubscribed, 
      subscriptionEndDate: student.subscriptionEndDate, 
      planType: student.planType 
    });
  } catch (error) {
    console.error('Subscription status check failed:', error.message);
    res.status(500).json({ status: 500, message: 'Failed to check subscription status', extraDetails: error.message });
  }
};

const dashboard = async (req, res, next) => {
  try {
    const student = await Student.findById(req.user.userId).select('childrenName email parentName subscribed subscriptionEndDate planType');
    if (!student) {
      console.log(`Student not found for userId: ${req.user.userId}`);
      return res.status(404).json({ status: 404, message: 'Student not found', extraDetails: '' });
    }

    const isSubscribed = student.subscribed && (student.planType === 'one-time' || student.subscriptionEndDate > new Date());
    if (!isSubscribed) {
      console.log(`Unauthorized dashboard access attempt by ${student.email}: No active subscription`);
      return res.status(403).json({
        status: 403,
        message: 'Access denied: Active subscription required',
        extraDetails: 'Please purchase a subscription to access the dashboard.',
      });
    }

    console.log(`Dashboard access granted for ${student.email}`);
    res.json({
      status: 200,
      message: 'Welcome to the Student Dashboard',
      data: {
        childrenName: student.childrenName,
        email: student.email,
        parentName: student.parentName,
        subscriptionEndDate: student.subscriptionEndDate,
        planType: student.planType,
      },
    });
  } catch (error) {
    console.error('Dashboard access failed:', error.message);
    res.status(500).json({ status: 500, message: 'Failed to access dashboard', extraDetails: error.message });
  }
};

const updateProfilePicture = [
  async (req, res, next) => {
    try {
      await new Promise((resolve, reject) => {
        upload(req, res, (err) => {
          if (err instanceof multer.MulterError) {
            return reject(new Error(`Multer error: ${err.message}`));
          } else if (err) {
            return reject(new Error(`Upload error: ${err.message}`));
          }
          console.log('Uploaded file:', req.file ? req.file.originalname : 'None');
          resolve();
        });
      });
      next();
    } catch (error) {
      console.error('File upload failed:', error.message);
      res.status(400).json({ status: 400, message: 'File upload failed', extraDetails: error.message });
    }
  },
  async (req, res, next) => {
    try {
      const student = await Student.findById(req.user.userId);
      if (!student) {
        console.log(`Student not found for userId: ${req.user.userId}`);
        return res.status(404).json({ status: 404, message: 'Student not found', extraDetails: '' });
      }

      const gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: 'Uploads' });
      let profilePictureId = student.profilePicture;

      if (req.file) {
        if (profilePictureId) {
          await gfs.delete(new mongoose.Types.ObjectId(profilePictureId)).catch((err) => {
            console.warn(`Failed to delete old profile picture ${profilePictureId}:`, err.message);
          });
        }

        const uploadStream = gfs.openUploadStream(`${Date.now()}-${req.file.originalname}`);
        const bufferStream = Readable.from(req.file.buffer);
        profilePictureId = uploadStream.id;

        await new Promise((resolve, reject) => {
          bufferStream
            .pipe(uploadStream)
            .on('error', (err) => reject(err))
            .on('finish', () => resolve());
        });
        console.log('New profile picture uploaded with ID:', profilePictureId);

        student.profilePicture = profilePictureId;
        await student.save();
      } else {
        return res.status(400).json({ status: 400, message: 'No file uploaded', extraDetails: '' });
      }

      res.status(200).json({
        status: 200,
        message: 'Profile picture updated successfully',
        data: { profilePicture: profilePictureId },
      });
    } catch (error) {
      console.error('Profile picture update failed:', error.message);
      res.status(500).json({ status: 500, message: 'Failed to update profile picture', extraDetails: error.message });
    }
  },
];

const getProfilePicture = async (req, res, next) => {
  try {
    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: 'Uploads' });
    const fileId = new mongoose.Types.ObjectId(req.params.id);
    const file = await mongoose.connection.db.collection('Uploads.files').findOne({ _id: fileId });
    if (!file) {
      console.log(`Profile picture not found: ${req.params.id}`);
      return res.status(404).json({ status: 404, message: 'File not found' });
    }
    res.set('Content-Type', file.contentType);
    const downloadStream = bucket.openDownloadStream(fileId);
    downloadStream.pipe(res).on('error', (err) => {
      console.error(`Error streaming file ${req.params.id}:`, err.message);
      res.status(500).json({ status: 500, message: 'Error streaming file' });
    });
  } catch (error) {
    console.error(`Error fetching profile picture ${req.params.id}:`, error.message);
    res.status(500).json({ status: 500, message: 'Server error', extraDetails: error.message });
  }
};

const updateStudentProject = async (req, res, next) => {
  try {
    const { projectTitle, projectDescription } = req.body;
    const studentId = req.user.userId;

    const student = await Student.findById(studentId);
    if (!student) {
      console.log(`Student not found: ${studentId}`);
      return res.status(404).json({ status: 404, message: "Student not found", extraDetails: "" });
    }

    const updatedStudent = await Student.findByIdAndUpdate(
      studentId,
      {
        $set: {
          project: {
            title: projectTitle,
            description: projectDescription,
          },
        },
      },
      { new: true }
    );

    await sendEmail(
      student.email,
      "Project Assigned",
      `Dear ${student.childrenName},\n\nYou have been assigned a new project:\n\nTitle: ${projectTitle}\nDescription: ${projectDescription}\n\nPlease review it in your dashboard.\n\nBest regards,\nEducationForAll Team`
    );
    console.log(`Project assigned and email sent to student ${student.email}`);

    console.log(`Project updated for student ${student.childrenName}: ${projectTitle}`);
    res.status(200).json({ status: 200, message: "Project updated successfully", data: updatedStudent });
  } catch (error) {
    console.error("Error updating student project:", error);
    res.status(500).json({ status: 500, message: "Server error", extraDetails: error.message });
  }
};

const uploadStudentPhoto = [
  async (req, res, next) => {
    try {
      await new Promise((resolve, reject) => {
        upload(req, res, (err) => {
          if (err instanceof multer.MulterError) {
            return reject(new Error(`Multer error: ${err.message}`));
          } else if (err) {
            return reject(new Error(`Upload error: ${err.message}`));
          }
          console.log('Uploaded project photo:', req.file ? req.file.originalname : 'None');
          resolve();
        });
      });
      next();
    } catch (error) {
      console.error('Project photo upload failed:', error.message);
      res.status(400).json({ status: 400, message: 'File upload failed', extraDetails: error.message });
    }
  },
  async (req, res, next) => {
    try {
      const student = await Student.findById(req.user.userId);
      if (!student) {
        console.log(`Student not found for userId: ${req.user.userId}`);
        return res.status(404).json({ status: 404, message: 'Student not found', extraDetails: '' });
      }

      const gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: 'Uploads' });
      let photoId = null;

      if (req.file) {
        const uploadStream = gfs.openUploadStream(`${Date.now()}-${req.file.originalname}`);
        const bufferStream = Readable.from(req.file.buffer);
        photoId = uploadStream.id;

        await new Promise((resolve, reject) => {
          bufferStream
            .pipe(uploadStream)
            .on('error', (err) => reject(err))
            .on('finish', () => resolve());
        });
        console.log('Project photo uploaded with ID:', photoId);

        student.submittedPhotos = student.submittedPhotos || [];
        student.submittedPhotos.push(photoId);
        await student.save();

        await sendEmail(
          student.email,
          "Project Photo Submitted",
          `Dear ${student.childrenName},\n\nYou have submitted a new photo for your project "${student.project?.title || 'Untitled'}".\n\nYou can view it in your dashboard.\n\nBest regards,\nEducationForAll Team`
        );
        console.log(`Photo submitted and email sent to student ${student.email}`);
      } else {
        return res.status(400).json({ status: 400, message: 'No file uploaded', extraDetails: '' });
      }

      res.status(200).json({
        status: 200,
        message: 'Project photo uploaded successfully',
        photoId,
      });
    } catch (error) {
      console.error('Project photo upload failed:', error.message);
      res.status(500).json({ status: 500, message: 'Failed to upload project photo', extraDetails: error.message });
    }
  },
];

module.exports = {
  registerStudent,
  verifyOTP,
  loginStudent,
  forgotPassword,
  resetPassword,
  getProfile,
  updateProfile,
  uploadStudentPhoto,
  updateProfilePicture,
  createOrder,
  verifyPayment,
  getSubscriptionStatus,
  dashboard,
  getProfilePicture,
  updateStudentProject,
};