export interface MealItem {
  mealName: string; // صبحانه، میان‌وعده، ناهار، قبل تمرین، بعد تمرین، شام، قبل خواب
  foods: string;
  approxCalories?: number;
}

export interface AgeNutritionPlan {
  id: string;
  ageGroup: string;
  ageRange: string;
  focus: string;
  dailyCalories?: number;
  description: string;
  warningNote?: string;
  meals: MealItem[];
  keyNutrients: string[];
  imageUrl?: string;
}

export interface FoodCalorieItem {
  id: string;
  name: string;
  category: 'نان و غلات' | 'پروتئین‌ها' | 'لبنیات' | 'میوه‌ها' | 'مغزها و چربی‌های مفید';
  portion: string;
  calories: number;
}

export const AGE_NUTRITION_PLANS: AgeNutritionPlan[] = [
  {
    id: 'nut-age-1',
    ageGroup: 'کودکان',
    ageRange: '۷ تا ۹ سال',
    focus: 'رشد قدی، استحکام استخوان‌ها و تأمین انرژی ورزشی',
    dailyCalories: 1650,
    description: 'در سنین ۷ تا ۹ سال انرژی و مواد مغذی برای رشد اندام‌ها و مغز حیاتی هستند. برنامه باید دارای نظم و منابع مغذی غنی از کلسیم، آهن و روی باشد.',
    warningNote: 'کاهش وزن در این رده سنی به هیچ وجه توصیه نمی‌شود و میزان غذا بر اساس اشتهای طبیعی و تحرک کودک تنظیم می‌گردد.',
    imageUrl: 'https://images.openai.com/static-rsc-4/pfRfC2qXobtdBVz6DbXUl181UAz-_vopjwJktcvk3UTyeSW3nKzX4w0rkfGYAYJo6XwSWGIAB5AFr-knq6V1xTx8Ik1e_r_aay0TQ0VaIS8VvAnaVtR1W3TTJ9d_S-VZWu1H88dKkR3pih08iof0rQSfQAJ7TIvlsk5PXBQj98w?purpose=inline',
    keyNutrients: ['کلسیم برای استخوان', 'روی و آهن', 'کربوهیدرات کامل', 'پروتئین زودهضم'],
    meals: [
      { mealName: 'صبحانه', foods: 'نان سنگک (۵۰ گرم)، پنیر سنتی (۳۰ گرم)، مغز گردو (۱۰ گرم)، یک لیوان شیر ولرم', approxCalories: 395 },
      { mealName: 'میان‌وعده اول', foods: 'یک عدد سیب یا موز متوسط همراه با ماست کم‌چرب (۱۰۰ گرم)', approxCalories: 165 },
      { mealName: 'ناهار', foods: 'برنج پخته کم‌روغن (۱۵۰ گرم)، سینه مرغ آبپز یا کبابی (۷۰ گرم)، سبزیجات تازه و ماست', approxCalories: 400 },
      { mealName: 'میان‌وعده عصر', foods: 'یک لیوان شیر کم‌چرب و ۲ عدد خرما', approxCalories: 165 },
      { mealName: 'شام', foods: 'خوراک عدسی یا یک عدد تخم‌مرغ آبپز همراه نان سنگک و سالاد خیار و گوجه', approxCalories: 350 },
      { mealName: 'قبل از خواب', foods: 'شیر ولرم در صورت نیاز و تمایل کودک', approxCalories: 120 },
    ],
  },
  {
    id: 'nut-age-2',
    ageGroup: 'نونهالان',
    ageRange: '۱۰ تا ۱۲ سال',
    focus: 'رشد اسکلتی، استخوان‌سازی و آمادگی برای تمرینات تکنیکی فوتبال',
    dailyCalories: 2100,
    description: 'در این دوره سن شروع جهش رشدی و شرکت در مسابقات آکادمی است؛ بنابراین تأمین کربوهیدرات قبل از تمرین و پروتئین برای بازسازی اهمیت دوچندان دارد.',
    warningNote: 'وعده‌های غذایی نباید حذف شوند و میان‌وعده‌های قبل و بعد از تمرین فوتبال اولویت اصلی هستند.',
    imageUrl: 'https://images.openai.com/static-rsc-4/nRX2aTEL2WIVc3QuR3ZLyH-SBgRWZfAkEA4j2UUFSg4eE3BbedK0-_PHiFRAOf0b0NxoxpVtge3lFF0YUfyDaSfJs0qcuuNrgoQ49qTGIF1wbnE8vU_tbA-7otaUmSw9mf25Ok_2tOAdHFj7btadWOoWMI0GczyHwp9AqW1TJDc?purpose=inline',
    keyNutrients: ['پروتئین روزانه کافی', 'ویتامین D و کلسیم', 'آب و املاح الکترولیت'],
    meals: [
      { mealName: 'صبحانه', foods: '۲ عدد تخم‌مرغ آبپز یا املت کم‌روغن، نان سنگک، یک لیوان شیر', approxCalories: 450 },
      { mealName: 'میان‌وعده صبح', foods: 'یک عدد موز، ۲۰ گرم گردو و ماست میوه‌ای خانگی', approxCalories: 260 },
      { mealName: 'ناهار', foods: 'چلو مرغ (۲۰۰ گرم برنج، ۱۰۰ گرم مرغ)، سالاد فصل با روغن زیتون و ماست', approxCalories: 550 },
      { mealName: 'قبل از تمرین', foods: 'نان سنگک همراه با عسل طبیعی یا یک عدد موز و ۲ عدد خرما', approxCalories: 180 },
      { mealName: 'بعد از تمرین', foods: 'یک لیوان شیر کم‌چرب و ساندویچ کوچک پنیر و گردو', approxCalories: 280 },
      { mealName: 'شام', foods: 'عدس‌پلو با گوشت چرخ‌کرده کم‌چرب یا خوراک لوبیاچیتی و نان سنگک', approxCalories: 480 },
    ],
  },
  {
    id: 'nut-age-3',
    ageGroup: 'نوجوانان',
    ageRange: '۱۳ تا ۱۵ سال',
    focus: 'جهش رشد بلوغ، ریکاوری فشرده و افزایش استقامت تمرین',
    dailyCalories: 2400,
    description: 'دوران اوج جهش قدی و تغییر ترکیب بدنی؛ نیاز شدید به آهن جهت ساخت گلبول‌های قرمز و انتقال اکسیژن در تمرینات چابکی.',
    warningNote: 'رژیم‌های محدودکننده کالری برای نوجوانان فوتبالیست ممنوع است و وزن با افزایش قد متعادل می‌شود.',
    imageUrl: 'https://images.openai.com/static-rsc-4/L_XxdcL0oKk0ZfS7LfNy88qsqeCcBlEdTjwKqXZzDdKO-OK3LVoU_qfwWqlwMRxaNB8OOW7_VR6sayxu0RzmXYAZJ5D2SxH9Fj_tXFRXUZnxqg-nu0rpXVVBMrau6AExRgsa7mkhOxCj2ELbBqMMOFdJxSm3Uw9NkJF9z7LkN6I?purpose=inline',
    keyNutrients: ['آهن و هموگلوبین', 'منیزیم جهت ریلکسیشن عضلانی', 'کربوهیدرات‌های پیچیده'],
    meals: [
      { mealName: 'صبحانه', foods: '۲ تخم‌مرغ، ۸۰ گرم نان سنگک، ۳۰ گرم پنیر، گردو و شیر', approxCalories: 480 },
      { mealName: 'میان‌وعده اول', foods: 'موز و مخلوط مغز بادام و پسته (۳۰ گرم)', approxCalories: 240 },
      { mealName: 'ناهار', foods: 'برنج کته (۲۰۰ گرم)، مرغ یا گوشت قرمز گوساله (۱۲۰ گرم)، سالاد و ماست یونانی', approxCalories: 620 },
      { mealName: 'قبل از تمرین', foods: 'ساندویچ نان و عسل یا ۳ عدد خرما و یک مشت کشمش', approxCalories: 200 },
      { mealName: 'بعد از تمرین', foods: 'شیرموز خانگی یا ساندویچ فیله مرغ و نان تست', approxCalories: 320 },
      { mealName: 'شام', foods: 'سیب‌زمینی تنوری (۲۰۰ گرم)، فیله مرغ یا ماهی قزل‌آلا، بروکلی و هویج پخته', approxCalories: 520 },
    ],
  },
  {
    id: 'nut-age-4',
    ageGroup: 'نوجوانان بزرگتر',
    ageRange: '۱۶ تا ۱۷ سال',
    focus: 'عملکرد حرفه‌ای، عضله‌سازی طبیعی و ریکاوری فواصل مسابقات',
    dailyCalories: 2600,
    description: 'شبیه‌سازی الگوی تغذیه آکادمی‌های حرفه‌ای اروپایی با تنظیم پروتئین ۱.۶ گرم به ازای هر کیلوگرم وزن بدن.',
    imageUrl: 'https://images.openai.com/static-rsc-4/FgrzbHTzLMdKYB9lsYoa788plRJ_KnqcCsebKqm0hB4Xl28b8GhNwcHvrW_B1DoOCj3T8W-5lipaq0z5plkA_u4atotvb_YzpZ87xIi6vDuhy94G-nr0lT15NbbvvxVCvu72KqWfnK0JfZEEzWa0xDqY0hjArcEtRm1fpbzChco?purpose=inline',
    keyNutrients: ['پروتئین کامل', 'آنتی‌اکسیدان‌ها', 'الکترولیت‌های ورزشی'],
    meals: [
      { mealName: 'صبحانه', foods: '۳ تخم‌مرغ (املت گوجه)، نان سنگک (۸۰ گرم)، شیر کم‌چرب (۲۵۰ میلی‌لیتر)', approxCalories: 510 },
      { mealName: 'میان‌وعده صبح', foods: 'موز، سیب، ۲۰ گرم گردو و ماست پروبیوتیک', approxCalories: 270 },
      { mealName: 'ناهار', foods: '۲۵۰ گرم برنج پخته، ۱۵۰ گرم سینه مرغ، سبزیجات بخارپز و ماست', approxCalories: 680 },
      { mealName: 'قبل از تمرین', foods: '۲ عدد خرما، نان تست با عسل طبیعی', approxCalories: 190 },
      { mealName: 'بعد از تمرین', foods: 'شیر کم‌چرب همراه با ساندویچ تخم‌مرغ و گوجه', approxCalories: 320 },
      { mealName: 'شام', foods: 'سیب‌زمینی آبپز یا ماکارونی، خوراک گوشت کم‌چرب، سالاد با روغن زیتون', approxCalories: 580 },
    ],
  },
  {
    id: 'nut-age-5',
    ageGroup: 'جوانان و بزرگسالان',
    ageRange: '۱۸ تا ۳۹ سال',
    focus: 'اوج توان بدنی، ریکاوری گلیکوژن و پایداری وزن مسابقه',
    dailyCalories: 2700,
    description: 'تنظیم ماکرونوترینت‌ها (۵۵٪ کربوهیدرات، ۲۵٪ پروتئین، ۲۰٪ چربی‌های غیراشباع) برای پوشش نیاز ۹۰ دقیقه بازی پرفشار.',
    imageUrl: 'https://images.openai.com/static-rsc-4/vDN8La4EFMSNIMGkBNo0U0hOzFBupj02KjB9hFauz8awlfBb-ikaJNut5XGdPT2fhD0uyiJI_VXN5SKu2n9xvvMK1qWQ2kRnugxx_grv_jaF_kzbwGZZ0kLSNsUoIMTYugpTaji2dyumK8fvgoRy_bsguOzTMs47sbzU5C88NqMI6W5nIiZKQGM5JVWMScxw?purpose=inline',
    keyNutrients: ['کربوهیدرات بارگذاری', 'پروتئین باکیفیت', 'اسیدهای چرب امگا ۳'],
    meals: [
      { mealName: 'صبحانه', foods: '۳ تخم‌مرغ کامل، ۱۰۰ گرم نان سنگک سبوس‌دار، ۳۰ گرم پنیر، گردو', approxCalories: 550 },
      { mealName: 'میان‌وعده', foods: 'یک عدد موز بزرگ، ۳۰ گرم بادام خام', approxCalories: 250 },
      { mealName: 'ناهار', foods: '۲۵۰ گرم برنج، ۱۸۰ گرم فیله مرغ یا گوشت کم‌چرب، سالاد شیرازی با روغن زیتون', approxCalories: 720 },
      { mealName: 'قبل از تمرین', foods: '۲ عدد خرما و یک عدد موز متوسط', approxCalories: 170 },
      { mealName: 'بعد از تمرین', foods: '۳۰۰ میلی‌لیتر شیر کم‌چرب و ساندویچ تخم‌مرغ آبپز', approxCalories: 330 },
      { mealName: 'شام', foods: 'خوراک ماهی یا مرغ، ۲۰۰ گرم سیب‌زمینی تنوری، سبزیجات فراوان', approxCalories: 580 },
      { mealName: 'قبل از خواب', foods: 'ماست ایسلندی (یونانی) و یک قاشق دانه چیا یا گردو', approxCalories: 160 },
    ],
  },
  {
    id: 'nut-age-6',
    ageGroup: 'بزرگسالان بالاتر و پیشکسوتان',
    ageRange: '۴۰ سال به بالا',
    focus: 'حفظ توده عضلانی (ضدسارکوپنی)، سلامت مفاصل، قلب و ریکاوری',
    dailyCalories: 2000,
    description: 'تمرکز بر پروتئین ضدالتهاب، امگا ۳ ماهی، کاهش قندهای ساده و هیدراتاسیون مداوم برای حفاظت از مفاصل.',
    imageUrl: 'https://images.openai.com/static-rsc-4/9L1k56NhCeuMW9vrjXBufTY8udk8bWP8DQEUGK3dt8jgC2notfCpmQd5yHGld-Mg9wWrGvlbhVtR2Vl2pwGve-CgkELfzNl4arBPg8FAlcXlczai7ArSKR_5qdCXfmKTCSB9MeKp52e4T2yod3jn2FgZfd3BKHW_7u6_bwRESf0?purpose=inline',
    keyNutrients: ['پروتئین آنتی‌کاتابولیک', 'کلسیم و ویتامین K2', 'فیبر محلول و سلامت قلب'],
    meals: [
      { mealName: 'صبحانه', foods: 'نان سبوس‌دار سنگک، پنیر کم‌نمک، گردو و یک لیوان شیر', approxCalories: 380 },
      { mealName: 'میان‌وعده', foods: 'یک عدد پرتقال و ۱۵ گرم بادام خام', approxCalories: 160 },
      { mealName: 'ناهار', foods: 'برنج کته (۱۵۰ گرم)، ماهی قزل‌آلا یا سالمون پخته (۱۵۰ گرم)، سالاد فصل با لیمو', approxCalories: 580 },
      { mealName: 'عصرانه', foods: 'ماست پروبیوتیک همراه توت یا خرما', approxCalories: 150 },
      { mealName: 'شام', foods: 'سوپ جو و سبزیجات همراه با سینه مرغ ریش‌ریش و نان سبوس‌دار', approxCalories: 450 },
    ],
  },
];

