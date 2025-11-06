const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIO = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }
});

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/citiconnect', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB Connected Successfully'))
.catch(err => console.error('❌ MongoDB Connection Error:', err));

// Socket.IO Connection
const activeDrivers = new Map(); // Store active driver connections
const activeBuses = new Map(); // Store bus locations

io.on('connection', (socket) => {
  console.log('🔌 New client connected:', socket.id);

  // Driver location updates
  socket.on('driver:location-update', (data) => {
    const { driverId, busId, location, currentStop, nextStop, status } = data;
    
    const busData = {
      driverId,
      busId,
      location,
      currentStop,
      nextStop,
      status,
      lastUpdate: new Date(),
      socketId: socket.id
    };
    
    activeBuses.set(busId, busData);
    activeDrivers.set(socket.id, { driverId, busId });
    
    // Broadcast to all users
    io.emit('bus:location-updated', busData);
  });

  // Driver trip start
  socket.on('driver:start-trip', (data) => {
    io.emit('bus:trip-started', data);
  });

  // Driver trip stop
  socket.on('driver:stop-trip', (data) => {
    io.emit('bus:trip-stopped', data);
    if (data.busId) {
      activeBuses.delete(data.busId);
    }
  });

  // SOS Alert
  socket.on('driver:sos', (data) => {
    console.log('🚨 SOS Alert received:', data);
    io.emit('admin:sos-alert', data);
  });

  // Admin notifications
  socket.on('admin:send-notification', (data) => {
    io.emit('notification:broadcast', data);
  });

  // Admin message to specific driver
  socket.on('admin:send-driver-message', (data) => {
    io.emit(`driver:message:${data.driverId}`, data.message);
  });

  // Get all active buses
  socket.on('get:active-buses', () => {
    const buses = Array.from(activeBuses.values());
    socket.emit('active-buses', buses);
  });

  // Disconnect
  socket.on('disconnect', () => {
    console.log('🔌 Client disconnected:', socket.id);
    const driverData = activeDrivers.get(socket.id);
    if (driverData) {
      activeBuses.delete(driverData.busId);
      activeDrivers.delete(socket.id);
      io.emit('bus:disconnected', { busId: driverData.busId });
    }
  });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/driver', require('./routes/driver'));
app.use('/api/user', require('./routes/user'));
app.use('/api/buses', require('./routes/buses'));
app.use('/api/routes', require('./routes/routes'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/analytics', require('./routes/analytics'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'CitiConnect Server is running' });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`🌐 Client URL: ${process.env.CLIENT_URL || 'http://localhost:5173'}`);
});

module.exports = { io };
