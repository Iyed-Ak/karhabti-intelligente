const express = require('express');
const router = express.Router();
const Vehicle = require('../models/Vehicle');
const { protect } = require('../middleware/auth');

// ============= GET ALL VEHICLES =============
router.get('/', protect, async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ userId: req.userId });

    res.json({
      success: true,
      count: vehicles.length,
      vehicles
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ============= GET SINGLE VEHICLE =============
router.get('/:id', protect, async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    // Vérifier que c'est le propriétaire
    if (vehicle.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to view this vehicle' });
    }

    res.json({
      success: true,
      vehicle
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ============= CREATE VEHICLE =============
router.post('/', protect, async (req, res) => {
  try {
    const { brand, model, year, plate, vin, mileage, fuel, color, purchaseDate } = req.body;

    // Validation
    if (!brand || !model || !year || !plate || !fuel) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Vérifier si la plaque existe déjà
    let existingVehicle = await Vehicle.findOne({ plate });
    if (existingVehicle) {
      return res.status(400).json({ message: 'A vehicle with this plate already exists' });
    }

    // Vérifier si le VIN existe déjà (si fourni)
    if (vin) {
      existingVehicle = await Vehicle.findOne({ vin });
      if (existingVehicle) {
        return res.status(400).json({ message: 'A vehicle with this VIN already exists' });
      }
    }

    // Créer le véhicule
    const vehicle = new Vehicle({
      userId: req.userId,
      brand,
      model,
      year,
      plate: plate.toUpperCase(),
      vin,
      mileage: mileage || 0,
      fuel,
      color,
      purchaseDate
    });

    await vehicle.save();

    res.status(201).json({
      success: true,
      message: 'Vehicle added successfully',
      vehicle
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ============= UPDATE VEHICLE =============
router.put('/:id', protect, async (req, res) => {
  try {
    let vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    // Vérifier que c'est le propriétaire
    if (vehicle.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to update this vehicle' });
    }

    // Mise à jour
    const updates = req.body;
    vehicle = await Vehicle.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      message: 'Vehicle updated successfully',
      vehicle
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ============= DELETE VEHICLE =============
router.delete('/:id', protect, async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    // Vérifier que c'est le propriétaire
    if (vehicle.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this vehicle' });
    }

    await Vehicle.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Vehicle deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ============= GET VEHICLE STATISTICS =============
router.get('/:id/stats', protect, async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    if (vehicle.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const Maintenance = require('../models/Maintenance');
    const maintenanceCount = await Maintenance.countDocuments({
      vehicleId: req.params.id,
      status: 'completed'
    });

    const totalCost = await Maintenance.aggregate([
      { $match: { vehicleId: vehicle._id, status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$cost' } } }
    ]);

    res.json({
      success: true,
      stats: {
        totalMaintenance: maintenanceCount,
        totalSpent: totalCost[0]?.total || 0,
        brand: vehicle.brand,
        model: vehicle.model,
        mileage: vehicle.mileage
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;