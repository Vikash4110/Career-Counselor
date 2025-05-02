// const jwt = require('jsonwebtoken');
// const { z } = require('zod');

// const authMiddleware = async (req, res, next) => {
//   const token = req.header('Authorization')?.replace('Bearer ', '');
//   if (!token) {
//     console.log('No token provided');
//     return res.status(401).json({ status: 401, message: 'Authentication required', extraDetails: 'No token provided' });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_KEY);
//     if (decoded.role !== 'student') throw new Error('Invalid role');
//     req.user = decoded;
//     next();
//   } catch (error) {
//     console.error('Token verification failed:', error.message);
//     res.status(401).json({ status: 401, message: 'Invalid or expired token', extraDetails: error.message });
//   }
// };

// const validate = (schema) => async (req, res, next) => {
//   try {
//     req.body = await schema.parseAsync(req.body);
//     console.log('Validation successful:', req.body);
//     next();
//   } catch (error) {
//     const status = 422;
//     const message = 'Validation Error';
//     const extraDetails = error.errors?.map((err) => `${err.path.join('.')}: ${err.message}`).join(', ') || 'Invalid input';
//     console.error(`[${status}] ${message}: ${extraDetails}`);
//     res.status(status).json({ status, message, extraDetails });
//   }
// };

// module.exports = { authMiddleware, validate };

const jwt = require('jsonwebtoken');
const { z } = require('zod');

const authMiddleware = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    console.log('No token provided');
    return res.status(401).json({ status: 401, message: 'Authentication required', extraDetails: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    if (decoded.role !== 'student') throw new Error('Invalid role');
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Token verification failed:', error.message);
    res.status(401).json({ status: 401, message: 'Invalid or expired token', extraDetails: error.message });
  }
};

const validate = (schema) => async (req, res, next) => {
  try {
    req.body = await schema.parseAsync(req.body);
    console.log('Validation successful:', req.body);
    next();
  } catch (error) {
    const status = 422;
    const message = 'Validation Error';
    const extraDetails = error.errors?.map((err) => `${err.path.join('.')}: ${err.message}`).join(', ') || 'Invalid input';
    console.error(`[${status}] ${message}: ${extraDetails}`);
    res.status(status).json({ status, message, extraDetails });
  }
};

module.exports = { authMiddleware, validate };