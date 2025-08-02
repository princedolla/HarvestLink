const mongoose = require('mongoose');

const farmerSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  phone: { type: String, unique: true, required: true },
  email: { type: String, unique: true, sparse: true },
  location: { type: String, required: true },
  password: { type: String, required: true },
  profileImage: { type: String, default: '' },
  farmName: { type: String, trim: true },
  crops: [{ type: String }],
  isVerified: { type: Boolean, default: false },
  role: { type: String, enum: ['farmer', 'admin'], default: 'farmer' },
  resetToken: String,
  resetTokenExpire: Date,
}, { timestamps: true });

module.exports = mongoose.model('Farmer', farmerSchema);
