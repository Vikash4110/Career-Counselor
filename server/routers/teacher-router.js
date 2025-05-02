const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/teacher-controller');
const { authMiddleware, validate } = require('../middlewares/teacher-middleware');
const { loginSchema } = require('../validators/teacher-validator');

router.post('/register', registerTeacher); // Validation handled inside controller due to FormData
router.post('/verify-otp', verifyOTP);
router.post('/login', validate(loginSchema), loginTeacher);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/profile', authMiddleware, getProfile);
router.get('/file/:fileId', authMiddleware, getFile);
router.put('/profile', authMiddleware, updateProfile); // Add this line

router.post("/students", authMiddleware, addStudent); // Add this
router.get("/students", authMiddleware, getStudents); // Add this
router.put("/students/project", authMiddleware, updateStudentProject); // New route
module.exports = router;