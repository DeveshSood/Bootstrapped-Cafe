const mongoose = require('mongoose');
const Order = require('./models/Order');
require('dotenv').config({ path: './.env' });

async function migrate() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const result1 = await Order.updateMany(
      { status: 'out_for_delivery' },
      { $set: { status: 'assigned_to_partner' } }
    );
    console.log('Migrated out_for_delivery:', result1.modifiedCount);

    const result2 = await Order.updateMany(
      { status: 'delivered' },
      { $set: { status: 'handed_to_partner' } }
    );
    console.log('Migrated delivered:', result2.modifiedCount);

    console.log('Done.');
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

migrate();
