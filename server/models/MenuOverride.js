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
    nutrition: {
      protein: String,
      carbs: String,
      fat: String,
      vitamins: [String]
    }
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
      nutrition: {
        protein: Number,
        carbs: Number,
        fat: Number,
        calories: Number
      }
    }]
  }
}, { timestamps: true });

module.exports = mongoose.model('MenuOverride', menuOverrideSchema);
