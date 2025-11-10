const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/citiconnect')
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.error('❌ MongoDB Error:', err));

async function testLogin(email, password) {
  try {
    console.log('\n🔍 Testing login for:', email);
    console.log('📝 Password provided:', password);
    
    // Find user with password
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      console.log('❌ User not found');
      return;
    }
    
    console.log('✅ User found:', user.email);
    console.log('🔐 Stored password hash:', user.password.substring(0, 20) + '...');
    console.log('📏 Hash length:', user.password.length);
    
    // Test password comparison
    const isMatch = await user.comparePassword(password);
    
    if (isMatch) {
      console.log('✅ Password CORRECT! Login should work.');
    } else {
      console.log('❌ Password INCORRECT! Login will fail.');
      
      // Try hashing the provided password to see what it becomes
      const testHash = await bcrypt.hash(password, 10);
      console.log('🧪 Test hash of provided password:', testHash.substring(0, 20) + '...');
      
      // Try direct bcrypt compare
      const directMatch = await bcrypt.compare(password, user.password);
      console.log('🔄 Direct bcrypt.compare result:', directMatch);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    process.exit(0);
  }
}

// Test with default credentials
const testEmail = process.argv[2] || 'user1@example.com';
const testPassword = process.argv[3] || 'user123';

testLogin(testEmail, testPassword);
