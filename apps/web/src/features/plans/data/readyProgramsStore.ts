export interface ReadyTrainingPlan {
  id: string;
  title: string;
  ageGroup: 'نونهالان (زیر ۱۲ سال)' | 'نوجوانان (۱۲ تا ۱۵ سال)' | 'جوانان (۱۶ تا ۱۹ سال)' | 'بزرگسالان (+۱۹ سال)' | 'تمامی رده‌ها';
  price: string; // '۱۹۹,۰۰۰ تومان' یا 'رایگان'
  priceNumber: number; // 199000 یا 0
  durationWeeks: number;
  sessionsPerWeek: number;
  totalSessions: number;
  difficulty: 'مبتدی' | 'متوسط' | 'پیشرفته' | 'حرفه‌ای';
  goal: string;
  description: string;
  equipment: string[];
  coachName: string;
  rating: number;
  studentsCount: number;
  drillsSummary: string[];
  videoUrl?: string;
  thumbnailUrl?: string;
  isFree?: boolean;
  category?: string;
  schedule?: any[];
  isCustomAdminCreated?: boolean;
}

export interface ReadyNutritionPlan {
  id: string;
  title: string;
  ageGroup: 'نونهالان (زیر ۱۲ سال)' | 'نوجوانان (۱۲ تا ۱۵ سال)' | 'جوانان (۱۶ تا ۱۹ سال)' | 'بزرگسالان (+۱۹ سال)' | 'تمامی رده‌ها';
  price: string; // '۱۹۹,۰۰۰ تومان'
  priceNumber: number;
  dailyCalories: number;
  goal: string;
  focus: string;
  description: string;
  mealsSummary: { name: string; food: string; time: string }[];
  isCustomAdminCreated?: boolean;
}

export const getAgeGroupFromAge = (
  ageInput?: string | number,
): 'نونهالان (زیر ۱۲ سال)' | 'نوجوانان (۱۲ تا ۱۵ سال)' | 'جوانان (۱۶ تا ۱۹ سال)' | 'بزرگسالان (+۱۹ سال)' => {
  const age = Number(ageInput);
  if (!age || isNaN(age)) return 'نوجوانان (۱۲ تا ۱۵ سال)';
  if (age < 12) return 'نونهالان (زیر ۱۲ سال)';
  if (age <= 15) return 'نوجوانان (۱۲ تا ۱۵ سال)';
  if (age <= 19) return 'جوانان (۱۶ تا ۱۹ سال)';
  return 'بزرگسالان (+۱۹ سال)';
};

