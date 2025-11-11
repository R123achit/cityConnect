const mongoose = require('mongoose');
require('dotenv').config();

const SOSAlert = require('./models/SOSAlert');
const Notification = require('./models/Notification');
const User = require('./models/User');
const Bus = require('./models/Bus');

async function seedAlertsNotifications() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Get users and buses
    const users = await User.find();
    const buses = await Bus.find();

    if (users.length === 0 || buses.length === 0) {
      console.log('❌ No users or buses found. Please add users and buses first');
      process.exit(1);
    }

    // Clear existing data
    await SOSAlert.deleteMany({});
    await Notification.deleteMany({});
    console.log('🗑️  Cleared existing alerts and notifications');

    // Create 2 SOS Alerts
    const sosAlerts = [
      {
        driver: users.find(u => u.role === 'driver')?._id || users[0]._id,
        bus: buses[0]._id,
        location: {
          type: 'Point',
          coordinates: [77.5946, 12.9716]
        },
        description: 'Engine breakdown near City Center',
        status: 'active'
      },
      {
        driver: users.find(u => u.role === 'driver')?._id || users[0]._id,
        bus: buses[1]._id,
        location: {
          type: 'Point',
          coordinates: [77.6033, 12.9759]
        },
        description: 'Medical emergency - passenger needs assistance',
        status: 'acknowledged',
        acknowledgedBy: users.find(u => u.role === 'admin')?._id || users[0]._id,
        acknowledgedAt: new Date()
      }
    ];

    const createdAlerts = await SOSAlert.insertMany(sosAlerts);
    console.log(`✅ Added ${createdAlerts.length} SOS alerts`);

    // Create 2 Notifications
    const notifications = [
      {
        title: 'Route Change Alert',
        message: 'Route R101 will have a temporary diversion due to road construction',
        type: 'alert',
        priority: 'medium',
        sender: users.find(u => u.role === 'admin')?._id || users[0]._id,
        recipients: 'all'
      },
      {
        title: 'New Bus Service',
        message: 'New AC bus service starting on Route R105 from tomorrow',
        type: 'info',
        priority: 'low',
        sender: users.find(u => u.role === 'admin')?._id || users[0]._id,
        recipients: 'users'
      }
    ];

    const createdNotifications = await Notification.insertMany(notifications);
    console.log(`✅ Added ${createdNotifications.length} notifications`);

    console.log('\n📋 Summary:');
    createdAlerts.forEach((alert, i) => {
      console.log(`   SOS ${i + 1}: ${alert.description} (${alert.status})`);
    });
    createdNotifications.forEach((notif, i) => {
      console.log(`   Notification ${i + 1}: ${notif.title}`);
    });

    console.log('\n🎉 Alerts and Notifications seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
}

seedAlertsNotifications();
