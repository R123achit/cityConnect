const express = require('express');
const router = express.Router();
const QRCode = require('qrcode');
const Ticket = require('../models/Ticket');
const Route = require('../models/Route');
const Bus = require('../models/Bus');
const { protect } = require('../middleware/auth');
const { sendTicketEmail } = require('../utils/emailService');

// @route   GET /api/tickets/route-stops/:routeId
// @desc    Get all stops for a route
// @access  Private (User)
router.get('/route-stops/:routeId', protect, async (req, res) => {
  try {
    const route = await Route.findById(req.params.routeId);
    
    if (!route) {
      return res.status(404).json({
        success: false,
        message: 'Route not found'
      });
    }

    const stops = route.stops.sort((a, b) => a.sequenceOrder - b.sequenceOrder);

    res.json({
      success: true,
      data: {
        routeId: route._id,
        routeNumber: route.routeNumber,
        routeName: route.routeName,
        stops: stops.map(stop => ({
          name: stop.name,
          sequenceOrder: stop.sequenceOrder,
          location: stop.location
        }))
      }
    });
  } catch (error) {
    console.error('Error fetching route stops:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   POST /api/tickets/calculate-fare
// @desc    Calculate fare between two stops
// @access  Private (User)
router.post('/calculate-fare', protect, async (req, res) => {
  try {
    const { routeId, fromStop, toStop } = req.body;

    const route = await Route.findById(routeId);
    if (!route) {
      return res.status(404).json({
        success: false,
        message: 'Route not found'
      });
    }

    const fromStopData = route.stops.find(s => s.name === fromStop);
    const toStopData = route.stops.find(s => s.name === toStop);

    if (!fromStopData || !toStopData) {
      return res.status(400).json({
        success: false,
        message: 'Invalid stops selected'
      });
    }

    if (fromStopData.sequenceOrder >= toStopData.sequenceOrder) {
      return res.status(400).json({
        success: false,
        message: 'Destination must be after starting point'
      });
    }

    // Calculate fare: Base fare ₹10 + ₹5 per stop
    const stopDifference = toStopData.sequenceOrder - fromStopData.sequenceOrder;
    const fare = 10 + (stopDifference * 5);

    res.json({
      success: true,
      data: {
        fare,
        stops: stopDifference,
        fromStop,
        toStop
      }
    });
  } catch (error) {
    console.error('Error calculating fare:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   POST /api/tickets/generate
// @desc    Generate QR code ticket
// @access  Private (User)
router.post('/generate', protect, async (req, res) => {
  try {
    const { busId, routeId, fromStop, toStop } = req.body;

    // Validate route and calculate fare
    const route = await Route.findById(routeId);
    if (!route) {
      return res.status(404).json({
        success: false,
        message: 'Route not found'
      });
    }

    const fromStopData = route.stops.find(s => s.name === fromStop);
    const toStopData = route.stops.find(s => s.name === toStop);

    if (!fromStopData || !toStopData) {
      return res.status(400).json({
        success: false,
        message: 'Invalid stops selected'
      });
    }

    if (fromStopData.sequenceOrder >= toStopData.sequenceOrder) {
      return res.status(400).json({
        success: false,
        message: 'Destination must be after starting point'
      });
    }

    // Calculate fare
    const stopDifference = toStopData.sequenceOrder - fromStopData.sequenceOrder;
    const fare = 10 + (stopDifference * 5);

    // Generate unique ticket ID
    const ticketId = `TKT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Create ticket data for QR code
    const ticketData = {
      ticketId,
      userId: req.user._id,
      busId,
      routeId,
      fare,
      fromStop,
      toStop,
      timestamp: new Date().toISOString()
    };

    // Generate QR code as Base64
    const qrCodeBase64 = await QRCode.toDataURL(JSON.stringify(ticketData));

    // Set ticket validity (24 hours from now)
    const validUntil = new Date();
    validUntil.setHours(validUntil.getHours() + 24);

    // Save ticket to database
    const ticket = await Ticket.create({
      ticketId,
      userId: req.user._id,
      busId,
      routeId,
      fare,
      fromStop,
      toStop,
      qrCode: qrCodeBase64,
      validUntil
    });

    // Populate references
    const populatedTicket = await Ticket.findById(ticket._id)
      .populate('userId', 'name email')
      .populate('busId', 'busNumber registrationNumber')
      .populate('routeId', 'routeNumber routeName');

    // Send email with ticket
    const emailData = {
      ticketId: populatedTicket.ticketId,
      busNumber: populatedTicket.busId.busNumber,
      routeNumber: populatedTicket.routeId.routeNumber,
      routeName: populatedTicket.routeId.routeName,
      fromStop: populatedTicket.fromStop,
      toStop: populatedTicket.toStop,
      fare: populatedTicket.fare,
      qrCode: populatedTicket.qrCode,
      validUntil: populatedTicket.validUntil
    };

    await sendTicketEmail(populatedTicket.userId.email, populatedTicket.userId.name, emailData);

    res.status(201).json({
      success: true,
      message: 'Ticket generated and sent to your email',
      data: populatedTicket
    });
  } catch (error) {
    console.error('Error generating ticket:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   POST /api/tickets/validate
// @desc    Validate and mark ticket as used
// @access  Private (Driver/Admin)
router.post('/validate', protect, async (req, res) => {
  try {
    const { ticketId } = req.body;

    const ticket = await Ticket.findOne({ ticketId })
      .populate('userId', 'name email')
      .populate('busId', 'busNumber')
      .populate('routeId', 'routeNumber routeName');

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    // Check if already used
    if (ticket.status === 'used') {
      return res.status(400).json({
        success: false,
        message: 'Ticket already used',
        usedAt: ticket.usedAt
      });
    }

    // Check if expired
    if (new Date() > ticket.validUntil) {
      ticket.status = 'expired';
      await ticket.save();
      return res.status(400).json({
        success: false,
        message: 'Ticket has expired'
      });
    }

    // Mark as used
    ticket.status = 'used';
    ticket.usedAt = new Date();
    await ticket.save();

    res.json({
      success: true,
      message: 'Ticket validated successfully',
      data: ticket
    });
  } catch (error) {
    console.error('Error validating ticket:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/tickets/history
// @desc    Get user's ticket history
// @access  Private (User)
router.get('/history', protect, async (req, res) => {
  try {
    const tickets = await Ticket.find({ userId: req.user._id })
      .populate('busId', 'busNumber registrationNumber')
      .populate('routeId', 'routeNumber routeName')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      success: true,
      count: tickets.length,
      data: tickets
    });
  } catch (error) {
    console.error('Error fetching ticket history:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/tickets/:ticketId
// @desc    Get single ticket details
// @access  Private
router.get('/:ticketId', protect, async (req, res) => {
  try {
    const ticket = await Ticket.findOne({ ticketId: req.params.ticketId })
      .populate('userId', 'name email')
      .populate('busId', 'busNumber registrationNumber')
      .populate('routeId', 'routeNumber routeName');

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    // Check if user owns this ticket or is admin/driver
    if (ticket.userId._id.toString() !== req.user._id.toString() && 
        !['admin', 'driver'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this ticket'
      });
    }

    res.json({
      success: true,
      data: ticket
    });
  } catch (error) {
    console.error('Error fetching ticket:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   DELETE /api/tickets/:id
// @desc    Delete used or expired ticket
// @access  Private (User)
router.delete('/:id', protect, async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    // Check if user owns this ticket
    if (ticket.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this ticket'
      });
    }

    // Only allow deletion of used or expired tickets
    if (ticket.status === 'active') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete active ticket'
      });
    }

    await Ticket.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Ticket deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting ticket:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