const DEFAULT_READY_TRAINING_PLANS: ReadyTrainingPlan[] = [
  {
    id: 'ready-plan-u12',
    title: 'برنامه پایه چابکی، لمس اول و هماهنگی نونهالان',
    ageGroup: 'نونهالان (زیر ۱۲ سال)',
    price: '۱۹۹,۰۰۰ تومان',
    priceNumber: 199000,
    durationWeeks: 4,
    sessionsPerWeek: 3,
    totalSessions: 12,
    difficulty: 'مبتدی',
    goal: 'تقویت ریتم گام‌برداری، شادی تمرین و لمس جهت‌دار با هر دو پا',
    description: 'طراحی شده بر مبنای متدهای پایه آکادمی‌های اروپایی برای رشد عصبی-عضلانی زیر ۱۲ سال بدون وزنه.',
    equipment: ['نردبان چابکی سبک', 'مخروط رنگی', 'توپ شماره ۴'],
    coachName: 'دپارتمان آکادمی نونهالان فرست تاچ',
    rating: 4.9,
    studentsCount: 312,
    drillsSummary: ['ایکی شافل مقدماتی', 'بازی واکنش رنگی', 'کنترل با کفی و بغل پا', 'استارت ۱۰ متر تفریحی'],
  },
  {
    id: 'ready-plan-u16',
    title: 'برنامه شتاب انفجاری، پرس و استقامت عضلانی نوجوانان',
    ageGroup: 'نوجوانان (۱۲ تا ۱۵ سال)',
    price: '۱۹۹,۰۰۰ تومان',
    priceNumber: 199000,
    durationWeeks: 6,
    sessionsPerWeek: 4,
    totalSessions: 24,
    difficulty: 'متوسط',
    goal: 'ارتقای شتاب گام اول، استقامت بی‌هوازی و تکنیک در موقعیت‌های تحت فشار',
    description: 'برنامه جامع بدنسازی تخصصی نوجوانان فوتبال با تأکید بر قدرت عملکردی وزن بدن و لمس دوم.',
    equipment: ['مخروط', 'کش مقاومتی مینی‌لوپ', 'توپ شماره ۵', 'نردبان'],
    coachName: 'کادر ارشد استعدادیابی فرست تاچ',
    rating: 4.8,
    studentsCount: 485,
    drillsSummary: ['تست ۵-۱۰-۵ حرفه‌ای', 'اسکات پرشی تک‌پا', 'شاتل شتاب زاویه‌دار', 'پرس پرسرعت ۲ به ۲'],
  },
  {
    id: 'ready-plan-u19',
    title: 'برنامه قدرت، موبیلیتی و سرعت پیش‌فصل جوانان',
    ageGroup: 'جوانان (۱۶ تا ۱۹ سال)',
    price: '۱۹۹,۰۰۰ تومان',
    priceNumber: 199000,
    durationWeeks: 8,
    sessionsPerWeek: 4,
    totalSessions: 32,
    difficulty: 'پیشرفته',
    goal: 'آماده‌سازی برای تست‌های باشگاهی و لیگ جوانان، بهبود توان انفجاری و ریکاوری',
    description: 'شامل پروتکل‌های حرفه‌ای FIFA 11+، تمرینات RSA استقامت در سرعت و کنترل پاس‌های پرفشار.',
    equipment: ['بوسوبال', 'موانع پرش', 'وزنه آزاد / مدیسن بال', 'توپ'],
    coachName: 'مربی بدنساز رسمی فیفا',
    rating: 5.0,
    studentsCount: 620,
    drillsSummary: ['تکرار اسپرینت بی‌هوازی', 'موبیلیتی ۹۰/۹۰ لگن', 'پاس تک‌ضرب تحت فشار', 'پرش سرزنی با فرود مقاومتی'],
  },
  {
    id: 'ready-plan-senior',
    title: 'برنامه جامع آماده‌سازی فیزیکی و تاکتیکی بزرگسالان',
    ageGroup: 'بزرگسالان (+۱۹ سال)',
    price: '۱۹۹,۰۰۰ تومان',
    priceNumber: 199000,
    durationWeeks: 8,
    sessionsPerWeek: 4,
    totalSessions: 32,
    difficulty: 'حرفه‌ای',
    goal: 'رسیدن به اوج آمادگی بدنی مسابقاتی، چابکی عرضی و استقامت ۹۰ دقیقه‌ای',
    description: 'تمرینات ویژه لیگ و بازیکنان باشگاهی با بالاترین چگالی تمرین و آنالیز بار کاری.',
    equipment: ['کامل آکادمی', 'جی‌پی‌اس یا ساعت هوشمند', 'وزنه'],
    coachName: 'سرمربی بین‌المللی UEFA Pro',
    rating: 4.9,
    studentsCount: 290,
    drillsSummary: ['RSA فوتبال ۹۰ دقیقه', 'شیرجه و انتقال موقعیت', 'شوت‌زنی بعد از استارت ۴۰ متری', 'حرکات ضد مصدومیت کشاله'],
  },
];

