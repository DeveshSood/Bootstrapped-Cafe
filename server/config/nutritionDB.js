const MACROS_PER_100G = {
  // Proteins
  'chicken': { calories: 165, protein: 31, carbs: 0, fat: 3.6, vitC: 0, vitE: 0.3, folate: 4, vitB6: 0.6 },
  'paneer': { calories: 265, protein: 18, carbs: 1.2, fat: 20, vitC: 0, vitE: 0.1, folate: 9, vitB6: 0.1 },
  'tofu': { calories: 76, protein: 8, carbs: 1.9, fat: 4.8, vitC: 0, vitE: 0.8, folate: 15, vitB6: 0.1 },
  'egg': { calories: 155, protein: 13, carbs: 1.1, fat: 11, vitC: 0, vitE: 1.0, folate: 44, vitB6: 0.1 },
  'fish': { calories: 105, protein: 22, carbs: 0, fat: 1.2, vitC: 0, vitE: 0.5, folate: 15, vitB6: 0.3 },

  // Carbs
  'rice': { calories: 130, protein: 2.7, carbs: 28, fat: 0.3, vitC: 0, vitE: 0.1, folate: 2, vitB6: 0.1 },
  'quinoa': { calories: 120, protein: 4.4, carbs: 21.3, fat: 1.9, vitC: 0, vitE: 0.6, folate: 42, vitB6: 0.1 },
  'millets': { calories: 119, protein: 3.5, carbs: 23.7, fat: 1, vitC: 0, vitE: 0.1, folate: 19, vitB6: 0.1 },

  // Legumes/Curries
  'rajma': { calories: 127, protein: 8.7, carbs: 22.8, fat: 0.5, vitC: 1, vitE: 0.1, folate: 130, vitB6: 0.1 },
  'kidney beans': { calories: 127, protein: 8.7, carbs: 22.8, fat: 0.5, vitC: 1, vitE: 0.1, folate: 130, vitB6: 0.1 },
  'chickpea': { calories: 164, protein: 8.9, carbs: 27.4, fat: 2.6, vitC: 1, vitE: 0.4, folate: 172, vitB6: 0.1 },
  'chole': { calories: 164, protein: 8.9, carbs: 27.4, fat: 2.6, vitC: 1, vitE: 0.4, folate: 172, vitB6: 0.1 },
  'dal': { calories: 116, protein: 9, carbs: 20, fat: 0.4, vitC: 0, vitE: 0.1, folate: 140, vitB6: 0.1 },
  'moong': { calories: 105, protein: 7, carbs: 19, fat: 0.4, vitC: 1, vitE: 0.1, folate: 159, vitB6: 0.1 },
  'chana': { calories: 164, protein: 8.9, carbs: 27.4, fat: 2.6, vitC: 1, vitE: 0.4, folate: 172, vitB6: 0.1 },
  
  // Veggies & Salsas
  'broccoli': { calories: 34, protein: 2.8, carbs: 6.6, fat: 0.4, vitC: 89, vitE: 0.8, folate: 63, vitB6: 0.2 },
  'carrot': { calories: 41, protein: 0.9, carbs: 9.6, fat: 0.2, vitC: 6, vitE: 0.7, folate: 19, vitB6: 0.1 },
  'zucchini': { calories: 17, protein: 1.2, carbs: 3.1, fat: 0.3, vitC: 18, vitE: 0.1, folate: 24, vitB6: 0.2 },
  'capsicum': { calories: 20, protein: 0.9, carbs: 4.6, fat: 0.2, vitC: 80, vitE: 0.4, folate: 10, vitB6: 0.2 },
  'bell pepper': { calories: 20, protein: 0.9, carbs: 4.6, fat: 0.2, vitC: 127, vitE: 1.6, folate: 10, vitB6: 0.3 },
  'cauliflower': { calories: 25, protein: 1.9, carbs: 5, fat: 0.3, vitC: 48, vitE: 0.1, folate: 57, vitB6: 0.2 },
  'corn': { calories: 86, protein: 3.2, carbs: 18.7, fat: 1.2, vitC: 7, vitE: 0.1, folate: 42, vitB6: 0.1 },
  'apple': { calories: 52, protein: 0.3, carbs: 14, fat: 0.2, vitC: 5, vitE: 0.2, folate: 3, vitB6: 0.04 },
  'beetroot': { calories: 43, protein: 1.6, carbs: 9.6, fat: 0.2, vitC: 5, vitE: 0.0, folate: 109, vitB6: 0.1 },
  'sweet potato': { calories: 86, protein: 1.6, carbs: 20, fat: 0.1, vitC: 2.4, vitE: 0.3, folate: 11, vitB6: 0.2 },
  'lettuce': { calories: 15, protein: 1.4, carbs: 2.9, fat: 0.2, vitC: 9, vitE: 0.2, folate: 38, vitB6: 0.1 },
  'onion': { calories: 40, protein: 1.1, carbs: 9.3, fat: 0.1, vitC: 7, vitE: 0.0, folate: 19, vitB6: 0.1 },
  'pineapple': { calories: 50, protein: 0.5, carbs: 13, fat: 0.1, vitC: 48, vitE: 0.0, folate: 18, vitB6: 0.1 },
  'pumpkin': { calories: 26, protein: 1, carbs: 6.5, fat: 0.1, vitC: 9, vitE: 1.1, folate: 16, vitB6: 0.1 },
  'guava': { calories: 68, protein: 2.6, carbs: 14, fat: 1, vitC: 228, vitE: 0.7, folate: 49, vitB6: 0.1 },
  'potato': { calories: 77, protein: 2, carbs: 17, fat: 0.1, vitC: 20, vitE: 0.0, folate: 16, vitB6: 0.3 },
  'watermelon': { calories: 30, protein: 0.6, carbs: 7.6, fat: 0.2, vitC: 8, vitE: 0.1, folate: 3, vitB6: 0.04 },
  'muskmelon': { calories: 34, protein: 0.8, carbs: 8.2, fat: 0.2, vitC: 37, vitE: 0.1, folate: 21, vitB6: 0.1 },
  'mango': { calories: 60, protein: 0.8, carbs: 15, fat: 0.4, vitC: 36, vitE: 0.9, folate: 43, vitB6: 0.1 },
  'avocado': { calories: 160, protein: 2, carbs: 8.5, fat: 14.7, vitC: 10, vitE: 2.1, folate: 81, vitB6: 0.3 },
  'cherry tomato': { calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2, vitC: 14, vitE: 0.5, folate: 15, vitB6: 0.1 },
  'cabbage': { calories: 25, protein: 1.3, carbs: 5.8, fat: 0.1, vitC: 36, vitE: 0.2, folate: 43, vitB6: 0.1 },
  'pea': { calories: 81, protein: 5.4, carbs: 14.5, fat: 0.4, vitC: 40, vitE: 0.1, folate: 65, vitB6: 0.2 },
  'cucumber': { calories: 15, protein: 0.6, carbs: 3.6, fat: 0.1, vitC: 3, vitE: 0.0, folate: 7, vitB6: 0.04 },
  'mushroom': { calories: 22, protein: 3.1, carbs: 3.3, fat: 0.3, vitC: 2, vitE: 0.0, folate: 17, vitB6: 0.1 },

  // Condiments/Dips
  'hummus': { calories: 166, protein: 7.9, carbs: 14.3, fat: 9.6, vitC: 0, vitE: 1.2, folate: 83, vitB6: 0.2 },
  'cheese': { calories: 402, protein: 25, carbs: 1.3, fat: 33, vitC: 0, vitE: 0.3, folate: 7, vitB6: 0.1 },
  'feta': { calories: 264, protein: 14, carbs: 4.1, fat: 21, vitC: 0, vitE: 0.2, folate: 32, vitB6: 0.4 },
  'chutney': { calories: 50, protein: 1, carbs: 12, fat: 0.5, vitC: 10, vitE: 0.1, folate: 10, vitB6: 0.1 },
  'sauce': { calories: 50, protein: 1, carbs: 12, fat: 1, vitC: 5, vitE: 0.1, folate: 5, vitB6: 0.1 },
  
  // Default fallback if not found
  'default': { calories: 50, protein: 2, carbs: 5, fat: 1, vitC: 5, vitE: 0.2, folate: 15, vitB6: 0.1 }
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
