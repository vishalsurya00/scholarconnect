const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/User');

dotenv.config({ path: path.join(__dirname, '../.env') });

const targetEmailOrPhone = process.argv[2];

if (!targetEmailOrPhone) {
  console.error('Usage: node server/scripts/makeAdmin.js <email_or_phone>');
  process.exit(1);
}

const makeAdmin = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/scholarconnect';
    console.log(`Connecting to MongoDB...`);
    await mongoose.connect(mongoUri);

    const input = targetEmailOrPhone.trim().toLowerCase();

    const user = await User.findOne({
      $or: [{ email: input }, { phone: targetEmailOrPhone.trim() }],
    });

    if (!user) {
      console.error(`User not found with email or phone: ${targetEmailOrPhone}`);
      process.exit(1);
    }

    user.role = 'admin';
    await user.save();

    console.log(`✅ Success! User "${user.fullName}" (${user.email || user.phone}) is now an ADMIN.`);
    process.exit(0);
  } catch (error) {
    console.error('Error promoting user to admin:', error);
    process.exit(1);
  }
};

makeAdmin();
