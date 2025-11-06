const express = require('express');
const router = express.Router();
const Bus = require('../models/Bus');
const User = require('../models/User');
const Route = require('../models/Route');
const SOSAlert = require('../models/SOSAlert');
const Notification = require('../models/Notification');
const { protect, authorize } = require('../middleware/auth');

// All routes are protected and for admin only
router.use(protect);
router.use(authorize('admin'));

// @route   GET /api/analytics/dashboard
// @desc    Get dashboard analytics
router.get('/dashboard', async (req, res) => {
  try {
    const totalBuses = await Bus.countDocuments();
    const activeBuses = await Bus.countDocuments({ isOnline: true });
    const totalDrivers = await User.countDocuments({ role: 'driver' });
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalRoutes = await Route.countDocuments({ isActive: true });
    const activeAlerts = await SOSAlert.countDocuments({ status: 'active' });
    const totalNotifications = await Notification.countDocuments();

    // Recent SOS alerts
    const recentAlerts = await SOSAlert.find()
      .populate('driver', 'name')
      .populate('bus', 'busNumber')
      .sort({ createdAt: -1 })
      .limit(5);

    // Bus status breakdown
    const busStatusBreakdown = await Bus.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Buses by type
    const busByType = await Bus.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        overview: {
          totalBuses,
          activeBuses,
          totalDrivers,
          totalUsers,
          totalRoutes,
          activeAlerts,
          totalNotifications
        },
        busStatusBreakdown,
        busByType,
        recentAlerts
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/analytics/bus-performance
// @desc    Get bus performance metrics
router.get('/bus-performance', async (req, res) => {
  try {
    const buses = await Bus.find()
      .populate('assignedRoute', 'routeName')
      .select('busNumber isOnline status type assignedRoute');

    const performance = buses.map(bus => ({
      busNumber: bus.busNumber,
      route: bus.assignedRoute?.routeName || 'Not Assigned',
      status: bus.status,
      isOnline: bus.isOnline,
      type: bus.type
    }));

    res.json({
      success: true,
      data: performance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/analytics/route-usage
// @desc    Get route usage statistics
router.get('/route-usage', async (req, res) => {
  try {
    const routes = await Route.find({ isActive: true });
    
    const routeStats = await Promise.all(
      routes.map(async (route) => {
        const busCount = await Bus.countDocuments({ assignedRoute: route._id });
        const activeBusCount = await Bus.countDocuments({
          assignedRoute: route._id,
          isOnline: true
        });

        return {
          routeName: route.routeName,
          routeNumber: route.routeNumber,
          totalBuses: busCount,
          activeBuses: activeBusCount,
          totalStops: route.stops.length,
          distance: route.totalDistance,
          duration: route.estimatedDuration
        };
      })
    );

    res.json({
      success: true,
      data: routeStats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/analytics/alerts-summary
// @desc    Get SOS alerts summary
router.get('/alerts-summary', async (req, res) => {
  try {
    const totalAlerts = await SOSAlert.countDocuments();
    const activeAlerts = await SOSAlert.countDocuments({ status: 'active' });
    const acknowledgedAlerts = await SOSAlert.countDocuments({ status: 'acknowledged' });
    const resolvedAlerts = await SOSAlert.countDocuments({ status: 'resolved' });

    // Alerts by date (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const alertsByDate = await SOSAlert.aggregate([
      {
        $match: {
          createdAt: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    res.json({
      success: true,
      data: {
        summary: {
          totalAlerts,
          activeAlerts,
          acknowledgedAlerts,
          resolvedAlerts
        },
        alertsByDate
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
