const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('./models/User');
const Bus = require('./models/Bus');
const Route = require('./models/Route');
const Notification = require('./models/Notification');
const SOSAlert = require('./models/SOSAlert');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/citiconnect', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB Connected for Seeding'))
.catch(err => console.error('❌ MongoDB Connection Error:', err));

// Ghaziabad, U.P. Bus Routes Data - Coordinates centered around Ghaziabad
const sampleRoutes = [
  {
    routeName: 'Raj Nagar to Vaishali Metro',
    routeNumber: 'GB-001',
    startPoint: 'Raj Nagar Extension',
    endPoint: 'Vaishali Metro Station',
    stops: [
      { name: 'Raj Nagar Extension', location: { coordinates: [77.4674, 28.6334] }, sequenceOrder: 1, estimatedTime: 0 },
      { name: 'Crossing Republik', location: { coordinates: [77.4550, 28.6411] }, sequenceOrder: 2, estimatedTime: 10 },
      { name: 'Kaushambi', location: { coordinates: [77.4083, 28.6419] }, sequenceOrder: 3, estimatedTime: 25 },
      { name: 'Anand Vihar', location: { coordinates: [77.3161, 28.6469] }, sequenceOrder: 4, estimatedTime: 40 },
      { name: 'Vaishali Metro Station', location: { coordinates: [77.3432, 28.6509] }, sequenceOrder: 5, estimatedTime: 55 }
    ],
    distance: 18.5,
    estimatedTime: 55,
    status: 'active'
  },
  {
    routeName: 'Indirapuram Circuit',
    routeNumber: 'GB-002',
    startPoint: 'Indirapuram',
    endPoint: 'Noida City Centre',
    stops: [
      { name: 'Indirapuram', location: { coordinates: [77.3635, 28.6375] }, sequenceOrder: 1, estimatedTime: 0 },
      { name: 'Ahinsa Khand', location: { coordinates: [77.3721, 28.6412] }, sequenceOrder: 2, estimatedTime: 8 },
      { name: 'Shipra Mall', location: { coordinates: [77.3821, 28.6469] }, sequenceOrder: 3, estimatedTime: 18 },
      { name: 'Kaushambi Metro', location: { coordinates: [77.4083, 28.6419] }, sequenceOrder: 4, estimatedTime: 32 },
      { name: 'Noida City Centre', location: { coordinates: [77.3568, 28.5748] }, sequenceOrder: 5, estimatedTime: 50 }
    ],
    distance: 16.2,
    estimatedTime: 50,
    status: 'active'
  },
  {
    routeName: 'Ghaziabad Railway to Mohan Nagar',
    routeNumber: 'GB-003',
    startPoint: 'Ghaziabad Railway Station',
    endPoint: 'Mohan Nagar',
    stops: [
      { name: 'Ghaziabad Railway Station', location: { coordinates: [77.4334, 28.6692] }, sequenceOrder: 1, estimatedTime: 0 },
      { name: 'RDC', location: { coordinates: [77.4284, 28.6592] }, sequenceOrder: 2, estimatedTime: 8 },
      { name: 'Sanjay Nagar', location: { coordinates: [77.4134, 28.6492] }, sequenceOrder: 3, estimatedTime: 18 },
      { name: 'Pratap Vihar', location: { coordinates: [77.3984, 28.6392] }, sequenceOrder: 4, estimatedTime: 28 },
      { name: 'Mohan Nagar', location: { coordinates: [77.3834, 28.6292] }, sequenceOrder: 5, estimatedTime: 40 }
    ],
    distance: 12.3,
    estimatedTime: 40,
    status: 'active'
  },
  {
    routeName: 'Vasundhara Express',
    routeNumber: 'GB-004',
    startPoint: 'Vasundhara Sector 1',
    endPoint: 'ISBT Anand Vihar',
    stops: [
      { name: 'Vasundhara Sector 1', location: { coordinates: [77.3775, 28.6608] }, sequenceOrder: 1, estimatedTime: 0 },
      { name: 'Vasundhara Sector 5', location: { coordinates: [77.3875, 28.6508] }, sequenceOrder: 2, estimatedTime: 9 },
      { name: 'Vasundhara Sector 16', location: { coordinates: [77.3975, 28.6408] }, sequenceOrder: 3, estimatedTime: 19 },
      { name: 'Kaushambi', location: { coordinates: [77.4083, 28.6419] }, sequenceOrder: 4, estimatedTime: 30 },
      { name: 'ISBT Anand Vihar', location: { coordinates: [77.3161, 28.6469] }, sequenceOrder: 5, estimatedTime: 45 }
    ],
    distance: 14.8,
    estimatedTime: 45,
    status: 'active'
  },
  {
    routeName: 'NH-24 Corridor',
    routeNumber: 'GB-005',
    startPoint: 'Ghaziabad Bus Depot',
    endPoint: 'Lal Kuan',
    stops: [
      { name: 'Ghaziabad Bus Depot', location: { coordinates: [77.4213, 28.6753] }, sequenceOrder: 1, estimatedTime: 0 },
      { name: 'Rajendra Nagar', location: { coordinates: [77.4313, 28.6653] }, sequenceOrder: 2, estimatedTime: 12 },
      { name: 'Vijay Nagar', location: { coordinates: [77.4413, 28.6553] }, sequenceOrder: 3, estimatedTime: 27 },
      { name: 'Govindpuram', location: { coordinates: [77.4513, 28.6453] }, sequenceOrder: 4, estimatedTime: 45 },
      { name: 'Lal Kuan', location: { coordinates: [77.4613, 28.6353] }, sequenceOrder: 5, estimatedTime: 65 }
    ],
    distance: 22.5,
    estimatedTime: 65,
    status: 'active'
  },
  {
    routeName: 'Sahibabad Industrial Loop',
    routeNumber: 'GB-006',
    startPoint: 'Sahibabad',
    endPoint: 'Hindon River',
    stops: [
      { name: 'Sahibabad', location: { coordinates: [77.3645, 28.6921] }, sequenceOrder: 1, estimatedTime: 0 },
      { name: 'Industrial Area', location: { coordinates: [77.3745, 28.6821] }, sequenceOrder: 2, estimatedTime: 8 },
      { name: 'Site 4', location: { coordinates: [77.3845, 28.6721] }, sequenceOrder: 3, estimatedTime: 18 },
      { name: 'Link Road', location: { coordinates: [77.3945, 28.6621] }, sequenceOrder: 4, estimatedTime: 26 },
      { name: 'Hindon River', location: { coordinates: [77.4045, 28.6521] }, sequenceOrder: 5, estimatedTime: 35 }
    ],
    distance: 11.7,
    estimatedTime: 35,
    status: 'active'
  },
  {
    routeName: 'Crossings Republik to Delhi',
    routeNumber: 'GB-007',
    startPoint: 'Crossings Republik',
    endPoint: 'Anand Vihar ISBT',
    stops: [
      { name: 'Crossings Republik', location: { coordinates: [77.4550, 28.6411] }, sequenceOrder: 1, estimatedTime: 0 },
      { name: 'Raj Nagar Extension', location: { coordinates: [77.4674, 28.6334] }, sequenceOrder: 2, estimatedTime: 12 },
      { name: 'Kaushambi Metro', location: { coordinates: [77.4083, 28.6419] }, sequenceOrder: 3, estimatedTime: 30 },
      { name: 'Anand Vihar ISBT', location: { coordinates: [77.3161, 28.6469] }, sequenceOrder: 4, estimatedTime: 60 }
    ],
    distance: 20.4,
    estimatedTime: 60,
    status: 'active'
  },
  {
    routeName: 'Loni to Ghaziabad',
    routeNumber: 'GB-008',
    startPoint: 'Loni Border',
    endPoint: 'Ghaziabad Railway Station',
    stops: [
      { name: 'Loni Border', location: { coordinates: [77.2875, 28.7521] }, sequenceOrder: 1, estimatedTime: 0 },
      { name: 'Shastri Nagar', location: { coordinates: [77.3175, 28.7321] }, sequenceOrder: 2, estimatedTime: 10 },
      { name: 'Rakesh Marg', location: { coordinates: [77.3475, 28.7121] }, sequenceOrder: 3, estimatedTime: 22 },
      { name: 'Gandhi Nagar', location: { coordinates: [77.3775, 28.6921] }, sequenceOrder: 4, estimatedTime: 32 },
      { name: 'Ghaziabad Railway Station', location: { coordinates: [77.4334, 28.6692] }, sequenceOrder: 5, estimatedTime: 42 }
    ],
    distance: 13.6,
    estimatedTime: 42,
    status: 'active'
  },
  {
    routeName: 'Maliwara to Dilshad Garden',
    routeNumber: 'GB-009',
    startPoint: 'Maliwara',
    endPoint: 'Dilshad Garden Metro',
    stops: [
      { name: 'Maliwara', location: { coordinates: [77.3134, 28.7092] }, sequenceOrder: 1, estimatedTime: 0 },
      { name: 'Shalimar Garden', location: { coordinates: [77.3234, 28.6992] }, sequenceOrder: 2, estimatedTime: 10 },
      { name: 'Ramprastha', location: { coordinates: [77.3334, 28.6892] }, sequenceOrder: 3, estimatedTime: 22 },
      { name: 'Old Bus Stand', location: { coordinates: [77.3434, 28.6792] }, sequenceOrder: 4, estimatedTime: 34 },
      { name: 'Dilshad Garden Metro', location: { coordinates: [77.3151, 28.6791] }, sequenceOrder: 5, estimatedTime: 48 }
    ],
    distance: 15.3,
    estimatedTime: 48,
    status: 'active'
  },
  {
    routeName: 'Muradnagar Highway',
    routeNumber: 'GB-010',
    startPoint: 'Muradnagar',
    endPoint: 'Ghaziabad',
    stops: [
      { name: 'Muradnagar', location: { coordinates: [77.5034, 28.7834] }, sequenceOrder: 1, estimatedTime: 0 },
      { name: 'Dasna', location: { coordinates: [77.4834, 28.7534] }, sequenceOrder: 2, estimatedTime: 14 },
      { name: 'Modi Nagar Road', location: { coordinates: [77.4634, 28.7234] }, sequenceOrder: 3, estimatedTime: 32 },
      { name: 'Wave City', location: { coordinates: [77.4434, 28.6934] }, sequenceOrder: 4, estimatedTime: 52 },
      { name: 'Ghaziabad', location: { coordinates: [77.4334, 28.6692] }, sequenceOrder: 5, estimatedTime: 70 }
    ],
    distance: 25.8,
    estimatedTime: 70,
    status: 'active'
  },
  {
    routeName: 'Wave City to Vaishali',
    routeNumber: 'GB-011',
    startPoint: 'Wave City',
    endPoint: 'Vaishali Metro',
    stops: [
      { name: 'Wave City', location: { coordinates: [77.4434, 28.6934] }, sequenceOrder: 1, estimatedTime: 0 },
      { name: 'NH-24', location: { coordinates: [77.4334, 28.6834] }, sequenceOrder: 2, estimatedTime: 10 },
      { name: 'Kaushambi', location: { coordinates: [77.4083, 28.6419] }, sequenceOrder: 3, estimatedTime: 27 },
      { name: 'Sector 4', location: { coordinates: [77.3632, 28.6509] }, sequenceOrder: 4, estimatedTime: 40 },
      { name: 'Vaishali Metro', location: { coordinates: [77.3432, 28.6509] }, sequenceOrder: 5, estimatedTime: 52 }
    ],
    distance: 17.2,
    estimatedTime: 52,
    status: 'active'
  },
  {
    routeName: 'Khoda Colony Circuit',
    routeNumber: 'GB-012',
    startPoint: 'Khoda Colony',
    endPoint: 'Anand Vihar',
    stops: [
      { name: 'Khoda Colony', location: { coordinates: [77.3335, 28.6208] }, sequenceOrder: 1, estimatedTime: 0 },
      { name: 'New Ashok Nagar', location: { coordinates: [77.3035, 28.6108] }, sequenceOrder: 2, estimatedTime: 10 },
      { name: 'IP Extension', location: { coordinates: [77.2935, 28.6208] }, sequenceOrder: 3, estimatedTime: 22 },
      { name: 'Karkardooma', location: { coordinates: [77.3035, 28.6308] }, sequenceOrder: 4, estimatedTime: 33 },
      { name: 'Anand Vihar', location: { coordinates: [77.3161, 28.6469] }, sequenceOrder: 5, estimatedTime: 44 }
    ],
    distance: 14.5,
    estimatedTime: 44,
    status: 'active'
  },
  {
    routeName: 'Hindon Vihar Express',
    routeNumber: 'GB-013',
    startPoint: 'Hindon Vihar',
    endPoint: 'Ghaziabad Junction',
    stops: [
      { name: 'Hindon Vihar', location: { coordinates: [77.4145, 28.6421] }, sequenceOrder: 1, estimatedTime: 0 },
      { name: 'Arthala', location: { coordinates: [77.4245, 28.6521] }, sequenceOrder: 2, estimatedTime: 8 },
      { name: 'Rajendra Nagar', location: { coordinates: [77.4313, 28.6653] }, sequenceOrder: 3, estimatedTime: 18 },
      { name: 'RDC', location: { coordinates: [77.4284, 28.6592] }, sequenceOrder: 4, estimatedTime: 26 },
      { name: 'Ghaziabad Junction', location: { coordinates: [77.4334, 28.6692] }, sequenceOrder: 5, estimatedTime: 35 }
    ],
    distance: 10.8,
    estimatedTime: 35,
    status: 'active'
  },
  {
    routeName: 'Dundahera to Noida',
    routeNumber: 'GB-014',
    startPoint: 'Dundahera',
    endPoint: 'Noida Sector 62',
    stops: [
      { name: 'Dundahera', location: { coordinates: [77.3235, 28.6608] }, sequenceOrder: 1, estimatedTime: 0 },
      { name: 'Vaishali', location: { coordinates: [77.3432, 28.6509] }, sequenceOrder: 2, estimatedTime: 12 },
      { name: 'Sector 5', location: { coordinates: [77.3532, 28.6309] }, sequenceOrder: 3, estimatedTime: 24 },
      { name: 'Sector 18', location: { coordinates: [77.3632, 28.5909] }, sequenceOrder: 4, estimatedTime: 40 },
      { name: 'Noida Sector 62', location: { coordinates: [77.3732, 28.5609] }, sequenceOrder: 5, estimatedTime: 58 }
    ],
    distance: 19.6,
    estimatedTime: 58,
    status: 'active'
  },
  {
    routeName: 'Madhuban Bapudham Loop',
    routeNumber: 'GB-015',
    startPoint: 'Madhuban Bapudham',
    endPoint: 'Sahibabad Metro',
    stops: [
      { name: 'Madhuban Bapudham', location: { coordinates: [77.2835, 28.7208] }, sequenceOrder: 1, estimatedTime: 0 },
      { name: 'Shastri Nagar', location: { coordinates: [77.3175, 28.7321] }, sequenceOrder: 2, estimatedTime: 9 },
      { name: 'Govindpuram', location: { coordinates: [77.4513, 28.6453] }, sequenceOrder: 3, estimatedTime: 20 },
      { name: 'Link Road', location: { coordinates: [77.3945, 28.6621] }, sequenceOrder: 4, estimatedTime: 30 },
      { name: 'Sahibabad Metro', location: { coordinates: [77.3645, 28.6921] }, sequenceOrder: 5, estimatedTime: 40 }
    ],
    distance: 12.9,
    estimatedTime: 40,
    status: 'active'
  },
];

