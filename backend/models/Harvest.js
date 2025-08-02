const mongoose = require('mongoose');

const harvestSchema = new mongoose.Schema({
  farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Farmer', required: true },
  cropName: String,
  cropType: String,
  plantingDate: Date,
  expectedHarvestDate: Date,
  estimatedQuantity: Number,
  unit: String,
  pricePerUnit: Number,
  currency: String,
  description: String,
  imageUrls: [String], 
}, { timestamps: true });

module.exports = mongoose.model('Harvest', harvestSchema);
