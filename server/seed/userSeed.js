require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bootstrap-cafe');
    console.log('Connected to MongoDB');

    // Don't wipe existing users — only create if they don't exist
    const accounts = [
      {
        name: 'Bootstrap Kitchen',
        email: 'kitchen@bootstrappedcafe.com',
        password: 'kitchen123',
        phone: '9876543210',
        role: 'restaurant',
      },
      {
        name: 'Cafe Owner',
        email: 'admin@bootstrappedcafe.com',
        password: 'admin123',
        phone: '9876543211',
        role: 'admin',
      },
    ];

    for (const acc of accounts) {
      const exists = await User.findOne({ email: acc.email });
      if (exists) {
        console.log(`  ✓ ${acc.role} account already exists: ${acc.email}`);
      } else {
        await User.create(acc);
        console.log(`  + Created ${acc.role} account: ${acc.email} / ${acc.password}`);
      }
    }

    console.log('\n  Login credentials:');
    console.log('  ─────────────────────────────────────────');
    console.log('  Restaurant: kitchen@bootstrappedcafe.com / kitchen123');
    console.log('  Admin:      admin@bootstrappedcafe.com   / admin123');
    console.log('  ─────────────────────────────────────────\n');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedUsers();
