// ============= Vehicle Model =============
// models/Vehicle.js
const mongoose = require('mongoose');
const vehicleSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  brand: {
    type: String,
    required: [true, 'Please provide a brand'],
    trim: true
  },
  model: {
    type: String,
    required: [true, 'Please provide a model']
  },
  year: {
    type: Number,
    required: true,
    min: [1980, 'Year must be 1980 or later']
  },
  plate: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  vin: {
    type: String,
    unique: true,
    sparse: true
  },
  mileage: {
    type: Number,
    default: 0
  },
  fuel: {
    type: String,
    enum: ['Essence', 'Diesel', 'Hybride', 'Électrique'],
    required: true
  },
  color: String,
  purchaseDate: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Vehicle', vehicleSchema);