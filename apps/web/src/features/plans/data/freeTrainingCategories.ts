export interface FreeDrill {
  id: string;
  categoryKey: string;
  categoryTitle: string;
  subCategory: string;
  title: string;
  englishTitle: string;
  difficulty: 'مبتدی' | 'متوسط' | 'پیشرفته' | 'حرفه‌ای';
  duration: string;
  setsReps: string;
  equipment: string;
  targetSkill: string;
  videoUrl: string; // Embed/Video demo link
  thumbnailUrl: string;
  description: string;
  steps: string[];
  coachingTips: string;
  commonMistakes: string;
}

export interface TrainingCategoryMeta {
  key: string;
  title: string;
  subContent: string;
  iconName: string;
  color: string;
  drillsCount: number;
}

export const TRAINING_CATEGORIES_10: TrainingCategoryMeta[] = [
  {
    key: 'agility',
    title: 'چابکی',
    subContent: 'نردبان چابکی، تغییر جهت، واکنش',
    iconName: 'Zap',
    color: 'from-amber-500 to-orange-600',
    drillsCount: 6,
  },
  {
    key: 'strength',
    title: 'قدرتی',
    subContent: 'وزن بدن، مقاومتی، قدرت پایین‌تنه',
    iconName: 'Dumbbell',
    color: 'from-rose-500 to-red-600',
    drillsCount: 6,
  },
  {
    key: 'speed',
    title: 'سرعت',
    subContent: 'شتاب، استارت، سرعت انفجاری',
    iconName: 'Flame',
    color: 'from-yellow-500 to-amber-600',
    drillsCount: 5,
  },
  {
    key: 'endurance',
    title: 'استقامت',
    subContent: 'هوازی، بی‌هوازی',
    iconName: 'Activity',
    color: 'from-emerald-500 to-teal-600',
    drillsCount: 5,
  },
  {
    key: 'technique',
    title: 'تکنیکی',
    subContent: 'دریبل، کنترل توپ، پاس',
    iconName: 'Target',
    color: 'from-blue-500 to-indigo-600',
    drillsCount: 6,
  },
  {
    key: 'tactics',
    title: 'تاکتیکی',
    subContent: 'پرس، جایگیری، انتقال بازی',
    iconName: 'Compass',
    color: 'from-purple-500 to-violet-600',
    drillsCount: 5,
  },
  {
    key: 'balance',
    title: 'تعادل و هماهنگی',
    subContent: 'تعادل، هماهنگی عصب و عضله',
    iconName: 'Scale',
    color: 'from-cyan-500 to-blue-600',
    drillsCount: 5,
  },
  {
    key: 'flexibility',
    title: 'انعطاف‌پذیری',
    subContent: 'موبیلیتی و دامنه حرکتی',
    iconName: 'Sparkles',
    color: 'from-pink-500 to-rose-600',
    drillsCount: 5,
  },
  {
    key: 'goalkeeping',
    title: 'دروازه‌بانی',
    subContent: 'واکنش، شیرجه، جایگیری',
    iconName: 'Shield',
    color: 'from-emerald-600 to-green-700',
    drillsCount: 5,
  },
  {
    key: 'warmup',
    title: 'گرم‌کردن و سردکردن',
    subContent: 'آماده‌سازی و ریکاوری',
    iconName: 'HeartPulse',
    color: 'from-teal-500 to-emerald-600',
    drillsCount: 5,
  },
];

// =========================================================================
// DYNAMIC TRAINING CATEGORIES STORE & ADMIN MANAGEMENT
// =========================================================================
const CATEGORIES_STORAGE_KEY = 'first_touch_training_categories';
const DELETED_CATEGORIES_KEY = 'first_touch_deleted_category_keys';

export const getDeletedCategoryKeys = (): string[] => {
  try {
    const raw = localStorage.getItem(DELETED_CATEGORIES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const addDeletedCategoryKey = (key: string): void => {
  try {
    const current = getDeletedCategoryKeys();
    if (!current.includes(key)) {
      current.push(key);
      localStorage.setItem(DELETED_CATEGORIES_KEY, JSON.stringify(current));
    }
  } catch {}
};

export const getTrainingCategories = (): TrainingCategoryMeta[] => {
  const deletedKeys = getDeletedCategoryKeys();
  try {
    const raw = localStorage.getItem(CATEGORIES_STORAGE_KEY);
    if (raw !== null) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.filter((c: TrainingCategoryMeta) => c && !deletedKeys.includes(c.key));
      }
    }
  } catch (err) {
    console.warn('Failed to parse categories from localStorage', err);
  }
  return TRAINING_CATEGORIES_10.filter((c) => !deletedKeys.includes(c.key));
};

export const saveTrainingCategories = (categories: TrainingCategoryMeta[]): void => {
  try {
    localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('ft_categories_updated'));
    }
  } catch (err) {
    console.error('Failed to save categories', err);
  }
};

