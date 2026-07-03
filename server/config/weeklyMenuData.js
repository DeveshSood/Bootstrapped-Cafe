const defaultMenuData = require('./baseMenuData');
const { calculateNutrition } = require('./nutritionDB');
// We will use the existing menuData and ingredientsData as a base, but modify them daily.
// The user provided Monday to Friday menus. Saturday and Sunday will default to Friday's menu for now.

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const SCHEDULES = {
  1: { // Monday
    complexCarbs: ['Rice', 'Corn rice', 'Quinoa'],
    protein: ['Chipotle chicken/paneer', 'Cilantro jalapeno yogurt chicken/paneer', 'Egg'],
    phytos: ['Grilled broccoli and carrot'],
    curry: ['Rajma'],
    salads: ['Corn salsa', 'Black chana', 'Apple carrot', 'Beetroot hummus', 'Sweet potato', 'Lettuce', 'Curd onion'],
    dressing: ['Mango Chutney', 'Mint Chutney']
  },
  2: { // Tuesday
    complexCarbs: ['Rice', 'Egg fried rice', 'Quinoa'],
    protein: ['Korean chicken/paneer', 'BBQi chicken/paneer', 'Egg'],
    phytos: ['Yellow Capsicum and Green Zucchini'],
    curry: ['Dal Makhani'],
    salads: ['Chickpea salad', 'Pineapple salsa', 'Cauliflower hummus', 'Sweet chili cucumber', 'Pumpkin salad', 'Lettuce', 'Masala onion'],
    dressing: ['Mango Chutney', 'Mint Chutney']
  },
  3: { // Wednesday
    complexCarbs: ['Rice', 'Chicken biryani', 'Quinoa'],
    protein: ['Plum chicken/paneer', 'Harisha chicken/paneer', 'Egg'],
    phytos: ['Green capcicum/cauliflower'],
    curry: ['Chole ( Kabuli Chana)'],
    salads: ['Guava salsa', 'Bellpepper Hummus', 'Potato salad', 'Sweet potato', 'Watermelon+Muskmelon feta cheese', 'Lettuce', 'Mint onion'],
    dressing: ['Mango Chutney', 'Mint Chutney']
  },
  4: { // Thursday
    complexCarbs: ['Rice', 'Lemon rice', 'Quinoa'],
    protein: ['Achari chicken/paneer', 'Thai green curry coconut chicken/paneer', 'Egg'],
    phytos: ['Yellow zucchini/mushroom'],
    curry: ['Dal pappu'],
    salads: ['mango salad', 'Peas hummus', 'Avocado salsa', 'Balsamic cherry tomato', 'Cream cheese cabbage', 'Lettuce', 'Achari onion'],
    dressing: ['Mango Chutney', 'Mint Chutney']
  },
  5: { // Friday
    complexCarbs: ['Rice', 'Peas rice', 'Quinoa'],
    protein: ['Dragon chicken/paneer', 'Thai peanut chicken/paneer', 'Egg'],
    phytos: ['red capsicum / Beans'],
    curry: ['Panchmail dal'],
    salads: ['Plain hummus', 'Beetroot salad', 'Pickled red cabbage', 'Greek salad', 'Mix fruit salad', 'Lettuce', 'Curd onion'],
    dressing: ['Mango Chutney', 'Mint Chutney']
  }
};

// Helper to generate dynamic custom salad categories and ingredients based on the daily Hot/Cold selections
const generateDailyCustomBowlData = (dayIndex) => {
  // Monday = 1, Tuesday = 2, ..., Friday = 5
  // If Saturday (6) or Sunday (0), default to Friday for now.
  const index = (dayIndex === 0 || dayIndex === 6) ? 5 : dayIndex;
  const schedule = SCHEDULES[index];

  const categories = [
    { id: 'complexCarbs', label: 'Complex carbs', limit: 2 },
    { id: 'protein', label: 'Protein', limit: 2 },
    { id: 'phytos', label: 'Phytos', limit: 2 },
    { id: 'curry', label: 'Curry of the day', limit: 1 },
    { id: 'salads', label: 'Salads', limit: 3 },
    { id: 'dressing', label: 'Dressing (home made)', limit: 2 },
  ];

  const mapIngredients = (items, catId, basePrice) => {
    return items.map((item, i) => ({
      id: `${catId}-${i}`,
      name: item,
      price: basePrice,
      isVeg: !item.toLowerCase().includes('chicken') && !item.toLowerCase().includes('egg') && !item.toLowerCase().includes('fish'),
      image: '🍲', // Generic icon, can be enhanced
      nutrition: calculateNutrition(item, catId)
    }));
  };

  const ingredients = {
    complexCarbs: mapIngredients(schedule.complexCarbs, 'complexCarbs', 40),
    protein: mapIngredients(schedule.protein, 'protein', 80),
    phytos: mapIngredients(schedule.phytos, 'phytos', 50),
    curry: mapIngredients(schedule.curry, 'curry', 30),
    salads: mapIngredients(schedule.salads, 'salads', 30),
    dressing: mapIngredients(schedule.dressing, 'dressing', 20),
  };

  return { categories, ingredients };
};

