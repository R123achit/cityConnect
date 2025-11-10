const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('./models/User');
const Bus = require('./models/Bus');
const Route = require('./models/Route');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/citiconnect')
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.error('❌ MongoDB Connection Error:', err));

async function addSampleData() {
  try {
    console.log('📊 Adding sample data without deleting existing accounts...\n');

    // Check existing data
    const existingUsers = await User.countDocuments();
    const existingBuses = await Bus.countDocuments();
    const existingRoutes = await Route.countDocuments();

    console.log(`Current Data:`);
    console.log(`  Users: ${existingUsers}`);
    console.log(`  Buses: ${existingBuses}`);
    console.log(`  Routes: ${existingRoutes}\n`);

    // Only add if data is missing
    if (existingRoutes === 0) {
      console.log('📍 Adding routes...');
      const sampleRoute = {
        routeName: 'Test Route',
        routeNumber: 'TEST-001',
        startPoint: 'Start Point',
        endPoint: 'End Point',
        stops: [
          { name: 'Stop 1', location: { coordinates: [77.4334, 28.6692] }, sequenceOrder: 1, estimatedTime: 0 },
          { name: 'Stop 2', location: { coordinates: [77.4434, 28.6792] }, sequenceOrder: 2, estimatedTime: 10 }
        ],
        distance: 5,
        estimatedTime: 10,
        status: 'active'
      };
      await Route.create(sampleRoute);
      console.log('✅ Added test route');
    } else {
      console.log('ℹ️  Routes already exist, skipping...');
    }

    if (existingBuses === 0) {
      console.log('🚌 Adding test bus...');
      const route = await Route.findOne();
      if (route) {
        const testBus = {
          busNumber: 'TEST-100',
          registrationNumber: 'UP14TEST2000',
          capacity: 40,
          type: 'AC',
          assignedRoute: route._id,
          currentLocation: {
            type: 'Point',
            coordinates: [77.4334, 28.6692]
          },
          status: 'active'
        };
        await Bus.create(testBus);
        console.log('✅ Added test bus');
      }
    } else {
      console.log('ℹ️  Buses already exist, skipping...');
    }

    console.log('\n✅ Sample data added successfully!');
    console.log('💡 Your existing user accounts are safe!\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

addSampleData();
