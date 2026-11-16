export interface FreeNutritionGuide {
  id: string;
  categoryKey: string;
  categoryTitle: string;
  title: string;
  summary: string;
  idealTiming: string;
  keyIngredients: string[];
  approxCalories: string;
  macroRatio: {
    carbs: string;
    protein: string;
    fat: string;
  };
  videoUrl: string;
  thumbnailUrl: string;
  instructions: string[];
  coachingNotes: string;
}

export const NUTRITION_CATEGORIES_FREE = [
  { key: 'hydration', title: 'هیدراتاسیون و آب‌رسانی', desc: 'پروتکل نوشیدن قبل، حین و بعد بازی' },
  { key: 'pre-match', title: 'وعده قبل از مسابقه', desc: 'کربوهیدرات پیچیده با هضم آسان' },
  { key: 'recovery', title: 'تغذیه ریکاوری طلایی', desc: 'پنجره ۳۰ دقیقه پس از سوت پایان' },
  { key: 'daily-macros', title: 'درشت‌مغذی‌های فوتبالیست', desc: 'تنظیم پروتئین، کربوهیدرات و چربی سالم' },
  { key: 'match-snacks', title: 'میان‌وعده‌های پرانرژی', desc: 'سوخت‌رسانی بین دو نیمه و تمرین' },
];

const NUTRITION_ITEMS_STORAGE_KEY = 'first_touch_free_nutrition_items';

export const getNutritionGuides = (): FreeNutritionGuide[] => {
  try {
    const raw = localStorage.getItem(NUTRITION_ITEMS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.error('Failed to get nutrition guides', err);
  }
  return [];
};

export const saveNutritionGuides = (items: FreeNutritionGuide[]): void => {
  try {
    localStorage.setItem(NUTRITION_ITEMS_STORAGE_KEY, JSON.stringify(items));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('ft_nutrition_updated'));
    }
  } catch (err) {
    console.error('Failed to save nutrition guides', err);
  }
};

export const FREE_NUTRITION_ITEMS: FreeNutritionGuide[] = [];
