import { API_BASE_URL } from '@/lib/api';
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
  coachTitle?: string;
  rating: number;
  studentsCount: number;
  drillsSummary: string[];
  videoUrl?: string;
  thumbnailUrl?: string;
  imageUrl?: string;
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
    "id": "prog-1794729612105",
    "title": "برنامه تست سرعت و چابکی با ویدیو",
    "coachName": "استاد حمید درخشان",
    "coachTitle": "سرمربی آکادمی",
    "goal": "توسعه شتاب و چابکی تخصصی و تست رکوردهای سرعتی",
    "difficulty": "پیشرفته",
    "ageGroup": "تمامی رده‌ها",
    "durationWeeks": 4,
    "sessionsPerWeek": 3,
    "equipment": ["توپ فوتبال", "مخروط"],
    "description": "برنامه تست تخصصی سرعت و چابکی به همراه ویدیوی آموزشی اضافه شده از پنل مدیریت",
    "price": "رایگان",
    "priceNumber": 0,
    "isFree": true,
    "studentsCount": 45,
    "rating": 5,
    "videoUrl": "/uploads/1795327247084-C63495EC-5FAC-443D-8C87-97E8EDD4FF88.mp4",
    "imageUrl": "https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=600&q=80",
    "totalSessions": 12,
    "drillsSummary": ["شتاب گام اول", "نردبان چابکی", "تست سرعت ۵-۱۰-۵", "تغییر مسیر انفجاری"],
  },
  {
    "id": "prog-1794729591094",
    "title": "برنامه تست سرعت و چابکی پایه‌ای",
    "coachName": "استاد حمید درخشان",
    "coachTitle": "سرمربی آکادمی",
    "goal": "توسعه شتاب و چابکی پایه و بهبود هماهنگی عصب و عضله",
    "difficulty": "متوسط",
    "ageGroup": "تمامی رده‌ها",
    "durationWeeks": 4,
    "sessionsPerWeek": 3,
    "equipment": ["توپ فوتبال", "مخروط"],
    "description": "پروتکل تمرینات پایه چابکی با تأکید بر فرکانس پای بالا و استارت‌های انفجاری",
    "price": "رایگان",
    "priceNumber": 0,
    "isFree": true,
    "studentsCount": 38,
    "rating": 5,
    "videoUrl": "/uploads/1795327270453-188C1646-FB83-4F65-B537-18EC2F7C8145.mp4",
    "imageUrl": "https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=600&q=80",
    "totalSessions": 12,
    "drillsSummary": ["شتاب گام اول", "نردبان چابکی"],
  },
  {
    id: 'ready-plan-free-football',
    title: 'برنامه آمادگی بدنی و لمس توپ فرست تاچ',
    ageGroup: 'تمامی رده‌ها',
    price: 'رایگان',
    priceNumber: 0,
    durationWeeks: 4,
    sessionsPerWeek: 3,
    totalSessions: 12,
    difficulty: 'متوسط',
    goal: 'تقویت لمس اول، چابکی فرکانسی و هماهنگی عصبی عضلانی فوتبال',
    description: 'برنامه پایه استاندارد آکادمی فرست تاچ شامل ۱۲ جلسه تقویمی با ویدیو و چک‌لیست حرکات.',
    equipment: ['توپ فوتبال', 'مخروط', 'نردبان چابکی'],
    coachName: 'کادر فنی فرست تاچ',
    rating: 4.9,
    studentsCount: 650,
    videoUrl: '/uploads/1795328024187-3E954364-7B55-4A71-9B41-04BC81B80308.mp4',
    drillsSummary: ['شتاب گام اول', 'نردبان چابکی', 'دریبل مارپیچ', 'پاس تک‌ضرب'],
    isFree: true,
  },
  {
    id: 'prog-1',
    title: 'افزایش سرعت و شتاب انفجاری در فوتبال',
    coachName: 'استاد حمید درخشان',
    goal: 'افزایش توان استارت ۵ تا ۱۵ متری، چابکی فرار از خط آفساید و کاهش زمان واکنش',
    difficulty: 'متوسط',
    ageGroup: 'جوانان (۱۶ تا ۱۹ سال)',
    durationWeeks: 4,
    sessionsPerWeek: 3,
    totalSessions: 12,
    equipment: ['مخروط‌های نشانگر', 'نردبان چابکی', 'کرنومتر'],
    description: 'این برنامه بر اساس متدهای پیشرفته شتاب‌گیری و فرکانس گام فوتبال مدرن طراحی شده و در ۴ هفته رکوردهای سرعتی شما را به شکل چشمگیری بهبود می‌بخشد.',
    price: '۱۹۹,۰۰۰ تومان',
    priceNumber: 199000,
    isFree: false,
    studentsCount: 28,
    rating: 4.9,
    videoUrl: '/uploads/1795327247084-C63495EC-5FAC-443D-8C87-97E8EDD4FF88.mp4',
    imageUrl: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=600&q=80',
    drillsSummary: ['شتاب اولیه', 'واکنش به محرک', 'شاتل ۵-۱۰-۵', 'ترمز و تغییر جهت'],
  },
  {
    id: 'prog-2',
    title: 'افزایش قدرت بدنی با وزن بدن برای فوتبالیست',
    coachName: 'دکتر علیرضا سلیمانی',
    goal: 'تقویت تنه، همسترینگ، چهارسر و ثبات مچ و زانو بدون نیاز به دمبل و وزنه',
    difficulty: 'مبتدی',
    ageGroup: 'تمامی رده‌ها',
    durationWeeks: 6,
    sessionsPerWeek: 3,
    totalSessions: 18,
    equipment: ['وزن بدن', 'زیرانداز ورزشی'],
    description: 'تمرینات ساختاری و کاربردی وزن بدن شامل اسکوات‌های تخصصی، نوردیک همسترینگ، پل‌های باسن و پلانک‌های ضدچرخش متناسب با فشارهای مسابقه فوتبال.',
    price: 'رایگان',
    priceNumber: 0,
    isFree: true,
    studentsCount: 94,
    rating: 4.8,
    videoUrl: '/uploads/1795327270453-188C1646-FB83-4F65-B537-18EC2F7C8145.mp4',
    drillsSummary: ['نوردیک همسترینگ', 'اسکوات فانکشنال', 'ثبات مرکزی کور'],
  },
  {
    id: 'prog-3',
    title: 'بهبود تکنیک فردی، لمس اول و دریبلینگ در فضاهای فشرده',
    coachName: 'مربی پیام صادقیان',
    goal: 'مهار جهت‌دار توپ، تسلط بر هر دو پا، حرکات کرویف و خروج از پرس مدافعان',
    difficulty: 'متوسط',
    ageGroup: 'نوجوانان (۱۲ تا ۱۵ سال)',
    durationWeeks: 8,
    sessionsPerWeek: 4,
    totalSessions: 32,
    equipment: ['توپ فوتبال شماره ۴ یا ۵', 'مخروط‌های کله‌قندی', 'دیوار یا ریباندر'],
    description: '۸ هفته تمرین فشرده روزانه لمس توپ با بیش از ۱۰۰۰ تماس در هر جلسه برای ساخت حافظه عضلانی ناخودآگاه در کنترل و ارسال پاس.',
    price: '۱۹۹,۰۰۰ تومان',
    priceNumber: 199000,
    isFree: false,
    studentsCount: 52,
    rating: 5.0,
    videoUrl: '/uploads/1795327354521-ECF2C5EF-5D1C-4398-B624-2E4FE9FE1DF5.mp4',
    drillsSummary: ['لمس اول جهت‌دار', 'دریبل مارپیچ', 'حرکت کرویف', 'کنترل هوایی'],
  },
  {
    id: 'prog-4',
    title: 'افزایش چابکی تخصصی و رفلکس‌های چندجهته',
    coachName: 'استاد مهدی مهدوی‌کیا',
    goal: 'حداکثرسازی چابکی بدون توپ، هماهنگی عصبی و رفلکس گام در کورس‌های سرعتی',
    difficulty: 'پیشرفته',
    ageGroup: 'جوانان (۱۶ تا ۱۹ سال)',
    durationWeeks: 4,
    sessionsPerWeek: 4,
    totalSessions: 16,
    equipment: ['نردبان چابکی', 'مخروط‌های رنگی', 'موانع کوتاه'],
    description: 'این برنامه به صورت تخصصی بر تمرینات آینه‌ای، ایکی شافل، برش‌های تند ۴۵ و ۹۰ درجه و تغییر جهت‌های واکنشی تمرکز دارد.',
    price: '۱۹۹,۰۰۰ تومان',
    priceNumber: 199000,
    isFree: false,
    studentsCount: 41,
    rating: 4.9,
    videoUrl: '/uploads/1795327449051-07FA6972-DC08-426A-8636-BD7DB1DAC477.mp4',
    drillsSummary: ['ایکی شافل', 'برش‌های زاویه‌دار', 'سرعت واکنش', 'دریبلینگ انفجاری'],
  },
  {
    id: 'prog-5',
    title: 'آمادگی جسمانی، استقامت و پیش‌فصل حرفه‌ای فوتبال',
    coachName: 'دکتر محسن رضایی',
    goal: 'ایجاد پایه استقامت ۹۰ دقیقه‌ای، بازتوانی قلبی عروقی و پیشگیری از مصدومیت فصل',
    difficulty: 'پیشرفته',
    ageGroup: 'بزرگسالان (+۱۹ سال)',
    durationWeeks: 8,
    sessionsPerWeek: 5,
    totalSessions: 40,
    equipment: ['زمین چمن', 'مخروط‌ها', 'طناب سرعتی', 'موانع'],
    description: 'پروتکل جامع پیش‌فصل شامل تست‌های یویو، اینتروال‌های شدید بی‌هوازی، تمرینات کپنهاگ کشاله ران و مسابقات فشرده ابعاد کوچک.',
    price: '۱۹۹,۰۰۰ تومان',
    priceNumber: 199000,
    isFree: false,
    studentsCount: 37,
    rating: 4.9,
    videoUrl: '/uploads/1795327581772-9066C8B2-F712-47F9-B2FF-F7CAEE3F55F2.mp4',
    drillsSummary: ['تست یویو', 'تمرینات کپنهاگ', 'اینتروال شدید', 'ریکاوری فعال'],
  },
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
    videoUrl: '/uploads/1795328370919-D5E3B0A0-7933-43C2-831D-0099B9E47D26.mp4',
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
    videoUrl: '/uploads/1795328492965-F5288CA7-137D-4535-8433-9FCE3E764367.mp4',
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
    videoUrl: '/uploads/1795328615717-451CA789-1BB6-4C2D-82F5-EDA57648251E.mp4',
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
    videoUrl: '/uploads/1795328728584-D5774462-9F86-4D86-B4D6-86A1EA4F9468.mp4',
    drillsSummary: ['RSA فوتبال ۹۰ دقیقه', 'شیرجه و انتقال موقعیت', 'شوت‌زنی بعد از استارت ۴۰ متری', 'حرکات ضد مصدومیت کشاله'],
  },
];

