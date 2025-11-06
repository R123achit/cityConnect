const express = require('express');
const router = express.Router();
const Bus = require('../models/Bus');
const Route = require('../models/Route');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/buses
// @desc    Get all active buses
router.get('/', async (req, res) => {
  try {
    const buses = await Bus.find({ isOnline: true })
      .populate('assignedDriver', 'name phone')
      .populate('assignedRoute', 'routeName routeNumber');

    res.json({
      success: true,
      count: buses.length,
      data: buses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/buses/:id
// @desc    Get single bus
router.get('/:id', async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.id)
      .populate('assignedDriver', 'name phone')
      .populate('assignedRoute');

    if (!bus) {
      return res.status(404).json({
        success: false,
        message: 'Bus not found'
      });
    }

    res.json({
      success: true,
      data: bus
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/buses/route/:routeId
// @desc    Get buses by route
router.get('/route/:routeId', async (req, res) => {
  try {
    const buses = await Bus.find({
      assignedRoute: req.params.routeId,
      isOnline: true
    })
      .populate('assignedDriver', 'name phone')
      .populate('assignedRoute');

    res.json({
      success: true,
      count: buses.length,
      data: buses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
