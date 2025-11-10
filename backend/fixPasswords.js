const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/citiconnect');

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', async () => {
  console.log('Connected to MongoDB');

  try {
    // Get all users
    const users = await db.collection('users').find({}).toArray();
    
    console.log(`\n📊 Found ${users.length} users`);
    
    let fixedCount = 0;
    
    for (const user of users) {
      // Check if password is already hashed (bcrypt hashes start with $2a$ or $2b$ and are 60 chars)
      if (!user.password.startsWith('$2a$') && !user.password.startsWith('$2b$')) {
        console.log(`\n🔧 Fixing password for: ${user.email}`);
        console.log(`   Old (plaintext): ${user.password}`);
        
        // Hash the plaintext password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        
        console.log(`   New (hashed): ${hashedPassword.substring(0, 20)}...`);
        
        // Update the user
        await db.collection('users').updateOne(
          { _id: user._id },
          { $set: { password: hashedPassword } }
        );
        
        fixedCount++;
      } else {
        console.log(`✅ ${user.email} - password already hashed`);
      }
    }
    
    console.log(`\n✅ Fixed ${fixedCount} plaintext passwords`);
    console.log(`✅ ${users.length - fixedCount} passwords were already hashed`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔒 Database connection closed');
  }
});
