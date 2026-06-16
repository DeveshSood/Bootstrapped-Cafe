import foodBowl from '../assets/images/food-bowl.png';

export const allMenuItems = [
  // Mini Bowls
  { id: 1, name: 'Mini Paneer Bowl', category: 'Mini Bowls', description: 'Exotic grilled paneer, veggies, sprout, beetroot, lettuce, salsa, pickled onion and with green sauce.', price: 280, isVeg: true, image: foodBowl },
  { id: 2, name: 'Mini Chicken Bowl', category: 'Mini Bowls', description: 'Grilled chicken, exotic grilled veggies, corn salsa, beetroot, lettuce and with green sauce.', price: 280, isVeg: false, image: foodBowl },
  { id: 3, name: 'Mini Malai Chicken Bowl', category: 'Mini Bowls', description: 'Grilled malai chicken [80 g], exotic grilled veggies, bell peppers, chickpea salsa, cheese lettuce, salsa and with green sauce.', price: 280, isVeg: false, image: foodBowl },
  { id: 4, name: 'Mini Egg Bowl', category: 'Mini Bowls', description: 'Boiled egg exotic grilled veggies, zucchini, cucumber, lettuce, salsa and with green sauce.', price: 280, isVeg: false, image: foodBowl },
  { id: 5, name: 'Mini Pesto Chicken Bowl', category: 'Mini Bowls', description: 'Grilled pesto Chicken [80 g], exotic grilled veggies, bell peppers, hummus, pickled red cabbage, lettuce, salsa and with green sauce.', price: 280, isVeg: false, image: foodBowl },
  { id: 6, name: 'Mini Fish Bowl', category: 'Mini Bowls', description: 'Grilled fish [80 g], exotic grilled veggies, bell peppers, mango salsa, lettuce, black chana and with green sauce.', price: 320, isVeg: false, image: foodBowl },
  
  // Healthy Finger Bites
  { id: 7, name: 'Hummus and Corn Toast', category: 'Healthy Finger Bites', description: 'Crispy golden toast, generously spread with creamy, earthy hummus and crowned with sweet, tender corn.', price: 140, isVeg: true, image: foodBowl },
  { id: 8, name: 'Peanut Butter Banana Toast', category: 'Healthy Finger Bites', description: 'Golden toasted bread, slathered with rich, nutty peanut butter and layered with sweet, ripe banana slices.', price: 150, isVeg: true, image: foodBowl },
  { id: 9, name: 'Spinach and Scrambled Egg Toast', category: 'Healthy Finger Bites', description: 'Crisp toast topped with creamy scrambled eggs and spinach.', price: 160, isVeg: false, image: foodBowl },
  { id: 10, name: 'Avocado and Egg Toast', category: 'Healthy Finger Bites', description: 'Crisp toast topped with creamy, smashed avocado and a perfectly cooked egg.', price: 180, isVeg: false, image: foodBowl },

  // Hand Crafted Probiotics
  { id: 11, name: 'Green Tea Kombucha', category: 'Hand Crafted Probiotics', description: 'Handmade brewed gut beverage which helps immensely in digestion.', price: 160, isVeg: true, image: foodBowl },
  { id: 12, name: 'Himachali Tea Kombucha', category: 'Hand Crafted Probiotics', description: 'Handmade brewed gut beverage which helps immensely in digestion.', price: 160, isVeg: true, image: foodBowl },
  { id: 13, name: 'Rose Kombucha', category: 'Hand Crafted Probiotics', description: 'Handmade brewed gut beverage which helps immensely in digestion.', price: 160, isVeg: true, image: foodBowl },
  { id: 14, name: 'Hibiscus Kombucha', category: 'Hand Crafted Probiotics', description: 'Handmade brewed gut beverage which helps immensely in digestion.', price: 160, isVeg: true, image: foodBowl },

  // Smoothies
  { id: 15, name: 'Banana, Spinach, Dry Berries', category: 'Freshly Made Liquid Nutrition', description: 'Banana, Spinach, Dry Berries, Chia Seeds & Mango Smoothie', price: 180, isVeg: true, image: foodBowl },
  { id: 16, name: 'Berries, Seeds & Apricot', category: 'Freshly Made Liquid Nutrition', description: 'Berries, Seeds & Apricot Smoothie', price: 230, isVeg: true, image: foodBowl },
  { id: 17, name: 'Granola, Pineapple, Avocado', category: 'Freshly Made Liquid Nutrition', description: 'Granola, Pineapple, Avocado & Flax Seeds Smoothie', price: 220, isVeg: true, image: foodBowl },
  { id: 18, name: 'Oats, Banana, Pineapple', category: 'Freshly Made Liquid Nutrition', description: 'Oats, Banana, Pineapple & Pumpkin Seeds Smoothie', price: 200, isVeg: true, image: foodBowl },
  { id: 19, name: 'Seeds, Watermelon, Cucumber', category: 'Freshly Made Liquid Nutrition', description: 'Seeds, Watermelon and Cucumber Smoothie', price: 170, isVeg: true, image: foodBowl },

  // Healthy Bowls
  { id: 20, name: 'Muscle Gain Bowl', category: 'Healthy Bowls', description: 'Loaded with proteins, exotic veg, complex carbs, choices of your fibers, salads, dressings.', price: 380, isVeg: false, image: foodBowl },
  { id: 21, name: 'Weight Loses Bowl', category: 'Healthy Bowls', description: 'Zero carbs, choices of your proteins, exotic fibers, exotic veg green leaves and dressings.', price: 350, isVeg: false, image: foodBowl },
  { id: 22, name: 'Vegan Bowl', category: 'Healthy Bowls', description: 'Loaded with all plant based food, tofu, exotic veg, multiple salads, dairy free sauce.', price: 320, isVeg: true, image: foodBowl },
  { id: 23, name: 'Paneer Quinoa Bowl', category: 'Healthy Bowls', description: 'Complex carbs, grilled paneer, lots of veggies, 6 choices of salads, kidney beans, home made sauces.', price: 320, isVeg: true, image: foodBowl },
  { id: 24, name: 'Chicken Millets Bowl', category: 'Healthy Bowls', description: 'Complex carbs, grilled chicken, lots of veggies, 6 choices of salads, kidney beans, home made sauces.', price: 320, isVeg: false, image: foodBowl },
  { id: 25, name: 'Fish Bowl', category: 'Healthy Bowls', description: 'Complex carbs, grilled fish, lots of veggies, 6 choices of salads, kidney beans, home made sauces.', price: 350, isVeg: false, image: foodBowl },
  { id: 26, name: 'Veg Millets Bowl', category: 'Healthy Bowls', description: 'Complex carbs, tofu, lots of veggies, 6 choices of salads, kidney beans, home made sauces.', price: 285, isVeg: true, image: foodBowl },
];

export const categories = ['Mini Bowls', 'Healthy Finger Bites', 'Hand Crafted Probiotics', 'Freshly Made Liquid Nutrition', 'Healthy Bowls'];
