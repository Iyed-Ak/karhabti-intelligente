// ============= Maintenance Model =============
// models/Maintenance.js
const mongoose = require('mongoose');
const maintenanceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  vehicleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true
  },
  type: {
    type: String,
    enum: ['vidange', 'filtres', 'pneus', 'freins', 'batterie', 'climatisation', 'autre'],
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  mileage: {
    type: Number,
    required: true
  },
  description: String,
  cost: {
    type: Number,
    default: 0
  },
  garage: String,
  status: {
    type: String,
    enum: ['planned', 'completed', 'cancelled'],
    default: 'planned'
  },
  notes: String,
  reminderSent: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Maintenance', maintenanceSchema);