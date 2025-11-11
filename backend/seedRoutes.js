const mongoose = require('mongoose');
require('dotenv').config();

const Route = require('./models/Route');

const sampleRoutes = [
  {
    routeName: 'City Center to Airport',
    routeNumber: 'R101',
    startPoint: 'City Center',
    endPoint: 'International Airport',
    totalDistance: 25,
    estimatedDuration: 45,
    frequency: 15,
    stops: [
      { name: 'City Center', location: { type: 'Point', coordinates: [77.5946, 12.9716] }, sequenceOrder: 1, estimatedTime: 0 },
      { name: 'MG Road', location: { type: 'Point', coordinates: [77.6033, 12.9759] }, sequenceOrder: 2, estimatedTime: 10 },
      { name: 'Indiranagar', location: { type: 'Point', coordinates: [77.6408, 12.9784] }, sequenceOrder: 3, estimatedTime: 20 },
      { name: 'HAL', location: { type: 'Point', coordinates: [77.6648, 12.9611] }, sequenceOrder: 4, estimatedTime: 30 },
      { name: 'International Airport', location: { type: 'Point', coordinates: [77.7064, 13.1986] }, sequenceOrder: 5, estimatedTime: 45 }
    ]
  },
  {
    routeName: 'Railway Station to Tech Park',
    routeNumber: 'R102',
    startPoint: 'Railway Station',
    endPoint: 'Tech Park',
    totalDistance: 18,
    estimatedDuration: 35,
    frequency: 20,
    stops: [
      { name: 'Railway Station', location: { type: 'Point', coordinates: [77.5833, 12.9767] }, sequenceOrder: 1, estimatedTime: 0 },
      { name: 'Majestic', location: { type: 'Point', coordinates: [77.5719, 12.9767] }, sequenceOrder: 2, estimatedTime: 8 },
      { name: 'Yeshwanthpur', location: { type: 'Point', coordinates: [77.5385, 13.0280] }, sequenceOrder: 3, estimatedTime: 18 },
      { name: 'Peenya', location: { type: 'Point', coordinates: [77.5200, 13.0300] }, sequenceOrder: 4, estimatedTime: 28 },
      { name: 'Tech Park', location: { type: 'Point', coordinates: [77.5100, 13.0350] }, sequenceOrder: 5, estimatedTime: 35 }
    ]
  },
  {
    routeName: 'Mall Road to University',
    routeNumber: 'R103',
    startPoint: 'Mall Road',
    endPoint: 'University Campus',
    totalDistance: 12,
    estimatedDuration: 25,
    frequency: 10,
    stops: [
      { name: 'Mall Road', location: { type: 'Point', coordinates: [77.5946, 12.9800] }, sequenceOrder: 1, estimatedTime: 0 },
      { name: 'Commercial Street', location: { type: 'Point', coordinates: [77.6100, 12.9820] }, sequenceOrder: 2, estimatedTime: 7 },
      { name: 'Koramangala', location: { type: 'Point', coordinates: [77.6270, 12.9352] }, sequenceOrder: 3, estimatedTime: 15 },
      { name: 'BTM Layout', location: { type: 'Point', coordinates: [77.6101, 12.9165] }, sequenceOrder: 4, estimatedTime: 20 },
      { name: 'University Campus', location: { type: 'Point', coordinates: [77.6000, 12.9000] }, sequenceOrder: 5, estimatedTime: 25 }
    ]
  },
  {
    routeName: 'Bus Stand to Hospital',
    routeNumber: 'R104',
    startPoint: 'Central Bus Stand',
    endPoint: 'City Hospital',
    totalDistance: 8,
    estimatedDuration: 20,
    frequency: 12,
    stops: [
      { name: 'Central Bus Stand', location: { type: 'Point', coordinates: [77.5800, 12.9700] }, sequenceOrder: 1, estimatedTime: 0 },
      { name: 'Gandhi Nagar', location: { type: 'Point', coordinates: [77.5850, 12.9750] }, sequenceOrder: 2, estimatedTime: 5 },
      { name: 'Shivaji Nagar', location: { type: 'Point', coordinates: [77.5900, 12.9800] }, sequenceOrder: 3, estimatedTime: 10 },
      { name: 'Cantonment', location: { type: 'Point', coordinates: [77.5950, 12.9850] }, sequenceOrder: 4, estimatedTime: 15 },
      { name: 'City Hospital', location: { type: 'Point', coordinates: [77.6000, 12.9900] }, sequenceOrder: 5, estimatedTime: 20 }
    ]
  },
  {
    routeName: 'Market to Beach',
    routeNumber: 'R105',
    startPoint: 'City Market',
    endPoint: 'Beach Road',
    totalDistance: 15,
    estimatedDuration: 30,
    frequency: 18,
    stops: [
      { name: 'City Market', location: { type: 'Point', coordinates: [77.5700, 12.9650] }, sequenceOrder: 1, estimatedTime: 0 },
      { name: 'Lalbagh', location: { type: 'Point', coordinates: [77.5840, 12.9507] }, sequenceOrder: 2, estimatedTime: 8 },
      { name: 'Jayanagar', location: { type: 'Point', coordinates: [77.5833, 12.9250] }, sequenceOrder: 3, estimatedTime: 15 },
      { name: 'JP Nagar', location: { type: 'Point', coordinates: [77.5833, 12.9083] }, sequenceOrder: 4, estimatedTime: 22 },
      { name: 'Beach Road', location: { type: 'Point', coordinates: [77.5900, 12.8900] }, sequenceOrder: 5, estimatedTime: 30 }
    ]
  }
];

async function seedRoutes() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing routes
    await Route.deleteMany({});
    console.log('🗑️  Cleared existing routes');

    // Insert sample routes
    const routes = await Route.insertMany(sampleRoutes);
    console.log(`✅ Added ${routes.length} sample routes`);

    routes.forEach(route => {
      console.log(`   - ${route.routeNumber}: ${route.routeName} (${route.stops.length} stops)`);
    });

    console.log('\n🎉 Routes seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding routes:', error);
    process.exit(1);
  }
}

seedRoutes();
