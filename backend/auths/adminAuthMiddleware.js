// middleware/adminAuthMiddleware.js
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

const adminAuthMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.split(' ')[1];
    if (!token) return res.status(403).json({ message: 'No token provided' });

    const decoded = jwt.verify(token, JWT_SECRET);
    const admin = await Admin.findById(decoded.id);

    if (!admin || admin.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    req.admin = admin;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token or unauthorized' });
  }
};

module.exports = adminAuthMiddleware;
