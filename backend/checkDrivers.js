require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function checkDrivers() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/citiconnect';
    await mongoose.connect(MONGODB_URI);
    
    console.log('Connected to MongoDB');
    
    const drivers = await User.find({ role: 'driver' });
    console.log('\nTotal drivers found:', drivers.length);
    
    if (drivers.length === 0) {
      console.log('❌ No drivers found in database');
    } else {
      console.log('\nDriver List:');
      drivers.forEach((d, index) => {
        console.log(`${index + 1}. ${d.name} (${d.email})`);
        console.log(`   License: ${d.licenseNumber || 'Not set'}`);
        console.log(`   Bus: ${d.assignedBus || 'Not assigned'}`);
        console.log(`   Route: ${d.assignedRoute || 'Not assigned'}`);
      });
    }
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

checkDrivers();