const DEFAULT_READY_NUTRITION_PLANS: ReadyNutritionPlan[] = [
  {
    id: 'ready-nut-u14',
    title: 'رژیم رشد قد و عضله‌سازی بدون چربی (نونهالان و نوجوانان)',
    ageGroup: 'نوجوانان (۱۲ تا ۱۵ سال)',
    price: '۱۹۹,۰۰۰ تومان',
    priceNumber: 199000,
    dailyCalories: 2600,
    goal: 'تغذیه صفحات رشد استخوانی و تأمین گلیکوژن برای ۲ ساعت تمرین روزانه',
    focus: 'کلسیم، ویتامین D، پروتئین تخم‌مرغ و غلات کامل',
    description: 'برنامه غذایی ۵ وعده‌ای با خوراکی‌های خوش‌طعم و غنی برای نوجوانان پرتحرک فوتبال.',
    mealsSummary: [
      { name: 'صبحانه', food: 'املت اسفناج و جو دوسر پرک با عسل و گردو', time: '۰۷:۳۰' },
      { name: 'میان‌وعده صبح', food: 'شیرموز خانگی با دانه چیا و خرما', time: '۱۰:۳۰' },
      { name: 'ناهار', food: 'برنج قهوه‌ای یا کته با سینه مرغ زعفرانی و سالاد', time: '۱۳:۳۰' },
      { name: 'عصرانه قبل تمرین', food: 'نان تست کامل با کره بادام زمینی و تکه‌های موز', time: '۱۶:۳۰' },
      { name: 'شام', food: 'سوپ عدس و ماهی قزل‌آلا کبابی با لیمو', time: '۲۰:۳۰' },
    ],
  },
  {
    id: 'ready-nut-muscle',
    title: 'رژیم افزایش توان عضلانی و کاهش چربی مسابقاتی',
    ageGroup: 'جوانان (۱۶ تا ۱۹ سال)',
    price: '۱۹۹,۰۰۰ تومان',
    priceNumber: 199000,
    dailyCalories: 3100,
    goal: 'افزایش چگالی عضلانی چهارسر و ساق پا، افزایش سرعت بدون افت انرژی',
    focus: 'توزیع ۱.۸ گرم پروتئین به ازای هر کیلو وزن بدن و کربوهیدرات‌های با شاخص قندی پایین',
    description: 'برنامه تغذیه‌ای حرفه‌ای متناسب با روزهای ۲ جلسه تمرین فشرده فوتبال.',
    mealsSummary: [
      { name: 'صبحانه قهرمانی', food: '۴ عدد سفیده تخم‌مرغ، ۱ زرده، نان سنگک و پنیر کم‌چرب', time: '۰۷:۰۰' },
      { name: 'میان‌وعده اول', food: 'سیب درختی، مشتی بادام خام و شیک پروتئین', time: '۱۰:۳۰' },
      { name: 'ناهار مسابقاتی', food: 'پاستا بدون خامه با گوشت بوقلمون و سبزیجات بخارپز', time: '۱۳:۰۰' },
      { name: 'قبل و بعد تمرین', food: 'نوشیدنی ایزوتونیک + شیک ریکاوری مالت و خرما', time: '۱۷:۰۰' },
      { name: 'شام سبک', food: 'فیله مرغ طعم‌دار با کلم بروکلی و سیب‌زمینی تنوری', time: '۲۱:۰۰' },
    ],
  },
];

const TRAINING_STORAGE_KEY = 'first_touch_ready_training_plans';
const NUTRITION_STORAGE_KEY = 'first_touch_ready_nutrition_plans';
const DELETED_PLANS_KEY = 'first_touch_deleted_plan_ids';

export const getDeletedPlanIds = (): string[] => {
  try {
    const raw = localStorage.getItem(DELETED_PLANS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const addDeletedPlanId = (id: string): void => {
  try {
    const current = getDeletedPlanIds();
    if (!current.includes(id)) {
      current.push(id);
      localStorage.setItem(DELETED_PLANS_KEY, JSON.stringify(current));
    }
  } catch {}
};

export const getReadyTrainingPlans = (): ReadyTrainingPlan[] => {
  const deletedIds = getDeletedPlanIds();
  try {
    const raw = localStorage.getItem(TRAINING_STORAGE_KEY);
    if (raw !== null) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.filter((p: ReadyTrainingPlan) => p && !deletedIds.includes(p.id));
      }
    }
  } catch (err) {
    console.warn('Failed to parse training plans from localStorage', err);
  }
  return DEFAULT_READY_TRAINING_PLANS.filter((p) => !deletedIds.includes(p.id));
};

export const saveReadyTrainingPlans = (plans: ReadyTrainingPlan[]): void => {
  try {
    localStorage.setItem(TRAINING_STORAGE_KEY, JSON.stringify(plans));
  } catch (err) {
    console.error('Failed to save training plans', err);
  }
};

export const addReadyTrainingPlan = (plan: Omit<ReadyTrainingPlan, 'id'>): ReadyTrainingPlan => {
  const current = getReadyTrainingPlans();
  const newPlan: ReadyTrainingPlan = {
    ...plan,
    id: `plan-adm-${Date.now()}`,
    isCustomAdminCreated: true,
  };
  const updated = [newPlan, ...current];
  saveReadyTrainingPlans(updated);
  return newPlan;
};

export const updateReadyTrainingPlan = (updatedPlan: ReadyTrainingPlan): void => {
  const current = getReadyTrainingPlans();
  const exists = current.some((p) => p.id === updatedPlan.id);
  const next = exists
    ? current.map((p) => (p.id === updatedPlan.id ? updatedPlan : p))
    : [updatedPlan, ...current];
  saveReadyTrainingPlans(next);

  // Sync to student active plans if currently active
  try {
    const rawActive = localStorage.getItem('first_touch_student_active_plans');
    if (rawActive) {
      const activeList = JSON.parse(rawActive);
      if (Array.isArray(activeList)) {
        const nextActive = activeList.map((p: any) =>
          p.id === updatedPlan.id ? { ...p, ...updatedPlan } : p,
        );
        localStorage.setItem('first_touch_student_active_plans', JSON.stringify(nextActive));
      }
    }
  } catch {}

  // Sync to API
  try {
    fetch('http://localhost:4000/programs/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedPlan),
    }).catch(() => {});
  } catch {}
};