export const GOAL_NUTRITION_PLANS = [
  {
    id: 'goal-weight-gain',
    title: 'برنامه افزایش وزن و حجم عضلانی فوتبالیست (Weight Gain)',
    dailyCalories: 2800,
    target: 'افزایش تدریجی توده عضلانی با کربوهیدرات متراکم و پروتئین بالا',
    description: 'افزایش انرژی دریافتی به میزان ۲۰۰ تا ۳۰۰ کالری مازاد بر متابولیسم پایه، همراه با میان‌وعده‌های پرکالری سالم مانند کره بادام‌زمینی، مغزها و خرما.',
    imageUrl: 'https://images.openai.com/static-rsc-4/yb9Ou_NnVG0eszvxNJXobYfTdLBC0c0uHX5kGT5BfMtyal9L-ACOAd2uikiq_swX_yMD3qRYvMpxExqmQ8i9IK2bC9EVoKj19bwGOTz4kS_C_kIMTBDNsTj4f-8QGj8gbgFbUI2dSoxxNJtFohZuPYrzGuPWTGuP0a2qnLONqlk?purpose=inline',
    meals: [
      { mealName: 'صبحانه (۶۰۰ کالری)', foods: '۳ تخم‌مرغ، ۱۰۰ گرم نان سنگک، پنیر سنتی، گردو و یک لیوان شیر پرچرب' },
      { mealName: 'میان‌وعده صبح (۳۵۰ کالری)', foods: 'اسموتی شیر، موز، ۲ قاشق کره بادام‌زمینی و یک قاشق عسل' },
      { mealName: 'ناهار (۷۰۰ کالری)', foods: '۳۰۰ گرم برنج پخته، ۱۸۰ گرم سینه مرغ یا گوشت، سالاد و ماست پرچرب' },
      { mealName: 'قبل تمرین (۲۰۰ کالری)', foods: 'یک عدد موز و ۳ عدد خرما' },
      { mealName: 'بعد تمرین (۳۰۰ کالری)', foods: 'شیر و ساندویچ تخم‌مرغ با نان تست' },
      { mealName: 'شام (۵۰۰ کالری)', foods: 'سیب‌زمینی تنوری، خوراک گوشت و سبزیجات همراه نان سنگک' },
      { mealName: 'قبل خواب (۱۵۰ کالری)', foods: 'ماست یونانی با عسل و گردو' },
    ],
  },
  {
    id: 'goal-weight-manage',
    title: 'برنامه مدیریت و کاهش وزن اصولی فوتبالیست (Weight Management)',
    dailyCalories: 2025,
    target: 'کاهش چربی زیرپوستی با حفظ ۱۰۰٪ توده عضلانی و توان تمرین',
    description: 'کسری کالری ملایم با جایگزینی کربوهیدرات‌های فیبردار، پروتئین بالا جهت احساس سیری و پیشگیری از افت قند خون در تمرینات چابکی.',
    imageUrl: 'https://images.openai.com/static-rsc-4/4BI562Ja1kFPkD_z-ekZuaqQ2wUCquOHNzPHdqeeLcykbICh-wurLvDgd8f55MQjc7H6LJWGvT9QiOrnwzv3JMfLwXrL9JFQmShznJ8SzLvdzm0VS1ZhLc66-GYDEcUWaEvsE-3SVjgyFXYUBQIn2Im_b9OtgDGIho5kWH4BNMY?purpose=inline',
    meals: [
      { mealName: 'صبحانه (۴۰۰ کالری)', foods: '۲ تخم‌مرغ آبپز، ۶۰ گرم نان سنگک، پنیر کم‌چرب و خیار و گوجه' },
      { mealName: 'میان‌وعده صبح (۱۷۰ کالری)', foods: 'یک عدد سیب سبز و ۱۵ گرم بادام خام' },
      { mealName: 'ناهار (۵۵۰ کالری)', foods: '۱۸۰ گرم برنج کته، ۱۵۰ گرم سینه مرغ گریل، سالاد فراوان بدون سس' },
      { mealName: 'قبل تمرین (۱۰۵ کالری)', foods: 'یک عدد موز متوسط جهت تأمین فوری انرژی' },
      { mealName: 'بعد تمرین (۲۰۰ کالری)', foods: 'یک لیوان شیر کم‌چرب و ماست ایسلندی' },
      { mealName: 'شام (۵۰۰ کالری)', foods: 'ماهی قزل‌آلا یا سینه بوقلمون، سیب‌زمینی آبپز کوچک و سبزیجات بخارپز' },
    ],
  },
];

