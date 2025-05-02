const express = require('express');
const router = express.Router();
const {
  registerStudent,
  verifyOTP,
  loginStudent,
  forgotPassword,
  resetPassword,
  getProfile,
  updateProfile,
  createOrder,
  verifyPayment,
  getSubscriptionStatus,
  dashboard,
  getProfilePicture,
  updateProfilePicture,
  updateStudentProject,
  uploadStudentPhoto
} = require('../controllers/student-controller');
const { authMiddleware, validate } = require('../middlewares/student-middleware');
const { loginSchema } = require('../validators/student-validator');

router.post('/register', registerStudent);
router.post('/verify-otp', verifyOTP);
router.post('/login', validate(loginSchema), loginStudent);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/profile', authMiddleware, getProfile);
router.put('/Profile', authMiddleware, updateProfile);
router.put('/profile/picture', authMiddleware, updateProfilePicture);
router.post('/create-order', authMiddleware, createOrder);
router.post('/verify-payment', authMiddleware, verifyPayment);
router.get('/get-subscription-status', authMiddleware, getSubscriptionStatus);
router.get('/dashboard', authMiddleware, dashboard);
router.get('/files/:id', getProfilePicture); 
router.put('/project', authMiddleware, updateStudentProject); // New route
router.put('/photo', authMiddleware, uploadStudentPhoto); // Existing route
module.exports = router;