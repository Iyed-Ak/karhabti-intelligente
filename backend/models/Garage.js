// ============= Garage Model =============
// models/Garage.js
const mongoose = require('mongoose');
const garageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  phone: String,
  email: String,
  hours: String,
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviews: {
    type: Number,
    default: 0
  },
  certified: {
    type: Boolean,
    default: false
  },
  specialties: [String], // ['Mécanique générale', 'Carrosserie']
  services: [String], // ['Vidange', 'Freins', 'Pneus']
  latitude: Number,
  longitude: Number,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Garage', garageSchema);