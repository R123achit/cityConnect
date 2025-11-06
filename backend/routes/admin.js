const express = require('express');
const router = express.Router();
const Bus = require('../models/Bus');
const User = require('../models/User');
const Route = require('../models/Route');
const Notification = require('../models/Notification');
const SOSAlert = require('../models/SOSAlert');
const { protect, authorize } = require('../middleware/auth');

// All routes are protected and for admin only
router.use(protect);
router.use(authorize('admin'));

// ============ BUS MANAGEMENT ============

// @route   GET /api/admin/buses
// @desc    Get all buses
router.get('/buses', async (req, res) => {
  try {
    const buses = await Bus.find()
      .populate('assignedDriver', 'name email phone')
      .populate('assignedRoute', 'routeName routeNumber')
      .sort({ createdAt: -1 });

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

// @route   POST /api/admin/buses
// @desc    Create a new bus
router.post('/buses', async (req, res) => {
  try {
    const bus = await Bus.create(req.body);
    
    // If driver is assigned, update driver's assignedBus
    if (req.body.assignedDriver) {
      await User.findByIdAndUpdate(req.body.assignedDriver, {
        assignedBus: bus._id,
        assignedRoute: req.body.assignedRoute
      });
    }

    res.status(201).json({
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

// @route   PUT /api/admin/buses/:id
// @desc    Update a bus
router.put('/buses/:id', async (req, res) => {
  try {
    const bus = await Bus.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('assignedDriver assignedRoute');

    if (!bus) {
      return res.status(404).json({
        success: false,
        message: 'Bus not found'
      });
    }

    // Update driver assignment
    if (req.body.assignedDriver) {
      await User.findByIdAndUpdate(req.body.assignedDriver, {
        assignedBus: bus._id,
        assignedRoute: req.body.assignedRoute
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

// @route   DELETE /api/admin/buses/:id
// @desc    Delete a bus
router.delete('/buses/:id', async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.id);

    if (!bus) {
      return res.status(404).json({
        success: false,
        message: 'Bus not found'
      });
    }

    // Remove bus assignment from driver
    if (bus.assignedDriver) {
      await User.findByIdAndUpdate(bus.assignedDriver, {
        $unset: { assignedBus: 1, assignedRoute: 1 }
      });
    }

    await bus.deleteOne();

    res.json({
      success: true,
      message: 'Bus deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// ============ DRIVER MANAGEMENT ============

// @route   GET /api/admin/drivers
// @desc    Get all drivers
router.get('/drivers', async (req, res) => {
  try {
    const drivers = await User.find({ role: 'driver' })
      .populate('assignedBus')
      .populate('assignedRoute')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: drivers.length,
      data: drivers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   POST /api/admin/drivers
// @desc    Create a new driver
router.post('/drivers', async (req, res) => {
  try {
    const driverData = {
      ...req.body,
      role: 'driver'
    };

    const driver = await User.create(driverData);

    res.status(201).json({
      success: true,
      data: driver
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   PUT /api/admin/drivers/:id
// @desc    Update a driver
router.put('/drivers/:id', async (req, res) => {
  try {
    const driver = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('assignedBus assignedRoute');

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: 'Driver not found'
      });
    }

    res.json({
      success: true,
      data: driver
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   DELETE /api/admin/drivers/:id
// @desc    Delete a driver
router.delete('/drivers/:id', async (req, res) => {
  try {
    const driver = await User.findById(req.params.id);

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: 'Driver not found'
      });
    }

    // Remove driver from assigned bus
    if (driver.assignedBus) {
      await Bus.findByIdAndUpdate(driver.assignedBus, {
        $unset: { assignedDriver: 1 }
      });
    }

    await driver.deleteOne();

    res.json({
      success: true,
      message: 'Driver deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// ============ ROUTE MANAGEMENT ============

// @route   GET /api/admin/routes
// @desc    Get all routes
router.get('/routes', async (req, res) => {
  try {
    const routes = await Route.find().sort({ createdAt: -1 });

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

// @route   POST /api/admin/routes
// @desc    Create a new route
router.post('/routes', async (req, res) => {
  try {
    const route = await Route.create(req.body);

    res.status(201).json({
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

// @route   PUT /api/admin/routes/:id
// @desc    Update a route
router.put('/routes/:id', async (req, res) => {
  try {
    const route = await Route.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!route) {
      return res.status(404).json({
        success: false,
        message: 'Route not found'
      });
    }

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

// @route   DELETE /api/admin/routes/:id
// @desc    Delete a route
router.delete('/routes/:id', async (req, res) => {
  try {
    const route = await Route.findById(req.params.id);

    if (!route) {
      return res.status(404).json({
        success: false,
        message: 'Route not found'
      });
    }

    await route.deleteOne();

    res.json({
      success: true,
      message: 'Route deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// ============ SOS ALERTS ============

// @route   GET /api/admin/sos-alerts
// @desc    Get all SOS alerts
router.get('/sos-alerts', async (req, res) => {
  try {
    const alerts = await SOSAlert.find()
      .populate('driver', 'name email phone')
      .populate('bus', 'busNumber registrationNumber')
      .populate('acknowledgedBy', 'name')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: alerts.length,
      data: alerts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   PUT /api/admin/sos-alerts/:id/acknowledge
// @desc    Acknowledge SOS alert
router.put('/sos-alerts/:id/acknowledge', async (req, res) => {
  try {
    const alert = await SOSAlert.findByIdAndUpdate(
      req.params.id,
      {
        status: 'acknowledged',
        acknowledgedBy: req.user._id,
        acknowledgedAt: new Date()
      },
      { new: true }
    ).populate('driver bus');

    res.json({
      success: true,
      data: alert
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   PUT /api/admin/sos-alerts/:id/resolve
// @desc    Resolve SOS alert
router.put('/sos-alerts/:id/resolve', async (req, res) => {
  try {
    const alert = await SOSAlert.findByIdAndUpdate(
      req.params.id,
      {
        status: 'resolved',
        resolvedAt: new Date(),
        notes: req.body.notes
      },
      { new: true }
    ).populate('driver bus');

    res.json({
      success: true,
      data: alert
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// ============ USERS MANAGEMENT ============

// @route   GET /api/admin/users
// @desc    Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({ role: 'user' })
      .populate('defaultRoute')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   PUT /api/admin/users/:id/toggle-active
// @desc    Toggle user active status
router.put('/users/:id/toggle-active', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    user.isActive = !user.isActive;
    await user.save();

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