const DEFAULT_READY_NUTRITION_PLANS: ReadyNutritionPlan[] = [
  {
    id: 'plan-free-football',
    title: 'برنامه اصولی فرست تاچ (استاندارد فوتبالیست‌ها)',
    ageGroup: 'تمامی رده‌ها',
    price: 'رایگان',
    priceNumber: 0,
    dailyCalories: 2350,
    goal: 'تغذیه بهینه مسابقه و ریکاوری با پروتئین و املاح استاندارد',
    focus: '۱۳۵ گرم پروتئین • ۲۷۵ گرم کربوهیدرات • ۶۲ گرم چربی',
    description: 'رژیم استاندارد ۵ وعده‌ای فوتبالیست شامل نان سنگک، تخم‌مرغ، مرغ، ماهی، جو دوسر و مغزها',
    mealsSummary: [
      { name: 'صبحانه', food: 'نان سنگک، ۲ تخم‌مرغ عسلی، پنیر سفید و گردو', time: '۰۸:۰۰' },
      { name: 'میان‌وعده صبح', food: 'سیب درختی، ۳ عدد خرما پیارم و مغز بادام', time: '۱۱:۰۰' },
      { name: 'ناهار', food: 'زرشک‌پلو با سینه مرغ پخته، ماست پروتئینی و سالاد زیتون', time: '۱۴:۰۰' },
      { name: 'میان‌وعده عصر', food: 'موز، ۱ قاشق کره بادام‌زمینی و اوتمیل شیر کم‌چرب', time: '۱۷:۳۰' },
      { name: 'شام', food: 'فیله مرغ یا سالمون گریل با سیب‌زمینی تنوری و بروکلی', time: '۲۱:۰۰' },
    ],
  },
  {
    id: 'plan-ready-growth',
    title: 'برنامه آماده رشد قد و عضله‌سازی (نوجوانان و جوانان)',
    ageGroup: 'نوجوانان (۱۲ تا ۱۵ سال)',
    price: '۱۹۹,۰۰۰ تومان',
    priceNumber: 199000,
    dailyCalories: 2500,
    goal: 'تغذیه صفحات رشد، افزایش تراکم استخوان و هایپرتروفی عضلانی',
    focus: '۱۴۵ گرم پروتئین • ۲۹۰ گرم کربوهیدرات • ۶۵ گرم چربی',
    description: 'غنی از کلسیم، املاح و پروتئین باکیفیت برای تغذیه صفحات رشد و توان انفجاری',
    mealsSummary: [
      { name: 'صبحانه', food: 'املت گوجه با ۲ تخم‌مرغ، ۲ کف دست سنگک و شیر', time: '۰۸:۰۰' },
      { name: 'میان‌وعده', food: '۱ لیوان شیرموز خانگی با ۳ عدد خرما پیارم', time: '۱۱:۰۰' },
      { name: 'ناهار', food: 'چلو راسته گوساله یا مرغ با برنج ایرانی و گوجه', time: '۱۴:۰۰' },
      { name: 'عصرانه', food: 'نان تست جو با کره بادام‌زمینی، عسل و دانه چیا', time: '۱۷:۰۰' },
      { name: 'شام', food: 'پاستا سبوس‌دار با سس گوجه تازه و فیله گریل', time: '۲۱:۰۰' },
    ],
  },
  {
    id: 'plan-ready-fatloss',
    title: 'برنامه آماده کات و چربی‌سوزی حرفه‌ای فوتبال',
    ageGroup: 'جوانان (۱۶ تا ۱۹ سال)',
    price: '۱۹۹,۰۰۰ تومان',
    priceNumber: 199000,
    dailyCalories: 2100,
    goal: 'کاهش درصد چربی زیرپوستی و حفظ کامل حجم عضلانی و سرعت',
    focus: '۱۶۰ گرم پروتئین • ۱۹۰ گرم کربوهیدرات • ۵۰ گرم چربی',
    description: 'برنامه چربی‌سوزی تخصصی ورزشکاران فوتبال بدون افت انرژی و شتاب اولیه',
    mealsSummary: [
      { name: 'صبحانه', food: '۳ سفیده تخم‌مرغ + ۱ زرده، اوتمیل دارچینی با آب/شیر بادام', time: '۰۸:۰۰' },
      { name: 'میان‌وعده', food: 'سیب سبز همراه با ۱۰ عدد بادام خام', time: '۱۱:۰۰' },
      { name: 'ناهار', food: 'سینه بوقلمون گریل‌شده با کینوا و سبزیجات بخارپز', time: '۱۴:۰۰' },
      { name: 'عصرانه', food: 'شیک پروتئینی خانگی با شیر کم‌چرب و قهوه اسپرسو', time: '۱۷:۳۰' },
      { name: 'شام', food: 'ماهی سالمون بخارپز با کلم بروکلی، مارچوبه و اسفناج', time: '۲۱:۰۰' },
    ],
  },
  {
    id: 'plan-ready-adults',
    title: 'برنامه تغذیه قهرمانی و انرژی پایدار (بزرگسالان)',
    ageGroup: 'بزرگسالان (+۱۹ سال)',
    price: '۱۹۹,۰۰۰ تومان',
    priceNumber: 199000,
    dailyCalories: 2600,
    goal: 'تأمین ذخایر گلیکوژن ۹۰ دقیقه مسابقه و ریکاوری سریع بافت عضلانی',
    focus: '۱۵۵ گرم پروتئین • ۳۱۰ گرم کربوهیدرات • ۷۰ گرم چربی',
    description: 'طراحی شده برای بازیکنان مسابقات رسمی و لیگ ۹۰ دقیقه‌ای',
    mealsSummary: [
      { name: 'صبحانه', food: 'نان جو دوسر، ۳ تخم‌مرغ، آووکادو و پنیر سفید', time: '۰۸:۰۰' },
      { name: 'میان‌وعده', food: 'اسموتی اسفناج، موز، پروتئین وی و بادام', time: '۱۱:۰۰' },
      { name: 'ناهار', food: 'استیک فیله یا سینه بوقلمون با برنج قهوه‌ای و زیتون', time: '۱۴:۰۰' },
      { name: 'عصرانه قبل تمرین', food: 'سیب‌زمینی شیرین پخته با مقداری عسل طبیعی', time: '۱۷:۳۰' },
      { name: 'شام ریکاوری', food: 'ماهی قزل‌آلا کبابی با سبزیجات فصلی و روغن زیتون بکر', time: '۲۱:۰۰' },
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
      if (Array.isArray(parsed) && parsed.length > 0) {
        const cleaned = parsed.filter(
          (p: ReadyTrainingPlan) => p && p.id && !deletedIds.includes(p.id)
        );
        const storedIds = new Set(cleaned.map((p) => p.id));
        const remaining = DEFAULT_READY_TRAINING_PLANS.filter((p) => !deletedIds.includes(p.id) && !storedIds.has(p.id));
        return [...cleaned, ...remaining];
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
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('ft_programs_updated'));
    }
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

  // Sync to API
  try {
    fetch(`${API_BASE_URL}/programs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPlan),
    }).catch(() => {});
  } catch {}

  return newPlan;
};

export const syncProgramsWithServer = async (): Promise<ReadyTrainingPlan[]> => {
  try {
    const res = await fetch(`${API_BASE_URL}/programs`);
    if (res.ok) {
      const serverPrograms: any[] = await res.json();
      if (Array.isArray(serverPrograms) && serverPrograms.length > 0) {
        const deletedIds = getDeletedPlanIds();
        const mapped: ReadyTrainingPlan[] = serverPrograms
          .filter(
            (p) =>
              !deletedIds.includes(p.id) &&
              !p.title?.includes('تست') &&
              !p.title?.toLowerCase().includes('test') &&
              !p.description?.includes('تستی')
          )
          .map((p) => ({
            id: p.id,
            title: p.title,
            coachName: p.coachName,
            coachTitle: p.coachTitle || 'مربی رسمی فرست تاچ',
            price: p.price || (p.isFree ? 'رایگان' : '۱۹۹,۰۰۰ تومان'),
            priceNumber: p.priceNumber || (p.price === 'رایگان' || p.isFree ? 0 : 199000),
            durationWeeks: p.durationWeeks || 4,
            sessionsPerWeek: p.sessionsPerWeek || 3,
            totalSessions: p.totalSessions || 12,
            difficulty: p.difficulty || 'متوسط',
            goal: p.goal || '',
            description: p.description || '',
            equipment: p.equipment || ['توپ', 'مخروط'],
            rating: p.rating || 5.0,
            studentsCount: p.studentsCount || 1,
            drillsSummary: p.drillsSummary || [],
            videoUrl: p.videoUrl || undefined,
            isFree: p.isFree ?? (p.price === 'رایگان'),
            ageGroup: p.ageGroup || 'تمامی رده‌ها',
            schedule: p.schedule || [],
            isCustomAdminCreated: true,
          }));

        const serverIds = new Set(mapped.map((m) => m.id));
        const merged = [...mapped, ...DEFAULT_READY_TRAINING_PLANS.filter((d) => !serverIds.has(d.id))];
        saveReadyTrainingPlans(merged);
        return merged;
      }
    }
  } catch (err) {
    console.warn('Failed to sync programs with server', err);
  }
  return getReadyTrainingPlans();
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
    fetch(`${API_BASE_URL}/programs/sync`, {
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
    fetch(`${API_BASE_URL}/programs/${id}`, { method: 'DELETE' }).catch(() => {});
  } catch {}
};

export const getReadyNutritionPlans = (): ReadyNutritionPlan[] => {
  const deletedIds = getDeletedPlanIds();
  try {
    const raw = localStorage.getItem(NUTRITION_STORAGE_KEY);
    if (raw !== null) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
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
