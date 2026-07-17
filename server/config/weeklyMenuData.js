const defaultMenuData = require('./baseMenuData');
const { calculateNutrition } = require('./nutritionDB');
// We will use the existing menuData and ingredientsData as a base, but modify them daily.
// The user provided Monday to Friday menus. Saturday and Sunday will default to Friday's menu for now.

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const SCHEDULES = {
  1: { // Monday
    complexCarbs: ['Rice', 'Corn rice', 'Quinoa'],
    protein: ['Chipotle chicken/paneer', 'Cilantro jalapeno yogurt chicken/paneer', 'Egg'],
    phytos: ['Grilled broccoli', 'Grilled carrot'],
    curry: ['Rajma'],
    salads: ['Corn salsa', 'Black chana', 'Apple carrot', 'Beetroot hummus', 'Sweet potato', 'Lettuce', 'Curd onion'],
    dressing: ['Mango Chutney', 'Mint Chutney']
  },
  2: { // Tuesdayf
    complexCarbs: ['Rice', 'Egg fried rice', 'Quinoa'],
    protein: ['Korean chicken/paneer', 'BBQi chicken/paneer', 'Egg'],
    phytos: ['Grilled Yellow capsicum', 'Grilled Green Zucchini'],
    curry: ['Dal Makhani'],
    salads: ['Chickpea salad', 'Pineapple salsa', 'Cauliflower hummus', 'Sweet chili cucumber', 'Pumpkin salad', 'Lettuce', 'Masala onion'],
    dressing: ['Mango Chutney', 'Mint Chutney']
  },
  3: { // Wednesday
    complexCarbs: ['Rice', 'Chicken biryani', 'Quinoa'],
    protein: ['Plum chicken/paneer', 'Harisha chicken/paneer', 'Egg'],
    phytos: ['Grilled Green capsicum', 'Grilled Cauliflower'],
    curry: ['Chole ( Kabuli Chana)'],
    salads: ['Guava salsa', 'Bellpepper Hummus', 'Potato salad', 'Sweet potato', 'Watermelon+Muskmelon feta cheese', 'Lettuce', 'Mint onion'],
    dressing: ['Mango Chutney', 'Mint Chutney']
  },
  4: { // Thursday
    complexCarbs: ['Rice', 'Lemon rice', 'Quinoa'],
    protein: ['Achari chicken/paneer', 'Thai green curry coconut chicken/paneer', 'Egg'],
    phytos: ['Grilled Yellow zucchini', 'Grilled Mushroom'],
    curry: ['Dal pappu'],
    salads: ['mango salad', 'Peas hummus', 'Avocado salsa', 'Balsamic cherry tomato', 'Cream cheese cabbage', 'Lettuce', 'Achari onion'],
    dressing: ['Mango Chutney', 'Mint Chutney']
  },
  5: { // Friday
    complexCarbs: ['Rice', 'Peas rice', 'Quinoa'],
    protein: ['Dragon chicken/paneer', 'Thai peanut chicken/paneer', 'Egg'],
    phytos: ['Grilled Red capsicum', 'Grilled Beans'],
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

const generateDailyMenuItems = (dayIndex) => {
  let items = JSON.parse(JSON.stringify(defaultMenuData.allMenuItems));
  
  const index = (dayIndex === 0 || dayIndex === 6) ? 5 : dayIndex;
  const todaySchedule = SCHEDULES[index];
  
  const p1 = (todaySchedule.protein[0] || '').split(' chicken')[0].trim();
  const p2 = (todaySchedule.protein[1] || '').split(' chicken')[0].trim();
  const s = todaySchedule.salads;
  const phytosText = todaySchedule.phytos.join(' and ');
  const curry = todaySchedule.curry[0];
  
  // Mapping logic for each bowl based on PDF structure
  items = items.map(item => {
    if (item.id === 1) { // Vegan Bowl
      item.ingredients = [
        'Tofu - 100gm', `${s[0]} - 40gm`, `${s[1]} - 40gm`, `${s[2]} - 40gm`,
        `${s[3]} - 40gm`, `${s[4]} - 30gm`, `${phytosText} - 120gm`, `${s[5]} - 30gm`,
        `Quinoa - 150gm`, `${curry} - 150gm`, 'Nuts - 20gm'
      ];
      if (s[6] && !s[6].toLowerCase().includes('curd')) item.ingredients.push(`${s[6]} - 15gm`);
    }
    else if (item.id === 2) { // Weight Gain Bowl
      item.ingredients = [
        '2 flavoured roast Chicken - 120gm', 'Egg - 1', `${s[0]} - 40gm`, `${s[1]} - 40gm`, `${s[2]} - 30gm`,
        'Quinoa - 100gm', 'Cheese - 15gm', `${s[4]} - 40gm`, `${s[3]} - 40gm`, `${curry} - 100gm`,
        `${phytosText} - 120gm`, `${s[5]} - 20gm`, `${s[6]} - 15gm`
      ];
    }
    else if (item.id === 3) { // Veg Weight Gain Bowl
      item.ingredients = [
        '2 flavoured roast Paneer - 120gm', 'Tofu - 25gm', `${s[0]} - 40gm`, `${s[1]} - 40gm`, `${s[2]} - 30gm`,
        'Quinoa - 100gm', 'Cheese - 15gm', `${s[4]} - 40gm`, `${s[3]} - 40gm`, `${curry} - 100gm`,
        `${phytosText} - 120gm`, `${s[5]} - 20gm`, `${s[6]} - 15gm`
      ];
    }
    else if (item.id === 4) { // Non Veg Weight Loss Bowl
      item.ingredients = [
        '2 flavoured roast Chicken - 140gm', 'Egg - 1', `${s[0]} - 40gm`, `${s[1]} - 40gm`, `${s[2]} - 30gm`,
        'Cheese - 15gm', `${s[4]} - 40gm`, `${s[3]} - 40gm`, `${phytosText} - 120gm`, `${s[5]} - 20gm`, `${s[6]} - 15gm`
      ];
    }
    else if (item.id === 5) { // Weight Loss Veg Bowl
      item.ingredients = [
        '2 flavoured roast paneer - 140gm', 'Tofu - 25gm', `${s[0]} - 40gm`, `${s[1]} - 40gm`, `${s[2]} - 30gm`,
        'Cheese - 15gm', `${s[4]} - 40gm`, `${s[3]} - 40gm`, `${phytosText} - 120gm`, `${s[5]} - 20gm`, `${s[6]} - 15gm`
      ];
    }
    else if (item.id === 6) { // Tandoori Chicken Bowl
      item.name = `Desk friendly ${index === 2 ? 'BBQ' : 'Tandoori'} chicken bowl`;
      item.ingredients = [
        `${index === 2 ? 'BBQ' : 'Tandoori'} Chicken - 80gm`, `${s[2]} - 40gm`, `${s[1]} - 40gm`, `${s[0]} - 30gm`,
        `Quinoa/Rice - 150gm`, `${s[4]} - 40gm`, `${s[3]} - 40gm`, `${phytosText} - 90gm`, `${s[5]} - 20gm`,
        `${curry} - 120gm`, `${s[6]} - 15gm`
      ];
    }
    else if (item.id === 7) { // Eggs Bowl
      item.ingredients = [
        'Eggs - 3 pcs', `${s[2]} - 40gm`, `${s[1]} - 40gm`, `${s[0]} - 30gm`,
        `Quinoa/Rice - 150gm`, `${s[4]} - 40gm`, `${s[3]} - 40gm`, `${phytosText} - 90gm`, `${s[5]} - 20gm`,
        `${curry} - 120gm`, `${s[6]} - 15gm`
      ];
    }
    else if (item.id === 8) { // Fish Bowl
      item.name = `Desk friendly ${index === 2 ? 'BBQ' : index === 4 ? 'Thai green' : 'Tandoori'} fish bowl`;
      item.ingredients = [
        `${index === 2 ? 'BBQ' : index === 4 ? 'Thai green curry' : 'Tandoori'} fish - 80gm`, `${s[2]} - 40gm`, `${s[1]} - 40gm`, `${s[0]} - 30gm`,
        `Quinoa/Rice - 150gm`, `${s[4]} - 40gm`, `${s[3]} - 40gm`, `${phytosText} - 90gm`, `${s[5]} - 20gm`,
        `${curry} - 120gm`, `${s[6]} - 15gm`
      ];
    }
    else if (item.id === 9) { // Malai -> P1 Chicken Bowl
      item.name = `Desk friendly ${p1} chicken bowl`;
      item.ingredients = [
        `${p1} Chicken - 80gm`, `${s[2]} - 40gm`, `${s[1]} - 40gm`, `${s[0]} - 30gm`,
        `Quinoa/Rice - 150gm`, `${s[4]} - 40gm`, `${s[3]} - 40gm`, `${phytosText} - 90gm`, `${s[5]} - 20gm`,
        `${curry} - 120gm`, `${s[6]} - 15gm`
      ];
    }
    else if (item.id === 10) { // Paneer Bowl (Tandoori/BBQ base)
      item.name = `Desk friendly ${index === 2 ? 'BBQ' : 'Tandoori'} paneer bowl`;
      item.ingredients = [
        `${index === 2 ? 'BBQ' : 'Tandoori'} Paneer - 80gm`, `${s[2]} - 40gm`, `${s[1]} - 40gm`, `${s[0]} - 30gm`,
        `Quinoa/Rice - 150gm`, `${s[4]} - 40gm`, `${s[3]} - 40gm`, `${phytosText} - 90gm`, `${s[5]} - 20gm`,
        `${curry} - 120gm`, `${s[6]} - 15gm`
      ];
    }
    else if (item.id === 11) { // Pesto -> P2 Chicken Bowl
      item.name = `Desk friendly ${p2} chicken bowl`;
      item.ingredients = [
        `${p2} Chicken - 80gm`, `${s[2]} - 40gm`, `${s[1]} - 40gm`, `${s[0]} - 30gm`,
        `Quinoa/Rice - 150gm`, `${s[4]} - 40gm`, `${s[3]} - 40gm`, `${phytosText} - 90gm`, `${s[5]} - 20gm`,
        `${curry} - 120gm`, `${s[6]} - 15gm`
      ];
    }
    else if (item.id === 12) { // Tandoori Chicken Mini Bowl
      item.name = `${index === 2 ? 'BBQ' : 'Tandoori'} chicken mini bowl`;
      item.ingredients = [
        `${index === 2 ? 'BBQ' : 'Tandoori'} Chicken - 60gm`, `${s[2]} - 25gm`, `${s[1]} - 25gm`, `${s[0]} - 25gm`,
        `Quinoa/Rice - 100gm`, `${phytosText} - 60gm`, `${s[5]} - 20gm`,
        `${curry} - 120gm`, `${s[6]} - 15gm`
      ];
    }
    else if (item.id === 20) { // Egg Mini Bowl
      item.ingredients = [
        'Eggs - 2pcs', `${s[2]} - 25gm`, `${s[1]} - 25gm`, `${s[0]} - 25gm`,
        `Quinoa/Rice - 100gm`, `${phytosText} - 60gm`, `${s[5]} - 20gm`,
        `${curry} - 120gm`, `${s[6]} - 15gm`
      ];
    }
    else if (item.id === 21) { // Fish Mini Bowl
      item.ingredients = [
        `Grilled fish - 60gm`, `${s[2]} - 25gm`, `${s[1]} - 25gm`, `${s[0]} - 25gm`,
        `Quinoa/Rice - 100gm`, `${phytosText} - 60gm`, `${s[5]} - 20gm`,
        `${curry} - 120gm`, `${s[6]} - 15gm`
      ];
    }
    else if (item.id === 22) { // Malai -> P1 Mini Bowl
      item.name = `${p1} chicken trail bowl`;
      item.ingredients = [
        `${p1} chicken - 60gm`, `${s[2]} - 25gm`, `${s[1]} - 25gm`, `${s[0]} - 25gm`,
        `Quinoa/Rice - 100gm`, `${phytosText} - 60gm`, `${s[5]} - 20gm`,
        `${curry} - 120gm`, `${s[6]} - 15gm`
      ];
    }
    else if (item.id === 23) { // Paneer Mini Bowl
      item.name = `${index === 2 ? 'BBQ' : 'Grilled'} paneer mini bowl`;
      item.ingredients = [
        `${index === 2 ? 'BBQ' : 'Grilled'} paneer - 60gm`, `${s[2]} - 25gm`, `${s[1]} - 25gm`, `${s[0]} - 25gm`,
        `Quinoa/Rice - 100gm`, `${phytosText} - 60gm`, `${s[5]} - 20gm`,
        `${curry} - 120gm`, `${s[6]} - 15gm`
      ];
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