export const addTrainingCategory = (
  cat: Omit<TrainingCategoryMeta, 'key'> & { key?: string },
): TrainingCategoryMeta => {
  const current = getTrainingCategories();
  const slugKey =
    cat.key && cat.key.trim()
      ? cat.key.trim().toLowerCase().replace(/\s+/g, '-')
      : `cat-${Date.now()}`;

  const newCat: TrainingCategoryMeta = {
    ...cat,
    key: slugKey,
  };
  const updated = [...current, newCat];
  saveTrainingCategories(updated);
  return newCat;
};

export const updateTrainingCategory = (updatedCat: TrainingCategoryMeta): void => {
  const current = getTrainingCategories();
  const exists = current.some((c) => c.key === updatedCat.key);
  const next = exists
    ? current.map((c) => (c.key === updatedCat.key ? updatedCat : c))
    : [...current, updatedCat];
  saveTrainingCategories(next);
};

export const deleteTrainingCategory = (key: string): void => {
  addDeletedCategoryKey(key);
  const current = getTrainingCategories();
  const updated = current.filter((c) => c.key !== key);
  saveTrainingCategories(updated);
};

export const resetTrainingCategories = (): void => {
  try {
    localStorage.removeItem(DELETED_CATEGORIES_KEY);
    localStorage.removeItem(CATEGORIES_STORAGE_KEY);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('ft_categories_updated'));
    }
  } catch {}
};


