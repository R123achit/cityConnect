const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Bus = require('../models/Bus');
const Route = require('../models/Route');
const Notification = require('../models/Notification');
const SOSAlert = require('../models/SOSAlert');
const { protect, authorize } = require('../middleware/auth');

// All routes are protected and for users
router.use(protect);
router.use(authorize('user'));

// @route   GET /api/user/routes
// @desc    Get all routes
router.get('/routes', async (req, res) => {
  try {
    const routes = await Route.find({ isActive: true }).sort({ routeNumber: 1 });

    res.json({
      success: true,
      count: routes.length,
      data: routes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/user/buses/route/:routeId
// @desc    Get buses by route
router.get('/buses/route/:routeId', async (req, res) => {
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

// @route   GET /api/user/active-buses
// @desc    Get all active buses
router.get('/active-buses', async (req, res) => {
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

// @route   POST /api/user/trip-history
// @desc    Add to trip history
router.post('/trip-history', async (req, res) => {
  try {
    const { route, bus } = req.body;

    const user = await User.findById(req.user._id);
    
    user.tripHistory.push({
      route,
      bus,
      timestamp: new Date()
    });

    await user.save();

    res.json({
      success: true,
      data: user.tripHistory
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/user/trip-history
// @desc    Get trip history
router.get('/trip-history', async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({
        path: 'tripHistory.route',
        select: 'routeName routeNumber'
      })
      .populate({
        path: 'tripHistory.bus',
        select: 'busNumber'
      });

    res.json({
      success: true,
      data: user.tripHistory || []
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/user/notifications
// @desc    Get user notifications
router.get('/notifications', async (req, res) => {
  try {
    const notifications = await Notification.find({
      $or: [
        { recipients: 'all' },
        { recipients: 'users' },
        { specificRecipients: req.user._id }
      ]
    })
    .populate('sender', 'name')
    .populate('relatedRoute', 'routeName routeNumber')
    .populate('relatedBus', 'busNumber')
    .sort({ createdAt: -1 })
    .limit(50);

    res.json({
      success: true,
      count: notifications.length,
      data: notifications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
