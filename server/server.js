// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const connectDb = require('./utils/db');
// const nodemailer = require('nodemailer');
// const teacherRouter = require('./routers/teacher-router');
// const studentRouter = require('./routers/student-router');
// const { errorMiddleware } = require('./middlewares/teacher-middleware');
// const { sendEmail } = require('./utils/db');

// const app = express();
// const PORT = process.env.PORT || 8000;

// app.use(cors({
//   origin: ['http://localhost:5173','https://eduationforall.vercel.app','https://time-table-gen.vercel.app'],
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   credentials: true,
// }));

// app.use(express.json());
// app.use('/api/teachers', teacherRouter);
// app.use('/api/students', studentRouter);
// // Nodemailer Transporter Configuration
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// // Verify transporter configuration
// transporter.verify((error, success) => {
//   if (error) {
//     console.error("Transporter verification failed:", error);
//   } else {
//     console.log("Transporter is ready to send messages");
//   }
// });

// // Contact Form Route
// app.post("/api/contact", async (req, res) => {
//   const { name, email, message } = req.body;

//   // Basic server-side validation
//   if (!name || !email || !message) {
//     return res.status(400).json({ status: "error", message: "All fields are required" });
//   }
//   if (!/\S+@\S+\.\S+/.test(email)) {
//     return res.status(400).json({ status: "error", message: "Invalid email format" });
//   }

//   const mailOptions = {
//     from: `"${name}" <${process.env.EMAIL_USER}>`,
//     to: process.env.RECEIVER_EMAIL,
//     subject: `New Contact Form Submission from ${name}`,
//     html: `
//       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
//         <h2 style="color: #1a73e8;">New Contact Message</h2>
//         <p><strong>Name:</strong> ${name}</p>
//         <p><strong>Email:</strong> ${email}</p>
//         <p><strong>Message:</strong></p>
//         <p style="background: #f8f9fa; padding: 15px; border-radius: 4px;">${message}</p>
//         <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
//         <p style="color: #666; font-size: 12px;">This email was sent from your website's contact form.</p>
//       </div>
//     `,
//   };

//   try {
//     await transporter.sendMail(mailOptions);
//     res.json({ status: "success", message: "Email sent successfully" });
//   } catch (error) {
//     console.error("Error sending email:", error);
//     res.status(500).json({ status: "error", message: "Failed to send email" });
//   }
// });
// app.use(errorMiddleware);

// connectDb()
//   .then(() => {
//     app.listen(PORT, () => {
//       console.log(`Server is running on port ${PORT}`);
//     });
//   })
//   .catch((error) => {
//     console.error('Database connection failed:', error);
//     process.exit(1);
//   });

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDb = require('./utils/db');
const nodemailer = require('nodemailer');
const teacherRouter = require('./routers/teacher-router');
const studentRouter = require('./routers/student-router');
const adminRouter = require('./routers/admin-router');
const { errorMiddleware } = require('./middlewares/teacher-middleware');

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'https://career-counselor-sigma.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/teachers', teacherRouter);
app.use('/api/students', studentRouter);
app.use('/api/admin', adminRouter);

// Nodemailer Transporter Configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.error("Transporter verification failed:", error);
  } else {
    console.log("Transporter is ready to send messages");
  }
});

// Contact Form Route
app.post("/api/contact", async (req, res) => {
  const { name, email, message } = req.body;

  // Server-side validation
  if (!name || !email || !message) {
    return res.status(400).json({ status: "error", message: "All fields are required" });
  }
  if (!/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({ status: "error", message: "Invalid email format" });
  }

  // Ensure RECEIVER_EMAIL is defined
  if (!process.env.RECEIVER_EMAIL) {
    console.error("RECEIVER_EMAIL is not defined in .env");
    return res.status(500).json({ status: "error", message: "Server configuration error" });
  }

  const mailOptions = {
    from: `"${name}" <${process.env.EMAIL_USER}>`,
    to: process.env.RECEIVER_EMAIL,
    subject: `New Contact Form Submission from ${name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #1a73e8;">New Contact Message</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p style="background: #f8f9fa; padding: 15px; border-radius: 4px;">${message}</p>
        <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
        <p style="color: #666; font-size: 12px;">This email was sent from your website's contact form.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ status: "success", message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ status: "error", message: "Failed to send email" });
  }
});

// Debug environment variables
console.log('RAZORPAY_KEY_ID:', process.env.RAZORPAY_KEY_ID);
console.log('RAZORPAY_KEY_SECRET:', process.env.RAZORPAY_KEY_SECRET ? '[REDACTED]' : undefined);

// Error Middleware
app.use(errorMiddleware);

// Start Server
connectDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Database connection failed:', error);
    process.exit(1);
  });