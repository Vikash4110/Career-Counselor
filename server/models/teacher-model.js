const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const teacherSchema = new mongoose.Schema({
  teacherName: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  profilePicture: { type: mongoose.Schema.Types.ObjectId, ref: 'uploads.files' },
  subject: { type: String, required: true },
  classGrade: { 
    type: String, 
    required: true, 
    enum: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
  },
  section: { 
    type: String, 
    required: true, 
    enum: ['A', 'B', 'C', 'D']
  },
  role: { type: String, default: 'teacher' },
}, { timestamps: true });

teacherSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

teacherSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

teacherSchema.methods.generateToken = function() {
  return jwt.sign(
    { userId: this._id, role: 'teacher' },
    process.env.JWT_KEY,
    { expiresIn: '24h' }
  );
};

module.exports = mongoose.model('Teacher', teacherSchema);