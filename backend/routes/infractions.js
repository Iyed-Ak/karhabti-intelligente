
// ============= routes/infractions.js =============
const express = require('express');
const router = express.Router();
const Infraction = require('../models/Infraction');
const { protect } = require('../middleware/auth');

// GET all infractions
router.get('/', protect, async (req, res) => {
  try {
    const infractions = await Infraction.find({ userId: req.userId })
      .populate('vehicleId', 'brand model plate');
    res.json({ success: true, infractions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST new infraction
router.post('/', protect, async (req, res) => {
  try {
    const infraction = new Infraction({
      ...req.body,
      userId: req.userId
    });
    await infraction.save();
    res.status(201).json({ success: true, infraction });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT mark as paid
router.put('/:id/pay', protect, async (req, res) => {
  try {
    const infraction = await Infraction.findByIdAndUpdate(
      req.params.id,
      { status: 'paid', paymentDate: new Date() },
      { new: true }
    );
    res.json({ success: true, infraction });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE infraction
router.delete('/:id', protect, async (req, res) => {
  try {
    await Infraction.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Infraction deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
