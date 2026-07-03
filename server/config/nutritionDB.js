const MACROS_PER_100G = {
  // Proteins
  'chicken': { calories: 165, protein: 31, carbs: 0, fat: 3.6, vitC: 15, vitE: 0.7, folate: 45, vitB6: 0.2 },
  'paneer': { calories: 265, protein: 18, carbs: 1.2, fat: 20, vitC: 2, vitE: 0.9, folate: 9, vitB6: 0.4 },
  'tofu': { calories: 76, protein: 8, carbs: 1.9, fat: 4.8, vitC: 4, vitE: 0.8, folate: 37, vitB6: 0.3 },
  'egg': { calories: 155, protein: 13, carbs: 1.1, fat: 11, vitC: 3, vitE: 0.8, folate: 42, vitB6: 0.3 }, // whole egg approx
  'fish': { calories: 105, protein: 22, carbs: 0, fat: 1.2, vitC: 14, vitE: 1.8, folate: 23, vitB6: 0.1 },

  // Carbs
  'rice': { calories: 130, protein: 2.7, carbs: 28, fat: 0.3, vitC: 17, vitE: 1.7, folate: 10, vitB6: 0.4 },
  'quinoa': { calories: 120, protein: 4.4, carbs: 21.3, fat: 1.9, vitC: 19, vitE: 1.6, folate: 30, vitB6: 0.1 },
  'millets': { calories: 119, protein: 3.5, carbs: 23.7, fat: 1, vitC: 19, vitE: 1.9, folate: 49, vitB6: 0.2 },

  // Legumes/Curries
  'rajma': { calories: 127, protein: 8.7, carbs: 22.8, fat: 0.5, vitC: 2, vitE: 1.7, folate: 12, vitB6: 0.2 },
  'kidney beans': { calories: 127, protein: 8.7, carbs: 22.8, fat: 0.5, vitC: 6, vitE: 0.6, folate: 2, vitB6: 0.2 },
  'chickpea': { calories: 164, protein: 8.9, carbs: 27.4, fat: 2.6, vitC: 4, vitE: 0.1, folate: 5, vitB6: 0.5 },
  'chole': { calories: 164, protein: 8.9, carbs: 27.4, fat: 2.6, vitC: 1, vitE: 0.8, folate: 32, vitB6: 0.3 },
  'dal': { calories: 116, protein: 9, carbs: 20, fat: 0.4, vitC: 5, vitE: 1.1, folate: 15, vitB6: 0.3 }, // generic dal
  'moong': { calories: 105, protein: 7, carbs: 19, fat: 0.4, vitC: 18, vitE: 0.1, folate: 26, vitB6: 0.1 },
  'chana': { calories: 164, protein: 8.9, carbs: 27.4, fat: 2.6, vitC: 15, vitE: 1.3, folate: 49, vitB6: 0.1 },
  
  // Veggies & Salsas (rough estimates)
  'broccoli': { calories: 34, protein: 2.8, carbs: 6.6, fat: 0.4, vitC: 0, vitE: 0.4, folate: 20, vitB6: 0.2 },
  'carrot': { calories: 41, protein: 0.9, carbs: 9.6, fat: 0.2, vitC: 13, vitE: 1.2, folate: 29, vitB6: 0.4 },
  'zucchini': { calories: 17, protein: 1.2, carbs: 3.1, fat: 0.3, vitC: 3, vitE: 0.7, folate: 41, vitB6: 0.5 },
  'capsicum': { calories: 20, protein: 0.9, carbs: 4.6, fat: 0.2, vitC: 3, vitE: 0.8, folate: 7, vitB6: 0.3 },
  'bell pepper': { calories: 20, protein: 0.9, carbs: 4.6, fat: 0.2, vitC: 8, vitE: 1.0, folate: 40, vitB6: 0.5 },
  'cauliflower': { calories: 25, protein: 1.9, carbs: 5, fat: 0.3, vitC: 6, vitE: 0.9, folate: 44, vitB6: 0.3 },
  'corn': { calories: 86, protein: 3.2, carbs: 18.7, fat: 1.2, vitC: 18, vitE: 1.7, folate: 17, vitB6: 0.4 },
  'apple': { calories: 52, protein: 0.3, carbs: 14, fat: 0.2, vitC: 10, vitE: 1.6, folate: 46, vitB6: 0.2 },
  'beetroot': { calories: 43, protein: 1.6, carbs: 9.6, fat: 0.2, vitC: 15, vitE: 1.5, folate: 47, vitB6: 0.1 },
  'sweet potato': { calories: 86, protein: 1.6, carbs: 20, fat: 0.1, vitC: 11, vitE: 1.3, folate: 12, vitB6: 0.5 },
  'lettuce': { calories: 15, protein: 1.4, carbs: 2.9, fat: 0.2, vitC: 15, vitE: 0.7, folate: 20, vitB6: 0.2 },
  'onion': { calories: 40, protein: 1.1, carbs: 9.3, fat: 0.1, vitC: 0, vitE: 1.5, folate: 9, vitB6: 0.3 },
  'pineapple': { calories: 50, protein: 0.5, carbs: 13, fat: 0.1, vitC: 8, vitE: 0.7, folate: 37, vitB6: 0.3 },
  'pumpkin': { calories: 26, protein: 1, carbs: 6.5, fat: 0.1, vitC: 13, vitE: 2.0, folate: 47, vitB6: 0.1 },
  'guava': { calories: 68, protein: 2.6, carbs: 14, fat: 1, vitC: 4, vitE: 0.8, folate: 42, vitB6: 0.0 },
  'potato': { calories: 77, protein: 2, carbs: 17, fat: 0.1, vitC: 9, vitE: 1.0, folate: 27, vitB6: 0.2 },
  'watermelon': { calories: 30, protein: 0.6, carbs: 7.6, fat: 0.2, vitC: 2, vitE: 1.7, folate: 44, vitB6: 0.0 },
  'muskmelon': { calories: 34, protein: 0.8, carbs: 8.2, fat: 0.2, vitC: 13, vitE: 1.6, folate: 45, vitB6: 0.3 },
  'mango': { calories: 60, protein: 0.8, carbs: 15, fat: 0.4, vitC: 7, vitE: 0.8, folate: 6, vitB6: 0.5 },
  'avocado': { calories: 160, protein: 2, carbs: 8.5, fat: 14.7, vitC: 14, vitE: 0.9, folate: 49, vitB6: 0.1 },
  'cherry tomato': { calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2, vitC: 13, vitE: 1.1, folate: 9, vitB6: 0.2 },
  'cabbage': { calories: 25, protein: 1.3, carbs: 5.8, fat: 0.1, vitC: 2, vitE: 0.1, folate: 20, vitB6: 0.4 },
  'pea': { calories: 81, protein: 5.4, carbs: 14.5, fat: 0.4, vitC: 14, vitE: 1.0, folate: 16, vitB6: 0.3 },
  'cucumber': { calories: 15, protein: 0.6, carbs: 3.6, fat: 0.1, vitC: 8, vitE: 1.9, folate: 47, vitB6: 0.1 },
  'mushroom': { calories: 22, protein: 3.1, carbs: 3.3, fat: 0.3, vitC: 5, vitE: 1.1, folate: 25, vitB6: 0.2 },

  // Condiments/Dips
  'hummus': { calories: 166, protein: 7.9, carbs: 14.3, fat: 9.6, vitC: 1, vitE: 1.4, folate: 41, vitB6: 0.1 },
  'cheese': { calories: 402, protein: 25, carbs: 1.3, fat: 33, vitC: 10, vitE: 1.7, folate: 10, vitB6: 0.3 }, // generic cheese
  'feta': { calories: 264, protein: 14, carbs: 4.1, fat: 21, vitC: 1, vitE: 1.6, folate: 36, vitB6: 0.1 },
  'chutney': { calories: 50, protein: 1, carbs: 12, fat: 0.5, vitC: 8, vitE: 1.5, folate: 48, vitB6: 0.3 },
  'sauce': { calories: 50, protein: 1, carbs: 12, fat: 1, vitC: 9, vitE: 0.6, folate: 35, vitB6: 0.2 }, // generic sauce
  
  // Default fallback if not found
  'default': { calories: 50, protein: 2, carbs: 5, fat: 1, vitC: 14, vitE: 0.2, folate: 8, vitB6: 0.5 }
};

