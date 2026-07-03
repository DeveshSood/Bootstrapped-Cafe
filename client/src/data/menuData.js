import foodBowl from '../assets/images/food-bowl.png';
import veganBowl from '../assets/images/vegan bowl.jpg';
import weightGainBowl from '../assets/images/weight gain bowl.jpg';
import weightLossBowl from '../assets/images/weight loss bolw.jpg';
import chickenBowl from '../assets/images/Chicken bowl.jpg';
import eggBowl from '../assets/images/egg bowl.jpg';
import fishBowl from '../assets/images/fish bowl 2.jpg';
import malaiChickenBowl from '../assets/images/malai chicken bowl.jpg';
import paneerBowl from '../assets/images/paneer bowl better.jpg';
import pestoChickenBowl from '../assets/images/pesto chicken bowl.jpg';

import chickenTrailBowl from '../assets/images/Chicken Trail Bowl.jpg';
import eggTrailBowl from '../assets/images/Egg Trial Bowl.jpg';
import fishTrailBowl from '../assets/images/Fish Trial Bowl.jpg';
import malaiChickenTrailBowl from '../assets/images/Malai Chicken Trial Bowl.jpg';
import paneerTrailBowl from '../assets/images/Paneer Trail Bowl.jpg';

import bananaSpinachSmoothie from '../assets/images/banana, spinach,dry berries chia seeds & mango smoothi.jpg';
import berriesApricotSmoothie from '../assets/images/Berries, seeds & apricoat smoothi.jpg';
import granolaFlaxSmoothie from '../assets/images/Granola,pineapple,avocado & felx seeds smoothi.jpg';
import oatsPumpkinSmoothie from '../assets/images/oats,banana,pineapple & pumpkin seeds smoothi.jpg';
import seedsWatermelonSmoothie from '../assets/images/seeds,watermelon and cucumber smoothi.jpg';

import coffeeKombucha from '../assets/images/BlackCoffee.jpeg';
import teaKombucha from '../assets/images/BlackTea.jpeg';

