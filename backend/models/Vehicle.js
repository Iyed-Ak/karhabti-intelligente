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

// Middleware pour gérer l'erreur E11000
vehicleSchema.post('save', function(error, doc, next) {
  if (error.name === 'MongoServerError' && error.code === 11000) {
    const field = Object.keys(error.keyPattern)[0];
    const message = `A vehicle with this ${field} already exists`;
    next(new Error(message));
  } else {
    next(error);
  }
});

module.exports = mongoose.model('Vehicle', vehicleSchema);