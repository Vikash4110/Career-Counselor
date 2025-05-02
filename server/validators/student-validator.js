const { z } = require('zod');

const registerSchema = z.object({
  childrenName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  dob: z.string().refine(
    (date) => {
      const parsedDate = new Date(date);
      const today = new Date();
      const minAgeDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
      return parsedDate <= minAgeDate && parsedDate >= new Date(1900, 0, 1);
    },
    { message: 'Invalid date of birth or age must be under 18' }
  ),
  gender: z.enum(['Male', 'Female', 'Other'], { message: 'Invalid gender' }),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Confirm password must be at least 6 characters'),
  parentName: z.string().min(2, 'Parent name must be at least 2 characters'),
  parentMobileNumber: z.string().regex(/^\d{10}$/, 'Parent mobile number must be 10 digits'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});


const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

module.exports = { registerSchema, loginSchema };