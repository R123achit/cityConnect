const express = require('express');
const router = express.Router();
const Bus = require('../models/Bus');
const Route = require('../models/Route');
const SOSAlert = require('../models/SOSAlert');
const Notification = require('../models/Notification');
const { protect, authorize } = require('../middleware/auth');

// All routes are protected and for drivers only
router.use(protect);
router.use(authorize('driver'));

// @route   GET /api/driver/assigned-bus
// @desc    Get driver's assigned bus
router.get('/assigned-bus', async (req, res) => {
  try {
    const bus = await Bus.findOne({ assignedDriver: req.user._id })
      .populate('assignedRoute');

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

// @route   GET /api/driver/assigned-route
// @desc    Get driver's assigned route
router.get('/assigned-route', async (req, res) => {
  try {
    const route = await Route.findById(req.user.assignedRoute);

    res.json({
      success: true,
      data: route
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   PUT /api/driver/update-location
// @desc    Update bus location
router.put('/update-location', async (req, res) => {
  try {
    const { coordinates, currentStop, nextStop } = req.body;

    const bus = await Bus.findOneAndUpdate(
      { assignedDriver: req.user._id },
      {
        currentLocation: {
          type: 'Point',
          coordinates
        },
        currentStop,
        nextStop,
        isOnline: true
      },
      { new: true }
    );

    if (!bus) {
      return res.status(404).json({
        success: false,
        message: 'No bus assigned to this driver'
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

// @route   PUT /api/driver/start-trip
// @desc    Start trip
router.put('/start-trip', async (req, res) => {
  try {
    const bus = await Bus.findOneAndUpdate(
      { assignedDriver: req.user._id },
      {
        status: 'active',
        isOnline: true
      },
      { new: true }
    );

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

// @route   PUT /api/driver/stop-trip
// @desc    Stop trip
router.put('/stop-trip', async (req, res) => {
  try {
    const bus = await Bus.findOneAndUpdate(
      { assignedDriver: req.user._id },
      {
        status: 'inactive',
        isOnline: false
      },
      { new: true }
    );

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

// @route   POST /api/driver/sos
// @desc    Send SOS alert
router.post('/sos', async (req, res) => {
  try {
    const { location, description } = req.body;

    const bus = await Bus.findOne({ assignedDriver: req.user._id });

    if (!bus) {
      return res.status(404).json({
        success: false,
        message: 'No bus assigned'
      });
    }

    const sosAlert = await SOSAlert.create({
      driver: req.user._id,
      bus: bus._id,
      location: {
        type: 'Point',
        coordinates: location.coordinates
      },
      description
    });

    const populatedAlert = await SOSAlert.findById(sosAlert._id)
      .populate('driver', 'name email phone')
      .populate('bus', 'busNumber registrationNumber');

    res.status(201).json({
      success: true,
      data: populatedAlert
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/driver/notifications
// @desc    Get driver notifications
router.get('/notifications', async (req, res) => {
  try {
    const notifications = await Notification.find({
      $or: [
        { recipients: 'all' },
        { recipients: 'drivers' },
        { specificRecipients: req.user._id }
      ]
    })
    .populate('sender', 'name')
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

// @route   PUT /api/driver/notifications/:id/read
// @desc    Mark notification as read
router.put('/notifications/:id/read', async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    // Check if already read
    const alreadyRead = notification.isRead.some(
      item => item.user.toString() === req.user._id.toString()
    );

    if (!alreadyRead) {
      notification.isRead.push({
        user: req.user._id,
        readAt: new Date()
      });
      await notification.save();
    }

    res.json({
      success: true,
      data: notification
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