export const allMenuItems = [
  { 
    id: 1, name: 'Vegan Bowl', category: 'Healthy Bowls', price: 350, isVeg: true, image: veganBowl,
    ingredients: ['Tofu - 80gm', 'Chickpea - 40gm', 'Pineapple salsa - 40gm', 'Moong salsa - 50gm', 'Corn salsa - 50gm', 'Avocado salsa - 30gm', 'Mango salsa - 20gm', 'Olives - 2gm', 'Pickled onion - 15gm', 'Iceberg lettuce - 50gm'],
    nutrition: { protein: '22-28g', carbs: '60-75g', fat: '20-30g', vitamins: ['Vitamin C: 40-60% DV', 'Vitamin E: 10-20% DV', 'Folate: 20-30% DV', 'Vitamin B6: 10-20% DV'] }
  },
  { 
    id: 2, name: 'Weight Gain Bowl', category: 'Healthy Bowls', price: 350, isVeg: false, image: weightGainBowl,
    ingredients: ['Paneer - 80gm', 'Egg - 1', 'Moong salad - 40gm', 'Broccoli - 40gm', 'Red bell pepper - 30gm', 'Quinoa - 100gm', 'Cheese - 25gm', 'Corn - 40gm', 'Beetroot hummus - 40gm', 'Kidney beans - 100gm'],
    nutrition: { protein: '46-57g', carbs: '120-145g', fat: '40-55g', vitamins: ['Vitamin C: 120-150% DV', 'Vitamin K: 50-60% DV', 'Folate: 50-60% DV', 'Vitamin B6: 30-40% DV', 'Calcium: 30-40% DV'] }
  },
  { 
    id: 3, name: 'Veg Weight Gain Bowl', category: 'Healthy Bowls', price: 350, isVeg: true, image: weightGainBowl,
    ingredients: ['Corn salsa - 50gm', 'Hummus - 40gm', 'Broccoli - 40gm', 'Red bell pepper - 30gm', 'Moong salad - 30gm', 'Grilled paneer - 130gm', 'Cucumber - 30gm', 'Cheese - 20gm', 'Lettuce - 40gm'],
    nutrition: { protein: '31-40g', carbs: '40-55g', fat: '30-45g', vitamins: ['Vitamin C: 120-150% DV', 'Vitamin K: 50-60% DV', 'Folate: 20-30% DV', 'Calcium: 20-30% DV'] }
  },
  { 
    id: 4, name: 'Non Veg Weight Loss Bowl', category: 'Healthy Bowls', price: 350, isVeg: false, image: weightLossBowl,
    ingredients: ['Chicken - 100gm', 'Chickpea - 40gm', 'Pineapple - 40gm', 'Moong salad - 40gm', 'Corn - 40gm', 'Avocado - 40gm', 'Mango salsa - 40gm', 'Beetroot hummus - 40gm', 'Pickled onion - 20gm', 'Lettuce - 50gm'],
    nutrition: { protein: '39-48g', carbs: '75-90g', fat: '20-30g', vitamins: ['Vitamin C: 150-200% DV', 'Folate: 20-30% DV', 'Vitamin B6: 20-30% DV'] }
  },
  { 
    id: 5, name: 'Weight Loss Bowl', category: 'Healthy Bowls', price: 350, isVeg: false, image: weightLossBowl,
    ingredients: ['Grilled paneer - 100gm', 'Egg - 1', 'Cucumber - 40gm', 'Corn - 40gm', 'Hummus - 40gm', 'Broccoli - 50gm', 'Bellpeppers - 50gm', 'Zucchini - 30gm', 'Moong salad - 40gm', 'Cheese - 15gm', 'Lettuce - 40gm'],
    nutrition: { protein: '37-47g', carbs: '50-65g', fat: '30-40g', vitamins: ['Vitamin C: 170-220% DV', 'Vitamin K: 100-120% DV', 'Folate: 20-30% DV', 'Calcium: 20-30% DV'] }
  },
  { 
    id: 6, name: 'Desk Friendly Tandoori Chicken Bowl', category: 'Healthy Bowls', price: 350, isVeg: false, image: chickenBowl,
    ingredients: ['Quinoa - 100gm', 'Chickpea - 30gm', 'Corn - 30gm', 'Cucumber - 30gm', 'Kidney beans - 50gm', 'Zucchini - 40gm', 'Broccoli - 40gm', 'Grilled chicken - 100gm', 'Lettuce - 50gm', 'Home made sauce - 15gm'],
    nutrition: { protein: '44-57g', carbs: '80-100g', fat: '10-15g', vitamins: ['Vitamin C: 100-150% DV', 'Vitamin K: 100-120% DV', 'Folate: 30-40% DV', 'Vitamin B6: 30-40% DV'] }
  },
  { 
    id: 7, name: 'Desk Friendly Eggs Bowl', category: 'Healthy Bowls', price: 350, isVeg: false, image: eggBowl,
    ingredients: ['Eggs - 2', 'Carrots - 40gm', 'Beetroot - 40gm', 'Avocado - 30gm', 'Rajma - 100gm', 'Millets - 80gm', 'Moong salad - 40gm', 'Red cabbage - 40gm', 'Mango salsa - 40gm', 'Lettuce - 50gm'],
    nutrition: { protein: '40-50g', carbs: '120-150g', fat: '25-35g', vitamins: ['Vitamin A: 20-30% DV', 'Vitamin C: 100-150% DV', 'Folate: 30-40% DV', 'Vitamin K: 100-120% DV'] }
  },
  { 
    id: 8, name: 'Desk Friendly Fish Bowl', category: 'Healthy Bowls', price: 350, isVeg: false, image: fishBowl,
    ingredients: ['Pineapple - 40gm', 'Broccoli - 30gm', 'Zucchini - 30gm', 'Mushroom - 30gm', 'Grilled fish - 100gm', 'Mango salsa - 25gm', 'Avocado - 30gm', 'Red cabbage - 25gm', 'Quinoa - 100gm', 'Rajma - 100gm', 'Feta cheese - 10gm'],
    nutrition: { protein: '45-57g', carbs: '90-110g', fat: '20-30g', vitamins: ['Vitamin C: 150-200% DV', 'Vitamin K: 100-120% DV', 'Folate: 20-30% DV', 'Omega-3 fatty acids: 20-30% DV'] }
  },
  { 
    id: 9, name: 'Desk Friendly Malai Chicken Bowl', category: 'Healthy Bowls', price: 350, isVeg: false, image: malaiChickenBowl,
    ingredients: ['Malai chicken - 100gm', 'Zucchini - 40gm', 'Broccoli - 40gm', 'Quinoa - 100gm', 'Red cabbage - 40gm', 'Feta cheese - 20gm', 'Hummus - 30gm', 'Chana salad - 30gm', 'Moong salad - 30gm', 'Kidney beans - 100gm', 'Lettuce - 40gm'],
    nutrition: { protein: '51-65g', carbs: '120-140g', fat: '40-55g', vitamins: ['Vitamin C: 100-150% DV', 'Vitamin K: 150-180% DV', 'Folate: 30-40% DV', 'Calcium: 20-30% DV'] }
  },
  { 
    id: 10, name: 'Desk Friendly Grilled Paneer Bowl', category: 'Healthy Bowls', price: 350, isVeg: true, image: paneerBowl,
    ingredients: ['Red bellpeper - 30gm', 'Green pea - 30gm', 'Grilled paneer - 80gm', 'Pickled onion - 15gm', 'Silk tofu - 30gm', 'Cheese - 20gm', 'Black chana - 30gm', 'Chana salad - 30gm', 'Moong salad - 25gm', 'Hummus - 25gm', 'Rice - 80gm', 'Lettuce - 40gm'],
    nutrition: { protein: '43-55g', carbs: '100-120g', fat: '40-50g', vitamins: ['Vitamin C: 50-60% DV', 'Vitamin K: 100-120% DV', 'Folate: 30-40% DV', 'Calcium: 20-30% DV'] }
  },
  { 
    id: 11, name: 'Desk Friendly Pesto Grilled Chicken Bowl', category: 'Healthy Bowls', price: 350, isVeg: false, image: pestoChickenBowl,
    ingredients: ['Pesto chicken - 100gm', 'Rice - 80gm', 'Cucumber - 30gm', 'Corn - 30gm', 'Black chana - 30gm', 'Hummus - 30gm', 'Zucchini - 40gm', 'Bellpeppers - 40gm', 'Tomato - 30gm', 'Lettuce - 40gm', 'Rajma - 100gm'],
    nutrition: { protein: '51-65g', carbs: '120-140g', fat: '30-40g', vitamins: ['Vitamin C: 100-150% DV', 'Vitamin K: 100-120% DV', 'Folate: 30-40% DV', 'Vitamin B6: 20-30% DV'] }
  },
  { 
    id: 12, name: 'Tandoori Grilled Chicken Trial Bowl', category: 'Mini Bowls', price: 350, isVeg: false, image: chickenTrailBowl,
    ingredients: ['Grilled chicken - 50gm', 'Tomato - 20gm', 'Grilled leek - 20gm', 'Beetroot - 20gm', 'Corn salsa - 15gm', 'Lettuce - 30gm'],
    nutrition: { protein: '14-19g', carbs: '12-18g', fat: '3-6g', vitamins: ['Vitamin C: 20-30% DV', 'Vitamin K: 20-30% DV', 'Folate: 10-20% DV'] }
  },
  { 
    id: 13, name: 'Banana, Spinach, Dry Berries Smoothie', category: 'Smoothies', price: 200, isVeg: true, image: bananaSpinachSmoothie,
    ingredients: ['Banana - 100gm', 'Spinach - 30gm', 'Mango - 40gm', 'Chia seeds - 10gm', 'Dry berries - 12gm', 'Soy milk - 150ml'],
    nutrition: { protein: '5-9g', carbs: '45-54g', fat: '5-7g', vitamins: ['Vitamin C: 50-70% DV', 'Vitamin A: 20-30% DV', 'Potassium: 10-20% DV'] }
  },
  { 
    id: 14, name: 'Berries, Seeds & Apricot Smoothie', category: 'Smoothies', price: 250, isVeg: true, image: berriesApricotSmoothie,
    ingredients: ['Blue berries - 25gm', 'Pumpkin seeds - 15gm', 'Apricot - 15gm', 'Oats - 20gm', 'Soy milk - 150ml'],
    nutrition: { protein: '11-16g', carbs: '32-40g', fat: '11-16g', vitamins: ['Vitamin C: 20-30% DV', 'Vitamin A: 10-20% DV', 'Calcium: 20-30% DV'] }
  },
  { 
    id: 15, name: 'Granola, Pineapple, Avocado & Flax Seeds Smoothie', category: 'Smoothies', price: 240, isVeg: true, image: granolaFlaxSmoothie,
    ingredients: ['Granola - 15gm', 'Pineapple - 15gm', 'Avocado - 20gm', 'Flax seeds - 5gm', 'Almond milk - 150ml'],
    nutrition: { protein: '4-7g', carbs: '19-26g', fat: '11-16g', vitamins: ['Vitamin C: 10-20% DV', 'Vitamin E: 10-20% DV', 'Calcium: 10-20% DV'] }
  },
  { 
    id: 16, name: 'Oats, Banana, Pineapple & Pumpkin Seeds Smoothie', category: 'Smoothies', price: 200, isVeg: true, image: oatsPumpkinSmoothie,
    ingredients: ['Oats - 20gm', 'Banana - 50gm', 'Pineapple - 30gm', 'Pumpkin seeds - 15gm'],
    nutrition: { protein: '5-8g', carbs: '44-54g', fat: '5-8g', vitamins: ['Vitamin C: 20-30% DV', 'Potassium: 10-20% DV', 'Magnesium: 10-20% DV'] }
  },
  { 
    id: 17, name: 'Seeds, Watermelon & Cucumber Smoothie', category: 'Smoothies', price: 180, isVeg: true, image: seedsWatermelonSmoothie,
    ingredients: ['Mix seeds - 25gm', 'Watermelon - 30gm', 'Cucumber - 20gm'],
    nutrition: { protein: '5-7g', carbs: '14-19g', fat: '10-12g', vitamins: ['Vitamin C: 10-20% DV', 'Vitamin K: 10-20% DV', 'Magnesium: 10-20% DV'] }
  },
  { 
    id: 18, name: 'Home Brewed Coffee Kombucha', category: 'Home brewed drinks', price: 180, isVeg: true, image: coffeeKombucha,
    ingredients: ['Ro water - 250ml', 'Jaggery - 20gm', 'Coffee - 7.5ml'],
    nutrition: { protein: '0g', carbs: '20g', fat: '0g', vitamins: ['Iron: 0.5-1.0mg', 'Magnesium: 10-15mg', 'Potassium: 100-150mg', 'Caffeine: 6-15mg', 'Antioxidants: Polyphenols and flavonoids'] }
  },
  { 
    id: 19, name: 'Home Brewed Himachali Tea Kombucha', category: 'Home brewed drinks', price: 180, isVeg: true, image: teaKombucha,
    ingredients: ['Ro water - 250ml', 'Jaggery - 20gm', 'Tea - 1.25ml'],
    nutrition: { protein: '0g', carbs: '20g', fat: '0g', vitamins: ['Iron: 0.5-1.0mg', 'Magnesium: 10-15mg', 'Potassium: 100-150mg', 'Antioxidants: Polyphenols and flavonoids'] }
  },
  { 
    id: 20, name: 'Egg Mini Bowl', category: 'Mini Bowls', price: 350, isVeg: false, image: eggTrailBowl,
    ingredients: ['Egg - 1', 'Cucumber - 15gm', 'Rice - 30gm', 'Zucchini - 40gm', 'Grilled potato - 25gm', 'Olives - 2gm', 'Lettuce - 20gm'],
    nutrition: { protein: '8-12g', carbs: '20-30g', fat: '6-9g', vitamins: ['Vitamin C: 10-20% DV', 'Vitamin K: 20-30% DV', 'Vitamin B6: 10-20% DV'] }
  },
  { 
    id: 21, name: 'Fish Mini Bowl', category: 'Mini Bowls', price: 350, isVeg: false, image: fishTrailBowl,
    ingredients: ['Grilled fish - 50gm', 'Chana salad - 15gm', 'Mango salsa - 15gm', 'Pineapple - 15gm', 'Mushroom - 15gm', 'Brussels sprout - 10gm'],
    nutrition: { protein: '12-17g', carbs: '15-23g', fat: '2-4g', vitamins: ['Vitamin C: 30-50% DV', 'Vitamin K: 10-20% DV', 'Folate: 10-20% DV'] }
  },
  { 
    id: 22, name: 'Malai Chicken Trail Bowl', category: 'Mini Bowls', price: 350, isVeg: false, image: malaiChickenTrailBowl,
    ingredients: ['Malai chicken - 50gm', 'Broccoli - 15gm', 'Bell peppers - 15gm', 'Cheese - 5gm', 'Corn - 5gm', 'Chana salad - 10gm', 'Lettuce - 30gm'],
    nutrition: { protein: '12-18g', carbs: '10-15g', fat: '10-14g', vitamins: ['Vitamin C: 40-60% DV', 'Vitamin K: 20-30% DV', 'Folate: 10-20% DV'] }
  },
  { 
    id: 23, name: 'Paneer Mini Bowl', category: 'Mini Bowls', price: 350, isVeg: true, image: paneerTrailBowl,
    ingredients: ['Grilled paneer - 40gm', 'Beetroot - 20gm', 'Tomato - 10gm', 'Sprout salad - 20gm', 'Pickled onion - 15gm', 'Lettuce - 25gm'],
    nutrition: { protein: '9-13g', carbs: '13-20g', fat: '6-9g', vitamins: ['Vitamin C: 20-30% DV', 'Vitamin K: 20-30% DV', 'Folate: 10-20% DV'] }
  }
];

export const categories = ['Healthy Bowls', 'Mini Bowls', 'Smoothies', 'Home brewed drinks'];

