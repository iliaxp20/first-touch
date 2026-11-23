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
  { key: 'all', title: 'همه راهنماها', desc: 'تمامی پروتکل‌های تغذیه و آب‌رسانی' },
  { key: 'hydration', title: 'هیدراتاسیون و آب‌رسانی', desc: 'پروتکل نوشیدن قبل، حین و بعد بازی' },
  { key: 'pre-match', title: 'وعده قبل از مسابقه', desc: 'کربوهیدرات پیچیده با هضم آسان' },
  { key: 'recovery', title: 'تغذیه ریکاوری طلایی', desc: 'پنجره ۳۰ دقیقه پس از سوت پایان' },
  { key: 'daily-macros', title: 'درشت‌مغذی‌های فوتبالیست', desc: 'تنظیم پروتئین، کربوهیدرات و چربی سالم' },
  { key: 'match-snacks', title: 'میان‌وعده‌های پرانرژی', desc: 'سوخت‌رسانی بین دو نیمه و تمرین' },
];

export const FREE_NUTRITION_ITEMS: FreeNutritionGuide[] = [
  {
    id: 'nut-guide-1',
    categoryKey: 'hydration',
    categoryTitle: 'هیدراتاسیون و آب‌رسانی',
    title: 'پروتکل آب‌رسانی و نوشیدنی الکترولیت مسابقه',
    summary: 'جلوگیری از افت توان در ۲۰ دقیقه پایانی بازی با مصرف ایزوتونیک نمک، لیمو و عسل.',
    idealTiming: '۲ ساعت قبل بازی (۵۰۰ میلی‌لیتر) و هر ۱۵ دقیقه حین توقف‌ها (۱۵۰ میلی‌لیتر)',
    keyIngredients: ['۵۰۰ میلی‌لیتر آب تصفیه شده', '۱ قاشق عسل طبیعی', 'نوک قاشق چای‌خوری نمک دریا', 'نصف لیموترش تازه'],
    approxCalories: '۸۵ کیلوکالری',
    macroRatio: { carbs: '۲۱ گرم', protein: '۰ گرم', fat: '۰ گرم' },
    videoUrl: '',
    thumbnailUrl: '/nutrition-cat-1.png',
    instructions: ['مواد را در قمقمه ورزشی با آب ولرم حل کرده و سپس خنک بنوشید.'],
    coachingNotes: 'کاهش ۲ درصدی آب بدن برابر با افت ۱۰ درصدی توان پرش و سرعت عکس‌العمل است.',
  },
  {
    id: 'nut-guide-2',
    categoryKey: 'pre-match',
    categoryTitle: 'وعده قبل از مسابقه',
    title: 'وعده اصلی ۳ ساعت قبل از سوت آغاز بازی',
    summary: 'انرژی پایدار و شارژ ذخایر گلیکوژن کبد و عضله بدون احساس سنگینی معده.',
    idealTiming: '۳ تا ۳.۵ ساعت قبل از آغاز مسابقه فوتبال',
    keyIngredients: ['۱۵۰ گرم سینه مرغ پخته زعفرانی', '۱ پیمانه برنج کته یا پاستا بدون خامه', 'پوره سیب‌زمینی یا هویج بخارپز'],
    approxCalories: '۶۲۰ کیلوکالری',
    macroRatio: { carbs: '۸۵ گرم', protein: '۴۲ گرم', fat: '۸ گرم' },
    videoUrl: '',
    thumbnailUrl: '/nutrition-cat-2.png',
    instructions: ['غذا را با جویدن کامل و آرام میل کنید و از مصرف چاشنی تند پرهیز شود.'],
    coachingNotes: 'پرهیز از غذاهای چرب و فیبر سنگین قبل بازی ریسک اسپاسم عضلات را به صفر می‌رساند.',
  },
  {
    id: 'nut-guide-3',
    categoryKey: 'recovery',
    categoryTitle: 'تغذیه ریکاوری طلایی',
    title: 'شیک ریکاوری آنابولیک ۳۰ دقیقه پس از سوت پایان',
    summary: 'ترمیم فوری تارهای عضلانی تخریب‌شده و جبران گلیکوژن با نسبت ۴ به ۱ کربوهیدرات به پروتئین.',
    idealTiming: 'حداکثر تا ۳۰ دقیقه بعد از پایان تمرین یا مسابقه',
    keyIngredients: ['۱ لیوان شیر کم‌چرب یا شیر سویا', '۱ عدد موز رسیده', '۳ عدد خرما پیارم', '۱ قاشق پودر وی یا جو دوسر آسیاب‌شده'],
    approxCalories: '۳۴۰ کیلوکالری',
    macroRatio: { carbs: '۵۲ گرم', protein: '۲۴ گرم', fat: '۴ گرم' },
    videoUrl: '',
    thumbnailUrl: '/nutrition-cat-3.png',
    instructions: ['تمام مواد را در مخلوط‌کن میکس کرده و خنک میل نمایید.'],
    coachingNotes: 'پنجره طلایی ۳۰ دقیقه‌ای تعیین‌کننده سطح شادابی عضلات برای جلسه تمرین فرداست.',
  },
  {
    id: 'nut-guide-4',
    categoryKey: 'daily-macros',
    categoryTitle: 'درشت‌مغذی‌های فوتبالیست',
    title: 'توزیع درشت‌مغذی‌ها در روزهای تمرین پرفشار',
    summary: 'تنظیم دقیق ۱.۶ تا ۱.۸ گرم پروتئین و ۶ تا ۸ گرم کربوهیدرات به ازای هر کیلو وزن بدن.',
    idealTiming: 'در طول کل روز تقسیم در ۵ وعده مجزا',
    keyIngredients: ['تخم‌مرغ آب‌پز', 'فیله مرغ و ماهی سالمون', 'برنج کته و جو دوسر', 'روغن زیتون فرابکر و مغز گردو'],
    approxCalories: '۲۶۰۰ کیلوکالری',
    macroRatio: { carbs: '۳۴۰ گرم', protein: '۱۴۰ گرم', fat: '۶۰ گرم' },
    videoUrl: '',
    thumbnailUrl: '/nutrition-cat-1.png',
    instructions: ['تقسیم کالری در ۵ وعده: صبحانه، میان‌وعده، ناهار، عصرانه، شام.'],
    coachingNotes: 'مصرف منظم پروتئین در تمام وعده‌ها سنتز پروتئین عضلانی را به بالاترین حد می‌رساند.',
  },
  {
    id: 'nut-guide-5',
    categoryKey: 'match-snacks',
    categoryTitle: 'میان‌وعده‌های پرانرژی',
    title: 'سوخت‌رسانی بین دو نیمه و ۹۰ ثانیه استراحت',
    summary: 'افزایش فوری قند خون و جلوگیری از افت هوشیاری و تمرکز در نیمه دوم مسابقه.',
    idealTiming: 'در رختکن بین دو نیمه (دقیقه ۴۵ تا ۵۰)',
    keyIngredients: ['نصف موز رسیده', 'ژل ورزشی یا ۲ عدد خرما پیارم', 'چند جرعه نوشیدنی ایزوتونیک خنک'],
    approxCalories: '۱۲۰ کیلوکالری',
    macroRatio: { carbs: '۲۸ گرم', protein: '۱ گرم', fat: '۰ گرم' },
    videoUrl: '',
    thumbnailUrl: '/nutrition-cat-2.png',
    instructions: ['آهسته بجوید و همراه با مقدار کمی آب میل شود.'],
    coachingNotes: 'گلوکز زودجذب بین دو نیمه سرعت تصمیم‌گیری در فاز هجومی نیمه دوم را تثبیت می‌کند.',
  },
];

const NUTRITION_ITEMS_STORAGE_KEY = 'first_touch_free_nutrition_items';

export const getNutritionGuides = (): FreeNutritionGuide[] => {
  try {
    const raw = localStorage.getItem(NUTRITION_ITEMS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (err) {
    console.error('Failed to get nutrition guides', err);
  }
  return FREE_NUTRITION_ITEMS;
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