export const FREE_TRAINING_DRILLS: FreeDrill[] = [
  // 1. چابکی (نردبان چابکی، تغییر جهت، واکنش)
  {
    id: 'ag-1',
    categoryKey: 'agility',
    categoryTitle: 'چابکی',
    subCategory: 'نردبان چابکی',
    title: 'تمرین ایکی شافل سرعتی',
    englishTitle: 'Icky Shuffle Speed Ladder',
    difficulty: 'متوسط',
    duration: '۱۰ دقیقه',
    setsReps: '۴ ست ۲ بار رفت و برگشت',
    equipment: 'نردبان چابکی، کرنومتر',
    targetSkill: 'هماهنگی سریع گام‌ها، لمس دقیق و چابکی پاها',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-athlete-training-on-an-agility-ladder-41315-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=600&q=80',
    description: 'الگوی ورود دو پا به داخل خانه نردبان و خروج پای بیرونی با ریتم انفجاری چپ و راست.',
    steps: [
      'روبروی نردبان بایستید و زانوها را کمی خم کنید.',
      'پای راست و سپس پای چپ را داخل خانه اول بگذارید.',
      'پای راست را بیرون خانه سمت راست بکارید و همزمان پای چپ وارد خانه بعدی شود.',
      'سر بالا و مرکز ثقل پایین حفظ شود.',
    ],
    coachingTips: 'وزن بدن را روی سینه پا نگه دارید و از کوبیدن پاشنه روی زمین خودداری کنید.',
    commonMistakes: 'نگاه کردن مستقیم به پاها به جای دید محیطی زمین مسابقه.',
  },
  {
    id: 'ag-2',
    categoryKey: 'agility',
    categoryTitle: 'چابکی',
    subCategory: 'تغییر جهت',
    title: 'تمرین تست ۵-۱۰-۵ شاتل پرو',
    englishTitle: 'Pro Agility 5-10-5 Shuttle',
    difficulty: 'پیشرفته',
    duration: '۱۲ دقیقه',
    setsReps: '۵ ست استراحت ۹۰ ثانیه',
    equipment: '۳ عدد مخروط در فاصله ۵ یاردی',
    targetSkill: 'ترمز ناگهانی، چرخش انفجاری و استارت متقابل',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-soccer-player-running-and-kicking-the-ball-41551-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?auto=format&fit=crop&w=600&q=80',
    description: 'استارت ۵ یارد به راست، لمس خط، چرخش ۱۰ یارد به چپ و استارت نهایی ۵ یارد عبور از خط وسط.',
    steps: [
      'شروع در حالت ۳ نقطه در مخروط وسط.',
      'حرکت انفجاری ۵ یارد به سمت راست و لمس خط با دست راست.',
      'تغییر جهت سریع و دویدن ۱۰ یارد به سمت چپ.',
      'لمس خط چپ با دست چپ و شتاب نهایی به سمت خط پایان وسط.',
    ],
    coachingTips: 'هنگام ترمز کردن مرکز ثقل را سریعاً کاهش دهید تا انرژی زاویه‌ای هدر نرود.',
    commonMistakes: 'چرخش عریض به دور مخروط به جای ترمز خطی روی خط.',
  },
  {
    id: 'ag-3',
    categoryKey: 'agility',
    categoryTitle: 'چابکی',
    subCategory: 'واکنش',
    title: 'چابکی واکنشی با علامت رنگی مربی',
    englishTitle: 'Visual Color Reactive Agility',
    difficulty: 'پیشرفته',
    duration: '۱۵ دقیقه',
    setsReps: '۴ ست ۶ واکنش تصادفی',
    equipment: '۴ عدد مخروط رنگی (قرمز، آبی، زرد، سبز)',
    targetSkill: 'کاهش زمان پاسخ عصبی-حرکتی و تصمیم‌گیری لحظه‌ای',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-man-training-with-a-soccer-ball-41552-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=600&q=80',
    description: 'استقرار در مرکز لوزی و استارت فوری به سمت رنگی که مربی در کسری از ثانیه صدا می‌زند.',
    steps: [
      'قرارگیری در حالت آماده‌باش در مرکز چهار مخروط.',
      'گوش دادن و تماشای علامت مربی.',
      'گام اول انفجاری و لمس مخروط اعلام شده.',
      'بازگشت سریع با گام‌های بک‌پدال به مرکز.',
    ],
    coachingTips: 'سر و قفسه سینه رو به جلو باشد و منتظر سیگنال بمانید بدون حدس زدن زودهنگام.',
    commonMistakes: 'پیش‌بینی ناخواسته و از دست دادن تعادل در گام اول.',
  },

  // 2. قدرتی (وزن بدن، مقاومتی، قدرت پایین‌تنه)
  {
    id: 'st-1',
    categoryKey: 'strength',
    categoryTitle: 'قدرتی',
    subCategory: 'وزن بدن',
    title: 'اسکات پرشی پلیومتریک فوتبال',
    englishTitle: 'Explosive Jump Squats',
    difficulty: 'متوسط',
    duration: '۱۲ دقیقه',
    setsReps: '۴ ست ۸ تکرار با تمرکز بر اوج پرش',
    equipment: 'وزن بدن',
    targetSkill: 'قدرت انفجاری عضلات چهارسر و باسن جهت پرش سرزنی',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-athletic-man-jumping-in-the-gym-41318-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80',
    description: 'فرود کنترل‌شده به حالت اسکات کامل و پرش بیشینه با پرتاب دست‌ها به سمت بالا.',
    steps: [
      'پاها به عرض شانه باز، پنجه‌ها کمی رو به بیرون.',
      'پایین آمدن آرام تا زاویه ۹۰ درجه زانو.',
      'انفجار قدرتمند از پاشنه و پرتاب بدن به بالاترین نقطه ممکن.',
      'فرود نرم روی سینه پا با جذب ضربه.',
    ],
    coachingTips: 'در لحظه فرود اجازه ندهید زانوها به سمت داخل همگرایی پیدا کنند.',
    commonMistakes: 'فرود سفت روی پاشنه که به مفاصل زانو و ستون فقرات فشار می‌آورد.',
  },
  {
    id: 'st-2',
    categoryKey: 'strength',
    categoryTitle: 'قدرتی',
    subCategory: 'قدرت پایین‌تنه',
    title: 'لانگز پیاده‌روی با تقویت زردپی همسترینگ',
    englishTitle: 'Walking Lunges for Hamstrings',
    difficulty: 'متوسط',
    duration: '۱۰ دقیقه',
    setsReps: '۳ ست ۲۰ گام (۱۰ گام هر پا)',
    equipment: 'وزن بدن یا دمبل سبک',
    targetSkill: 'استحکام تک‌پا، تعادل دینامیک و پیشگیری از مصدومیت همسترینگ',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-man-exercising-in-a-sports-hall-41314-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=600&q=80',
    description: 'گام‌برداری طولی به جلو، پایین آوردن زانوی عقبی تا نزدیکی زمین و انتقال وزن به گام بعد.',
    steps: [
      'قامت صاف و نگاه به روبرو.',
      'گام بلند به جلو و پایین آمدن زانوی عقب تا ۳ سانتیمتری زمین.',
      'فشار از پاشنه پای جلو برای بلند شدن و گام مستقیم با پای مخالف.',
    ],
    coachingTips: 'زانوی پای جلو هرگز نباید از نوک انگشتان پا جلوتر برود.',
    commonMistakes: 'خم کردن کمر به جلو و نوسان تنه حین فرود.',
  },

  // 3. سرعت (شتاب، استارت، سرعت انفجاری)
  {
    id: 'sp-1',
    categoryKey: 'speed',
    categoryTitle: 'سرعت',
    subCategory: 'شتاب و استارت',
    title: 'استارت انفجاری ۱۰ و ۲۰ متر از حالت‌های مختلف',
    englishTitle: 'Multi-Position Acceleration Sprints',
    difficulty: 'پیشرفته',
    duration: '۱۵ دقیقه',
    setsReps: '۶ استارت با ۲ دقیقه استراحت کامل',
    equipment: 'مخروط، کرنومتر',
    targetSkill: 'زاویه رانش بدن در شتاب اولیه و گام اول تهاجمی',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-soccer-player-running-and-kicking-the-ball-41551-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=600&q=80',
    description: 'شروع استارت از موقعیت درازکش، نشسته و پشت به زمین برای شبیه‌سازی شرایط غیرمنتظره فوتبال.',
    steps: [
      'استقرار در حالت درازکش روی سینه.',
      'با صدای سوت، جهش برق‌آسا به بالا و زاویه تنه ۴۵ درجه.',
      'گام‌های قدرتمند پیستونی در ۵ متر اول بدون بالا آوردن ناگهانی سر.',
      'رسیدن به اوج شتاب در متر دهم و دویدن با حداکثر توان تا متر بیستم.',
    ],
    coachingTips: 'دست‌ها را با دامنه حرکتی کامل و تیغه عمود تاب دهید.',
    commonMistakes: 'ایستادن زودهنگام در متر اول که زاویه رانش را از بین می‌برد.',
  },

  // 4. استقامت (هوازی، بی‌هوازی)
  {
    id: 'en-1',
    categoryKey: 'endurance',
    categoryTitle: 'استقامت',
    subCategory: 'بی‌هوازی تکرارشونده',
    title: 'تمرین استقامت سرعت تکراری (RSA فوتبال)',
    englishTitle: 'Repeated Sprint Ability (RSA)',
    difficulty: 'حرفه‌ای',
    duration: '۲۰ دقیقه',
    setsReps: '۲ ست ۶ تکرار ۳۰ متری با ۲۰ ثانیه استراحت فعال',
    equipment: 'مخروط‌های نشانگر فاصله',
    targetSkill: 'توانایی حفظ سرعت در دقایق پایانی مسابقه و دفع اسید لاکتیک',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-athlete-training-on-an-agility-ladder-41315-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=600&q=80',
    description: 'تکرار شتاب‌های حداکثری با فاصله استراحت کوتاه، دقیقاً شبیه کورس‌های مکرر در جریان ۹۰ دقیقه.',
    steps: [
      'استارت انفجاری ۳۰ متر با ۱۰۰٪ توان.',
      'راه رفتن و ریکاوری در ۲۰ ثانیه بازگشت به خط شروع.',
      'تکرار تا ۶ بار و سپس استراحت ۵ دقیقه‌ای بین دو ست.',
    ],
    coachingTips: 'تنفس عمیق شکمی در بازگشت برای اکسیژن‌گیری حداکثری.',
    commonMistakes: 'دویدن با ۹۰ درصد توان به جای تلاش حداکثری واقعی.',
  },

  // 5. تکنیکی (دریبل، کنترل توپ، پاس)
  {
    id: 'tc-1',
    categoryKey: 'technique',
    categoryTitle: 'تکنیکی',
    subCategory: 'کنترل توپ و لمس اول',
    title: 'لمس اول جهت‌دار با چرخش ۱۸۰ درجه',
    englishTitle: 'Directional First Touch & Turn',
    difficulty: 'متوسط',
    duration: '۱۵ دقیقه',
    setsReps: '۴ ست ۱۵ کنترل با هر دو پا',
    equipment: 'دیوار پاس یا هم‌تیمی، توپ، ۴ مخروط',
    targetSkill: 'خروج از پرس مدافع با اولین تماس توپ به فضای خالی',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-man-training-with-a-soccer-ball-41552-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600&q=80',
    description: 'دریافت پاس تند زمینی و هدایت توپ با داخل و بیرون پا به سمت مسیر جدید بدون مکث.',
    steps: [
      'ارسال پاس محکم به دیوار.',
      'پیش‌بینی مسیر برگشت و تصمیم‌گیری قبل از رسیدن توپ.',
      'لمس اول کوسن‌دار با داخل پا به سمت فضای پشت سر.',
      'استارت ۲ گام با توپ جهت فرار از مدافع فرضی.',
    ],
    coachingTips: 'قفل بودن مچ پا در لمس اول رمز کنترل نرم و جهت‌دار است.',
    commonMistakes: 'استپ ساکن توپ زیر پا که باعث پرس سریع حریف می‌شود.',
  },

  // 6. تاکتیکی (پرس، جایگیری، انتقال بازی)
  {
    id: 'ta-1',
    categoryKey: 'tactics',
    categoryTitle: 'تاکتیکی',
    subCategory: 'پرس و قطع توپ',
    title: 'تمرین زاویه هدایت و پرس تکی تهاجمی',
    englishTitle: 'Curved Run Pressing & Shadowing',
    difficulty: 'پیشرفته',
    duration: '۱۵ دقیقه',
    setsReps: '۴ ست ۸ تکرار بستن لاین پاس',
    equipment: 'مخروط‌ها و دروازه کوچک',
    targetSkill: 'بستن خط پاس داخلی و هدایت بازیساز حریف به سمت خط طولی',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-soccer-player-running-and-kicking-the-ball-41551-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?auto=format&fit=crop&w=600&q=80',
    description: 'دویدن قوسی شکل برای بستن همزمان دو گزینه پاس حریف و کاهش زمان تصمیم‌گیری او.',
    steps: [
      'شروع از فاصله ۱۰ متری حریف صاحب توپ.',
      'استارت با قوس هلالی برای قرار دادن مدافع پشت سر خود در سایه بدن.',
      'ترمز در فاصله ۱.۵ متری بدون تکل بی‌مورد برای حفظ تعادل دفاعی.',
    ],
    coachingTips: 'سرعت دویدن را هنگام نزدیک شدن کاهش دهید تا حریف با دریبل رد نشود.',
    commonMistakes: 'حمله مستقیم خطی که لاین پاس وسط را کاملاً باز می‌گذارد.',
  },

  // 7. تعادل و هماهنگی (تعادل، هماهنگی عصب و عضله)
  {
    id: 'bl-1',
    categoryKey: 'balance',
    categoryTitle: 'تعادل و هماهنگی',
    subCategory: 'هماهنگی عصب و عضله',
    title: 'تک‌پای پویا با پاس و پرش روی بوسوبال',
    englishTitle: 'Single Leg Dynamic Balance & Volley',
    difficulty: 'متوسط',
    duration: '۱۰ دقیقه',
    setsReps: '۳ ست ۱۲ ضربه هر پا',
    equipment: 'توپ، تخته تعادل یا زمین صاف',
    targetSkill: 'استحکام لیگامنت‌های مچ و زانو در ضربات سرضرب هوایی',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-man-exercising-in-a-sports-hall-41314-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=600&q=80',
    description: 'ایستادن روی یک پا با زانوی کمی خم، دریافت پاس هوایی و بازگرداندن ضربه سرضرب بدون زمین گذاشتن پا.',
    steps: [
      'وزن کامل روی پای چپ، پای راست شناور.',
      'دریافت توپ هوایی و زدن بغل پای ملایم به هم‌تیمی.',
      'حفظ انقباض عضلات شکم و چهارسر برای پایداری بالاتنه.',
    ],
    coachingTips: 'دید خود را روی یک نقطه ثابت در روبرو متمرکز کنید.',
    commonMistakes: 'قفل کردن کامل مفصل زانو که باعث برهم خوردن تعادل می‌شود.',
  },

  // 8. انعطاف‌پذیری (موبیلیتی و دامنه حرکتی)
  {
    id: 'fl-1',
    categoryKey: 'flexibility',
    categoryTitle: 'انعطاف‌پذیری',
    subCategory: 'موبیلیتی مفاصل لگن',
    title: 'موبیلیتی ۹۰/۹۰ لگن برای شوت‌زنی و چرخش',
    englishTitle: '90/90 Hip Mobility Flow',
    difficulty: 'مبتدی',
    duration: '۸ دقیقه',
    setsReps: '۳ ست ۱۰ گردش آرام به چپ و راست',
    equipment: 'مت ورزشی',
    targetSkill: 'افزایش چرخش داخلی و خارجی مفصل ران و پیشگیری از درد کشاله ران',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-athletic-man-jumping-in-the-gym-41318-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80',
    description: 'نشستن روی زمین با زوایای قائمه ۹۰ درجه در هر دو زانو و انتقال روان لگن از یک سمت به سمت دیگر.',
    steps: [
      'روی مت بنشینید؛ ران جلو در ۹۰ درجه و ران عقب در ۹۰ درجه نسبت به لگن.',
      'ستون فقرات را کاملاً کشیده نگه دارید.',
      'بدون بلند کردن دست‌ها، زانوها را به سمت مخالف زمین بغلتانید.',
    ],
    coachingTips: 'حرکت را بدون عجله و با کنترل تنفس انجام دهید.',
    commonMistakes: 'قوز کردن شانه و بالا بردن لگن از روی مت.',
  },

  // 9. دروازه‌بانی (واکنش، شیرجه، جایگیری)
  {
    id: 'gk-1',
    categoryKey: 'goalkeeping',
    categoryTitle: 'دروازه‌بانی',
    subCategory: 'شیرجه و واکنش زمینی',
    title: 'شیرجه کوتاه زمینی با تکنیک فرود ایمن',
    englishTitle: 'Low Collapse Diving & Recovery',
    difficulty: 'پیشرفته',
    duration: '۱۵ دقیقه',
    setsReps: '۴ ست ۶ شیرجه به هر دو سمت',
    equipment: 'دستکش، توپ، مت محافظ',
    targetSkill: 'مهار توپ‌های زمینی زاویه‌دار و بازگشت سریع به موضع دفاعی',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-soccer-player-running-and-kicking-the-ball-41551-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=600&q=80',
    description: 'گام جانبی پرقدرت، فروپاشی زاویه‌دار به سمت توپ و جمع‌آوری توپ با دو دست به سینه.',
    steps: [
      'وضعیت آماده‌باش دروازه‌بان در فاصله یک متری خط دروازه.',
      'گام حمله به سمت زاویه حرکت توپ.',
      'فرود روی پهلوی ران و بالاتنه با دست‌های سپر شده جلوی توپ.',
      'بلند شدن آنی با پای تکیه‌گاه برای واکنش ثانویه.',
    ],
    coachingTips: 'هرگز با آرنج یا زانو روی زمین فرود نیایید؛ سطح تماس عضلانی پهلو باشد.',
    commonMistakes: 'برخورد خشن استخوان مفصل به زمین و پرتاب توپ به جلوی دروازه.',
  },

  // 10. گرم‌کردن و سردکردن (آماده‌سازی و ریکاوری)
  {
    id: 'wm-1',
    categoryKey: 'warmup',
    categoryTitle: 'گرم‌کردن و سردکردن',
    subCategory: 'آماده‌سازی پویا FIFA 11+',
    title: 'پروتکل داینامیک گرم‌کردن فیفا ۱۱+ پلاس',
    englishTitle: 'FIFA 11+ Dynamic Warmup Sequence',
    difficulty: 'مبتدی',
    duration: '۱۵ دقیقه',
    setsReps: 'یک راند کامل قبل از هر جلسه تمرینی',
    equipment: 'مخروط‌های نشانگر خط دویدن',
    targetSkill: 'بالا بردن دمای عمقی عضلات و کاهش ۶۰ درصدی احتمال آسیب‌دیدگی',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-athlete-training-on-an-agility-ladder-41315-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=600&q=80',
    description: 'ترکیبی از دویدن‌های کنترلی، باز و بسته کردن کشاله، تماس‌های جانبی و شتاب‌گیری‌های پیش‌رونده.',
    steps: [
      'دویدن آرام رفت و برگشت به فاصله ۱۰ متر.',
      'چرخش زانو به بیرون (باز کردن دروازه) و سپس به داخل (بستن دروازه).',
      'گام‌های ریز و پرش سرزنی نرم با فرود متعادل.',
      'شتاب تدریجی ۵۰٪، ۷۵٪ و در نهایت ۹۰٪.',
    ],
    coachingTips: 'گرم کردن با تمرکز بالا انجام شود تا سیستم عصبی بیدار گردد.',
    commonMistakes: 'استفاده از کشش‌های ایستا و ساکن قبل از شروع تمرینات سرعتی.',
  },
];

