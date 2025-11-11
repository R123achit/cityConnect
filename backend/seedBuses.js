const mongoose = require('mongoose');
require('dotenv').config();

const Bus = require('./models/Bus');
const Route = require('./models/Route');

async function seedBuses() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Get all routes
    const routes = await Route.find();
    if (routes.length === 0) {
      console.log('❌ No routes found. Please run seedRoutes.js first');
      process.exit(1);
    }

    // Clear existing buses
    await Bus.deleteMany({});
    console.log('🗑️  Cleared existing buses');

    const sampleBuses = [
      {
        busNumber: 'KA-01-AB-1234',
        busName: 'Express 1',
        capacity: 50,
        type: 'AC',
        registrationNumber: 'KA01AB1234',
        assignedRoute: routes[0]._id,
        status: 'active',
        isOnline: false,
        features: ['AC', 'WiFi', 'GPS']
      },
      {
        busNumber: 'KA-01-CD-5678',
        busName: 'City Bus 2',
        capacity: 45,
        type: 'Non-AC',
        registrationNumber: 'KA01CD5678',
        assignedRoute: routes[1]._id,
        status: 'active',
        isOnline: false,
        features: ['GPS', 'CCTV']
      },
      {
        busNumber: 'KA-01-EF-9012',
        busName: 'Metro Link 3',
        capacity: 55,
        type: 'AC',
        registrationNumber: 'KA01EF9012',
        assignedRoute: routes[2]._id,
        status: 'active',
        isOnline: false,
        features: ['AC', 'WiFi', 'USB Charging']
      },
      {
        busNumber: 'KA-01-GH-3456',
        busName: 'Local 4',
        capacity: 40,
        type: 'Non-AC',
        registrationNumber: 'KA01GH3456',
        assignedRoute: routes[3]._id,
        status: 'active',
        isOnline: false,
        features: ['GPS']
      },
      {
        busNumber: 'KA-01-IJ-7890',
        busName: 'Express 5',
        capacity: 48,
        type: 'Electric',
        registrationNumber: 'KA01IJ7890',
        assignedRoute: routes[4]._id,
        status: 'active',
        isOnline: false,
        features: ['Electric', 'WiFi', 'GPS', 'USB Charging']
      }
    ];

    const buses = await Bus.insertMany(sampleBuses);
    console.log(`✅ Added ${buses.length} sample buses`);

    buses.forEach((bus, index) => {
      console.log(`   - ${bus.busNumber}: ${bus.busName} (${bus.type}) → Route ${routes[index].routeNumber}`);
    });

    console.log('\n🎉 Buses seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding buses:', error);
    process.exit(1);
  }
}

seedBuses();
