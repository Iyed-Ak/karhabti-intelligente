// ============= routes/maintenance.js =============
const express = require('express');
const router = express.Router();
const Maintenance = require('../models/Maintenance');
const { protect } = require('../middleware/auth');

// GET all maintenances
router.get('/', protect, async (req, res) => {
  try {
    const maintenances = await Maintenance.find({ userId: req.userId })
      .populate('vehicleId', 'brand model plate');
    res.json({ success: true, maintenances });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST new maintenance
router.post('/', protect, async (req, res) => {
  try {
    const maintenance = new Maintenance({
      ...req.body,
      userId: req.userId
    });
    await maintenance.save();
    res.status(201).json({ success: true, maintenance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT update maintenance
router.put('/:id', protect, async (req, res) => {
  try {
    const maintenance = await Maintenance.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, maintenance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE maintenance
router.delete('/:id', protect, async (req, res) => {
  try {
    await Maintenance.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Maintenance deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;