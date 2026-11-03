const fs = require('fs');
const path = require('path');

function getUnit(label, name, cat) {
  if (!label || typeof label !== 'string') return 'عدد';
  if (label.includes('کف دست')) return 'کف دست';
  if (label.includes('لیوان')) return 'لیوان';
  if (label.includes('کاسه')) return 'کاسه';
  if (label.includes('سیخ')) return 'سیخ';
  if (label.includes('برش')) return 'برش';
  if (label.includes('تکه')) return 'تکه';
  if (label.includes('ورق')) return 'ورق';
  if (label.includes('پیمانه')) return 'پیمانه';
  if (label.includes('قاشق')) return 'قاشق';
  if (label.includes('قوطی')) return 'قوطی';
  if (label.includes('وعده') || label.includes('پرس') || cat === 'iranian_dishes' || cat === 'fast_food' || cat === 'meals') return 'پرس';
  return 'عدد';
}

function run() {
  const possiblePaths = [
    path.resolve('food/first_touch_food_database_v2_2_0/first_touch_food_database_fa_IR.json'),
    path.resolve('../food/first_touch_food_database_v2_2_0/first_touch_food_database_fa_IR.json'),
    path.resolve('food/first_touch_food_database_fa_IR.json'),
  ];

  let jsonPath = null;
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      jsonPath = p;
      break;
    }
  }

  if (!jsonPath) {
    console.error('File not found in any path');
    return;
  }

  console.log(`Using database file: ${jsonPath}`);
  const raw = fs.readFileSync(jsonPath, 'utf8');
  const data = JSON.parse(raw);

  const catMap = Object.fromEntries(data.categories.map((c) => [c.id, c.name_fa]));

  const items = data.foods.map((f) => {
    const cal = Math.round(
      Number(
        f.nutrition_per_default_serving?.energy_kcal ||
          ((f.nutrition_per_100g?.energy_kcal || 0) * (f.default_serving?.amount_g || 100)) / 100 ||
          0
      )
    );
    const prot =
      Math.round(
        Number(
          f.nutrition_per_default_serving?.protein_g ||
            ((f.nutrition_per_100g?.protein_g || 0) * (f.default_serving?.amount_g || 100)) / 100 ||
            0
        ) * 10
      ) / 10;
    const carb =
      Math.round(
        Number(
          f.nutrition_per_default_serving?.carbohydrate_g ||
            ((f.nutrition_per_100g?.carbohydrate_g || 0) * (f.default_serving?.amount_g || 100)) / 100 ||
            0
        ) * 10
      ) / 10;
    const fat =
      Math.round(
        Number(
          f.nutrition_per_default_serving?.total_fat_g ||
            ((f.nutrition_per_100g?.total_fat_g || 0) * (f.default_serving?.amount_g || 100)) / 100 ||
            0
        ) * 10
      ) / 10;

    let portionStr = f.default_serving?.label_fa;
    if (typeof portionStr !== 'string') {
      portionStr = typeof f.default_serving?.unit === 'string' ? f.default_serving.unit : '';
    }

    const unit = getUnit(portionStr, f.name.fa, f.category);
    if (!portionStr) {
      portionStr = `۱ ${unit}`;
    }

    return {
      id: f.id,
      name: f.name.fa,
      category: catMap[f.category] || f.category,
      portion: portionStr,
      unitName: unit,
      calories: cal,
      protein: prot,
      carbs: carb,
      fat: fat,
      searchTerms: f.search_terms || [f.name.fa],
    };
  });

  const outPath = path.resolve('apps/api/src/modules/nutrition/food.dataset.ts');
  const tsContent = `// Automatically generated from food/first_touch_food_database_v2_2_0/first_touch_food_database_fa_IR.json
import { FoodCalorieItem } from './nutrition.data';

export const FIRST_TOUCH_FOOD_DATABASE: FoodCalorieItem[] = ${JSON.stringify(items, null, 2)};
`;

  fs.writeFileSync(outPath, tsContent, 'utf8');
  console.log(`Successfully mapped and saved ${items.length} food items to ${outPath}`);
}

run();
