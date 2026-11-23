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
    id: "prog-1794729612105",
    title: "برنامه تست سرعت و چابکی با ویدیو",
    coachName: "استاد حمید درخشان",
    coachTitle: "سرمربی آکادمی",
    goal: "توسعه شتاب و چابکی تخصصی و تست رکوردهای سرعتی",
    difficulty: "پیشرفته",
    ageGroup: "تمامی رده‌ها",
    durationWeeks: 4,
    sessionsPerWeek: 3,
    equipment: ["توپ فوتبال", "مخروط"],
    description: "برنامه تست تخصصی سرعت و چابکی به همراه ویدیوی آموزشی اضافه شده از پنل مدیریت",
    price: "رایگان",
    priceNumber: 0,
    isFree: true,
    studentsCount: 45,
    rating: 5,
    videoUrl: "/uploads/1795327247084-C63495EC-5FAC-443D-8C87-97E8EDD4FF88.mp4",
    imageUrl: "https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=600&q=80",
    totalSessions: 12,
    drillsSummary: ["شتاب گام اول", "کنترل و لمس اول", "تست سرعت ۵-۱۰-۵", "تغییر مسیر انفجاری"],
  },
  {
    id: "prog-1794729591094",
    title: "برنامه تست سرعت و چابکی پایه‌ای",
    coachName: "استاد حمید درخشان",
    coachTitle: "سرمربی آکادمی",
    goal: "توسعه شتاب و چابکی پایه و بهبود هماهنگی عصب و عضله",
    difficulty: "متوسط",
    ageGroup: "تمامی رده‌ها",
    durationWeeks: 4,
    sessionsPerWeek: 3,
    equipment: ["توپ فوتبال", "مخروط"],
    description: "پروتکل تمرینات پایه چابکی با تأکید بر فرکانس پای بالا و استارت‌های انفجاری",
    price: "رایگان",
    priceNumber: 0,
    isFree: true,
    studentsCount: 38,
    rating: 5,
    videoUrl: "/uploads/1795327270453-188C1646-FB83-4F65-B537-18EC2F7C8145.mp4",
    imageUrl: "https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=600&q=80",
    totalSessions: 12,
    drillsSummary: ["شتاب گام اول", "کنترل و لمس اول"],
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

// Purge any stale mock items from localStorage on module load
if (typeof window !== 'undefined') {
  try {
    const raw = localStorage.getItem(TRAINING_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        const cleaned = parsed.filter(
          (p: any) =>
            p &&
            p.id &&
            !p.id.startsWith('ready-plan-') &&
            !['prog-1', 'prog-2', 'prog-3', 'prog-4', 'prog-5'].includes(p.id) &&
            !p.title?.includes('شافل') &&
            (p.videoUrl?.includes('/uploads/') || p.id?.startsWith('prog-179') || p.isCustomAdminCreated)
        );
        localStorage.setItem(TRAINING_STORAGE_KEY, JSON.stringify(cleaned));
      }
    }
  } catch {}

  try {
    const rawDrills = localStorage.getItem('first_touch_free_training_drills');
    if (rawDrills) {
      const parsed = JSON.parse(rawDrills);
      if (Array.isArray(parsed)) {
        const cleaned = parsed.filter(
          (d: any) =>
            d &&
            d.id &&
            !d.id.startsWith('drill-1-') &&
            !d.title?.includes('شافل') &&
            (d.videoUrl?.includes('/uploads/') || d.id?.startsWith('drill-adm-'))
        );
        localStorage.setItem('first_touch_free_training_drills', JSON.stringify(cleaned));
      }
    }
  } catch {}

  try {
    const rawActive = localStorage.getItem('first_touch_student_active_plans');
    if (rawActive) {
      const parsed = JSON.parse(rawActive);
      if (Array.isArray(parsed)) {
        const cleaned = parsed.filter(
          (p: any) =>
            p &&
            p.id &&
            !p.id.startsWith('ready-plan-') &&
            !['prog-1', 'prog-2', 'prog-3', 'prog-4', 'prog-5'].includes(p.id) &&
            !p.title?.includes('شافل')
        );
        localStorage.setItem('first_touch_student_active_plans', JSON.stringify(cleaned));
      }
    }
  } catch {}
}

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
          (p: ReadyTrainingPlan) =>
            p &&
            p.id &&
            !deletedIds.includes(p.id) &&
            !p.id.startsWith('ready-plan-') &&
            p.id !== 'prog-1' &&
            p.id !== 'prog-2' &&
            p.id !== 'prog-3' &&
            p.id !== 'prog-4' &&
            p.id !== 'prog-5' &&
            (p.videoUrl?.includes('/uploads/') || p.id?.startsWith('prog-179') || p.isCustomAdminCreated)
        );
        const storedIds = new Set(cleaned.map((p) => p.id));
        const remaining = DEFAULT_READY_TRAINING_PLANS.filter(
          (p) => !deletedIds.includes(p.id) && !storedIds.has(p.id)
        );
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
              p &&
              p.id &&
              !deletedIds.includes(p.id) &&
              !p.id.startsWith('ready-plan-') &&
              p.id !== 'prog-1' &&
              p.id !== 'prog-2' &&
              p.id !== 'prog-3' &&
              p.id !== 'prog-4' &&
              p.id !== 'prog-5' &&
              (p.videoUrl?.includes('/uploads/') || p.id?.startsWith('prog-179') || p.isCustomAdminCreated)
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