export const WORKOUT_TIMING_GUIDE = {
  preWorkout: {
    title: 'تغذیه قبل از تمرین فوتبال (۱ تا ۲ ساعت قبل)',
    purpose: 'تأمین قند خون پایدار، پر کردن ذخایر گلیکوژن و جلوگیری از احساس ضعف یا سنگینی معده',
    recommendations: [
      'یک عدد موز متوسط (زودهضم و سرشار از پتاسیم)',
      'نان تست یا سنگک همراه با یک قاشق عسل طبیعی',
      '۲ تا ۳ عدد خرما',
      'سیب‌زمینی آبپز کوچک بدون روغن',
      'ساندویچ کوچک نان و پنیر با آب فراوان',
    ],
    avoid: 'پرهیز از غذاهای چرب، فست‌فود و حبوبات نفاخ ۲ ساعت قبل از تمرین',
  },
  intraWorkout: {
    title: 'تغذیه حین تمرین فوتبال',
    purpose: 'جبران تعریق، پیشگیری از افت فشار خون و حفظ رفلکس‌های چابکی',
    recommendations: [
      'آب آشامیدنی خنک در فواصل استراحت هر ۱۵ دقیقه',
      'در تمرین‌های پرفشار بالای ۶۰ دقیقه: نوشیدنی ایزوتونیک حاوی مقدار اندکی نمک و قند طبیعی',
      'آب نارگیل طبیعی یا شربت رقیق آبلیمو و عسل',
    ],
    avoid: 'نوشیدن حجم زیاد آب به یکباره که موجب سنگینی معده می‌شود',
  },
  postWorkout: {
    title: 'تغذیه بعد از تمرین فوتبال (پنجره آنابولیک ۳۰ تا ۴۵ دقیقه اول)',
    purpose: 'ترمیم پارگی‌های میکروسکوپی تار عضلانی و شارژ مجدد ذخایر گلیکوژن کبد و عضلات',
    recommendations: [
      'شیر کم‌چرب همراه با موز یا پودر کاکائو طبیعی (نسبت ایده‌آل کربوهیدرات به پروتئین ۴ به ۱)',
      'برنج کته با سینه مرغ یا فیله ماهی',
      'ساندویچ تخم‌مرغ آبپز و نان سنگک',
      'ماست یونانی با پوره سیب‌زمینی و خیار',
    ],
    avoid: 'به تأخیر انداختن وعده ریکاوری بعد از تمرین به بیش از ۲ ساعت',
  },
};