const mapIngredient = (ingredient, todaySchedule) => {
    let newIng = ingredient;
    
    // Proteins
    if (/chicken/i.test(newIng)) {
        const dailyProtein = todaySchedule.protein[0].replace(/\/paneer/i, '').trim();
        newIng = newIng.replace(/^.*?chicken/ig, dailyProtein); 
    }
    else if (/paneer|tofu/i.test(newIng)) {
        const dailyProtein = todaySchedule.protein[0].replace(/chicken\//i, '').trim();
        newIng = newIng.replace(/^.*?(paneer|tofu)/ig, dailyProtein);
    }
    // Curries / Beans
    else if (/rajma|kidney beans/i.test(newIng)) {
        newIng = newIng.replace(/^.*?(rajma|kidney beans)/ig, todaySchedule.curry[0]);
    }
    // Salads / Salsas / Hummus
    else if (/black chana/i.test(newIng)) {
        newIng = newIng.replace(/black chana/ig, todaySchedule.salads[1] || 'Salad');
    }
    else if (/chana salad/i.test(newIng)) {
        newIng = newIng.replace(/chana salad/ig, todaySchedule.salads[0] || 'Salad');
    }
    else if (/corn salsa/i.test(newIng)) {
        newIng = newIng.replace(/corn salsa/ig, todaySchedule.salads[0] || 'Salad');
    }
    else if (/moong (salsa|salad)/i.test(newIng)) {
        newIng = newIng.replace(/moong (salsa|salad)/ig, todaySchedule.salads[2] || 'Salad');
    }
    else if (/beetroot hummus/i.test(newIng)) {
        newIng = newIng.replace(/beetroot hummus/ig, todaySchedule.salads[3] || 'Salad');
    }
    else if (/hummus/i.test(newIng)) {
        newIng = newIng.replace(/hummus/ig, todaySchedule.salads[2] || 'Salad');
    }
    else if (/pineapple salsa/i.test(newIng)) {
        newIng = newIng.replace(/pineapple salsa/ig, todaySchedule.salads[1] || 'Salad');
    }
    else if (/mango salsa/i.test(newIng)) {
        newIng = newIng.replace(/mango salsa/ig, todaySchedule.salads[0] || 'Salad');
    }
    // Phytos
    else if (/broccoli/i.test(newIng)) {
        newIng = newIng.replace(/^.*?broccoli/ig, todaySchedule.phytos[0]);
    }
    
    return newIng;
};

// Generate standard menu items based on the day.
// The bowls remain the same in name and image, but we swap specific ingredients accurately based on the schedule.
const generateDailyMenuItems = (dayIndex) => {
  let items = JSON.parse(JSON.stringify(defaultMenuData.allMenuItems));
  
  const index = (dayIndex === 0 || dayIndex === 6) ? 5 : dayIndex;
  const todaySchedule = SCHEDULES[index];
  
  items = items.map(item => {
    if (item.category === 'Healthy Bowls' || item.category === 'Mini Bowls') {
      
      // Update the specific ingredients in the bowl exactly based on the schedule mapping
      // Update the specific ingredients in the bowl exactly based on the schedule mapping
      item.ingredients = item.ingredients.map(ing => mapIngredient(ing, todaySchedule));
    }
    
    // Calculate accurate nutrition dynamically for any item with ingredients
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
    return item;
  });

  return items;
};

module.exports = {
  getMenuForDay: (dayIndex) => {
    return {
      menuItems: generateDailyMenuItems(dayIndex),
      customSalad: generateDailyCustomBowlData(dayIndex),
      categories: defaultMenuData.categories
    };
  }
};