// Default weights if not specified (in grams)
const DEFAULT_WEIGHTS = {
  protein: 100,
  complexCarbs: 100,
  curry: 100,
  salads: 50,
  phytos: 50,
  dressing: 20,
  default: 50
};

// Calculate nutrition for an ingredient string (e.g. "Grilled chicken - 100gm" or "Corn salsa")
const calculateNutrition = (ingredientString, categoryId = 'default') => {
  if (!ingredientString) return { calories: 0, protein: 0, carbs: 0, fat: 0, vitC: 0, vitE: 0, folate: 0, vitB6: 0 };
  
  const lowerStr = ingredientString.toLowerCase();
  
  // Extract weight if specified (e.g., "100gm", "80g")
  let weightInGrams = null;
  
  // Special case: "Egg - 1" or "Eggs - 2"
  const eggMatch = lowerStr.match(/egg[s]?\s*-\s*(\d+)/i);
  if (eggMatch) {
    // an average large egg is ~50g
    weightInGrams = parseInt(eggMatch[1], 10) * 50; 
  } else {
    const weightMatch = lowerStr.match(/(\d+)\s*(gm|g|ml)/i);
    if (weightMatch) {
      weightInGrams = parseInt(weightMatch[1], 10);
    }
  }

  // If no weight found, use the default for this category or a fallback
  if (!weightInGrams) {
    weightInGrams = DEFAULT_WEIGHTS[categoryId] || DEFAULT_WEIGHTS['default'];
  }

  // Find the best matching ingredient from DB
  let bestMatchKey = 'default';
  
  // Sort keys by length descending to match longer specific names before shorter generic ones
  const keys = Object.keys(MACROS_PER_100G).sort((a, b) => b.length - a.length);
  
  for (const key of keys) {
    if (key === 'default') continue;
    if (lowerStr.includes(key)) {
      bestMatchKey = key;
      break;
    }
  }

  const macros = MACROS_PER_100G[bestMatchKey];
  const multiplier = weightInGrams / 100;

  return {
    calories: Math.round(macros.calories * multiplier),
    protein: Math.round(macros.protein * multiplier * 10) / 10,
    carbs: Math.round(macros.carbs * multiplier * 10) / 10,
    fat: Math.round(macros.fat * multiplier * 10) / 10,
    vitC: Math.round(macros.vitC * multiplier * 10) / 10,
    vitE: Math.round(macros.vitE * multiplier * 10) / 10,
    folate: Math.round(macros.folate * multiplier * 10) / 10,
    vitB6: Math.round(macros.vitB6 * multiplier * 10) / 10
  };
};

module.exports = {
  calculateNutrition,
  MACROS_PER_100G
};
