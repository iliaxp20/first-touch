export interface MealItem {
  mealName: string;
  foods: string;
  approxCalories?: number;
}

export interface FoodCalorieItem {
  id: string;
  name: string;
  category: string;
  portion: string; // e.g. "۱ عدد", "۱ پرس", "۱ کف دست", "۱ لیوان", "۱ کاسه"
  unitName: string; // "عدد", "پرس", "کف دست", "لیوان", "کاسه", "قوطی", "برش"
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  searchTerms?: string[];
  isCustom?: boolean;
}

export interface LoggedFoodItem {
  id: string;
  foodId?: string;
  name: string;
  portion: string;
  count: number; // تعداد (e.g. 1, 2, 3)
  unitName: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  loggedAt: string;
  isPlannedItem?: boolean;
  isCompleted?: boolean;
  isCustom?: boolean;
}

export interface DailyNutritionTarget {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  planTitle?: string;
  planType?: 'none' | 'free' | 'ready' | 'coach';
  currentWeight?: number;
  targetWeight?: number;
  weightGoal?: 'lose' | 'maintain' | 'gain';
}

export interface DailyLogSummary {
  date: string;
  target: DailyNutritionTarget;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  remainingCalories: number;
  caloriesProgressPct: number;
  proteinProgressPct: number;
  meals: {
    breakfast: LoggedFoodItem[];
    lunch: LoggedFoodItem[];
    dinner: LoggedFoodItem[];
    snack: LoggedFoodItem[];
  };
}

export interface PresetNutritionPlan {
  id: string;
  title: string;
  type: 'free' | 'ready' | 'coach';
  price: string;
  dailyCalories: number;
  protein: number;
  carbs: number;
  fat: number;
  description: string;
  coachName?: string;
  plannedItems: {
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    name: string;
    portion: string;
    count: number;
    unitName: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  }[];
}

export const DEFAULT_NUTRITION_TARGET: DailyNutritionTarget = {
  calories: 0,
  protein: 0,
  carbs: 0,
  fat: 0,
  planTitle: '',
  planType: 'none',
};