const busNumberPrefix = ['CT', 'BC', 'EX', 'SH'];
const busStatus = ['active', 'maintenance', 'inactive'];

async function seedDatabase() {
  try {
    // WARNING: Commenting out deleteMany to preserve existing user accounts
    // Only uncomment if you want to completely reset the database
    console.log('⚠️  NOT clearing existing data (to preserve accounts)...');
    console.log('💡 If you want to reset database, uncomment the deleteMany lines in seedData.js');
    
    // UNCOMMENT THESE LINES ONLY IF YOU WANT TO DELETE ALL DATA:
    // await User.deleteMany({});
    // await Bus.deleteMany({});
    // await Route.deleteMany({});
    // await Notification.deleteMany({});
    // await SOSAlert.deleteMany({});

    // Create Routes
    console.log('📍 Creating routes...');
    const routes = await Route.insertMany(sampleRoutes);
    console.log(`✅ Created ${routes.length} routes`);

    // Create Admin Users (5)
    console.log('👤 Creating admin users...');
    const admins = [];
    for (let i = 1; i <= 5; i++) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      admins.push({
        name: `Admin User ${i}`,
        email: `admin${i}@citiconnect.com`,
        password: hashedPassword,
        phone: `+1234567${1000 + i}`,
        role: 'admin',
      });
    }
    const adminUsers = await User.insertMany(admins);
    console.log(`✅ Created ${adminUsers.length} admin users`);

    // Create Driver Users (20)
    console.log('🚗 Creating driver users...');
    const drivers = [];
    for (let i = 1; i <= 20; i++) {
      const hashedPassword = await bcrypt.hash('driver123', 10);
      drivers.push({
        name: `Driver ${i}`,
        email: `driver${i}@citiconnect.com`,
        password: hashedPassword,
        phone: `+1234568${1000 + i}`,
        role: 'driver',
        licenseNumber: `DL${100000 + i}`,
      });
    }
    const driverUsers = await User.insertMany(drivers);
    console.log(`✅ Created ${driverUsers.length} driver users`);

    // Create Regular Users (25)
    console.log('👥 Creating regular users...');
    const users = [];
    for (let i = 1; i <= 25; i++) {
      const hashedPassword = await bcrypt.hash('user123', 10);
      users.push({
        name: `User ${i}`,
        email: `user${i}@example.com`,
        password: hashedPassword,
        phone: `+1234569${1000 + i}`,
        role: 'user',
      });
    }
    const regularUsers = await User.insertMany(users);
    console.log(`✅ Created ${regularUsers.length} regular users`);

    // Create Buses (20)
    console.log('🚌 Creating buses...');
    const buses = [];
    const busTypes = ['AC', 'Non-AC', 'Electric'];
    for (let i = 0; i < 20; i++) {
      const route = routes[i % routes.length];
      const driver = driverUsers[i];
      const prefix = busNumberPrefix[i % busNumberPrefix.length];
      
      buses.push({
        busNumber: `${prefix}-${1000 + i}`,
        registrationNumber: `UP14${String.fromCharCode(65 + (i % 26))}${String.fromCharCode(65 + ((i + 1) % 26))}${2000 + i}`,
        capacity: [40, 50, 60][i % 3],
        type: busTypes[i % 3],
        assignedRoute: route._id,
        assignedDriver: driver._id,
        currentLocation: {
          type: 'Point',
          coordinates: [77.4334 + (Math.random() - 0.5) * 0.1, 28.6692 + (Math.random() - 0.5) * 0.1]
        },
        status: busStatus[i % 3],
        lastMaintenance: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        nextMaintenance: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000),
      });
    }
    const createdBuses = await Bus.insertMany(buses);
    console.log(`✅ Created ${createdBuses.length} buses`);

    // Create Notifications (30)
    console.log('🔔 Creating notifications...');
    const notifications = [];
    const notificationTypes = ['info', 'warning', 'alert', 'emergency', 'announcement'];
    const notificationMessages = [
      'Bus is running on time',
      'Slight delay due to traffic',
      'Bus approaching your stop',
      'Route change announcement',
      'New bus added to route',
      'Maintenance scheduled',
      'Service update available',
      'Weather alert',
      'Special event route change',
      'Bus reached destination',
    ];

    for (let i = 0; i < 30; i++) {
      const targetUser = [...adminUsers, ...driverUsers, ...regularUsers][i % 50];
      const sender = adminUsers[i % adminUsers.length];
      notifications.push({
        title: `Notification ${i + 1}`,
        message: notificationMessages[i % notificationMessages.length],
        type: notificationTypes[i % notificationTypes.length],
        sender: sender._id,
        recipients: ['all', 'users', 'drivers'][i % 3],
        createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      });
    }
    const createdNotifications = await Notification.insertMany(notifications);
    console.log(`✅ Created ${createdNotifications.length} notifications`);

    // Create SOS Alerts (10)
    console.log('🚨 Creating SOS alerts...');
    const sosAlerts = [];
    const alertStatuses = ['active', 'acknowledged', 'resolved'];
    const emergencyDescriptions = [
      'Medical emergency on bus',
      'Bus breakdown - engine failure',
      'Accident - minor collision',
      'Security concern - suspicious activity',
      'Tire puncture - need assistance',
      'Passenger feeling unwell',
      'Traffic accident ahead',
      'Bus overheating',
      'Lost child on bus',
      'Harassment complaint',
    ];

    for (let i = 0; i < 10; i++) {
      const driver = driverUsers[i % driverUsers.length];
      const bus = createdBuses[i % createdBuses.length];
      
      sosAlerts.push({
        driver: driver._id,
        bus: bus._id,
        location: {
          type: 'Point',
          coordinates: [77.4334 + (Math.random() - 0.5) * 0.1, 28.6692 + (Math.random() - 0.5) * 0.1]
        },
        description: emergencyDescriptions[i],
        status: alertStatuses[i % alertStatuses.length],
        createdAt: new Date(Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1000),
        acknowledgedBy: i % 3 !== 0 ? adminUsers[i % adminUsers.length]._id : undefined,
        acknowledgedAt: i % 3 !== 0 ? new Date(Date.now() - Math.random() * 2 * 24 * 60 * 60 * 1000) : undefined,
        resolvedAt: i % 3 === 2 ? new Date(Date.now() - Math.random() * 1 * 24 * 60 * 60 * 1000) : undefined,
      });
    }
    const createdSOSAlerts = await SOSAlert.insertMany(sosAlerts);
    console.log(`✅ Created ${createdSOSAlerts.length} SOS alerts`);

    // Summary
    console.log('\n📊 === SEED DATA SUMMARY ===');
    console.log(`Total Users: ${adminUsers.length + driverUsers.length + regularUsers.length}`);
    console.log(`  - Admins: ${adminUsers.length}`);
    console.log(`  - Drivers: ${driverUsers.length}`);
    console.log(`  - Regular Users: ${regularUsers.length}`);
    console.log(`Total Routes: ${routes.length}`);
    console.log(`Total Buses: ${createdBuses.length}`);
    console.log(`Total Notifications: ${createdNotifications.length}`);
    console.log(`Total SOS Alerts: ${createdSOSAlerts.length}`);
    console.log('\n🔑 === TEST CREDENTIALS ===');
    console.log('Admin: admin1@citiconnect.com / admin123');
    console.log('Driver: driver1@citiconnect.com / driver123');
    console.log('User: user1@example.com / user123');
    console.log('\n✅ Database seeded successfully!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seed function
seedDatabase();
