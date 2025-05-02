const { z } = require('zod');

const registerSchema = z.object({
  teacherName: z.string().min(1, 'Teacher name is required'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Confirm password must be at least 6 characters'),
  phoneNumber: z.string().regex(/^\d{10}$/, 'Phone number must be 10 digits'),
  subject: z.string().min(1, 'Subject is required'),
  classGrade: z.enum(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'], { message: 'Invalid class grade' }),
  section: z.enum(['A', 'B', 'C', 'D'], { message: 'Invalid section' }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

module.exports = { registerSchema, loginSchema };