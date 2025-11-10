const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

// @route   POST /api/notifications
// @desc    Create notification (Admin only)
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const notification = await Notification.create({
      ...req.body,
      sender: req.user._id
    });

    const populatedNotification = await Notification.findById(notification._id)
      .populate('sender', 'name');

    res.status(201).json({
      success: true,
      data: populatedNotification
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/notifications
// @desc    Get user notifications (All authenticated users)
router.get('/', protect, async (req, res) => {
  try {
    let query = {};

    if (req.user.role === 'admin') {
      query = {}; // Admin sees all
    } else if (req.user.role === 'driver') {
      query = {
        $or: [
          { recipients: 'all' },
          { recipients: 'drivers' },
          { specificRecipients: req.user._id }
        ]
      };
    } else {
      query = {
        $or: [
          { recipients: 'all' },
          { recipients: 'users' },
          { specificRecipients: req.user._id }
        ]
      };
    }

    const notifications = await Notification.find(query)
      .populate('sender', 'name')
      .populate('relatedRoute', 'routeName routeNumber')
      .populate('relatedBus', 'busNumber')
      .sort({ createdAt: -1 })
      .limit(100);

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

// @route   PUT /api/notifications/:id/read
// @desc    Mark notification as read
router.put('/:id/read', protect, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

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

// @route   DELETE /api/notifications/:id
// @desc    Delete notification (Admin only)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    await notification.deleteOne();

    res.json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   POST /api/notifications/send-realtime
// @desc    Send real-time notification via Socket.IO (Admin only)
router.post('/send-realtime', protect, authorize('admin'), async (req, res) => {
  try {
    const { title, message, recipients, specificRecipients, type, priority } = req.body;

    // Create notification in database
    const notification = await Notification.create({
      title,
      message,
      recipients,
      specificRecipients,
      type: type || 'info',
      priority: priority || 'medium',
      sender: req.user._id
    });

    // Get Socket.IO instance
    const io = req.app.get('io');

    // Emit real-time notification
    if (specificRecipients && specificRecipients.length > 0) {
      // Send to specific users
      specificRecipients.forEach(recipientId => {
        io.emit(`notification:${recipientId}`, {
          ...notification.toObject(),
          message,
          type
        });
      });
    } else {
      // Broadcast to all matching recipients
      io.emit('notification:broadcast', {
        ...notification.toObject(),
        message,
        type
      });
    }

    res.status(201).json({
      success: true,
      message: 'Notification sent successfully',
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
