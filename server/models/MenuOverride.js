const mongoose = require('mongoose');

const menuOverrideSchema = new mongoose.Schema({
  date: { 
    type: String, 
    required: true,
    unique: true, // e.g. '2026-07-03'
    index: true
  },
  // We can store the full menu structure for the overridden day
  categories: [{ type: String }],
  menuItems: [{
    id: Number,
    name: String,
    category: String,
    price: Number,
    isVeg: Boolean,
    image: String,
    ingredients: [String],
    nutrition: mongoose.Schema.Types.Mixed
  }],
  // Custom Salad ingredients categories for this specific day
  customSaladCategories: [{
    id: String,
    label: String,
    limit: Number
  }],
  customSaladIngredients: {
    // This will be a Map/Object where keys are category IDs, and values are arrays of ingredient objects
    type: Map,
    of: [{
      id: String,
      name: String,
      price: Number,
      isVeg: Boolean,
      image: String,
      nutrition: mongoose.Schema.Types.Mixed
    }]
  }
}, { timestamps: true });

module.exports = mongoose.model('MenuOverride', menuOverrideSchema);
