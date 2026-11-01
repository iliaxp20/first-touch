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

export const FREE_NUTRITION_ITEMS: FreeNutritionGuide[] = [
  {
    id: 'nut-free-1',
    categoryKey: 'hydration',
    categoryTitle: 'هیدراتاسیون و آب‌رسانی',
    title: 'فرمول نوشیدنی ایزوتونیک خانگی روز مسابقه',
    summary: 'جبران سریع سدیم، پتاسیم و آب از دست رفته از طریق تعریق شدید در زمین چمن.',
    idealTiming: '۳۰ تا ۴۵ دقیقه قبل از بازی و بین دو نیمه',
    keyIngredients: ['۵۰۰ میلی‌لیتر آب تصفیه شده', '۲ قاشق عسل طبیعی', 'نوک قاشق چایخوری نمک دریا', 'آب لیموترش تازه'],
    approxCalories: '۱۲۰ کیلوکالری',
    macroRatio: { carbs: '۹۰٪', protein: '۲٪', fat: '۸٪' },
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-man-exercising-in-a-sports-hall-41314-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80',
    instructions: [
      'آب ولرم را در قمقمه ورزشی بریزید.',
      'عسل و نمک دریا را کاملاً در آب حل کنید.',
      'آب لیموی تازه را اضافه کرده و بگذارید خنک شود.',
      'در فواصل ۱۵ دقیقه‌ای تمرین جرعه‌جرعه بنوشید.',
    ],
    coachingNotes: 'از نوشیدن مقادیر زیاد آب یخ یکباره قبل از مسابقه پرهیز کنید زیرا باعث گرفتگی معده می‌شود.',
  },
  {
    id: 'nut-free-2',
    categoryKey: 'pre-match',
    categoryTitle: 'وعده قبل از مسابقه',
    title: 'بشقاب انرژی پایدار ۳ ساعت قبل بازی',
    summary: 'ترکیب جو دوسر، فیله مرغ گریل شده و سیب‌زمینی تنوری جهت پر کردن ذخایر گلیکوژن کبد و عضله.',
    idealTiming: '۳ تا ۳.۵ ساعت قبل از آغاز گرم‌کردن',
    keyIngredients: ['۱۵۰ گرم سینه مرغ گریل', '۲۰۰ گرم سیب‌زمینی آب‌پز یا پوره بدون خامه', 'یک پیاله بروکلی بخارپز'],
    approxCalories: '۵۵۰ کیلوکالری',
    macroRatio: { carbs: '۶۰٪', protein: '۲۵٪', fat: '۱۵٪' },
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-athlete-training-on-an-agility-ladder-41315-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=600&q=80',
    instructions: [
      'سیب‌زمینی را با مقداری کمی نمک و روغن زیتون بپزید.',
      'فیله مرغ را بدون روغن اضافی گریل نمایید.',
      'همراه با سالاد ملایم بدون سس مایونز میل شود.',
    ],
    coachingNotes: 'مصرف حبوبات و سبزیجات نفاخ قبل از بازی ممنوع است.',
  },
  {
    id: 'nut-free-3',
    categoryKey: 'recovery',
    categoryTitle: 'تغذیه ریکاوری طلایی',
    title: 'شیک بازسازی پروتئین و گلیکوژن پس از ۹۰ دقیقه',
    summary: 'شیر کم‌چرب، موز رسیده و پروتئین وی یا سفیده تخم‌مرغ برای ترمیم سریع پارگی‌های میکروسکوپی عضله.',
    idealTiming: 'در ۳۰ دقیقه اول پس از پایان تمرین یا مسابقه',
    keyIngredients: ['۳۰۰ میلی‌لیتر شیر کم‌چرب', 'یک عدد موز رسیده', 'یک قاشق کره بادام زمینی', 'پودر دارچین'],
    approxCalories: '۳۴۰ کیلوکالری',
    macroRatio: { carbs: '۵۵٪', protein: '۳۰٪', fat: '۱۵٪' },
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-man-training-with-a-soccer-ball-41552-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=80',
    instructions: [
      'تمام مواد را در مخلوط‌کن ریخته و به مدت ۴۵ ثانیه میکس کنید.',
      'بلافاصله پس از دوش بعد از بازی میل شود.',
    ],
    coachingNotes: 'پنجره آنابولیک پس از تمرین حیاتی‌ترین زمان برای حفظ عضلات پا و کاهش خستگی فرداست.',
  },
];
