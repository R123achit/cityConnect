const mongoose = require('mongoose');

const stopSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  sequenceOrder: {
    type: Number,
    required: true
  },
  estimatedTime: {
    type: Number, // in minutes from start
    default: 0
  }
}, { _id: false });

const routeSchema = new mongoose.Schema({
  routeName: {
    type: String,
    required: [true, 'Route name is required'],
    trim: true
  },
  routeNumber: {
    type: String,
    required: [true, 'Route number is required'],
    unique: true,
    trim: true
  },
  startPoint: {
    type: String,
    required: true,
    trim: true
  },
  endPoint: {
    type: String,
    required: true,
    trim: true
  },
  stops: [stopSchema],
  totalDistance: {
    type: Number, // in kilometers
    default: 0
  },
  estimatedDuration: {
    type: Number, // in minutes
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  operatingHours: {
    start: {
      type: String,
      default: '06:00'
    },
    end: {
      type: String,
      default: '22:00'
    }
  },
  frequency: {
    type: Number, // in minutes
    default: 15
  },
  description: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Create geospatial index for stops
routeSchema.index({ 'stops.location': '2dsphere' });

module.exports = mongoose.model('Route', routeSchema);
