// ============= routes/garages.js =============
const express = require('express');
const router = express.Router();
const Garage = require('../models/Garage');

// GET all garages
router.get('/', async (req, res) => {
  try {
    const { city, specialty, sortBy = 'distance' } = req.query;
    let query = {};

    if (city && city !== 'all') query.city = city;
    if (specialty && specialty !== 'all') query.specialties = specialty;

    const garages = await Garage.find(query);
    
    // Tri
    if (sortBy === 'rating') {
      garages.sort((a, b) => b.rating - a.rating);
    }

    res.json({ success: true, count: garages.length, garages });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// SEARCH garages
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    const garages = await Garage.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { city: { $regex: q, $options: 'i' } },
        { specialties: { $regex: q, $options: 'i' } }
      ]
    });

    res.json({ success: true, garages });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;