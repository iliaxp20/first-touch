export interface ProgramSession {
  dayName: string; // شنبه، دوشنبه، چهارشنبه، پنج‌شنبه
  title: string;
  focus: string;
  durationMinutes: number;
  completed: boolean;
  drillsCount: number;
}

export interface TrainingProgramItem {
  id: string;
  title: string;
  coachName: string;
  coachTitle: string;
  goal: string;
  difficulty: 'مبتدی' | 'متوسط' | 'پیشرفته';
  ageGroup: string;
  durationWeeks: number;
  sessionsPerWeek: number;
  equipment: string[];
  description: string;
  price: string;
  isFree: boolean;
  studentsCount: number;
  rating: number;
  imageUrl?: string;
  completedSessions: number;
  totalSessions: number;
  schedule: {
    weekNumber: number;
    sessions: ProgramSession[];
  }[];
}

export const INITIAL_TRAINING_PROGRAMS: TrainingProgramItem[] = [
  {
    id: 'prog-1',
    title: 'افزایش سرعت و شتاب انفجاری در فوتبال',
    coachName: 'استاد حمید درخشان',
    coachTitle: 'مربی بدنساز دارای مدرک A آسیا',
    goal: 'افزایش توان استارت ۵ تا ۱۵ متری، چابکی فرار از خط آفساید و کاهش زمان واکنش',
    difficulty: 'متوسط',
    ageGroup: 'نوجوانان و جوانان (۱۴ سال به بالا)',
    durationWeeks: 4,
    sessionsPerWeek: 3,
    equipment: ['مخروط‌های نشانگر', 'نردبان چابکی', 'کرنومتر'],
    description: 'این برنامه بر اساس متدهای پیشرفته شتاب‌گیری و فرکانس گام فوتبال مدرن طراحی شده و در ۴ هفته رکوردهای سرعتی شما را به شکل چشمگیری بهبود می‌بخشد.',
    price: '۳۹۰,۰۰۰ تومان',
    isFree: false,
    studentsCount: 28,
    rating: 4.9,
    imageUrl: 'https://images.openai.com/static-rsc-4/57Fxx5YigrvTD5plecW8SeNc4w8CPdQkPYMimsdhsM8qDK3EbwD-v0WLOjaqiF9q_2x_Ewakc6pwZVPc7jZnZrBIA05SsSxJT4j68XVdWfjgKXXDbFXrey8xPwC-h7FFUo4XxODM4OpxXi24UUu4NwEV8sJLTD7JTyKaJMNs1o0?purpose=inline',
    completedSessions: 4,
    totalSessions: 12,
    schedule: [
      {
        weekNumber: 1,
        sessions: [
          { dayName: 'شنبه', title: 'تمرین چابکی و تغییر جهت ۴۵ درجه', focus: 'شتاب اولیه و گام اول', durationMinutes: 45, completed: true, drillsCount: 5 },
          { dayName: 'دوشنبه', title: 'تمرین سرعت واکنش به سوت و رنگ', focus: 'شروع انفجاری و زمان واکنش', durationMinutes: 40, completed: true, drillsCount: 4 },
          { dayName: 'چهارشنبه', title: 'تمرین هماهنگی نردبان و شاتل ۵-۱۰-۵', focus: 'ریتم فرکانس پا', durationMinutes: 50, completed: false, drillsCount: 6 },
        ],
      },
      {
        weekNumber: 2,
        sessions: [
          { dayName: 'شنبه', title: 'تغییر مسیر ۹۰ درجه با ترمز فوری', focus: 'توان برون‌گرا و ترمز', durationMinutes: 45, completed: false, drillsCount: 5 },
          { dayName: 'دوشنبه', title: 'دویدن‌های منحنی و عبور مارپیچ', focus: 'سرعت زاویه‌ای', durationMinutes: 45, completed: false, drillsCount: 4 },
          { dayName: 'چهارشنبه', title: 'شتاب انفجاری ۲۰ متری با محرک دیداری', focus: 'بیشینه سرعت', durationMinutes: 50, completed: false, drillsCount: 5 },
        ],
      },
    ],
  },
  {
    id: 'prog-2',
    title: 'افزایش قدرت بدنی با وزن بدن برای فوتبالیست',
    coachName: 'دکتر علیرضا سلیمانی',
    coachTitle: 'متخصص فیزیولوژی ورزشی آکادمی ملی فوتبال',
    goal: 'تقویت تنه، همسترینگ، چهارسر و ثبات مچ و زانو بدون نیاز به دمبل و وزنه',
    difficulty: 'مبتدی',
    ageGroup: 'عمومی (۱۰ سال به بالا)',
    durationWeeks: 6,
    sessionsPerWeek: 3,
    equipment: ['وزن بدن', 'زیرانداز ورزشی'],
    description: 'تمرینات ساختاری و کاربردی وزن بدن شامل اسکوات‌های تخصصی، نوردیک همسترینگ، پل‌های باسن و پلانک‌های ضدچرخش متناسب با فشارهای مسابقه فوتبال.',
    price: 'رایگان',
    isFree: true,
    studentsCount: 94,
    rating: 4.8,
    imageUrl: 'https://images.openai.com/static-rsc-4/CxfOtg9pGWQInGVDGNI8acyWURpQO5JrF-74ajR5bbizzZ0g4V88M-4EAxTUKeyFyHhxSLAAu98RHQ9Y_SDVD51oEkmb2l3IzkiMNfJfNDEMcWYZodnobofAp_9mqLPdFFI9CGItFTsaR3WpLHJymTnyx7Q3J9Ar17PRjouAuQI?purpose=inline',
    completedSessions: 6,
    totalSessions: 18,
    schedule: [
      {
        weekNumber: 1,
        sessions: [
          { dayName: 'شنبه', title: 'تقویت زنجیره خلفی و تعادل تک‌پا', focus: 'همسترینگ و پل باسن', durationMinutes: 40, completed: true, drillsCount: 5 },
          { dayName: 'دوشنبه', title: 'ثبات مرکزی و پلانک‌های ایزومتریک', focus: 'عضلات شکم و مفاصل ستون فقرات', durationMinutes: 35, completed: true, drillsCount: 4 },
          { dayName: 'چهارشنبه', title: 'اسکوات‌های فانکشنال و تقویت چهارسر', focus: 'قدرت پایین‌تنه', durationMinutes: 45, completed: true, drillsCount: 5 },
        ],
      },
      {
        weekNumber: 2,
        sessions: [
          { dayName: 'شنبه', title: 'لانج‌های چندجهته و تثبیت زانو', focus: 'تعادل حرکتی', durationMinutes: 40, completed: false, drillsCount: 5 },
          { dayName: 'دوشنبه', title: 'شنای سوئدی و قدرت کمربند شانه‌ای', focus: 'تنه و بالاتنه دفاعی', durationMinutes: 40, completed: false, drillsCount: 4 },
          { dayName: 'چهارشنبه', title: 'مدار قدرتی تک‌پای فوتبال', focus: 'هماهنگی عصب و عضله', durationMinutes: 45, completed: false, drillsCount: 6 },
        ],
      },
    ],
  },
  {
    id: 'prog-3',
    title: 'بهبود تکنیک فردی، لمس اول و دریبلینگ در فضاهای فشرده',
    coachName: 'مربی پیام صادقیان',
    coachTitle: 'مدرس تکنیک و مهارت‌های فردی فوتبال',
    goal: 'مهار جهت‌دار توپ، تسلط بر هر دو پا، حرکات کرویف و خروج از پرس مدافعان',
    difficulty: 'متوسط',
    ageGroup: 'نونهالان تا بزرگسالان',
    durationWeeks: 8,
    sessionsPerWeek: 4,
    equipment: ['توپ فوتبال شماره ۴ یا ۵', 'مخروط‌های کله‌قندی', 'دیوار یا ریباندر'],
    description: '۸ هفته تمرین فشرده روزانه لمس توپ با بیش از ۱۰۰۰ تماس در هر جلسه برای ساخت حافظه عضلانی ناخودآگاه در کنترل و ارسال پاس.',
    price: '۴۹۰,۰۰۰ تومان',
    isFree: false,
    studentsCount: 52,
    rating: 5.0,
    imageUrl: 'https://images.openai.com/static-rsc-4/cUkZqoO26WIfrDnkmfFWU7rcT1Qj6dt1LWBB8oQsg118YwUWlmKeveCjHKphVdRNyk0iUTOVxozdPSfyWcS5xsJ0-nHIP5byNAiwF3DaJu802puLB25z0JB3WZ5Vup9qSNGrywekTnXOXLmcxPbLyVDS6yPyeDKUt4k2O8WQqdM?purpose=inline',
    completedSessions: 8,
    totalSessions: 32,
    schedule: [
      {
        weekNumber: 1,
        sessions: [
          { dayName: 'شنبه', title: 'لمس اول با بغل پای موافق و مخالف', focus: 'دقت کنترل استپ اول', durationMinutes: 45, completed: true, drillsCount: 6 },
          { dayName: 'یکشنبه', title: 'دریبل مارپیچ با بیرون و داخل پا', focus: 'چسبندگی توپ به پا', durationMinutes: 40, completed: true, drillsCount: 5 },
          { dayName: 'سه‌شنبه', title: 'حرکت کرویف و کشیدن توپ به عقب', focus: 'فریب‌های جهتی', durationMinutes: 45, completed: true, drillsCount: 5 },
          { dayName: 'پنج‌شنبه', title: 'کنترل توپ‌های هوایی با سینه و روی پا', focus: 'تعادل فرود توپ', durationMinutes: 50, completed: false, drillsCount: 6 },
        ],
      },
    ],
  },
  {
    id: 'prog-4',
    title: 'افزایش چابکی تخصصی و رفلکس‌های چندجهته',
    coachName: 'استاد مهدی مهدوی‌کیا',
    coachTitle: 'آکادمی کیا - کارشناس تمرینات رده‌های پایه',
    goal: 'حداکثرسازی چابکی بدون توپ، هماهنگی عصبی و رفلکس گام در کورس‌های سرعتی',
    difficulty: 'پیشرفته',
    ageGroup: 'نوجوانان و بزرگسالان',
    durationWeeks: 4,
    sessionsPerWeek: 4,
    equipment: ['نردبان چابکی', 'مخروط‌های رنگی', 'موانع کوتاه'],
    description: 'این برنامه به صورت تخصصی بر تمرینات آینه‌ای، ایکی شافل، برش‌های تند ۴۵ و ۹۰ درجه و تغییر جهت‌های واکنشی تمرکز دارد.',
    price: '۴۲۰,۰۰۰ تومان',
    isFree: false,
    studentsCount: 41,
    rating: 4.9,
    imageUrl: 'https://images.openai.com/static-rsc-4/ICoXl52bLCdc5Z4PVk79BVOiGgQyecbK8xGlVVtk8MOzT7mCj6n1--GtWr_WdJMNwz1JeUprJKpdi8zkvuQCm3H-9gGNwEuyLcICwSJtEGEuN-PmkWp-p0EELCkhCbnanj54W9iCqWHUfXjyR2eAlTkPJ2jPP6LFt7mVorn1uW8?purpose=inline',
    completedSessions: 2,
    totalSessions: 16,
    schedule: [
      {
        weekNumber: 1,
        sessions: [
          { dayName: 'شنبه', title: 'تمرین چابکی و تغییر جهت', focus: 'برش‌های زاویه‌دار', durationMinutes: 45, completed: true, drillsCount: 6 },
          { dayName: 'دوشنبه', title: 'تمرین سرعت واکنش', focus: 'محرک‌های صوتی و بینایی', durationMinutes: 40, completed: true, drillsCount: 5 },
          { dayName: 'چهارشنبه', title: 'تمرین هماهنگی و تعادل', focus: 'نردبان چابکی و تعادل تک‌پا', durationMinutes: 45, completed: false, drillsCount: 6 },
          { dayName: 'پنج‌شنبه', title: 'تمرین چابکی با توپ', focus: 'دریبلینگ انفجاری', durationMinutes: 50, completed: false, drillsCount: 5 },
        ],
      },
    ],
  },
  {
    id: 'prog-5',
    title: 'آمادگی جسمانی، استقامت و پیش‌فصل حرفه‌ای فوتبال',
    coachName: 'دکتر محسن رضایی',
    coachTitle: 'سرمربی و مربی بدنساز لیگ برتر',
    goal: 'ایجاد پایه استقامت ۹۰ دقیقه‌ای، بازتوانی قلبی عروقی و پیشگیری از مصدومیت فصل',
    difficulty: 'پیشرفته',
    ageGroup: '۱۶ سال به بالا',
    durationWeeks: 8,
    sessionsPerWeek: 5,
    equipment: ['زمین چمن', 'مخروط‌ها', 'طناب سرعتی', 'موانع'],
    description: 'پروتکل جامع پیش‌فصل شامل تست‌های یویو، اینتروال‌های شدید بی‌هوازی، تمرینات کپنهاگ کشاله ران و مسابقات فشرده ابعاد کوچک.',
    price: '۶۵۰,۰۰۰ تومان',
    isFree: false,
    studentsCount: 37,
    rating: 4.9,
    imageUrl: 'https://images.openai.com/static-rsc-4/A5MgHsMsNwN63JX7f0tRszU4wp10P0POi_6Di4RHJMesuIyWWv9LrqPWLNYkJxBu0kZ-4DJ6z8sdE6ngScdC99Bkcpa5Al9j1-y6WodjBVy__FIKeDgqmiCnT6hMpsvlDHO0b-UaqZvdNkr8YnPqEV6Z1MNRZ3vHzhPGaW3NcQM?purpose=inline',
    completedSessions: 10,
    totalSessions: 40,
    schedule: [
      {
        weekNumber: 1,
        sessions: [
          { dayName: 'شنبه', title: 'تمرینات هوازی و پایه‌های توان تنفسی', focus: 'استقامت قلبی', durationMinutes: 60, completed: true, drillsCount: 5 },
          { dayName: 'یکشنبه', title: 'قدرت عضلات مرکزی و ثبات لگن', focus: 'پیشگیری از آسیب کشاله', durationMinutes: 45, completed: true, drillsCount: 6 },
          { dayName: 'سه‌شنبه', title: 'شاتل‌های متناوب و استارت‌های چابکی', focus: 'سازگاری لاکتیک', durationMinutes: 55, completed: true, drillsCount: 6 },
          { dayName: 'چهارشنبه', title: 'بازی‌های در ابعاد کوچک ۳ در برابر ۳', focus: 'فشار بازی رسمی', durationMinutes: 50, completed: false, drillsCount: 4 },
          { dayName: 'پنج‌شنبه', title: 'ریکاوری فعال و موبیلیتی مفاصل', focus: 'انعطاف‌پذیری و کشش', durationMinutes: 40, completed: false, drillsCount: 5 },
        ],
      },
    ],
  },
];
