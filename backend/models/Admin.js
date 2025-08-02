const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const AdminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: 'admin',
    enum: ['admin'], // ensures this stays 'admin'
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Virtual field to set password and hash it
AdminSchema.virtual('password')
  .set(function(password) {
    this._password = password;
    this.passwordHash = bcrypt.hashSync(password, 10);
  })
  .get(function() {
    return this._password;
  });

// Instance method to verify password
AdminSchema.methods.verifyPassword = function(password) {
  return bcrypt.compare(password, this.passwordHash);
};

module.exports = mongoose.model('Admin', AdminSchema);
