const MenuOverride = require('../models/MenuOverride');
const weeklyMenuData = require('../config/weeklyMenuData');
const { calculateNutrition } = require('../config/nutritionDB');

const recalculateOverrideNutrition = (overrideObj) => {
  const menuItems = overrideObj.menuItems || overrideObj.overrideData?.menuItems || [];
  
  menuItems.forEach(item => {
    if (item.ingredients && item.ingredients.length > 0) {
      let totalCals = 0, totalProt = 0, totalCarb = 0, totalFat = 0;
      let totalVitC = 0, totalVitE = 0, totalFolate = 0, totalVitB6 = 0;
      
      item.ingredients.forEach(ing => {
         const macros = calculateNutrition(ing);
         totalCals += macros.calories;
         totalProt += macros.protein;
         totalCarb += macros.carbs;
         totalFat += macros.fat;
         totalVitC += macros.vitC;
         totalVitE += macros.vitE;
         totalFolate += macros.folate;
         totalVitB6 += macros.vitB6;
      });
      
      item.nutrition = {
         calories: totalCals,
         protein: Math.round(totalProt * 10) / 10,
         carbs: Math.round(totalCarb * 10) / 10,
         fat: Math.round(totalFat * 10) / 10,
         vitC: Math.round(totalVitC * 10) / 10,
         vitE: Math.round(totalVitE * 10) / 10,
         folate: Math.round(totalFolate * 10) / 10,
         vitB6: Math.round(totalVitB6 * 10) / 10
      };
    }
  });
  
  const rawIngredients = overrideObj.customSaladIngredients || overrideObj.overrideData?.customSalad?.ingredients || {};
  // Handle Mongoose Map type - convert to plain object if needed
  const customSaladIngredients = rawIngredients instanceof Map 
    ? Object.fromEntries(rawIngredients) 
    : (typeof rawIngredients.toObject === 'function' ? rawIngredients.toObject() : rawIngredients);
  
  Object.keys(customSaladIngredients).forEach(catId => {
    const items = customSaladIngredients[catId];
    if (!Array.isArray(items)) return;
    items.forEach(ingObj => {
      const macros = calculateNutrition(ingObj.name);
      ingObj.nutrition = {
         calories: macros.calories,
         protein: macros.protein,
         carbs: macros.carbs,
         fat: macros.fat,
         vitC: macros.vitC,
         vitE: macros.vitE,
         folate: macros.folate,
         vitB6: macros.vitB6
      };
    });
  });

  
  return overrideObj;
};

// Gets the menu for today (combines defaults with any override for the current date)
exports.getDailyMenu = async (req, res) => {
  try {
    // Current date string in YYYY-MM-DD or provided via query
    const dateStr = req.query.date || new Date().toLocaleDateString('en-CA'); // 'YYYY-MM-DD' format

    // Check for an override
    const override = await MenuOverride.findOne({ date: dateStr }).lean();
    
    if (override) {
      const updatedOverride = recalculateOverrideNutrition(override);
      return res.json({
        isOverride: true,
        menuItems: updatedOverride.menuItems,
        customSalad: {
          categories: updatedOverride.customSaladCategories,
          ingredients: updatedOverride.customSaladIngredients
        },
        categories: updatedOverride.categories
      });
    }

    // No override, serve the default for that date
    // Use the provided date string to get the day of the week if provided
    let dayIndex;
    if (req.query.date) {
      dayIndex = new Date(req.query.date).getUTCDay();
    } else {
      dayIndex = new Date().getDay(); // 0 = Sunday, 1 = Monday
    }
    
    const defaultMenu = weeklyMenuData.getMenuForDay(dayIndex);
    
    res.json({
      isOverride: false,
      ...defaultMenu
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Gets the full 7-day schedule (used by Kitchen Dashboard)
exports.getSchedule = async (req, res) => {
  try {
    const schedule = [];
    for (let i = 0; i < 7; i++) {
      schedule.push({
        dayIndex: i,
        menu: weeklyMenuData.getMenuForDay(i)
      });
    }
    
    // Fetch all active overrides to display on the dashboard
    let overrides = await MenuOverride.find({});
    
    // Map them to recalculate nutrition dynamically
    const overridesWithNutrition = overrides.map(o => {
      const obj = o.toObject();
      obj.overrideData = {
        menuItems: obj.menuItems,
        customSalad: {
          categories: obj.customSaladCategories,
          ingredients: obj.customSaladIngredients
        }
      };
      return recalculateOverrideNutrition(obj);
    });
    
    res.json({ defaultSchedule: schedule, overrides: overridesWithNutrition });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Sets an override for a specific date
exports.setOverride = async (req, res) => {
  try {
    const { date, menuItems, customSaladCategories, customSaladIngredients, categories } = req.body;
    
    if (!date) return res.status(400).json({ message: 'Date is required' });

    let override = await MenuOverride.findOne({ date });
    if (override) {
      // Update existing
      override.menuItems = menuItems;
      override.customSaladCategories = customSaladCategories;
      override.customSaladIngredients = customSaladIngredients;
      override.categories = categories;
      await override.save();
    } else {
      // Create new
      override = await MenuOverride.create({
        date,
        menuItems,
        customSaladCategories,
        customSaladIngredients,
        categories
      });
    }

    res.json(override);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Deletes an override
exports.deleteOverride = async (req, res) => {
  try {
    const { date } = req.params;
    await MenuOverride.findOneAndDelete({ date });
    res.json({ message: 'Override deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
