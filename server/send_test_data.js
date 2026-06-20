const mongoose = require('mongoose');
const User = require('./models/User.js');
const RewardTransaction = require('./models/RewardTransaction.js');
const Dustbin = require('./models/Dustbin.js');
const dotenv = require('dotenv');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const adminEmail = process.env.DEV_ADMIN_EMAIL || 'admin@wastewise.com';
    const collectorEmail = process.env.DEV_COLLECTOR_EMAIL || 'collector@wastewise.com';
    const adminPassword = process.env.DEV_ADMIN_PASSWORD || 'Admin@123';
    const collectorPassword = process.env.DEV_COLLECTOR_PASSWORD || 'Collector@123';

    const admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      await User.create({
        name: 'WasteWise Admin',
        email: adminEmail,
        phone: '9000000001',
        password: adminPassword,
        role: 'admin',
        isVerified: true
      });
      console.log(`Created admin account: ${adminEmail} / ${adminPassword}`);
    }

    const collector = await User.findOne({ email: collectorEmail });
    if (!collector) {
      await User.create({
        name: 'WasteWise Collector',
        email: collectorEmail,
        phone: '9000000002',
        password: collectorPassword,
        role: 'collector',
        isVerified: true
      });
      console.log(`Created collector account: ${collectorEmail} / ${collectorPassword}`);
    }

    // Find a user
    const user = await User.findOne({ role: 'user' });
    if (!user) {
      console.log('No user found to seed history. Please register a user first.');
    } else {
      // Create a test transaction
      const transaction = await RewardTransaction.create({
        user: user._id,
        amount: 100,
        type: 'earned',
        description: 'Welcome Bonus Points',
        status: 'completed'
      });
      console.log('Created test transaction for:', user.email);
      
      // Update user points
      user.rewardPoints = (user.rewardPoints || 0) + 100;
      await user.save();
      console.log('Updated user points');
    }

    // Seed database-managed bins if none exist
    const binCount = await Dustbin.countDocuments();
    if (binCount === 0) {
      await Dustbin.create([
        {
          name: 'Central Park Entrance',
          location: 'Central Park Entrance',
          fillLevel: 45,
          status: 'active'
        },
        {
          name: 'Market Square South',
          location: 'Market Square South',
          fillLevel: 85,
          status: 'active'
        }
      ]);
      console.log('Created test bins');
    }

    console.log('Seeding completed!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
};

seedData();
