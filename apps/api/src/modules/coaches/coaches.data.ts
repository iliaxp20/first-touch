export interface CoachItem {
  id: string;
  fullName: string;
  title: string;
  license: string;
  specialty: string[];
  experienceYears: number;
  rating: number;
  studentsCount: number;
  monthlyFee: string;
  bio: string;
  features: string[];
  avatarUrl?: string;
  isAvailable: boolean;
}

export const INITIAL_COACHES: CoachItem[] = [
  {
    id: 'coach-1',
    fullName: 'استاد حمیدرضا استیلی',
    title: 'سرمربی و کارشناس ارشد فوتبال پایه',
    license: 'مدرک حرفه‌ای Pro آسیا',
    specialty: ['تکنیک و لمس اول', 'هوش محیطی و تصمیم‌گیری', 'تاکتیک هجومی'],
    experienceYears: 18,
    rating: 5.0,
    studentsCount: 34,
    monthlyFee: '۸۹۰,۰۰۰ تومان',
    bio: 'سرمربی سابق تیم‌های ملی امید و جوانان، متخصص پرورش استعدادهای تهاجمی و اصلاح تکنیک‌های لمس اول در شرایط فشرده مسابقه.',
    features: [
      'طراحی برنامه اختصاصی ماهانه بر اساس فیزیک و پست بازیکن',
      'آنالیز ویدیویی ۲ مسابقه یا جلسه تمرین در هر ماه',
      'چت مستقیم هفتگی جهت اصلاح تکنیک و تمرینات',
      'گزارش مکتوب پیشرفت فیزیکی و مهارتی برای اولیا',
    ],
    avatarUrl: 'https://images.openai.com/static-rsc-4/5GToxtoVHX_X06CDWFGQJ2KKdsLv1Sk9GG3wDeXNPEgfaRMNwQTzXp8qWuC9tT9gwtUgoWW8uqgIDFddxDtj117CRvBMFn1w9JQCHnnl0DsGKHKY9RWtwPXlV9wBZhE4hDkC8eMM7BdeKOpfM6qr9TMzFw-extB4jSTZlWjcDE0?purpose=inline',
    isAvailable: true,
  },
  {
    id: 'coach-2',
    fullName: 'دکتر محسن گرامی',
    title: 'مربی بدنساز تخصصی فوتبال و متخصص آسیب‌شناسی',
    license: 'مدرک A بدنسازی کنفدراسیون فوتبال آسیا',
    specialty: ['سرعت و شتاب انفجاری', 'چابکی نردبان و مخروط', 'پیشگیری از آسیب کشاله و رباط'],
    experienceYears: 12,
    rating: 4.9,
    studentsCount: 42,
    monthlyFee: '۷۵۰,۰۰۰ تومان',
    bio: 'مربی بدنساز اسبق باشگاه‌های لیگ برتر، طراح پروتکل‌های تقویت عضلات مرکزی، شتاب ۵ تا ۱۵ متری و هماهنگی عصب و عضله.',
    features: [
      'تست اولیه شاخص‌های چابکی و رکوردگیری سرعت',
      'طراحی جدول تمرینات وزن بدن و پلیومتریک خانگی و چمن',
      'تنظیم راهنمای تغذیه مکمل قبل و بعد از تمرین',
      'پشتیبانی آنلاین و اصلاح زوایای اجرای حرکات',
    ],
    avatarUrl: 'https://images.openai.com/static-rsc-4/0-bzjTDqKfJXRMUE7_77o_C5BdFYrBqFmgJBMm569Iwwk7Z9SmEmkkgPpDoT8RJyPeldLFtp5XTpL9odxfu1szauNaHx7QGOwWLZn1RaXRMNEcAlOPS_vRT-ffArFHQfx9QCsoMhBMe4S1umYOcsTSOvf8QNcR_9yJQiE6IhfyM?purpose=inline',
    isAvailable: true,
  },
  {
    id: 'coach-3',
    fullName: 'کاپیتان آرش برهانی',
    title: 'مربی آکادمی و مهاجم اسبق لیگ برتر',
    license: 'مدرک مربیگری A کنفدراسیون آسیا',
    specialty: ['حرکات تمام‌کنندگی و چارچوب‌شناسی', 'فرار از تله آفساید', 'برش‌های سرعتی در ۱۸ قدم'],
    experienceYears: 10,
    rating: 4.9,
    studentsCount: 28,
    monthlyFee: '۷۹۰,۰۰۰ تومان',
    bio: 'آقای گل اسبق لیگ برتر، متخصص تمرینات تمام‌کنندگی، موقعیت‌شناسی مهاجمان و ضربات با هر دو پا در زوایای بسته.',
    features: [
      'برنامه تخصصی ضربه به چارچوب و دریبل در محوطه جریمه',
      'بازبینی ویدیوهای گلزنی و تحلیل موقعیت‌های از دست رفته',
      'تمرینات شبیه‌سازی فشار دروازه‌بان و دفاع آخر',
      'ارتباط مستقیم پیامکی داخل اپلیکیشن',
    ],
    avatarUrl: 'https://images.openai.com/static-rsc-4/zpHPIUfWhF07Trip-Ddj60plM3U2wkgaCLQq9OH2Gx2XJQdEjBqALKrWRaNkVJQusajDHeC8sQoKo3H9omIi3bzfrOQb-AAd7FaNUw6PP0uqZk_3JG20uKnY9cF3mWiumXCq5T80YU4PuzSIZLgtjb5stKMneMXnCW6Sq6rSAPc?purpose=inline',
    isAvailable: true,
  },
];
