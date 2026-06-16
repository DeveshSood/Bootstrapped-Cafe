require('dotenv').config();
const mongoose = require('mongoose');
const MenuItem = require('../models/MenuItem');

const menuItems = [
  { name: 'Teriyaki Salmon Bowl', description: 'Grilled salmon with quinoa, avocado, edamame, roasted veggies and miso dressing.', price: 549, category: 'Protein Bowls', calories: 520, protein: 42, carbs: 48, fat: 18, tags: ['High Protein', 'Omega Rich'], isVeg: false },
  { name: 'Paneer Harvest Bowl', description: 'Grilled paneer with sweet potato, chickpeas, kale, and tahini drizzle.', price: 399, category: 'Vegan Bowls', calories: 460, protein: 28, carbs: 52, fat: 14, tags: ['Fresh Daily', 'High Fibre'], isVeg: true },
  { name: 'Grilled Chicken Protein Plate', description: 'Herb-marinated chicken breast with brown rice, steamed broccoli, and tzatziki.', price: 479, category: 'High Protein', calories: 580, protein: 48, carbs: 42, fat: 16, tags: ['High Protein', 'Low Carb'], isVeg: false },
  { name: 'Mediterranean Lunch Box', description: 'Hummus, falafel, tabbouleh, pita, olives, and feta cheese.', price: 429, category: 'Office Lunch', calories: 510, protein: 22, carbs: 56, fat: 20, tags: ['Fresh Daily', 'Balanced'], isVeg: true },
  { name: 'Citrus Kombucha', description: 'House-brewed orange and ginger kombucha with live cultures.', price: 179, category: 'Kombucha', calories: 45, protein: 0, carbs: 10, fat: 0, tags: ['Low Carb', 'Probiotic'], isVeg: true },
  { name: 'Steak & Quinoa Power Bowl', description: 'Grass-fed steak strips with quinoa, roasted peppers, and chimichurri.', price: 649, category: 'High Protein', calories: 620, protein: 52, carbs: 38, fat: 22, tags: ['High Protein'], isVeg: false },
  { name: 'Avocado Toast Plate', description: 'Sourdough toast with smashed avocado, cherry tomatoes, microgreens, and seeds.', price: 349, category: 'Vegan Bowls', calories: 380, protein: 12, carbs: 42, fat: 18, tags: ['Fresh Daily'], isVeg: true },
  { name: 'Berry Bliss Kombucha', description: 'Mixed berry and hibiscus kombucha, naturally carbonated.', price: 189, category: 'Kombucha', calories: 50, protein: 0, carbs: 12, fat: 0, tags: ['Low Carb', 'Live Culture'], isVeg: true },
  { name: 'Office Thali Balanced', description: 'Dal, sabzi, rice, roti, raita, and salad — balanced macros for focused work.', price: 299, category: 'Office Lunch', calories: 540, protein: 24, carbs: 68, fat: 12, tags: ['Balanced', 'Office Ready'], isVeg: true },
  { name: 'Egg White Protein Wrap', description: 'Egg whites with spinach, peppers, cheese, and chipotle in a whole wheat wrap.', price: 329, category: 'High Protein', calories: 420, protein: 38, carbs: 32, fat: 10, tags: ['High Protein', 'Low Carb'], isVeg: true },
  { name: 'Kombucha Citrus Cooler', description: 'Sparkling kombucha with fresh citrus zest and mint, served over ice.', price: 199, category: 'Kombucha', calories: 40, protein: 0, carbs: 8, fat: 0, tags: ['Low Sugar', 'Refreshing'], isVeg: true },
  { name: 'Chicken Caesar Protein Bowl', description: 'Grilled chicken, romaine, parmesan, croutons, and Caesar dressing over quinoa.', price: 499, category: 'Protein Bowls', calories: 560, protein: 44, carbs: 40, fat: 20, tags: ['High Protein'], isVeg: false },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bootstrap-cafe');
    console.log('Connected to MongoDB');

    await MenuItem.deleteMany({});
    console.log('Cleared existing menu items');

    await MenuItem.insertMany(menuItems);
    console.log(`Seeded ${menuItems.length} menu items`);

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedDB();
