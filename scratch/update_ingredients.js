const fs = require('fs');
let content = fs.readFileSync('o:/Bootstrap Cafe/client/src/data/ingredientsData.js', 'utf8');

content = content.replace(/(id: 'b\d+',.*?isVeg: (?:true|false), image: '[^']+')/g, "$1, nutrition: { protein: 4, carbs: 20, fat: 1, calories: 100 }");
content = content.replace(/(id: 'e\d+',.*?isVeg: (?:true|false), image: '[^']+')/g, "$1, nutrition: { protein: 1, carbs: 15, fat: 0, calories: 50 }");
content = content.replace(/(id: 'p\d+',.*?isVeg: (?:true|false), image: '[^']+')/g, "$1, nutrition: { protein: 20, carbs: 5, fat: 8, calories: 150 }");
content = content.replace(/(id: 't\d+',.*?isVeg: (?:true|false), image: '[^']+')/g, "$1, nutrition: { protein: 1, carbs: 5, fat: 0, calories: 25 }");
content = content.replace(/(id: 'c\d+',.*?isVeg: (?:true|false), image: '[^']+')/g, "$1, nutrition: { protein: 5, carbs: 2, fat: 10, calories: 120 }");
content = content.replace(/(id: 'd\d+',.*?isVeg: (?:true|false), image: '[^']+')/g, "$1, nutrition: { protein: 0, carbs: 3, fat: 5, calories: 60 }");

fs.writeFileSync('o:/Bootstrap Cafe/client/src/data/ingredientsData.js', content);
