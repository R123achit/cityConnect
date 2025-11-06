const mongoose = require('mongoose');

const busSchema = new mongoose.Schema({
  busNumber: {
    type: String,
    required: [true, 'Bus number is required'],
    unique: true,
    trim: true
  },
  busName: {
    type: String,
    trim: true
  },
  capacity: {
    type: Number,
    required: [true, 'Capacity is required'],
    min: 1
  },
  type: {
    type: String,
    enum: ['AC', 'Non-AC', 'Electric', 'Hybrid'],
    default: 'Non-AC'
  },
  registrationNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  assignedDriver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  assignedRoute: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Route'
  },
  currentLocation: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      default: [0, 0]
    }
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'maintenance', 'out-of-service'],
    default: 'inactive'
  },
  isOnline: {
    type: Boolean,
    default: false
  },
  lastMaintenance: {
    type: Date
  },
  nextMaintenance: {
    type: Date
  },
  features: [{
    type: String
  }],
  currentStop: {
    type: String,
    default: ''
  },
  nextStop: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Create geospatial index
busSchema.index({ currentLocation: '2dsphere' });

module.exports = mongoose.model('Bus', busSchema);