export const deleteReadyTrainingPlan = (id: string): void => {
  addDeletedPlanId(id);
  const current = getReadyTrainingPlans();
  const updated = current.filter((p) => p.id !== id);
  saveReadyTrainingPlans(updated);

  // Also purge from student active plans if currently enrolled
  try {
    const rawActive = localStorage.getItem('first_touch_student_active_plans');
    if (rawActive) {
      const activeList = JSON.parse(rawActive);
      if (Array.isArray(activeList)) {
        const filtered = activeList.filter((p: any) => p && p.id !== id);
        localStorage.setItem('first_touch_student_active_plans', JSON.stringify(filtered));
      }
    }
  } catch {}

  // Also notify server to delete program
  try {
    fetch(`http://localhost:4000/programs/${id}`, { method: 'DELETE' }).catch(() => {});
  } catch {}
};

export const getReadyNutritionPlans = (): ReadyNutritionPlan[] => {
  const deletedIds = getDeletedPlanIds();
  try {
    const raw = localStorage.getItem(NUTRITION_STORAGE_KEY);
    if (raw !== null) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.filter((p: ReadyNutritionPlan) => p && !deletedIds.includes(p.id));
      }
    }
  } catch (err) {
    console.warn('Failed to parse nutrition plans from localStorage', err);
  }
  return DEFAULT_READY_NUTRITION_PLANS.filter((p) => !deletedIds.includes(p.id));
};

export const saveReadyNutritionPlans = (plans: ReadyNutritionPlan[]): void => {
  try {
    localStorage.setItem(NUTRITION_STORAGE_KEY, JSON.stringify(plans));
  } catch (err) {
    console.error('Failed to save nutrition plans', err);
  }
};

export const addReadyNutritionPlan = (plan: Omit<ReadyNutritionPlan, 'id'>): ReadyNutritionPlan => {
  const current = getReadyNutritionPlans();
  const newPlan: ReadyNutritionPlan = {
    ...plan,
    id: `nut-adm-${Date.now()}`,
    isCustomAdminCreated: true,
  };
  const updated = [newPlan, ...current];
  saveReadyNutritionPlans(updated);
  return newPlan;
};

export const updateReadyNutritionPlan = (updatedPlan: ReadyNutritionPlan): void => {
  const current = getReadyNutritionPlans();
  const exists = current.some((p) => p.id === updatedPlan.id);
  const next = exists
    ? current.map((p) => (p.id === updatedPlan.id ? updatedPlan : p))
    : [updatedPlan, ...current];
  saveReadyNutritionPlans(next);
};

export const deleteReadyNutritionPlan = (id: string): void => {
  addDeletedPlanId(id);
  const current = getReadyNutritionPlans();
  const updated = current.filter((p) => p.id !== id);
  saveReadyNutritionPlans(updated);
};

// =========================================================================
// UNLOCKED / PURCHASED PLANS STORE (PERSISTENT LIFETIME ACCESS)
// Once unlocked, deleting the plan will NEVER ask for payment again!
// =========================================================================
const UNLOCKED_STORAGE_KEY = 'first_touch_unlocked_plans';

export const getUnlockedPlans = (): string[] => {
  try {
    const raw = localStorage.getItem(UNLOCKED_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveUnlockedPlan = (id?: string, title?: string): void => {
  try {
    const current = getUnlockedPlans();
    let changed = false;
    if (id && !current.includes(id)) {
      current.push(id);
      changed = true;
    }
    if (title && !current.includes(title)) {
      current.push(title);
      changed = true;
    }
    if (changed) {
      localStorage.setItem(UNLOCKED_STORAGE_KEY, JSON.stringify(current));
    }
  } catch {
    // Ignored
  }
};

export const isPlanUnlocked = (id?: string, title?: string): boolean => {
  const current = getUnlockedPlans();
  return (!!id && current.includes(id)) || (!!title && current.includes(title));
};