export const IRANIAN_FOOD_DATABASE: FoodCalorieItem[] = [
  // نان و غلات
  { id: 'f-1', name: 'نان سنگک', category: 'نان و غلات', portion: '۱۰۰ گرم', calories: 260 },
  { id: 'f-2', name: 'نان بربری', category: 'نان و غلات', portion: '۱۰۰ گرم', calories: 270 },
  { id: 'f-3', name: 'نان لواش', category: 'نان و غلات', portion: '۱۰۰ گرم', calories: 290 },
  { id: 'f-4', name: 'نان تافتون', category: 'نان و غلات', portion: '۱۰۰ گرم', calories: 270 },
  { id: 'f-5', name: 'برنج پخته (کته)', category: 'نان و غلات', portion: '۱۰۰ گرم', calories: 130 },
  { id: 'f-6', name: 'ماکارونی پخته', category: 'نان و غلات', portion: '۱۰۰ گرم', calories: 158 },
  { id: 'f-7', name: 'جو دوسر پرک', category: 'نان و غلات', portion: '۱۰۰ گرم', calories: 389 },
  { id: 'f-8', name: 'سیب‌زمینی آبپز', category: 'نان و غلات', portion: '۱۰۰ گرم', calories: 87 },
  { id: 'f-9', name: 'نان تست', category: 'نان و غلات', portion: '۱۰۰ گرم', calories: 265 },

  // پروتئین‌ها
  { id: 'f-10', name: 'تخم‌مرغ کامل', category: 'پروتئین‌ها', portion: '۱ عدد', calories: 70 },
  { id: 'f-11', name: 'سینه مرغ پخته', category: 'پروتئین‌ها', portion: '۱۰۰ گرم', calories: 165 },
  { id: 'f-12', name: 'گوشت گوساله کم‌چرب پخته', category: 'پروتئین‌ها', portion: '۱۰۰ گرم', calories: 200 },
  { id: 'f-13', name: 'ماهی قزل‌آلا پخته', category: 'پروتئین‌ها', portion: '۱۰۰ گرم', calories: 130 },
  { id: 'f-14', name: 'تن ماهی آبکش‌شده', category: 'پروتئین‌ها', portion: '۱۰۰ گرم', calories: 130 },
  { id: 'f-15', name: 'عدس پخته', category: 'پروتئین‌ها', portion: '۱۰۰ گرم', calories: 116 },
  { id: 'f-16', name: 'لوبیا چیتی پخته', category: 'پروتئین‌ها', portion: '۱۰۰ گرم', calories: 127 },
  { id: 'f-17', name: 'نخود پخته', category: 'پروتئین‌ها', portion: '۱۰۰ گرم', calories: 164 },

  // لبنیات
  { id: 'f-18', name: 'شیر کم‌چرب', category: 'لبنیات', portion: '۲۵۰ میلی‌لیتر (یک لیوان)', calories: 115 },
  { id: 'f-19', name: 'شیر پرچرب', category: 'لبنیات', portion: '۲۵۰ میلی‌لیتر', calories: 150 },
  { id: 'f-20', name: 'ماست معمولی', category: 'لبنیات', portion: '۱۰۰ گرم', calories: 60 },
  { id: 'f-21', name: 'ماست یونانی / ایسلندی', category: 'لبنیات', portion: '۱۰۰ گرم', calories: 90 },
  { id: 'f-22', name: 'پنیر سفید سنتی', category: 'لبنیات', portion: '۳۰ گرم', calories: 80 },
  { id: 'f-23', name: 'دوغ سنتی بدون گاز', category: 'لبنیات', portion: '۲۵۰ میلی‌لیتر', calories: 60 },

  // میوه‌ها
  { id: 'f-24', name: 'موز متوسط', category: 'میوه‌ها', portion: '۱ عدد', calories: 105 },
  { id: 'f-25', name: 'سیب متوسط', category: 'میوه‌ها', portion: '۱ عدد', calories: 95 },
  { id: 'f-26', name: 'پرتقال متوسط', category: 'میوه‌ها', portion: '۱ عدد', calories: 60 },
  { id: 'f-27', name: 'خرما مضافتی', category: 'میوه‌ها', portion: '۱ عدد', calories: 23 },
  { id: 'f-28', name: 'کیوی', category: 'میوه‌ها', portion: '۱ عدد', calories: 45 },
  { id: 'f-29', name: 'انگور', category: 'میوه‌ها', portion: '۱۰۰ گرم', calories: 69 },
  { id: 'f-30', name: 'هندوانه', category: 'میوه‌ها', portion: '۱۰۰ گرم', calories: 30 },
  { id: 'f-31', name: 'خربزه', category: 'میوه‌ها', portion: '۱۰۰ گرم', calories: 34 },

  // مغزها و چربی‌های مفید
  { id: 'f-32', name: 'گردو', category: 'مغزها و چربی‌های مفید', portion: '۱۰ گرم', calories: 65 },
  { id: 'f-33', name: 'بادام درختی', category: 'مغزها و چربی‌های مفید', portion: '۱۰ گرم', calories: 58 },
  { id: 'f-34', name: 'پسته', category: 'مغزها و چربی‌های مفید', portion: '۱۰ گرم', calories: 56 },
  { id: 'f-35', name: 'کره بادام‌زمینی', category: 'مغزها و چربی‌های مفید', portion: '۱ قاشق غذاخوری', calories: 95 },
  { id: 'f-36', name: 'روغن زیتون فرابکر', category: 'مغزها و چربی‌های مفید', portion: '۱ قاشق غذاخوری', calories: 119 },
  { id: 'f-37', name: 'ارده کنجد', category: 'مغزها و چربی‌های مفید', portion: '۱ قاشق غذاخوری', calories: 90 },
  { id: 'f-38', name: 'کنجد خام', category: 'مغزها و چربی‌های مفید', portion: '۱۰ گرم', calories: 57 },
];