export const PRESET_NUTRITION_PLANS: PresetNutritionPlan[] = [
  {
    id: 'plan-free',
    title: 'برنامه اصولی آکادمی فرست تاچ',
    type: 'free',
    price: 'رایگان',
    dailyCalories: 2350,
    protein: 135,
    carbs: 275,
    fat: 62,
    description: 'رژیم استاندارد و چندمرحله‌ای ویژه فوتبالیست‌ها با تنوع کامل صبحانه، میان‌وعده، ناهار و شام',
    plannedItems: [
      // صبحانه
      {
        mealType: 'breakfast',
        name: 'نان سنگک سنتی تازه',
        portion: '۲ کف دست',
        count: 2,
        unitName: 'کف دست',
        calories: 156,
        protein: 5.8,
        carbs: 30,
        fat: 1.2,
      },
      {
        mealType: 'breakfast',
        name: 'تخم‌مرغ آبپز عسلی',
        portion: '۲ عدد',
        count: 2,
        unitName: 'عدد',
        calories: 148,
        protein: 13,
        carbs: 1.2,
        fat: 10,
      },
      {
        mealType: 'breakfast',
        name: 'پنیر سفید کم‌نمک صبحانه',
        portion: '۱ قوطی کبریت (۳۰ گرم)',
        count: 1,
        unitName: 'قوطی کبریت',
        calories: 72,
        protein: 4.8,
        carbs: 0.8,
        fat: 5.2,
      },
      {
        mealType: 'breakfast',
        name: 'مغز گردو درشت',
        portion: '۲ عدد کامل',
        count: 2,
        unitName: 'عدد',
        calories: 64,
        protein: 1.6,
        carbs: 1.4,
        fat: 6.4,
      },
      {
        mealType: 'breakfast',
        name: 'عسل طبیعی با چای کمرنگ',
        portion: '۱ قاشق',
        count: 1,
        unitName: 'قاشق',
        calories: 64,
        protein: 0.1,
        carbs: 17,
        fat: 0,
      },

      // میان‌وعده صبح
      {
        mealType: 'snack',
        name: 'سیب درختی سرخ یا زرد',
        portion: '۱ عدد متوسط',
        count: 1,
        unitName: 'عدد',
        calories: 95,
        protein: 0.5,
        carbs: 25,
        fat: 0.3,
      },
      {
        mealType: 'snack',
        name: 'خرما پیارم اعلا',
        portion: '۳ عدد',
        count: 3,
        unitName: 'عدد',
        calories: 78,
        protein: 0.9,
        carbs: 21,
        fat: 0,
      },
      {
        mealType: 'snack',
        name: 'مغز بادام درختی خام',
        portion: '۱۰ عدد',
        count: 1,
        unitName: 'سهم',
        calories: 80,
        protein: 3,
        carbs: 3,
        fat: 7,
      },

      // ناهار
      {
        mealType: 'lunch',
        name: 'زرشک‌پلو با سینه مرغ پخته',
        portion: '۱ پرس استاندارد',
        count: 1,
        unitName: 'پرس',
        calories: 580,
        protein: 44,
        carbs: 65,
        fat: 14,
      },
      {
        mealType: 'lunch',
        name: 'ماست پروتئینی یا کم‌چرب',
        portion: '۱ کاسه',
        count: 1,
        unitName: 'کاسه',
        calories: 60,
        protein: 11,
        carbs: 4,
        fat: 0,
      },
      {
        mealType: 'lunch',
        name: 'سالاد شیرازی با روغن زیتون',
        portion: '۱ کاسه',
        count: 1,
        unitName: 'کاسه',
        calories: 75,
        protein: 1.6,
        carbs: 10,
        fat: 3,
      },

      // میان‌وعده عصر / قبل تمرین
      {
        mealType: 'snack',
        name: 'موز متوسط',
        portion: '۱ عدد',
        count: 1,
        unitName: 'عدد',
        calories: 105,
        protein: 1.3,
        carbs: 27,
        fat: 0.3,
      },
      {
        mealType: 'snack',
        name: 'کره بادام‌زمینی طبیعی',
        portion: '۱ قاشق غذاخوری',
        count: 1,
        unitName: 'قاشق',
        calories: 95,
        protein: 4.2,
        carbs: 3,
        fat: 8,
      },
      {
        mealType: 'snack',
        name: 'جو دوسر پرک با شیر کم‌چرب',
        portion: '۱ کاسه',
        count: 1,
        unitName: 'کاسه',
        calories: 190,
        protein: 7,
        carbs: 34,
        fat: 3.2,
      },

      // شام
      {
        mealType: 'dinner',
        name: 'فیله مرغ یا سالمون گریل‌شده',
        portion: '۱ پرس',
        count: 1,
        unitName: 'پرس',
        calories: 280,
        protein: 34,
        carbs: 0,
        fat: 14,
      },
      {
        mealType: 'dinner',
        name: 'سیب‌زمینی تنوری یا کته برنج',
        portion: '۱ عدد / ۱ کفگیر',
        count: 1,
        unitName: 'عدد',
        calories: 145,
        protein: 3.2,
        carbs: 31,
        fat: 1,
      },
      {
        mealType: 'dinner',
        name: 'بشقاب سبزیجات بخارپز (بروکلی و هویج)',
        portion: '۱ بشقاب',
        count: 1,
        unitName: 'بشقاب',
        calories: 60,
        protein: 3,
        carbs: 12,
        fat: 0.5,
      },

      // میان‌وعده قبل خواب
      {
        mealType: 'snack',
        name: 'شیر پاستوریزه کم‌چرب ولرم',
        portion: '۱ لیوان',
        count: 1,
        unitName: 'لیوان',
        calories: 110,
        protein: 8.2,
        carbs: 12,
        fat: 3.8,
      },
    ],
  },
  {
    id: 'plan-ready-growth',
    title: 'برنامه آماده رشد قد و عضله‌سازی (نوجوانان و جوانان)',
    type: 'ready',
    price: '۱۹۹,۰۰۰ تومان',
    dailyCalories: 2500,
    protein: 145,
    carbs: 290,
    fat: 65,
    description: 'غنی از کلسیم، املاح و پروتئین باکیفیت برای تغذیه صفحات رشد و توان انفجاری',
    plannedItems: [
      {
        mealType: 'breakfast',
        name: 'املت گوجه با ۲ تخم‌مرغ + ۲ کف دست سنگک + ۱ لیوان شیر',
        portion: '۱ وعده',
        count: 1,
        unitName: 'وعده',
        calories: 450,
        protein: 25,
        carbs: 45,
        fat: 18,
      },
      {
        mealType: 'snack',
        name: '۱ لیوان شیرموز خانگی + ۳ عدد خرما پیارم',
        portion: '۱ لیوان با خرما',
        count: 1,
        unitName: 'لیوان',
        calories: 280,
        protein: 10,
        carbs: 52,
        fat: 4,
      },
      {
        mealType: 'lunch',
        name: 'چلو جوجه کباب با برنج کته و ماست ایسلندی',
        portion: '۱ پرس',
        count: 1,
        unitName: 'پرس',
        calories: 660,
        protein: 55,
        carbs: 65,
        fat: 14,
      },
      {
        mealType: 'dinner',
        name: '۱۵۰ گرم ماهی قزل‌آلا کباب شده با سیب‌زمینی تنوری',
        portion: '۱ پرس',
        count: 1,
        unitName: 'پرس',
        calories: 410,
        protein: 34,
        carbs: 34,
        fat: 12,
      },
    ],
  },
  {
    id: 'plan-ready-fatloss',
    title: 'برنامه آماده کات و چربی‌سوزی مسابقاتی',
    type: 'ready',
    price: '۱۹۹,۰۰۰ تومان',
    dailyCalories: 1900,
    protein: 140,
    carbs: 200,
    fat: 45,
    description: 'کسری کالری اصولی با حفظ کامل توده عضلانی و چابکی گام اول',
    plannedItems: [
      {
        mealType: 'breakfast',
        name: '۲ تخم‌مرغ آبپز + ۱ کف دست سنگک + خیار و گوجه',
        portion: '۱ وعده',
        count: 1,
        unitName: 'وعده',
        calories: 240,
        protein: 16,
        carbs: 18,
        fat: 11,
      },
      {
        mealType: 'snack',
        name: '۱ عدد سیب متوسط + ۱۵ عدد بادام خام',
        portion: '۱ سهم',
        count: 1,
        unitName: 'سهم',
        calories: 175,
        protein: 4,
        carbs: 28,
        fat: 8,
      },
      {
        mealType: 'lunch',
        name: '۱۵۰ گرم سینه مرغ گریل با برنج کته و سالاد فصل',
        portion: '۱ پرس',
        count: 1,
        unitName: 'پرس',
        calories: 520,
        protein: 44,
        carbs: 55,
        fat: 8,
      },
      {
        mealType: 'dinner',
        name: 'کنسرو تن ماهی در آب‌نمک با نان جو و سبزیجات',
        portion: '۱ وعده',
        count: 1,
        unitName: 'وعده',
        calories: 360,
        protein: 40,
        carbs: 35,
        fat: 4,
      },
    ],
  },
  {
    id: 'plan-coach-custom',
    title: 'برنامه اختصاصی با نظارت مربی تغذیه ورزشی',
    type: 'coach',
    price: '۳۹۹,۰۰۰ تومان',
    coachName: 'دپارتمان تخصصی تغذیه ورزشی آکادمی',
    dailyCalories: 2400,
    protein: 140,
    carbs: 270,
    fat: 60,
    description: 'طراحی رژیم کاملاً منطبق بر اهداف بدنی، پست بازی و برنامه تمرینات هفتگی',
    plannedItems: [
      {
        mealType: 'breakfast',
        name: '۳ عدد سفیده تخم‌مرغ + ۱ زرده + ۲ کف دست سنگک و پنیر',
        portion: '۱ وعده',
        count: 1,
        unitName: 'وعده',
        calories: 380,
        protein: 26,
        carbs: 35,
        fat: 12,
      },
      {
        mealType: 'snack',
        name: 'اسموتی جو دوسر با شیر کم‌چرب، موز و عسل',
        portion: '۱ لیوان',
        count: 1,
        unitName: 'لیوان',
        calories: 290,
        protein: 12,
        carbs: 52,
        fat: 4,
      },
      {
        mealType: 'lunch',
        name: 'چلو فیله مرغ گریل با برنج کته و سبزیجات بخارپز',
        portion: '۱ پرس',
        count: 1,
        unitName: 'پرس',
        calories: 620,
        protein: 50,
        carbs: 65,
        fat: 12,
      },
      {
        mealType: 'dinner',
        name: 'فیله سالمون نروژی با سیب‌زمینی تنوری و کلم بروکلی',
        portion: '۱ پرس',
        count: 1,
        unitName: 'پرس',
        calories: 480,
        protein: 38,
        carbs: 35,
        fat: 18,
      },
    ],
  },
];

import { FIRST_TOUCH_FOOD_DATABASE } from './food.dataset';

// بانک رسمی و جامع غذاهای ایرانی و ورزشی فرست‌تاچ (۲۸۲ خوراکی با درشت‌مغذی‌های دقیق)
export const IRANIAN_FOOD_DATABASE: FoodCalorieItem[] = FIRST_TOUCH_FOOD_DATABASE;
