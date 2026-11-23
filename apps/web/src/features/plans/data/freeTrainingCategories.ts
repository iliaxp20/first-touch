import { API_BASE_URL } from '@/lib/api';
export interface SuggestedDrill {
  id: string;
  title: string;
  duration: string;
  difficultyLabel: string;
  difficultyBars: boolean[];
  barColor: 'emerald' | 'purple';
  image: string;
  videoUrl?: string;
}

const SUGGESTED_DRILLS_KEY = 'first_touch_suggested_drills';

export const getSuggestedDrills = (): SuggestedDrill[] => {
  try {
    const raw = localStorage.getItem(SUGGESTED_DRILLS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return [
    {
      id: 'drill-passing',
      title: 'پاس‌کاری دقیق',
      duration: '15 min',
      difficultyLabel: 'آسان',
      difficultyBars: [true, false, false],
      barColor: 'emerald',
      image: '/drill-thumb-passing.png',
    },
    {
      id: 'drill-agility',
      title: 'کنترل توپ در فضاهای تنگ',
      duration: '20 min',
      difficultyLabel: 'سخت',
      difficultyBars: [true, true, false],
      barColor: 'purple',
      image: '/drill-thumb-agility.png',
    },
    {
      id: 'drill-cones',
      title: 'دریبلینگ با مخروط‌ها',
      duration: '15 min',
      difficultyLabel: 'متوسط',
      difficultyBars: [true, true, false],
      barColor: 'emerald',
      image: '/drill-thumb-cones.png',
    },
  ];
};

export const saveSuggestedDrills = (drills: SuggestedDrill[]): void => {
  try {
    localStorage.setItem(SUGGESTED_DRILLS_KEY, JSON.stringify(drills));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('ft_suggested_drills_updated'));
    }
  } catch {}
};

export const syncSuggestedDrillsWithServer = async (): Promise<SuggestedDrill[]> => {
  try {
    const res = await fetch(`${API_BASE_URL}/programs/suggested-drills`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        localStorage.setItem(SUGGESTED_DRILLS_KEY, JSON.stringify(data));
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('ft_suggested_drills_updated'));
        }
        return data;
      }
    }
  } catch {}
  return getSuggestedDrills();
};

export const saveSuggestedDrillsToServer = async (drills: SuggestedDrill[]): Promise<SuggestedDrill[]> => {
  saveSuggestedDrills(drills);
  try {
    const res = await fetch(`${API_BASE_URL}/programs/suggested-drills`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(drills),
    });
    if (res.ok) {
      const updated = await res.json();
      if (Array.isArray(updated) && updated.length > 0) {
        saveSuggestedDrills(updated);
        return updated;
      }
    }
  } catch {}
  return drills;
};

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
    color: 'from-emerald-500 to-teal-600',
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


const DRILLS_STORAGE_KEY = 'first_touch_free_training_drills';

export const getTrainingDrills = (): FreeDrill[] => {
  try {
    const raw = localStorage.getItem(DRILLS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const cleaned = parsed.filter(
          (d) =>
            !d.title?.includes('تست') &&
            !d.englishTitle?.toLowerCase().includes('test') &&
            !d.description?.includes('تستی')
        );
        const customIds = new Set(cleaned.map((d) => d.id));
        const remaining = FREE_TRAINING_DRILLS.filter((d) => !customIds.has(d.id));
        return [...cleaned, ...remaining];
      }
    }
  } catch (err) {
    console.error('Failed to get training drills', err);
  }
  return FREE_TRAINING_DRILLS;
};

export const saveTrainingDrills = (drills: FreeDrill[]): void => {
  try {
    localStorage.setItem(DRILLS_STORAGE_KEY, JSON.stringify(drills));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('ft_drills_updated'));
    }
  } catch (err) {
    console.error('Failed to save training drills', err);
  }
};

export const addTrainingDrill = (drill: Omit<FreeDrill, 'id'>): FreeDrill => {
  const current = getTrainingDrills();
  const newDrill: FreeDrill = {
    ...drill,
    id: `drill-adm-${Date.now()}`,
  };
  saveTrainingDrills([newDrill, ...current]);

  // Sync with API
  try {
    fetch(`${API_BASE_URL}/drills`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        categoryIndex: drill.categoryKey === 'agility' ? 1 : 2,
        categoryTitle: drill.categoryTitle,
        englishName: drill.englishTitle || 'Custom Drill',
        persianName: drill.title,
        imageUrl: drill.thumbnailUrl,
        videoUrl: drill.videoUrl,
        description: drill.description,
        difficulty: drill.difficulty === 'مبتدی' ? 'BEGINNER' : drill.difficulty === 'پیشرفته' ? 'ADVANCED' : 'INTERMEDIATE',
        equipment: drill.equipment,
        targetSkill: drill.targetSkill,
        categoryKey: drill.categoryKey,
        duration: drill.duration,
        setsReps: drill.setsReps,
      }),
    }).catch(() => {});
  } catch {}

  return newDrill;
};

export const updateTrainingDrill = (updatedDrill: FreeDrill): void => {
  const current = getTrainingDrills();
  const next = current.map((d) => (d.id === updatedDrill.id ? updatedDrill : d));
  saveTrainingDrills(next);

  // Sync update with API
  try {
    fetch(`${API_BASE_URL}/drills/${updatedDrill.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        categoryTitle: updatedDrill.categoryTitle,
        persianName: updatedDrill.title,
        englishName: updatedDrill.englishTitle || 'Custom Drill',
        imageUrl: updatedDrill.thumbnailUrl,
        videoUrl: updatedDrill.videoUrl,
        description: updatedDrill.description,
        difficulty: updatedDrill.difficulty === 'مبتدی' ? 'BEGINNER' : updatedDrill.difficulty === 'پیشرفته' ? 'ADVANCED' : 'INTERMEDIATE',
        equipment: updatedDrill.equipment,
        targetSkill: updatedDrill.targetSkill,
        categoryKey: updatedDrill.categoryKey,
        duration: updatedDrill.duration,
        setsReps: updatedDrill.setsReps,
      }),
    }).catch(() => {});
  } catch {}
};

export const deleteTrainingDrill = (id: string): void => {
  const current = getTrainingDrills();
  saveTrainingDrills(current.filter((d) => d.id !== id));
  try {
    fetch(`${API_BASE_URL}/drills/${id}`, { method: 'DELETE' }).catch(() => {});
  } catch {}
};

export const syncDrillsWithServer = async (): Promise<FreeDrill[]> => {
  try {
    const res = await fetch(`${API_BASE_URL}/drills`);
    if (res.ok) {
      const serverDrills: any[] = await res.json();
      if (Array.isArray(serverDrills)) {
        const mapped: FreeDrill[] = serverDrills
          .filter(
            (d: any) =>
              !d.persianName?.includes('تست') &&
              !d.title?.includes('تست') &&
              !d.englishName?.toLowerCase().includes('test') &&
              !d.description?.includes('تستی')
          )
          .map((d: any) => ({
            id: d.id,
            categoryKey: d.categoryKey || (d.categoryIndex === 1 ? 'agility' : d.categoryIndex === 2 ? 'strength' : 'speed'),
            categoryTitle: d.categoryTitle || 'تمرین تخصصی',
            subCategory: d.categoryTitle || 'تمرین تخصصی',
            title: d.persianName || d.title,
            englishTitle: d.englishName || '',
            difficulty: d.difficulty === 'ADVANCED' ? 'پیشرفته' : d.difficulty === 'BEGINNER' ? 'مبتدی' : 'متوسط',
            duration: d.duration || (d.durationMinutes ? `${d.durationMinutes} دقیقه` : '۱۵ دقیقه'),
            setsReps: d.setsReps || '۴ ست',
            equipment: d.equipment || 'توپ، مخروط',
            targetSkill: d.targetSkill || d.persianName,
            videoUrl: d.videoUrl || '',
            thumbnailUrl: d.imageUrl || 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=600&q=80',
            description: d.description || '',
            steps: d.description ? [d.description] : [],
            coachingTips: d.coachingTips || '',
            commonMistakes: d.commonMistakes || '',
          }));

        const serverIds = new Set(mapped.map((d) => d.id));
        const merged = [...mapped, ...FREE_TRAINING_DRILLS.filter((d) => !serverIds.has(d.id))];
        saveTrainingDrills(merged);
        return merged;
      }
    }
  } catch (err) {
    console.warn('Failed to sync drills with server', err);
  }
  return getTrainingDrills();
};

export const FREE_TRAINING_DRILLS: FreeDrill[] = [
  {
    "id": "drill-1-1",
    "categoryKey": "agility",
    "categoryTitle": "چابکی",
    "subCategory": "تمرینات نردبان چابکی (Agility Ladder)",
    "title": "یک پا در هر خانه",
    "englishTitle": "One Foot In Each Box",
    "difficulty": "مبتدی",
    "duration": "۱۵ دقیقه",
    "setsReps": "۴ ست",
    "equipment": "نردبان چابکی",
    "targetSkill": "سرعت گام‌برداری و واکنش کف پا",
    "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-athlete-training-on-an-agility-ladder-41315-large.mp4",
    "thumbnailUrl": "https://images.openai.com/static-rsc-4/wkvTrr6tP3hUwE2tQRNyNa91eOYr696_6Ef_uNr4EbAfx42f0kuUJnJgCBgSzUvX8HwSHv_V7FX7kNsmzIndNFzXoGrsPeFF9s5S_2hgG7lQWJRwquLHEzhcBQSVqvEt4ZIrvsztxVkfINedZuRxpkGcfiiGTSQSP7pMdlVg98I?purpose=inline",
    "description": "عبور از طول نردبان با قرار دادن تنها یک تماس پا در هر خانه بدون برخورد به پله‌ها.",
    "steps": [
      "عبور از طول نردبان با قرار دادن تنها یک تماس پا در هر خانه بدون برخورد به پله‌ها."
    ],
    "coachingTips": "مرکز ثقل بدن پایین حفظ شود و نگاه سر بالا باشد.",
    "commonMistakes": "کوبیدن پاشنه پا روی زمین یا خم کردن کمر به جای زانوها."
  },
  {
    "id": "drill-1-2",
    "categoryKey": "agility",
    "categoryTitle": "چابکی",
    "subCategory": "تمرینات نردبان چابکی (Agility Ladder)",
    "title": "دو پا در هر خانه",
    "englishTitle": "Two Feet In Each Box",
    "difficulty": "مبتدی",
    "duration": "۱۵ دقیقه",
    "setsReps": "۴ ست",
    "equipment": "نردبان چابکی",
    "targetSkill": "فرکانس گام و ریتم حرکتی",
    "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-athlete-training-on-an-agility-ladder-41315-large.mp4",
    "thumbnailUrl": "https://images.openai.com/static-rsc-4/UTP4am2CFkJ2JmYnxyGWWaKAjhke0AWf9ZHxIOYTuUF17UnqC0RKQ_vnPHOWvlqOU1AU4HynMtenFl6HhXUYLj_y6xMe2V6T2PkpaVVvEibh9TS-mbhwnw9PVAzcmR9GNgA1qtcPKWJgN8WjK7cwJcOzQ9XtLOyVSK3Md5rXM9o?purpose=inline",
    "description": "در هر خانه ابتدا پای راهنما و بلافاصله پای دوم فرود آمده و با سرعت به خانه بعد منتقل می‌شود.",
    "steps": [
      "در هر خانه ابتدا پای راهنما و بلافاصله پای دوم فرود آمده و با سرعت به خانه بعد منتقل می‌شود."
    ],
    "coachingTips": "مرکز ثقل بدن پایین حفظ شود و نگاه سر بالا باشد.",
    "commonMistakes": "کوبیدن پاشنه پا روی زمین یا خم کردن کمر به جای زانوها."
  },
  {
    "id": "drill-1-3",
    "categoryKey": "agility",
    "categoryTitle": "چابکی",
    "subCategory": "تمرینات نردبان چابکی (Agility Ladder)",
    "title": "ورود و خروج متناوب",
    "englishTitle": "In-In-Out-Out",
    "difficulty": "متوسط",
    "duration": "۱۵ دقیقه",
    "setsReps": "۴ ست",
    "equipment": "نردبان چابکی",
    "targetSkill": "هماهنگی عضلات پا و تغییر تکیه‌گاه",
    "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-athlete-training-on-an-agility-ladder-41315-large.mp4",
    "thumbnailUrl": "https://images.openai.com/static-rsc-4/N8VIqqEHFUySkQwWl2hXVGu32A0Ue7dRGyycb9tYj7SHPOv5sU-_4sUH31LrsCIYs0uE_Cbl3rgwkodkbxOONH0T3mMf-0_FpszMaKm0P8dOEI6XtBPDJiD_CB47y10KEVb317Aqr0iY-Yi8rrgkEe5jBK_rF-1qErkySqspB9s?purpose=inline",
    "description": "ورود دو پا به داخل خانه نردبان و سپس باز کردن و گام گذاشتن به طرفین خارج از نردبان.",
    "steps": [
      "ورود دو پا به داخل خانه نردبان و سپس باز کردن و گام گذاشتن به طرفین خارج از نردبان."
    ],
    "coachingTips": "مرکز ثقل بدن پایین حفظ شود و نگاه سر بالا باشد.",
    "commonMistakes": "کوبیدن پاشنه پا روی زمین یا خم کردن کمر به جای زانوها."
  },
  {
    "id": "drill-1-4",
    "categoryKey": "agility",
    "categoryTitle": "چابکی",
    "subCategory": "تمرینات نردبان چابکی (Agility Ladder)",
    "title": "گام‌های سریع جانبی",
    "englishTitle": "Lateral Quick Steps",
    "difficulty": "متوسط",
    "duration": "۱۵ دقیقه",
    "setsReps": "۴ ست",
    "equipment": "نردبان چابکی",
    "targetSkill": "چابکی عرضی و جاگیری دفاعی",
    "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-athlete-training-on-an-agility-ladder-41315-large.mp4",
    "thumbnailUrl": "/drill-thumb-agility.png",
    "description": "حرکت به پهلو در امتداد نردبان با تماس‌های انفجاری سینه پا.",
    "steps": [
      "حرکت به پهلو در امتداد نردبان با تماس‌های انفجاری سینه پا."
    ],
    "coachingTips": "مرکز ثقل بدن پایین حفظ شود و نگاه سر بالا باشد.",
    "commonMistakes": "کوبیدن پاشنه پا روی زمین یا خم کردن کمر به جای زانوها."
  },
  {
    "id": "drill-1-5",
    "categoryKey": "agility",
    "categoryTitle": "چابکی",
    "subCategory": "تمرینات نردبان چابکی (Agility Ladder)",
    "title": "دو پا داخل هر خانه از بغل",
    "englishTitle": "Lateral Two Feet In",
    "difficulty": "متوسط",
    "duration": "۱۵ دقیقه",
    "setsReps": "۴ ست",
    "equipment": "نردبان چابکی",
    "targetSkill": "تعادل پویا و تقویت مچ پا",
    "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-athlete-training-on-an-agility-ladder-41315-large.mp4",
    "thumbnailUrl": "/drill-thumb-agility.png",
    "description": "حرکت از پهلو به طوری که در هر سلول نردبان هر دو پا به ترتیب قرار گیرند.",
    "steps": [
      "حرکت از پهلو به طوری که در هر سلول نردبان هر دو پا به ترتیب قرار گیرند."
    ],
    "coachingTips": "مرکز ثقل بدن پایین حفظ شود و نگاه سر بالا باشد.",
    "commonMistakes": "کوبیدن پاشنه پا روی زمین یا خم کردن کمر به جای زانوها."
  },
  {
    "id": "drill-1-6",
    "categoryKey": "agility",
    "categoryTitle": "چابکی",
    "subCategory": "تمرینات نردبان چابکی (Agility Ladder)",
    "title": "حرکت ایکی شافل",
    "englishTitle": "Icky Shuffle",
    "difficulty": "پیشرفته",
    "duration": "۱۵ دقیقه",
    "setsReps": "۴ ست",
    "equipment": "نردبان چابکی",
    "targetSkill": "چابکی فوتبال مدرن و استارت انفجاری",
    "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-athlete-training-on-an-agility-ladder-41315-large.mp4",
    "thumbnailUrl": "/drill-thumb-agility.png",
    "description": "الگوی کلاسیک دو گام داخل خانه و یک گام تکیه‌گاهی سریع در خارج نردبان به صورت تناوبی چپ و راست.",
    "steps": [
      "الگوی کلاسیک دو گام داخل خانه و یک گام تکیه‌گاهی سریع در خارج نردبان به صورت تناوبی چپ و راست."
    ],
    "coachingTips": "مرکز ثقل بدن پایین حفظ شود و نگاه سر بالا باشد.",
    "commonMistakes": "کوبیدن پاشنه پا روی زمین یا خم کردن کمر به جای زانوها."
  },
  {
    "id": "drill-1-7",
    "categoryKey": "agility",
    "categoryTitle": "چابکی",
    "subCategory": "تمرینات نردبان چابکی (Agility Ladder)",
    "title": "حرکت علی شافل",
    "englishTitle": "Ali Shuffle",
    "difficulty": "پیشرفته",
    "duration": "۱۵ دقیقه",
    "setsReps": "۴ ست",
    "equipment": "نردبان چابکی",
    "targetSkill": "ریتم بوکسوری و جابجایی تند پای فوتبال",
    "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-athlete-training-on-an-agility-ladder-41315-large.mp4",
    "thumbnailUrl": "/drill-thumb-agility.png",
    "description": "قیچی کردن پاها در وضعیت زاویه‌دار نسبت به نردبان با شبیه‌سازی گام‌های محمدعلی کلی.",
    "steps": [
      "قیچی کردن پاها در وضعیت زاویه‌دار نسبت به نردبان با شبیه‌سازی گام‌های محمدعلی کلی."
    ],
    "coachingTips": "مرکز ثقل بدن پایین حفظ شود و نگاه سر بالا باشد.",
    "commonMistakes": "کوبیدن پاشنه پا روی زمین یا خم کردن کمر به جای زانوها."
  },
  {
    "id": "drill-1-8",
    "categoryKey": "agility",
    "categoryTitle": "چابکی",
    "subCategory": "تمرینات نردبان چابکی (Agility Ladder)",
    "title": "پرش تک‌پا",
    "englishTitle": "Single Leg Hop",
    "difficulty": "متوسط",
    "duration": "۱۵ دقیقه",
    "setsReps": "۴ ست",
    "equipment": "نردبان چابکی",
    "targetSkill": "توان پلیومتریک تک‌پا و پایداری زانو",
    "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-athlete-training-on-an-agility-ladder-41315-large.mp4",
    "thumbnailUrl": "/drill-thumb-agility.png",
    "description": "پرش متوالی روی یک پا در تمام خانه‌ها با کنترل دقیق فرود روی پنجه.",
    "steps": [
      "پرش متوالی روی یک پا در تمام خانه‌ها با کنترل دقیق فرود روی پنجه."
    ],
    "coachingTips": "مرکز ثقل بدن پایین حفظ شود و نگاه سر بالا باشد.",
    "commonMistakes": "کوبیدن پاشنه پا روی زمین یا خم کردن کمر به جای زانوها."
  },
  {
    "id": "drill-1-9",
    "categoryKey": "agility",
    "categoryTitle": "چابکی",
    "subCategory": "تمرینات نردبان چابکی (Agility Ladder)",
    "title": "پرش جفت‌پا",
    "englishTitle": "Double Leg Hop",
    "difficulty": "مبتدی",
    "duration": "۱۵ دقیقه",
    "setsReps": "۴ ست",
    "equipment": "نردبان چابکی",
    "targetSkill": "قدرت انفجاری پرش عمودی و افقی",
    "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-athlete-training-on-an-agility-ladder-41315-large.mp4",
    "thumbnailUrl": "/drill-thumb-agility.png",
    "description": "پرش‌های سریع با هر دو پا در هر خانه با کمترین زمان توقف روی زمین.",
    "steps": [
      "پرش‌های سریع با هر دو پا در هر خانه با کمترین زمان توقف روی زمین."
    ],
    "coachingTips": "مرکز ثقل بدن پایین حفظ شود و نگاه سر بالا باشد.",
    "commonMistakes": "کوبیدن پاشنه پا روی زمین یا خم کردن کمر به جای زانوها."
  },
  {
    "id": "drill-1-10",
    "categoryKey": "agility",
    "categoryTitle": "چابکی",
    "subCategory": "تمرینات نردبان چابکی (Agility Ladder)",
    "title": "پرش لی‌لی ترکیبی",
    "englishTitle": "Hopscotch Drill",
    "difficulty": "متوسط",
    "duration": "۱۵ دقیقه",
    "setsReps": "۴ ست",
    "equipment": "نردبان چابکی",
    "targetSkill": "هماهنگی عصبی عضلانی ترکیبی",
    "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-athlete-training-on-an-agility-ladder-41315-large.mp4",
    "thumbnailUrl": "/drill-thumb-agility.png",
    "description": "پرش یک پا در داخل خانه و سپس فرود جفت پا به طرفین نردبان.",
    "steps": [
      "پرش یک پا در داخل خانه و سپس فرود جفت پا به طرفین نردبان."
    ],
    "coachingTips": "مرکز ثقل بدن پایین حفظ شود و نگاه سر بالا باشد.",
    "commonMistakes": "کوبیدن پاشنه پا روی زمین یا خم کردن کمر به جای زانوها."
  },
  {
    "id": "drill-1-11",
    "categoryKey": "agility",
    "categoryTitle": "چابکی",
    "subCategory": "تمرینات نردبان چابکی (Agility Ladder)",
    "title": "گام‌های ضربدری",
    "englishTitle": "Crossover Steps",
    "difficulty": "پیشرفته",
    "duration": "۱۵ دقیقه",
    "setsReps": "۴ ست",
    "equipment": "نردبان چابکی",
    "targetSkill": "انعطاف لگن و فرار از پرس",
    "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-athlete-training-on-an-agility-ladder-41315-large.mp4",
    "thumbnailUrl": "/drill-thumb-agility.png",
    "description": "عبور پای بیرونی از روی پای دیگر و فرود در خانه نردبان با چرخش بالاتنه.",
    "steps": [
      "عبور پای بیرونی از روی پای دیگر و فرود در خانه نردبان با چرخش بالاتنه."
    ],
    "coachingTips": "مرکز ثقل بدن پایین حفظ شود و نگاه سر بالا باشد.",
    "commonMistakes": "کوبیدن پاشنه پا روی زمین یا خم کردن کمر به جای زانوها."
  },
  {
    "id": "drill-1-12",
    "categoryKey": "agility",
    "categoryTitle": "چابکی",
    "subCategory": "تمرینات نردبان چابکی (Agility Ladder)",
    "title": "ورود و خروج جانبی",
    "englishTitle": "Lateral In-Out",
    "difficulty": "متوسط",
    "duration": "۱۵ دقیقه",
    "setsReps": "۴ ست",
    "equipment": "نردبان چابکی",
    "targetSkill": "چابکی عرضی سریع",
    "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-athlete-training-on-an-agility-ladder-41315-large.mp4",
    "thumbnailUrl": "/drill-thumb-agility.png",
    "description": "گام‌گذاری به داخل و خارج نردبان در راستای عرضی حین پیشروی به جلو.",
    "steps": [
      "گام‌گذاری به داخل و خارج نردبان در راستای عرضی حین پیشروی به جلو."
    ],
    "coachingTips": "مرکز ثقل بدن پایین حفظ شود و نگاه سر بالا باشد.",
    "commonMistakes": "کوبیدن پاشنه پا روی زمین یا خم کردن کمر به جای زانوها."
  },
  {
    "id": "drill-1-13",
    "categoryKey": "agility",
    "categoryTitle": "چابکی",
    "subCategory": "تمرینات نردبان چابکی (Agility Ladder)",
    "title": "گام‌های جلو و عقب",
    "englishTitle": "Forward-Backward Steps",
    "difficulty": "متوسط",
    "duration": "۱۵ دقیقه",
    "setsReps": "۴ ست",
    "equipment": "نردبان چابکی",
    "targetSkill": "تغییر مرکز ثقل خطی",
    "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-athlete-training-on-an-agility-ladder-41315-large.mp4",
    "thumbnailUrl": "/drill-thumb-agility.png",
    "description": "حرکت مداوم جلو و عقب در حین گذر از پهنای پله‌ها.",
    "steps": [
      "حرکت مداوم جلو و عقب در حین گذر از پهنای پله‌ها."
    ],
    "coachingTips": "مرکز ثقل بدن پایین حفظ شود و نگاه سر بالا باشد.",
    "commonMistakes": "کوبیدن پاشنه پا روی زمین یا خم کردن کمر به جای زانوها."
  },
  {
    "id": "drill-1-14",
    "categoryKey": "agility",
    "categoryTitle": "چابکی",
    "subCategory": "تمرینات نردبان چابکی (Agility Ladder)",
    "title": "عبور جانبی از نردبان",
    "englishTitle": "Lateral Shuffle Through",
    "difficulty": "مبتدی",
    "duration": "۱۵ دقیقه",
    "setsReps": "۴ ست",
    "equipment": "نردبان چابکی",
    "targetSkill": "جاگیری و پوشش فضا",
    "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-athlete-training-on-an-agility-ladder-41315-large.mp4",
    "thumbnailUrl": "/drill-thumb-agility.png",
    "description": "دویدن جانبی سریع بدون قطع شدن خط تعادل بدن.",
    "steps": [
      "دویدن جانبی سریع بدون قطع شدن خط تعادل بدن."
    ],
    "coachingTips": "مرکز ثقل بدن پایین حفظ شود و نگاه سر بالا باشد.",
    "commonMistakes": "کوبیدن پاشنه پا روی زمین یا خم کردن کمر به جای زانوها."
  },
  {
    "id": "drill-1-15",
    "categoryKey": "agility",
    "categoryTitle": "چابکی",
    "subCategory": "تمرینات نردبان چابکی (Agility Ladder)",
    "title": "گام‌های قیچی",
    "englishTitle": "Scissors Steps",
    "difficulty": "پیشرفته",
    "duration": "۱۵ دقیقه",
    "setsReps": "۴ ست",
    "equipment": "نردبان چابکی",
    "targetSkill": "قدرت ریتمیک عضلات چهارسر و همسترینگ",
    "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-athlete-training-on-an-agility-ladder-41315-large.mp4",
    "thumbnailUrl": "/drill-thumb-agility.png",
    "description": "حرکت قیچی پاها به صورت متناوب داخل و خارج نردبان.",
    "steps": [
      "حرکت قیچی پاها به صورت متناوب داخل و خارج نردبان."
    ],
    "coachingTips": "مرکز ثقل بدن پایین حفظ شود و نگاه سر بالا باشد.",
    "commonMistakes": "کوبیدن پاشنه پا روی زمین یا خم کردن کمر به جای زانوها."
  },
  {
    "id": "drill-1-16",
    "categoryKey": "agility",
    "categoryTitle": "چابکی",
    "subCategory": "تمرینات نردبان چابکی (Agility Ladder)",
    "title": "حرکت کاریوکا",
    "englishTitle": "Carioca Ladder",
    "difficulty": "پیشرفته",
    "duration": "۱۵ دقیقه",
    "setsReps": "۴ ست",
    "equipment": "نردبان چابکی",
    "targetSkill": "جداسازی بالاتنه از پایین‌تنه و انعطاف لگن",
    "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-athlete-training-on-an-agility-ladder-41315-large.mp4",
    "thumbnailUrl": "/drill-thumb-agility.png",
    "description": "حرکت به پهلو با عبور ضربدری پا از جلو و عقب به صورت تناوبی در خانه‌ها.",
    "steps": [
      "حرکت به پهلو با عبور ضربدری پا از جلو و عقب به صورت تناوبی در خانه‌ها."
    ],
    "coachingTips": "مرکز ثقل بدن پایین حفظ شود و نگاه سر بالا باشد.",
    "commonMistakes": "کوبیدن پاشنه پا روی زمین یا خم کردن کمر به جای زانوها."
  },
  {
    "id": "drill-1-17",
    "categoryKey": "agility",
    "categoryTitle": "چابکی",
    "subCategory": "تمرینات نردبان چابکی (Agility Ladder)",
    "title": "دویدن با گام‌های بسیار سریع",
    "englishTitle": "Quick Feet Run",
    "difficulty": "متوسط",
    "duration": "۱۵ دقیقه",
    "setsReps": "۴ ست",
    "equipment": "نردبان چابکی",
    "targetSkill": "بیشینه فرکانس حرکتی پنجه",
    "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-athlete-training-on-an-agility-ladder-41315-large.mp4",
    "thumbnailUrl": "/drill-thumb-agility.png",
    "description": "دویدن با حداکثر سرعت ممکن و ثبت بیشترین تعداد تماس پا در ثانیه.",
    "steps": [
      "دویدن با حداکثر سرعت ممکن و ثبت بیشترین تعداد تماس پا در ثانیه."
    ],
    "coachingTips": "مرکز ثقل بدن پایین حفظ شود و نگاه سر بالا باشد.",
    "commonMistakes": "کوبیدن پاشنه پا روی زمین یا خم کردن کمر به جای زانوها."
  },
  {
    "id": "drill-1-18",
    "categoryKey": "agility",
    "categoryTitle": "چابکی",
    "subCategory": "تمرینات نردبان چابکی (Agility Ladder)",
    "title": "یک پا داخل، دو پا خارج",
    "englishTitle": "Single-In Double-Out",
    "difficulty": "متوسط",
    "duration": "۱۵ دقیقه",
    "setsReps": "۴ ست",
    "equipment": "نردبان چابکی",
    "targetSkill": "تغییر جهت متناوب بیرونی",
    "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-athlete-training-on-an-agility-ladder-41315-large.mp4",
    "thumbnailUrl": "/drill-thumb-agility.png",
    "description": "فرود تک پا در باکس نردبان و انتقال انفجاری هر دو پا به بیرون.",
    "steps": [
      "فرود تک پا در باکس نردبان و انتقال انفجاری هر دو پا به بیرون."
    ],
    "coachingTips": "مرکز ثقل بدن پایین حفظ شود و نگاه سر بالا باشد.",
    "commonMistakes": "کوبیدن پاشنه پا روی زمین یا خم کردن کمر به جای زانوها."
  },
  {
    "id": "drill-1-19",
    "categoryKey": "agility",
    "categoryTitle": "چابکی",
    "subCategory": "تمرینات نردبان چابکی (Agility Ladder)",
    "title": "دو پا داخل، یک پا خارج",
    "englishTitle": "Double-In Single-Out",
    "difficulty": "متوسط",
    "duration": "۱۵ دقیقه",
    "setsReps": "۴ ست",
    "equipment": "نردبان چابکی",
    "targetSkill": "تمرکز ذهنی و گام‌برداری دقیق",
    "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-athlete-training-on-an-agility-ladder-41315-large.mp4",
    "thumbnailUrl": "/drill-thumb-agility.png",
    "description": "دو پا سریع در باکس و پرتاب یک پا به سمت بیرون جهت حفظ تعادل.",
    "steps": [
      "دو پا سریع در باکس و پرتاب یک پا به سمت بیرون جهت حفظ تعادل."
    ],
    "coachingTips": "مرکز ثقل بدن پایین حفظ شود و نگاه سر بالا باشد.",
    "commonMistakes": "کوبیدن پاشنه پا روی زمین یا خم کردن کمر به جای زانوها."
  },
  {
    "id": "drill-1-20",
    "categoryKey": "agility",
    "categoryTitle": "چابکی",
    "subCategory": "تمرینات نردبان چابکی (Agility Ladder)",
    "title": "عبور از نردبان به‌صورت معکوس",
    "englishTitle": "Reverse Ladder Run",
    "difficulty": "پیشرفته",
    "duration": "۱۵ دقیقه",
    "setsReps": "۴ ست",
    "equipment": "نردبان چابکی",
    "targetSkill": "حس عمقی و حرکت به عقب مدافعین",
    "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-athlete-training-on-an-agility-ladder-41315-large.mp4",
    "thumbnailUrl": "/drill-thumb-agility.png",
    "description": "عبور رو به عقب از نردبان بدون نگاه کردن مستقیم به پاها.",
    "steps": [
      "عبور رو به عقب از نردبان بدون نگاه کردن مستقیم به پاها."
    ],
    "coachingTips": "مرکز ثقل بدن پایین حفظ شود و نگاه سر بالا باشد.",
    "commonMistakes": "کوبیدن پاشنه پا روی زمین یا خم کردن کمر به جای زانوها."
  },
  {
    "id": "drill-2-1",
    "categoryKey": "agility",
    "categoryTitle": "چابکی",
    "subCategory": "تمرینات چابکی با مخروط (Cone Agility Drills)",
    "title": "عبور مارپیچی از مخروط‌ها",
    "englishTitle": "Cone Slalom",
    "difficulty": "مبتدی",
    "duration": "۱۵ دقیقه",
    "setsReps": "۴ ست",
    "equipment": "مخروط‌های کله‌قندی",
    "targetSkill": "چرخش‌های سریع و خم کردن زانوها",
    "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-athlete-training-on-an-agility-ladder-41315-large.mp4",
    "thumbnailUrl": "https://images.openai.com/static-rsc-4/FplY-gwtyqkiTKsErvYB9DnRUx5iUZOkCetvtQq_QNsyKXb0D81J-XPXlsyyh01MkSa4kx6SFH79R6CaIWuHefUBJKvkY_Jvvq44MAeM2kyz1bbZDijA6NxPb0Cdh6dW-Vb7uSRwdWTCX17OGQkCLCTEA4CGXHY3C7EZOoXVWzw?purpose=inline",
    "description": "دویدن مارپیچ با زاویه تند دور مخروط‌ها با پایین آوردن مرکز ثقل.",
    "steps": [
      "دویدن مارپیچ با زاویه تند دور مخروط‌ها با پایین آوردن مرکز ثقل."
    ],
    "coachingTips": "مرکز ثقل بدن پایین حفظ شود و نگاه سر بالا باشد.",
    "commonMistakes": "کوبیدن پاشنه پا روی زمین یا خم کردن کمر به جای زانوها."
  },
  {
    "id": "drill-2-2",
    "categoryKey": "agility",
    "categoryTitle": "چابکی",
    "subCategory": "تمرینات چابکی با مخروط (Cone Agility Drills)",
    "title": "دویدن زیگزاگی",
    "englishTitle": "Zigzag Run",
    "difficulty": "مبتدی",
    "duration": "۱۵ دقیقه",
    "setsReps": "۴ ست",
    "equipment": "مخروط‌ها",
    "targetSkill": "تغییر زاویه شتاب و ترمز",
    "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-athlete-training-on-an-agility-ladder-41315-large.mp4",
    "thumbnailUrl": "/drill-thumb-agility.png",
    "description": "حرکت مورب از مخروطی به مخروط دیگر با شتاب‌گیری و ترمز ناگهانی.",
    "steps": [
      "حرکت مورب از مخروطی به مخروط دیگر با شتاب‌گیری و ترمز ناگهانی."
    ],
    "coachingTips": "مرکز ثقل بدن پایین حفظ شود و نگاه سر بالا باشد.",
    "commonMistakes": "کوبیدن پاشنه پا روی زمین یا خم کردن کمر به جای زانوها."
  },
  {
    "id": "drill-2-3",
    "categoryKey": "agility",
    "categoryTitle": "چابکی",
    "subCategory": "تمرینات چابکی با مخروط (Cone Agility Drills)",
    "title": "تمرین تی (T-Drill)",
    "englishTitle": "T-Drill",
    "difficulty": "متوسط",
    "duration": "۱۵ دقیقه",
    "setsReps": "۴ ست",
    "equipment": "۴ عدد مخروط",
    "targetSkill": "تست استاندارد چابکی چندجهته",
    "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-athlete-training-on-an-agility-ladder-41315-large.mp4",
    "thumbnailUrl": "https://images.openai.com/static-rsc-4/I4SmXYZRvntG-i4nvcoYINfx8O0XLAkw0mlnIRka4visbC2Mzk_oTbaioDh0IN5vqKX18-OcqZsRhElakzuLaaw6jA7yZKWjPfdNVTat7mHxldTjG3Y-HKJus-Ckv4QleEsoZJS_ond0f6ZlNvEb3_7JNmwymudYD57EdjN_7Nk?purpose=inline",
    "description": "دوی مستقیم ۱۰ متر به سمت مخروط وسط، شافل به چپ، شافل به راست و بازگشت عقب‌عقب.",
    "steps": [
      "دوی مستقیم ۱۰ متر به سمت مخروط وسط، شافل به چپ، شافل به راست و بازگشت عقب‌عقب."
    ],
    "coachingTips": "مرکز ثقل بدن پایین حفظ شود و نگاه سر بالا باشد.",
    "commonMistakes": "کوبیدن پاشنه پا روی زمین یا خم کردن کمر به جای زانوها."
  },
  {
    "id": "drill-2-4",
    "categoryKey": "agility",
    "categoryTitle": "چابکی",
    "subCategory": "تمرینات چابکی با مخروط (Cone Agility Drills)",
    "title": "شاتل ۵-۱۰-۵ (Pro Agility)",
    "englishTitle": "5-10-5 Shuttle",
    "difficulty": "پیشرفته",
    "duration": "۱۵ دقیقه",
    "setsReps": "۴ ست",
    "equipment": "۳ عدد مخروط در یک خط",
    "targetSkill": "شتاب انفجاری و برش عرضی",
    "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-athlete-training-on-an-agility-ladder-41315-large.mp4",
    "thumbnailUrl": "https://images.openai.com/static-rsc-4/z23LmdWKr3Qy3MKnUeloFM6tfuD8QFQ_RwsT_ZVCfRIG7Jut-oEabVCAHGUiMDmxP0oK-Zwed-hOBXcdDyhDM4Q2GxctqB4Xi9SrMyRAhZIFuD4E2xp8pEdAPmi2Lnvhme9pLCMbFIdlwlW129mSZjCGHztFXPfuu9KkxEeFkIw?purpose=inline",
    "description": "استارت ۵ یارد به راست، لمس خط، ۱۰ یارد استارت به چپ، لمس خط و ۵ یارد نهایی عبور از خط میانی.",
    "steps": [
      "استارت ۵ یارد به راست، لمس خط، ۱۰ یارد استارت به چپ، لمس خط و ۵ یارد نهایی عبور از خط میانی."
    ],
    "coachingTips": "مرکز ثقل بدن پایین حفظ شود و نگاه سر بالا باشد.",
    "commonMistakes": "کوبیدن پاشنه پا روی زمین یا خم کردن کمر به جای زانوها."
  },
  {
    "id": "drill-2-5",
    "categoryKey": "agility",
    "categoryTitle": "چابکی",
    "subCategory": "تمرینات چابکی با مخروط (Cone Agility Drills)",
    "title": "تمرین چهارگوش",
    "englishTitle": "Box Drill",
    "difficulty": "متوسط",
    "duration": "۱۵ دقیقه",
    "setsReps": "۴ ست",
    "equipment": "۴ مخروط در مربع ۵×۵ متر",
    "targetSkill": "ترکیب دوی مستقیم، شافل و بک‌پدال",
    "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-athlete-training-on-an-agility-ladder-41315-large.mp4",
    "thumbnailUrl": "/drill-thumb-agility.png",
    "description": "حرکت در اضلاع مربع با تغییر متناوب نوع دویدن در هر ضلع.",
    "steps": [
      "حرکت در اضلاع مربع با تغییر متناوب نوع دویدن در هر ضلع."
    ],
    "coachingTips": "مرکز ثقل بدن پایین حفظ شود و نگاه سر بالا باشد.",
    "commonMistakes": "کوبیدن پاشنه پا روی زمین یا خم کردن کمر به جای زانوها."
  },
  {
    "id": "drill-2-6",
    "categoryKey": "agility",
    "categoryTitle": "چابکی",
    "subCategory": "تمرینات چابکی با مخروط (Cone Agility Drills)",
    "title": "چابکی مربعی",
    "englishTitle": "Square Agility Drill",
    "difficulty": "متوسط",
    "duration": "۱۵ دقیقه",
    "setsReps": "۴ ست",
    "equipment": "۴ عدد مخروط",
    "targetSkill": "برش‌های سریع ۹۰ درجه",
    "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-athlete-training-on-an-agility-ladder-41315-large.mp4",
    "thumbnailUrl": "/drill-thumb-agility.png",
    "description": "دویدن دور کادرهای مربع و حرکت قطری ناگهانی به گوشه روبرو.",
    "steps": [
      "دویدن دور کادرهای مربع و حرکت قطری ناگهانی به گوشه روبرو."
    ],
    "coachingTips": "مرکز ثقل بدن پایین حفظ شود و نگاه سر بالا باشد.",
    "commonMistakes": "کوبیدن پاشنه پا روی زمین یا خم کردن کمر به جای زانوها."
  },
  {
    "id": "drill-2-7",
    "categoryKey": "agility",
    "categoryTitle": "چابکی",
    "subCategory": "تمرینات چابکی با مخروط (Cone Agility Drills)",
    "title": "تمرین ال (L-Drill)",
    "englishTitle": "L-Drill",
    "difficulty": "متوسط",
    "duration": "۱۵ دقیقه",
    "setsReps": "۴ ست",
    "equipment": "۳ مخروط به شکل حرف L",
    "targetSkill": "چرخش تنگاتنگ و شتاب فوری",
    "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-athlete-training-on-an-agility-ladder-41315-large.mp4",
    "thumbnailUrl": "/drill-thumb-agility.png",
    "description": "دوی ۵ متر رفت و برگشت، دور زدن مخروط دوم، پیچیدن دور مخروط سوم و اتمام با سرعت بالا.",
    "steps": [
      "دوی ۵ متر رفت و برگشت، دور زدن مخروط دوم، پیچیدن دور مخروط سوم و اتمام با سرعت بالا."
    ],
    "coachingTips": "مرکز ثقل بدن پایین حفظ شود و نگاه سر بالا باشد.",
    "commonMistakes": "کوبیدن پاشنه پا روی زمین یا خم کردن کمر به جای زانوها."
  },
  {
    "id": "drill-2-8",
    "categoryKey": "agility",
    "categoryTitle": "چابکی",
    "subCategory": "تمرینات چابکی با مخروط (Cone Agility Drills)",
    "title": "تمرین دبلیو (W-Drill)",
    "englishTitle": "W-Drill",
    "difficulty": "متوسط",
    "duration": "۱۵ دقیقه",
    "setsReps": "۴ ست",
    "equipment": "۵ مخروط به شکل حرف W",
    "targetSkill": "تغییر جهت قطری به جلو و عقب",
    "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-athlete-training-on-an-agility-ladder-41315-large.mp4",
    "thumbnailUrl": "/drill-thumb-agility.png",
    "description": "استارت‌های قطری متوالی به سمت مخروط‌های روبرو و بازگشت زاویه‌دار.",
    "steps": [
      "استارت‌های قطری متوالی به سمت مخروط‌های روبرو و بازگشت زاویه‌دار."
    ],
    "coachingTips": "مرکز ثقل بدن پایین حفظ شود و نگاه سر بالا باشد.",
    "commonMistakes": "کوبیدن پاشنه پا روی زمین یا خم کردن کمر به جای زانوها."
  },
  {
    "id": "drill-2-9",
    "categoryKey": "agility",
    "categoryTitle": "چابکی",
    "subCategory": "تمرینات چابکی با مخروط (Cone Agility Drills)",
    "title": "تمرین ام (M-Drill)",
    "englishTitle": "M-Drill",
    "difficulty": "متوسط",
    "duration": "۱۵ دقیقه",
    "setsReps": "۴ ست",
    "equipment": "۵ مخروط به فرم M",
    "targetSkill": "پوشش فضاهای هجومی و دفاعی",
    "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-athlete-training-on-an-agility-ladder-41315-large.mp4",
    "thumbnailUrl": "/drill-thumb-agility.png",
    "description": "شتاب‌گیری در مسیرهای متقاطع حرف M با حفظ گارد فوتبالی.",
    "steps": [
      "شتاب‌گیری در مسیرهای متقاطع حرف M با حفظ گارد فوتبالی."
    ],
    "coachingTips": "مرکز ثقل بدن پایین حفظ شود و نگاه سر بالا باشد.",
    "commonMistakes": "کوبیدن پاشنه پا روی زمین یا خم کردن کمر به جای زانوها."
  },
  {
    "id": "drill-2-10",
    "categoryKey": "agility",
    "categoryTitle": "چابکی",
    "subCategory": "تمرینات چابکی با مخروط (Cone Agility Drills)",
    "title": "دویدن عدد هشت (8)",
    "englishTitle": "Figure 8 Run",
    "difficulty": "مبتدی",
    "duration": "۱۵ دقیقه",
    "setsReps": "۴ ست",
    "equipment": "۲ مخروط با فاصله ۳ متر",
    "targetSkill": "کنترل سرعت زاویه‌ای و خمیدگی بدن",
    "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-athlete-training-on-an-agility-ladder-41315-large.mp4",
    "thumbnailUrl": "/drill-thumb-agility.png",
    "description": "دویدن سریع دور دو مخروط در یک مسیر پیوسته هشت انگلیسی.",
    "steps": [
      "دویدن سریع دور دو مخروط در یک مسیر پیوسته هشت انگلیسی."
    ],
    "coachingTips": "مرکز ثقل بدن پایین حفظ شود و نگاه سر بالا باشد.",
    "commonMistakes": "کوبیدن پاشنه پا روی زمین یا خم کردن کمر به جای زانوها."
  },
  {
    "id": "drill-2-11",
    "categoryKey": "agility",
    "categoryTitle": "چابکی",
    "subCategory": "تمرینات چابکی با مخروط (Cone Agility Drills)",
    "title": "تمرین ستاره‌ای",
    "englishTitle": "Star Drill",
    "difficulty": "پیشرفته",
    "duration": "۱۵ دقیقه",
    "setsReps": "۴ ست",
    "equipment": "۵ مخروط (یک مرکز و ۴ گوشه)",
    "targetSkill": "شعاع واکنش چندجهته",
    "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-athlete-training-on-an-agility-ladder-41315-large.mp4",
    "thumbnailUrl": "/drill-thumb-agility.png",
    "description": "استارت از مخروط مرکز به هر یک از ۴ مخروط پیرامونی و بازگشت فوری به مرکز.",
    "steps": [
      "استارت از مخروط مرکز به هر یک از ۴ مخروط پیرامونی و بازگشت فوری به مرکز."
    ],
    "coachingTips": "مرکز ثقل بدن پایین حفظ شود و نگاه سر بالا باشد.",
    "commonMistakes": "کوبیدن پاشنه پا روی زمین یا خم کردن کمر به جای زانوها."
  },
  {
    "id": "drill-2-12",
    "categoryKey": "agility",
    "categoryTitle": "چابکی",
    "subCategory": "تمرینات چابکی با مخروط (Cone Agility Drills)",
    "title": "تمرین لوزی",
    "englishTitle": "Diamond Drill",
    "difficulty": "متوسط",
    "duration": "۱۵ دقیقه",
    "setsReps": "۴ ست",
    "equipment": "۴ مخروط به فرم لوزی",
    "targetSkill": "جابجایی قطری مدافعان میانی",
    "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-athlete-training-on-an-agility-ladder-41315-large.mp4",
    "thumbnailUrl": "/drill-thumb-agility.png",
    "description": "حرکت سریع در محیط لوزی با گام‌های ضربدری و تغییر جهت‌های تند.",
    "steps": [
      "حرکت سریع در محیط لوزی با گام‌های ضربدری و تغییر جهت‌های تند."
    ],
    "coachingTips": "مرکز ثقل بدن پایین حفظ شود و نگاه سر بالا باشد.",
    "commonMistakes": "کوبیدن پاشنه پا روی زمین یا خم کردن کمر به جای زانوها."
  },
  {
    "id": "drill-2-13",
    "categoryKey": "agility",
    "categoryTitle": "چابکی",
    "subCategory": "تمرینات چابکی با مخروط (Cone Agility Drills)",
    "title": "تمرین قطب‌نما",
    "englishTitle": "Compass Drill",
    "difficulty": "پیشرفته",
    "duration": "۱۵ دقیقه",
    "setsReps": "۴ ست",
    "equipment": "۸ مخروط در دایره",
    "targetSkill": "جهت‌یابی فضایی در زمین فوتبال",
    "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-athlete-training-on-an-agility-ladder-41315-large.mp4",
    "thumbnailUrl": "/drill-thumb-agility.png",
    "description": "دویدن به سمت جهات جغرافیایی (شمال، جنوب، شرق، غرب و زوایا) با اعلام مربی.",
    "steps": [
      "دویدن به سمت جهات جغرافیایی (شمال، جنوب، شرق، غرب و زوایا) با اعلام مربی."
    ],
    "coachingTips": "مرکز ثقل بدن پایین حفظ شود و نگاه سر بالا باشد.",
    "commonMistakes": "کوبیدن پاشنه پا روی زمین یا خم کردن کمر به جای زانوها."
  },
  {
    "id": "drill-2-14",
    "categoryKey": "agility",
    "categoryTitle": "چابکی",
    "subCategory": "تمرینات چابکی با مخروط (Cone Agility Drills)",
    "title": "دویدن چهارگوشه",
    "englishTitle": "Four-Corner Sprint",
    "difficulty": "متوسط",
    "duration": "۱۵ دقیقه",
    "setsReps": "۴ ست",
    "equipment": "۴ مخروط گوشه زمین",
    "targetSkill": "استقامت سرعتی در فواصل متوسط",
    "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-athlete-training-on-an-agility-ladder-41315-large.mp4",
    "thumbnailUrl": "/drill-thumb-agility.png",
    "description": "دوی سرعت در اضلاع و قطرها با حداکثر توان قلبی عروقی.",
    "steps": [
      "دوی سرعت در اضلاع و قطرها با حداکثر توان قلبی عروقی."
    ],
    "coachingTips": "مرکز ثقل بدن پایین حفظ شود و نگاه سر بالا باشد.",
    "commonMistakes": "کوبیدن پاشنه پا روی زمین یا خم کردن کمر به جای زانوها."
  },
  {
    "id": "drill-2-15",
    "categoryKey": "agility",
    "categoryTitle": "چابکی",
    "subCategory": "تمرینات چابکی با مخروط (Cone Agility Drills)",
    "title": "حرکت چندجهته بین مخروط‌ها",
    "englishTitle": "Multi-Directional Cone Run",
    "difficulty": "پیشرفته",
    "duration": "۱۵ دقیقه",
    "setsReps": "۴ ست",
    "equipment": "مخروط‌های نامنظم",
    "targetSkill": "انعطاف تصمیم‌گیری حرکتی",
    "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-athlete-training-on-an-agility-ladder-41315-large.mp4",
    "thumbnailUrl": "/drill-thumb-agility.png",
    "description": "رد شدن از بین مخروط‌های پراکنده با الگوهای ترکیبی.",
    "steps": [
      "رد شدن از بین مخروط‌های پراکنده با الگوهای ترکیبی."
    ],
    "coachingTips": "مرکز ثقل بدن پایین حفظ شود و نگاه سر بالا باشد.",
    "commonMistakes": "کوبیدن پاشنه پا روی زمین یا خم کردن کمر به جای زانوها."
  },
  {
    "id": "drill-2-16",
    "categoryKey": "agility",
    "categoryTitle": "چابکی",
    "subCategory": "تمرینات چابکی با مخروط (Cone Agility Drills)",
    "title": "شاتل کوتاه",
    "englishTitle": "Short Shuttle Run",
    "difficulty": "مبتدی",
    "duration": "۱۵ دقیقه",
    "setsReps": "۴ ست",
    "equipment": "مخروط‌های فاصله‌دار",
    "targetSkill": "کاهش شتاب و استارت مجدد",
    "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-athlete-training-on-an-agility-ladder-41315-large.mp4",
    "thumbnailUrl": "/drill-thumb-agility.png",
    "description": "شاتل‌های سرعتی ۵ و ۱۰ متری با ترمزهای محکم پای تکیه‌گاه.",
    "steps": [
      "شاتل‌های سرعتی ۵ و ۱۰ متری با ترمزهای محکم پای تکیه‌گاه."
    ],
    "coachingTips": "مرکز ثقل بدن پایین حفظ شود و نگاه سر بالا باشد.",
    "commonMistakes": "کوبیدن پاشنه پا روی زمین یا خم کردن کمر به جای زانوها."
  },
  {
    "id": "drill-2-17",
    "categoryKey": "agility",
    "categoryTitle": "چابکی",
    "subCategory": "تمرینات چابکی با مخروط (Cone Agility Drills)",
    "title": "عبور بافت‌های از مخروط‌ها",
    "englishTitle": "Cone Weave",
    "difficulty": "مبتدی",
    "duration": "۱۵ دقیقه",
    "setsReps": "۴ ست",
    "equipment": "ردیف متراکم مخروط",
    "targetSkill": "ریزگام‌های فرکانس بالا",
    "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-athlete-training-on-an-agility-ladder-41315-large.mp4",
    "thumbnailUrl": "/drill-thumb-agility.png",
    "description": "بافتن گام‌ها از لابه‌لای مخروط‌های با فاصله کمتر از ۱ متر.",
    "steps": [
      "بافتن گام‌ها از لابه‌لای مخروط‌های با فاصله کمتر از ۱ متر."
    ],
    "coachingTips": "مرکز ثقل بدن پایین حفظ شود و نگاه سر بالا باشد.",
    "commonMistakes": "کوبیدن پاشنه پا روی زمین یا خم کردن کمر به جای زانوها."
  },
  {
    "id": "drill-2-18",
    "categoryKey": "agility",
    "categoryTitle": "چابکی",
    "subCategory": "تمرینات چابکی با مخروط (Cone Agility Drills)",
    "title": "حرکت جلو و عقب بین مخروط‌ها",
    "englishTitle": "Forward-Backward Cone Run",
    "difficulty": "متوسط",
    "duration": "۱۵ دقیقه",
    "setsReps": "۴ ست",
    "equipment": "مخروط‌های موازی",
    "targetSkill": "تعادل خط مستقیم",
    "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-athlete-training-on-an-agility-ladder-41315-large.mp4",
    "thumbnailUrl": "/drill-thumb-agility.png",
    "description": "پیشروی به جلو و عقب‌نشینی سریع به دور هر مانع.",
    "steps": [
      "پیشروی به جلو و عقب‌نشینی سریع به دور هر مانع."
    ],
    "coachingTips": "مرکز ثقل بدن پایین حفظ شود و نگاه سر بالا باشد.",
    "commonMistakes": "کوبیدن پاشنه پا روی زمین یا خم کردن کمر به جای زانوها."
  },
  {
    "id": "drill-2-19",
    "categoryKey": "agility",
    "categoryTitle": "چابکی",
    "subCategory": "تمرینات چابکی با مخروط (Cone Agility Drills)",
    "title": "حرکت جانبی بین مخروط‌ها",
    "englishTitle": "Lateral Cone Shuffle",
    "difficulty": "مبتدی",
    "duration": "۱۵ دقیقه",
    "setsReps": "۴ ست",
    "equipment": "مخروط‌های افقی",
    "targetSkill": "گارد دفاعی فشرده",
    "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-athlete-training-on-an-agility-ladder-41315-large.mp4",
    "thumbnailUrl": "/drill-thumb-agility.png",
    "description": "حرکت ساید استپ ممتد و چرخش پیرامون پایه‌های مخروط.",
    "steps": [
      "حرکت ساید استپ ممتد و چرخش پیرامون پایه‌های مخروط."
    ],
    "coachingTips": "مرکز ثقل بدن پایین حفظ شود و نگاه سر بالا باشد.",
    "commonMistakes": "کوبیدن پاشنه پا روی زمین یا خم کردن کمر به جای زانوها."
  },
  {
    "id": "drill-2-20",
    "categoryKey": "agility",
    "categoryTitle": "چابکی",
    "subCategory": "تمرینات چابکی با مخروط (Cone Agility Drills)",
    "title": "دوی سرعت و تغییر مسیر",
    "englishTitle": "Sprint and Cut",
    "difficulty": "پیشرفته",
    "duration": "۱۵ دقیقه",
    "setsReps": "۴ ست",
    "equipment": "مخروط نشانه برش",
    "targetSkill": "برش زاویه‌دار انفجاری فرار از آفساید",
    "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-athlete-training-on-an-agility-ladder-41315-large.mp4",
    "thumbnailUrl": "/drill-thumb-agility.png",
    "description": "استارت مستقیم تمام سرعت و کاشت پای بیرونی و چرخش شدید با زاویه ۹۰ درجه.",
    "steps": [
      "استارت مستقیم تمام سرعت و کاشت پای بیرونی و چرخش شدید با زاویه ۹۰ درجه."
    ],
    "coachingTips": "مرکز ثقل بدن پایین حفظ شود و نگاه سر بالا باشد.",
    "commonMistakes": "کوبیدن پاشنه پا روی زمین یا خم کردن کمر به جای زانوها."
  },
  {
    "id": "drill-3-1",
    "categoryKey": "agility",
    "categoryTitle": "چابکی",
    "subCategory": "تمرینات تغییر جهت (Change of Direction)",
    "title": "تغییر جهت ۴۵ درجه",
    "englishTitle": "45-Degree Cut",
    "difficulty": "مبتدی",
    "duration": "۱۵ دقیقه",
    "setsReps": "۴ ست",
    "equipment": "مخروط نشانگر",
    "targetSkill": "برش مورب تهاجمی",
    "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-athlete-training-on-an-agility-ladder-41315-large.mp4",
    "thumbnailUrl": "https://images.openai.com/static-rsc-4/JANPU4jDStcaSSRAsQKdDwmshy2PpKQuZCSGLIORyZZLwHh2CHytFI_BxA1YiXUdJfRXwA_7PhtCVc9xxzxeEQn8HX0Pe8IGboReIZfhx_rjwK9FNctCME2qA5bD8YPR_fUzcRFZsnxYzo0V6PZ_B214EtODtb6RQnkFy3X7SwI?purpose=inline",
    "description": "کاشت پا در زاویه ۴۵ درجه و انفجار سریع به فضای خالی سمت مخالف.",
    "steps": [
      "کاشت پا در زاویه ۴۵ درجه و انفجار سریع به فضای خالی سمت مخالف."
    ],
    "coachingTips": "مرکز ثقل بدن پایین حفظ شود و نگاه سر بالا باشد.",
    "commonMistakes": "کوبیدن پاشنه پا روی زمین یا خم کردن کمر به جای زانوها."
  },
  {
    "id": "drill-3-2",
    "categoryKey": "agility",
    "categoryTitle": "چابکی",
    "subCategory": "تمرینات تغییر جهت (Change of Direction)",
    "title": "تغییر جهت ۹۰ درجه",
    "englishTitle": "90-Degree Cut",
    "difficulty": "متوسط",
    "duration": "۱۵ دقیقه",
    "setsReps": "۴ ست",
    "equipment": "مخروط نشانگر",
    "targetSkill": "دور زدن مدافع در کانال‌های کناری",
    "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-athlete-training-on-an-agility-ladder-41315-large.mp4",
    "thumbnailUrl": "/drill-thumb-agility.png",
    "description": "ترمز عمود و پرتاب بدن در زاویه ۹۰ درجه نسبت به مسیر قبلی.",
    "steps": [
      "ترمز عمود و پرتاب بدن در زاویه ۹۰ درجه نسبت به مسیر قبلی."
    ],
    "coachingTips": "مرکز ثقل بدن پایین حفظ شود و نگاه سر بالا باشد.",
    "commonMistakes": "کوبیدن پاشنه پا روی زمین یا خم کردن کمر به جای زانوها."
  },
  {
    "id": "drill-3-3",
    "categoryKey": "agility",
    "categoryTitle": "چابکی",
    "subCategory": "تمرینات تغییر جهت (Change of Direction)",
    "title": "چرخش ۱۸۰ درجه",
    "englishTitle": "180-Degree Turn",
    "difficulty": "متوسط",
    "duration": "۱۵ دقیقه",
    "setsReps": "۴ ست",
    "equipment": "مخروط خط برگشت",
    "targetSkill": "بازگشت فوری در انتقال‌های منفی",
    "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-athlete-training-on-an-agility-ladder-41315-large.mp4",
    "thumbnailUrl": "/drill-thumb-agility.png",
    "description": "چرخش کامل نیم‌دایره در یک گام و بازگشت به مسیر مبدأ با حداکثر توان.",
    "steps": [
      "چرخش کامل نیم‌دایره در یک گام و بازگشت به مسیر مبدأ با حداکثر توان."
    ],
    "coachingTips": "مرکز ثقل بدن پایین حفظ شود و نگاه سر بالا باشد.",
    "commonMistakes": "کوبیدن پاشنه پا روی زمین یا خم کردن کمر به جای زانوها."
  },
  {
    "id": "drill-3-4",
    "categoryKey": "agility",
    "categoryTitle": "چابکی",
    "subCategory": "تمرینات تغییر جهت (Change of Direction)",
    "title": "چرخش ۳۶۰ درجه",
    "englishTitle": "360-Degree Turn",
    "difficulty": "پیشرفته",
    "duration": "۱۵ دقیقه",
    "setsReps": "۴ ست",
    "equipment": "مخروط محوری",
    "targetSkill": "حفظ توپ چرخشی در مرکز میدان",
    "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-athlete-training-on-an-agility-ladder-41315-large.mp4",
    "thumbnailUrl": "/drill-thumb-agility.png",
    "description": "گردش کامل به دور مانع در حداقل شعاع ممکن و خروج سریع.",
    "steps": [
      "گردش کامل به دور مانع در حداقل شعاع ممکن و خروج سریع."
    ],
    "coachingTips": "مرکز ثقل بدن پایین حفظ شود و نگاه سر بالا باشد.",
    "commonMistakes": "کوبیدن پاشنه پا روی زمین یا خم کردن کمر به جای زانوها."
  },
  {
    "id": "drill-3-5",
    "categoryKey": "agility",
    "categoryTitle": "چابکی",
    "subCategory": "تمرینات تغییر جهت (Change of Direction)",
    "title": "دویدن و چرخش",
    "englishTitle": "Sprint and Turn",
    "difficulty": "متوسط",
    "duration": "۱۵ دقیقه",
    "setsReps": "۴ ست",
    "equipment": "مخروط‌ها",
    "targetSkill": "ترکیب سرعت خطی با مانور چرخشی",
    "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-athlete-training-on-an-agility-ladder-41315-large.mp4",
    "thumbnailUrl": "/drill-thumb-agility.png",
    "description": "سرعت مستقیم به مدت ۱۵ متر و گردش بلافاصله پیرامون هدف.",
    "steps": [
      "سرعت مستقیم به مدت ۱۵ متر و گردش بلافاصله پیرامون هدف."
    ],
    "coachingTips": "مرکز ثقل بدن پایین حفظ شود و نگاه سر بالا باشد.",
    "commonMistakes": "کوبیدن پاشنه پا روی زمین یا خم کردن کمر به جای زانوها."
  },
  {
    "id": "drill-3-6",
    "categoryKey": "agility",
    "categoryTitle": "چابکی",
    "subCategory": "تمرینات تغییر جهت (Change of Direction)",
    "title": "توقف و شروع مجدد",
    "englishTitle": "Stop and Go",
    "difficulty": "پیشرفته",
    "duration": "۱۵ دقیقه",
    "setsReps": "۴ ست",
    "equipment": "خطوط نشانگر",
    "targetSkill": "فریب توقف مدافع و استارت ناگهانی",
    "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-athlete-training-on-an-agility-ladder-41315-large.mp4",
    "thumbnailUrl": "/drill-thumb-agility.png",
    "description": "کاهش کامل سرعت به صفر در کسری از ثانیه و انفجار مجدد روبه جلو.",
    "steps": [
      "کاهش کامل سرعت به صفر در کسری از ثانیه و انفجار مجدد روبه جلو."
    ],
    "coachingTips": "مرکز ثقل بدن پایین حفظ شود و نگاه سر بالا باشد.",
    "commonMistakes": "کوبیدن پاشنه پا روی زمین یا خم کردن کمر به جای زانوها."
  },
  {
    "id": "drill-3-7",
    "categoryKey": "agility",
    "categoryTitle": "چابکی",
    "subCategory": "تمرینات تغییر جهت (Change of Direction)",
    "title": "تمرین کاهش سرعت (ترمز)",
    "englishTitle": "Deceleration Drill",
    "difficulty": "متوسط",
    "duration": "۱۵ دقیقه",
    "setsReps": "۴ ست",
    "equipment": "مخروط ترمز",
    "targetSkill": "کاهش فشار روی رباط صلیبی و جذب ضربه زانو",
    "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-athlete-training-on-an-agility-ladder-41315-large.mp4",
    "thumbnailUrl": "https://images.openai.com/static-rsc-4/-tnsqZFm632G_Rn9ipilux4-W6kXfngGmxJOIUfW9trlhGSqjxJWy7YiqhnLiATKQXqkZdtBLbpp_W1Q0wF4QQIS0kMQNRyxzGwtP8WrTWa-1rf0WV_y70z31I_ftvAqW2DpcZriWXspz2QnSdhRcB462wLkHo-0yVrPOixgGQ8?purpose=inline",
    "description": "توقف در ۲ یا ۳ گام کوتاه از حداکثر سرعت با زوایای صحیح بدنی.",
    "steps": [
      "توقف در ۲ یا ۳ گام کوتاه از حداکثر سرعت با زوایای صحیح بدنی."
    ],
    "coachingTips": "مرکز ثقل بدن پایین حفظ شود و نگاه سر بالا باشد.",
    "commonMistakes": "کوبیدن پاشنه پا روی زمین یا خم کردن کمر به جای زانوها."
  },
  {
    "id": "drill-3-8",
    "categoryKey": "agility",
    "categoryTitle": "چابکی",
    "subCategory": "تمرینات تغییر جهت (Change of Direction)",
    "title": "شتاب‌گیری پس از چرخش",
    "englishTitle": "Acceleration After Turn",
    "difficulty": "پیشرفته",
    "duration": "۱۵ دقیقه",
    "setsReps": "۴ ست",
    "equipment": "مخروط و زمان‌سنج",
    "targetSkill": "گام نخست انفجاری بعد از دور زدن",
    "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-athlete-training-on-an-agility-ladder-41315-large.mp4",
    "thumbnailUrl": "https://images.openai.com/static-rsc-4/L4ROmW2J6NCSCf3yeScSOv4wBtXeO3TFyVmuKnB-KTyZclSmJ2XN1xf5EMvC2nQNVaZFZZgKenCd6XFrbnNPtWAlCHMTAXbYwy0CV78bTAjlleaAwiuS86uifxogEUyAWEQk4CIJZ0x7AXMKojno1Sz0_IxVIOWpzvsM2MXFl3Y?purpose=inline",
    "description": "چرخش ۱۸۰ درجه و رسیدن به حداکثر سرعت در ۳ گام ابتدایی.",
    "steps": [
      "چرخش ۱۸۰ درجه و رسیدن به حداکثر سرعت در ۳ گام ابتدایی."
    ],
    "coachingTips": "مرکز ثقل بدن پایین حفظ شود و نگاه سر بالا باشد.",
    "commonMistakes": "کوبیدن پاشنه پا روی زمین یا خم کردن کمر به جای زانوها."
  },
  {
    "id": "drill-3-9",
    "categoryKey": "agility",
    "categoryTitle": "چابکی",
    "subCategory": "تمرینات تغییر جهت (Change of Direction)",
    "title": "حرکت عقب‌عقب و سپس سرعت",
    "englishTitle": "Backpedal to Sprint",
    "difficulty": "متوسط",
    "duration": "۱۵ دقیقه",
    "setsReps": "۴ ست",
    "equipment": "مخروط‌های ۱۰ متری",
    "targetSkill": "واکنش مدافع در دفع پاس عمقی حریف",
    "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-athlete-training-on-an-agility-ladder-41315-large.mp4",
    "thumbnailUrl": "/drill-thumb-agility.png",
    "description": "عقب‌نشینی سریع به مدت ۵ متر و بلافاصله پرتاب بدن به سمت جلو با چرخش تنه.",
    "steps": [
      "عقب‌نشینی سریع به مدت ۵ متر و بلافاصله پرتاب بدن به سمت جلو با چرخش تنه."
    ],
    "coachingTips": "مرکز ثقل بدن پایین حفظ شود و نگاه سر بالا باشد.",
    "commonMistakes": "کوبیدن پاشنه پا روی زمین یا خم کردن کمر به جای زانوها."
  },
  {
    "id": "drill-3-10",
    "categoryKey": "agility",
    "categoryTitle": "چابکی",
    "subCategory": "تمرینات تغییر جهت (Change of Direction)",
    "title": "حرکت جانبی و سپس سرعت",
    "englishTitle": "Shuffle to Sprint",
    "difficulty": "متوسط",
    "duration": "۱۵ دقیقه",
    "setsReps": "۴ ست",
    "equipment": "مخروط‌ها",
    "targetSkill": "تبدیل گارد دفاعی به استارت بازپس‌گیری",
    "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-athlete-training-on-an-agility-ladder-41315-large.mp4",
    "thumbnailUrl": "/drill-thumb-agility.png",
    "description": "گام‌های شافل جانبی و ناگهان چرخش و استارت رو به جلو.",
    "steps": [
      "گام‌های شافل جانبی و ناگهان چرخش و استارت رو به جلو."
    ],
    "coachingTips": "مرکز ثقل بدن پایین حفظ شود و نگاه سر بالا باشد.",
    "commonMistakes": "کوبیدن پاشنه پا روی زمین یا خم کردن کمر به جای زانوها."
  },
  {
    "id": "drill-3-11",
    "categoryKey": "agility",
    "categoryTitle": "چابکی",
    "subCategory": "تمرینات تغییر جهت (Change of Direction)",
    "title": "انتقال از حرکت مستقیم به جانبی",
    "englishTitle": "Forward to Lateral Transition",
    "difficulty": "مبتدی",
    "duration": "۱۵ دقیقه",
    "setsReps": "۴ ست",
    "equipment": "مخروط‌ها",
    "targetSkill": "بستن خط عبور توپ مهاجم",
    "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-athlete-training-on-an-agility-ladder-41315-large.mp4",
    "thumbnailUrl": "/drill-thumb-agility.png",
    "description": "دویدن مستقیم و انتقال بی‌وقفه به حرکت در عرض زمین.",
    "steps": [
      "دویدن مستقیم و انتقال بی‌وقفه به حرکت در عرض زمین."
    ],
    "coachingTips": "مرکز ثقل بدن پایین حفظ شود و نگاه سر بالا باشد.",
    "commonMistakes": "کوبیدن پاشنه پا روی زمین یا خم کردن کمر به جای زانوها."
  },
  {
    "id": "drill-3-12",
    "categoryKey": "agility",
    "categoryTitle": "چابکی",
    "subCategory": "تمرینات تغییر جهت (Change of Direction)",
    "title": "انتقال از حرکت جانبی به مستقیم",
    "englishTitle": "Lateral to Forward Transition",
    "difficulty": "مبتدی",
    "duration": "۱۵ دقیقه",
    "setsReps": "۴ ست",
    "equipment": "مخروط‌ها",
    "targetSkill": "خروج از پوشش و ضدحمله",
    "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-athlete-training-on-an-agility-ladder-41315-large.mp4",
    "thumbnailUrl": "/drill-thumb-agility.png",
    "description": "حرکت دفاعی جانبی و شلیک به سمت جلو در مسیر هجومی.",
    "steps": [
      "حرکت دفاعی جانبی و شلیک به سمت جلو در مسیر هجومی."
    ],
    "coachingTips": "مرکز ثقل بدن پایین حفظ شود و نگاه سر بالا باشد.",
    "commonMistakes": "کوبیدن پاشنه پا روی زمین یا خم کردن کمر به جای زانوها."
  },
  {
    "id": "drill-3-13",
    "categoryKey": "agility",
    "categoryTitle": "چابکی",
    "subCategory": "تمرینات تغییر جهت (Change of Direction)",
    "title": "تغییر جهت چندمرحله‌ای",
    "englishTitle": "Multi-Cut Drill",
    "difficulty": "پیشرفته",
    "duration": "۱۵ دقیقه",
    "setsReps": "۴ ست",
    "equipment": "مجموعه مخروط‌های زیگزاگ",
    "targetSkill": "توالی مانور در فضاهای متراکم",
    "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-athlete-training-on-an-agility-ladder-41315-large.mp4",
    "thumbnailUrl": "/drill-thumb-agility.png",
    "description": "اجرای ۳ تا ۵ برش پیاپی با زوایای مختلف در کمتر از ۱۰ ثانیه.",
    "steps": [
      "اجرای ۳ تا ۵ برش پیاپی با زوایای مختلف در کمتر از ۱۰ ثانیه."
    ],
    "coachingTips": "مرکز ثقل بدن پایین حفظ شود و نگاه سر بالا باشد.",
    "commonMistakes": "کوبیدن پاشنه پا روی زمین یا خم کردن کمر به جای زانوها."
  },
  {
    "id": "drill-3-14",
    "categoryKey": "agility",
    "categoryTitle": "چابکی",
    "subCategory": "تمرینات تغییر جهت (Change of Direction)",
    "title": "تغییر جهت واکنشی",
    "englishTitle": "Reactive Cutting",
    "difficulty": "پیشرفته",
    "duration": "۱۵ دقیقه",
    "setsReps": "۴ ست",
    "equipment": "راهنمای دیداری مربی",
    "targetSkill": "چابکی تصمیم‌گیری با محرک بیرونی",
    "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-athlete-training-on-an-agility-ladder-41315-large.mp4",
    "thumbnailUrl": "/drill-thumb-agility.png",
    "description": "استارت با حداکثر سرعت و تغییر زاویه مسیر بر اساس اشاره دست مربی در لحظه آخر.",
    "steps": [
      "استارت با حداکثر سرعت و تغییر زاویه مسیر بر اساس اشاره دست مربی در لحظه آخر."
    ],
    "coachingTips": "مرکز ثقل بدن پایین حفظ شود و نگاه سر بالا باشد.",
    "commonMistakes": "کوبیدن پاشنه پا روی زمین یا خم کردن کمر به جای زانوها."
  },
  {
    "id": "drill-3-15",
    "categoryKey": "agility",
    "categoryTitle": "چابکی",
    "subCategory": "تمرینات تغییر جهت (Change of Direction)",
    "title": "سرعت، توقف و شروع مجدد",
    "englishTitle": "Sprint-Stop-Sprint",
    "difficulty": "پیشرفته",
    "duration": "۱۵ دقیقه",
    "setsReps": "۴ ست",
    "equipment": "ایستگاه‌های متوالی",
    "targetSkill": "سازگاری قلبی و عضلانی اینتروال شدید",
    "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-athlete-training-on-an-agility-ladder-41315-large.mp4",
    "thumbnailUrl": "/drill-thumb-agility.png",
    "description": "سیکل‌های ۵ متری انفجار، توقف قطعی ۱ ثانیه‌ای و انفجار مجدد.",
    "steps": [
      "سیکل‌های ۵ متری انفجار، توقف قطعی ۱ ثانیه‌ای و انفجار مجدد."
    ],
    "coachingTips": "مرکز ثقل بدن پایین حفظ شود و نگاه سر بالا باشد.",
    "commonMistakes": "کوبیدن پاشنه پا روی زمین یا خم کردن کمر به جای زانوها."
  },
  {
    "id": "drill-4-1",
    "categoryKey": "agility",
    "categoryTitle": "چابکی",
    "subCategory": "تمرینات چابکی واکنشی (Reactive Agility)",
    "title": "واکنش به فرمان مربی",
    "englishTitle": "Coach Command Drill",
    "difficulty": "مبتدی",
    "duration": "۱۵ دقیقه",
    "setsReps": "۴ ست",
    "equipment": "سوت و فرمان کلامی",
    "targetSkill": "زمان واکنش شنیداری و شروع حرکت",
    "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-athlete-training-on-an-agility-ladder-41315-large.mp4",
    "thumbnailUrl": "https://images.openai.com/static-rsc-4/DXhOpvBrNzF60RxiIevVMf5NB1OxHfS4gO3DyIzxIFfi_RfvBQ19QMihonLdFSzqOP_VPn3zV-GdgInzTvGgSt0MG84t_HgJnum8M5QmwhOi1yQR0Wvdi11uU_MDZ8ilgmUxKr0_7HyXfkQnWvFvdwXnoazxe_otQomCFq93C6g?purpose=inline",
    "description": "درجا زدن سریع و استارت به سمت درگاه اعلام شده به محض شنیدن نام رنگ یا شماره.",
    "steps": [
      "درجا زدن سریع و استارت به سمت درگاه اعلام شده به محض شنیدن نام رنگ یا شماره."
    ],
    "coachingTips": "مرکز ثقل بدن پایین حفظ شود و نگاه سر بالا باشد.",
    "commonMistakes": "کوبیدن پاشنه پا روی زمین یا خم کردن کمر به جای زانوها."
  },
  {
    "id": "drill-4-2",
    "categoryKey": "agility",
    "categoryTitle": "چابکی",
    "subCategory": "تمرینات چابکی واکنشی (Reactive Agility)",
    "title": "واکنش به رنگ مخروط",
    "englishTitle": "Color Cone Reaction",
    "difficulty": "متوسط",
    "duration": "۱۵ دقیقه",
    "setsReps": "۴ ست",
    "equipment": "۴ مخروط رنگی (قرمز، آبی، زرد، سبز)",
    "targetSkill": "پردازش ادراکی و تصمیم حرکتی",
    "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-athlete-training-on-an-agility-ladder-41315-large.mp4",
    "thumbnailUrl": "/drill-thumb-agility.png",
    "description": "حرکت سریع به سمت مخروط رنگی اعلام شده توسط مربی و لمس آن در کمترین زمان.",
    "steps": [
      "حرکت سریع به سمت مخروط رنگی اعلام شده توسط مربی و لمس آن در کمترین زمان."
    ],
    "coachingTips": "مرکز ثقل بدن پایین حفظ شود و نگاه سر بالا باشد.",
    "commonMistakes": "کوبیدن پاشنه پا روی زمین یا خم کردن کمر به جای زانوها."
  },
  {
    "id": "drill-4-3",
    "categoryKey": "agility",
    "categoryTitle": "چابکی",
    "subCategory": "تمرینات چابکی واکنشی (Reactive Agility)",
    "title": "واکنش به شماره اعلام‌شده",
    "englishTitle": "Number Call Reaction",
    "difficulty": "متوسط",
    "duration": "۱۵ دقیقه",
    "setsReps": "۴ ست",
    "equipment": "دروازه‌های شماره‌گذاری شده ۱ تا ۴",
    "targetSkill": "سرعت عمل شناختی حین خستگی",
    "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-athlete-training-on-an-agility-ladder-41315-large.mp4",
    "thumbnailUrl": "/drill-thumb-agility.png",
    "description": "محاسبه ریاضی ساده یا اعلام مستقیم شماره و دویدن به درگاه مربوطه.",
    "steps": [
      "محاسبه ریاضی ساده یا اعلام مستقیم شماره و دویدن به درگاه مربوطه."
    ],
    "coachingTips": "مرکز ثقل بدن پایین حفظ شود و نگاه سر بالا باشد.",
    "commonMistakes": "کوبیدن پاشنه پا روی زمین یا خم کردن کمر به جای زانوها."
  },
  {
    "id": "drill-4-4",
    "categoryKey": "agility",
    "categoryTitle": "چابکی",
    "subCategory": "تمرینات چابکی واکنشی (Reactive Agility)",
    "title": "تمرین آینه‌ای دونفره",
    "englishTitle": "Mirror Drill",
    "difficulty": "پیشرفته",
    "duration": "۱۵ دقیقه",
    "setsReps": "۴ ست",
    "equipment": "خط تلاقی ۲ متری",
    "targetSkill": "پیش‌بینی و تطبیق با حرکات حریف",
    "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-athlete-training-on-an-agility-ladder-41315-large.mp4",
    "thumbnailUrl": "https://images.openai.com/static-rsc-4/GdjZCTEezZrwaHGutkxkn2UILQXfp5jKjXREW2eSiZizAPNMmg4i4UL766leMHECglaG4EUASdDNoyaX4MQ03g6ZRyNAcLJTjElSsUZ9EsQrZrCHjC2TPuAFiOKyW6Iv9IVO4vCJ_bIhK-M9GwaArhCiE4mja244nNs0Za6Cb5o?purpose=inline",
    "description": "یک بازیکن لیدر و بازیکن روبرو موظف است تمامی جابجایی‌های او را مثل تصویر آینه تقلید کند.",
    "steps": [
      "یک بازیکن لیدر و بازیکن روبرو موظف است تمامی جابجایی‌های او را مثل تصویر آینه تقلید کند."
    ],
    "coachingTips": "مرکز ثقل بدن پایین حفظ شود و نگاه سر بالا باشد.",
    "commonMistakes": "کوبیدن پاشنه پا روی زمین یا خم کردن کمر به جای زانوها."
  },
  {
    "id": "drill-4-5",
    "categoryKey": "agility",
    "categoryTitle": "چابکی",
    "subCategory": "تمرینات چابکی واکنشی (Reactive Agility)",
    "title": "دنبال‌کردن حرکت هم‌تیمی",
    "englishTitle": "Shadow Movement",
    "difficulty": "متوسط",
    "duration": "۱۵ دقیقه",
    "setsReps": "۴ ست",
    "equipment": "محیط آزاد تمرینی",
    "targetSkill": "تعقیب سایه‌به‌سایه و جاگیری دفاعی",
    "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-athlete-training-on-an-agility-ladder-41315-large.mp4",
    "thumbnailUrl": "https://images.openai.com/static-rsc-4/JBwqnieNcv4o_jcBIsAK8mZnVB5eP2Qny6ucfk_51qt5QsnjP7kR2l6oogIyEtvktkDc-W2SFGckFVCTfVlTIj21JOY3pswgruygxk0j_Yu-OMPbUrR_yUWmg-IvZaPaM3EWSOujSkYB49ii38VdztJH3tsQpbL7ZgRSBzGhq0A?purpose=inline",
    "description": "حرکت در فاصله ۱ متری پشت سر هم‌تیمی و کپی کردن تمامی فریب‌های بدنی او.",
    "steps": [
      "حرکت در فاصله ۱ متری پشت سر هم‌تیمی و کپی کردن تمامی فریب‌های بدنی او."
    ],
    "coachingTips": "مرکز ثقل بدن پایین حفظ شود و نگاه سر بالا باشد.",
    "commonMistakes": "کوبیدن پاشنه پا روی زمین یا خم کردن کمر به جای زانوها."
  },
  {
    "id": "drill-4-6",
    "categoryKey": "agility",
    "categoryTitle": "چابکی",
    "subCategory": "تمرینات چابکی واکنشی (Reactive Agility)",
    "title": "واکنش به علامت دیداری",
    "englishTitle": "Visual Signal Reaction",
    "difficulty": "پیشرفته",
    "duration": "۱۵ دقیقه",
    "setsReps": "۴ ست",
    "equipment": "مخروط یا کارت‌های رنگی مربی",
    "targetSkill": "دید پیرامونی و واکنش بدون کلام",
    "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-athlete-training-on-an-agility-ladder-41315-large.mp4",
    "thumbnailUrl": "/drill-thumb-agility.png",
    "description": "استارت یا تغییر مسیر فقط بر اساس بالا بردن کارت یا جهت دست مربی در سکوت کامل.",
    "steps": [
      "استارت یا تغییر مسیر فقط بر اساس بالا بردن کارت یا جهت دست مربی در سکوت کامل."
    ],
    "coachingTips": "مرکز ثقل بدن پایین حفظ شود و نگاه سر بالا باشد.",
    "commonMistakes": "کوبیدن پاشنه پا روی زمین یا خم کردن کمر به جای زانوها."
  },
  {
    "id": "drill-4-7",
    "categoryKey": "agility",
    "categoryTitle": "چابکی",
    "subCategory": "تمرینات چابکی واکنشی (Reactive Agility)",
    "title": "واکنش به رهاشدن توپ",
    "englishTitle": "Ball Drop Reaction",
    "difficulty": "پیشرفته",
    "duration": "۱۵ دقیقه",
    "setsReps": "۴ ست",
    "equipment": "توپ فوتبال یا تنیس",
    "targetSkill": "شتاب انفجاری گام اول",
    "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-athlete-training-on-an-agility-ladder-41315-large.mp4",
    "thumbnailUrl": "/drill-thumb-agility.png",
    "description": "مربی توپ را از ارتفاع سینه رها می‌کند و بازیکن قبل از برخورد دوم به زمین باید آن را مهار کند.",
    "steps": [
      "مربی توپ را از ارتفاع سینه رها می‌کند و بازیکن قبل از برخورد دوم به زمین باید آن را مهار کند."
    ],
    "coachingTips": "مرکز ثقل بدن پایین حفظ شود و نگاه سر بالا باشد.",
    "commonMistakes": "کوبیدن پاشنه پا روی زمین یا خم کردن کمر به جای زانوها."
  },
  {
    "id": "drill-4-8",
    "categoryKey": "agility",
    "categoryTitle": "چابکی",
    "subCategory": "تمرینات چابکی واکنشی (Reactive Agility)",
    "title": "حرکت در جهت اشاره مربی",
    "englishTitle": "Point and Go",
    "difficulty": "متوسط",
    "duration": "۱۵ دقیقه",
    "setsReps": "۴ ست",
    "equipment": "فضای مخروطی ۱۰ متری",
    "targetSkill": "سرعت تصمیم‌گیری در کسری از ثانیه",
    "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-athlete-training-on-an-agility-ladder-41315-large.mp4",
    "thumbnailUrl": "/drill-thumb-agility.png",
    "description": "مربی دست خود را به یک سمت اشاره می‌دهد و بازیکن بلافاصله به آن جهت یورش می‌برد.",
    "steps": [
      "مربی دست خود را به یک سمت اشاره می‌دهد و بازیکن بلافاصله به آن جهت یورش می‌برد."
    ],
    "coachingTips": "مرکز ثقل بدن پایین حفظ شود و نگاه سر بالا باشد.",
    "commonMistakes": "کوبیدن پاشنه پا روی زمین یا خم کردن کمر به جای زانوها."
  },
  {
    "id": "drill-5-1",
    "categoryKey": "technique",
    "categoryTitle": "تکنیکی",
    "subCategory": "تمرینات چابکی با توپ (Ball Agility Drills)",
    "title": "دریبل با کنترل نزدیک",
    "englishTitle": "Close Control Dribbling",
    "difficulty": "مبتدی",
    "duration": "۱۵ دقیقه",
    "setsReps": "۴ ست",
    "equipment": "توپ فوتبال و مخروط‌ها",
    "targetSkill": "لمس اول دقیق و چسبندگی توپ به پا",
    "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-athlete-training-on-an-agility-ladder-41315-large.mp4",
    "thumbnailUrl": "https://images.openai.com/static-rsc-4/YSv1IiXTEYXe95OO0SSbwZTiUDnd6G0CwXp1_Nx9818UYYZ2ff7kHR8yhWZqe3WsZml_mGCZZV8WfuiFjrmGoXg2Of9HbXdgJS6DK6Ya_4JFYe7x-0XqX3-9KRz6EQDaqyH-DkZio2XVaaxODcdOCM5HwuSBOJ_nklqkvl96HxA?purpose=inline",
    "description": "هدایت توپ با لمس‌های میلی‌متری در هر گام به گونه‌ای که توپ هرگز بیش از ۳۰ سانتی‌متر دور نشود.",
    "steps": [
      "هدایت توپ با لمس‌های میلی‌متری در هر گام به گونه‌ای که توپ هرگز بیش از ۳۰ سانتی‌متر دور نشود."
    ],
    "coachingTips": "مرکز ثقل بدن پایین حفظ شود و نگاه سر بالا باشد.",
    "commonMistakes": "کوبیدن پاشنه پا روی زمین یا خم کردن کمر به جای زانوها."
  },
  {
    "id": "drill-5-2",
    "categoryKey": "technique",
    "categoryTitle": "تکنیکی",
    "subCategory": "تمرینات چابکی با توپ (Ball Agility Drills)",
    "title": "دریبل بین مخروط‌ها",
    "englishTitle": "Cone Dribbling",
    "difficulty": "مبتدی",
    "duration": "۱۵ دقیقه",
    "setsReps": "۴ ست",
    "equipment": "۱۰ عدد مخروط در ردیف",
    "targetSkill": "استفاده متناوب از داخل و خارج هر دو پا",
    "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-athlete-training-on-an-agility-ladder-41315-large.mp4",
    "thumbnailUrl": "/drill-thumb-agility.png",
    "description": "عبور مارپیچ با توپ از بین مخروط‌ها با تکیه بر هر دو پای چپ و راست.",
    "steps": [
      "عبور مارپیچ با توپ از بین مخروط‌ها با تکیه بر هر دو پای چپ و راست."
    ],
    "coachingTips": "مرکز ثقل بدن پایین حفظ شود و نگاه سر بالا باشد.",
    "commonMistakes": "کوبیدن پاشنه پا روی زمین یا خم کردن کمر به جای زانوها."
  },
  {
    "id": "drill-5-3",
    "categoryKey": "technique",
    "categoryTitle": "تکنیکی",
    "subCategory": "تمرینات چابکی با توپ (Ball Agility Drills)",
    "title": "دریبل در فضای محدود",
    "englishTitle": "Tight-Space Dribbling",
    "difficulty": "پیشرفته",
    "duration": "۱۵ دقیقه",
    "setsReps": "۴ ست",
    "equipment": "مربع ۲×۲ متر",
    "targetSkill": "کنترل توپ در باکس فشرده مدافعان",
    "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-athlete-training-on-an-agility-ladder-41315-large.mp4",
    "thumbnailUrl": "https://images.openai.com/static-rsc-4/B5w0mLudnTc8RPtq4x29UYzI59ncW_rDtXJCLphXT1H45Sux2PJcGtoGNdb0ZPU1EJUQPaVzds3EpUSdYB9I9Z6qh6Z8ZPqlCa-2NhKcMweRcUibhV8uS4D9dCOb0ZAfFLkfnDWSM8HnZ3gDpEr7HQiucnVyNWGokcD8zh3htVI?purpose=inline",
    "description": "مانورهای سرعتی کف پا و داخل پا بدون برخورد توپ به خطوط محوطه کوچک.",
    "steps": [
      "مانورهای سرعتی کف پا و داخل پا بدون برخورد توپ به خطوط محوطه کوچک."
    ],
    "coachingTips": "مرکز ثقل بدن پایین حفظ شود و نگاه سر بالا باشد.",
    "commonMistakes": "کوبیدن پاشنه پا روی زمین یا خم کردن کمر به جای زانوها."
  },
  {
    "id": "drill-5-4",
    "categoryKey": "technique",
    "categoryTitle": "تکنیکی",
    "subCategory": "تمرینات چابکی با توپ (Ball Agility Drills)",
    "title": "چرخش کرویف (Cruyff Turn)",
    "englishTitle": "Cruyff Turn",
    "difficulty": "متوسط",
    "duration": "۱۵ دقیقه",
    "setsReps": "۴ ست",
    "equipment": "توپ فوتبال و مانع شبیه‌ساز مدافع",
    "targetSkill": "فریب پاس/شوت و برش پشت پای تکیه‌گاه",
    "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-athlete-training-on-an-agility-ladder-41315-large.mp4",
    "thumbnailUrl": "https://images.openai.com/static-rsc-4/XzUZZA65OlVcFO3h4jaSO7wvlEBAK5BwsaWoy5DT8M-P33RPJMWrFnwhnn_AF-gZsdrhzLzhH41metWU2W0mBqkyfzBaBMGpeCRW-lNoBXtxt-fZAzXMUyWagi96ZQLZn1ZCDV2SLOwh-w_ffoM1e9rRq5ulHcpn9GnM5gOwNRU?purpose=inline",
    "description": "تظاهر به ارسال پاس بلند و کشیدن ناگهانی توپ با بغل پای موافق از پشت پای تکیه‌گاه.",
    "steps": [
      "تظاهر به ارسال پاس بلند و کشیدن ناگهانی توپ با بغل پای موافق از پشت پای تکیه‌گاه."
    ],
    "coachingTips": "مرکز ثقل بدن پایین حفظ شود و نگاه سر بالا باشد.",
    "commonMistakes": "کوبیدن پاشنه پا روی زمین یا خم کردن کمر به جای زانوها."
  },
  {
    "id": "drill-5-5",
    "categoryKey": "technique",
    "categoryTitle": "تکنیکی",
    "subCategory": "تمرینات چابکی با توپ (Ball Agility Drills)",
    "title": "استپ‌اور و استپ‌اور دوبل",
    "englishTitle": "Step Over & Double Step Over",
    "difficulty": "پیشرفته",
    "duration": "۱۵ دقیقه",
    "setsReps": "۴ ست",
    "equipment": "توپ فوتبال",
    "targetSkill": "فریب بدنی و بی‌تعادل کردن مدافع",
    "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-athlete-training-on-an-agility-ladder-41315-large.mp4",
    "thumbnailUrl": "/drill-thumb-agility.png",
    "description": "چرخاندن پا از روی توپ بدون تماس و پرتاب وزن بدن به جهت مخالف.",
    "steps": [
      "چرخاندن پا از روی توپ بدون تماس و پرتاب وزن بدن به جهت مخالف."
    ],
    "coachingTips": "مرکز ثقل بدن پایین حفظ شود و نگاه سر بالا باشد.",
    "commonMistakes": "کوبیدن پاشنه پا روی زمین یا خم کردن کمر به جای زانوها."
  },
  {
    "id": "drill-5-6",
    "categoryKey": "technique",
    "categoryTitle": "تکنیکی",
    "subCategory": "تمرینات چابکی با توپ (Ball Agility Drills)",
    "title": "حرکت لا کروکتا (La Croqueta)",
    "englishTitle": "La Croqueta",
    "difficulty": "پیشرفته",
    "duration": "۱۵ دقیقه",
    "setsReps": "۴ ست",
    "equipment": "توپ و مدافع فرضی",
    "targetSkill": "انتقال سریع توپ از پای راست به چپ و عبور",
    "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-athlete-training-on-an-agility-ladder-41315-large.mp4",
    "thumbnailUrl": "/drill-thumb-agility.png",
    "description": "ضربه با بغل یک پا به سمت پای دیگر و هدایت روبه جلوی توپ در کسری از ثانیه شبیه به اینیستا.",
    "steps": [
      "ضربه با بغل یک پا به سمت پای دیگر و هدایت روبه جلوی توپ در کسری از ثانیه شبیه به اینیستا."
    ],
    "coachingTips": "مرکز ثقل بدن پایین حفظ شود و نگاه سر بالا باشد.",
    "commonMistakes": "کوبیدن پاشنه پا روی زمین یا خم کردن کمر به جای زانوها."
  },
  {
    "id": "drill-6-1",
    "categoryKey": "tactics",
    "categoryTitle": "تاکتیکی",
    "subCategory": "تمرینات چابکی دفاعی (Defensive Agility)",
    "title": "حرکت جانبی دفاعی",
    "englishTitle": "Defensive Shuffle",
    "difficulty": "مبتدی",
    "duration": "۱۵ دقیقه",
    "setsReps": "۴ ست",
    "equipment": "مخروط‌های خط عرضی",
    "targetSkill": "حفظ گارد دفاعی بدون جفت شدن پاها",
    "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-athlete-training-on-an-agility-ladder-41315-large.mp4",
    "thumbnailUrl": "https://images.openai.com/static-rsc-4/Tj2YnY9b3HBVo80tmFjhr9QYm1uUI2R9HDtGuCylG1UyGNIZ7NZeBVP0ClarjDW6_6PXLl88w8Xltn1f0q7VgtQkyTn4rrCfItBq_cqXwiishlUFO1OwnxL4HH8DIxMlnIs_gArnhzpWlli4B67Nqj2oMJ-cCUNhU3mQ3kSPBDE?purpose=inline",
    "description": "گام‌های شافل با زانوان خمیده و بالاتنه روبه‌جلو برای هدایت مهاجم به کناره‌ها.",
    "steps": [
      "گام‌های شافل با زانوان خمیده و بالاتنه روبه‌جلو برای هدایت مهاجم به کناره‌ها."
    ],
    "coachingTips": "مرکز ثقل بدن پایین حفظ شود و نگاه سر بالا باشد.",
    "commonMistakes": "کوبیدن پاشنه پا روی زمین یا خم کردن کمر به جای زانوها."
  },
  {
    "id": "drill-6-2",
    "categoryKey": "tactics",
    "categoryTitle": "تاکتیکی",
    "subCategory": "تمرینات چابکی دفاعی (Defensive Agility)",
    "title": "تمرین جاگیری و کنترل مهاجم (Jockeying)",
    "englishTitle": "Jockeying Drill",
    "difficulty": "متوسط",
    "duration": "۱۵ دقیقه",
    "setsReps": "۴ ست",
    "equipment": "مهاجم و مدافع در کریدور ۵ متری",
    "targetSkill": "تاخیر انداختن حمله و سلب فضا",
    "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-athlete-training-on-an-agility-ladder-41315-large.mp4",
    "thumbnailUrl": "https://images.openai.com/static-rsc-4/-MezUmboYNGOJPVnOeuHxiciDThoq28AhGaphc0QbR7o28Lx9C-EuaNQWyeucAQn0p_bYYCvwFLZDfeZ6Uq48MQnAxLPmASxOSo_vS9eNP6vLAQ3k2cPo3ZvUiafw4iZfjWHwnKVO_DByAj_bacyQ1Fxil3Jm-Hjp2RCcmzExNk?purpose=inline",
    "description": "عقب‌نشینی زاویه‌دار با حفظ فاصله ایمن و پیش‌بینی لحظه مناسب تکل.",
    "steps": [
      "عقب‌نشینی زاویه‌دار با حفظ فاصله ایمن و پیش‌بینی لحظه مناسب تکل."
    ],
    "coachingTips": "مرکز ثقل بدن پایین حفظ شود و نگاه سر بالا باشد.",
    "commonMistakes": "کوبیدن پاشنه پا روی زمین یا خم کردن کمر به جای زانوها."
  },
  {
    "id": "drill-6-3",
    "categoryKey": "tactics",
    "categoryTitle": "تاکتیکی",
    "subCategory": "تمرینات چابکی دفاعی (Defensive Agility)",
    "title": "نزدیک‌شدن به مهاجم و بازگشت",
    "englishTitle": "Close Down and Recover",
    "difficulty": "پیشرفته",
    "duration": "۱۵ دقیقه",
    "setsReps": "۴ ست",
    "equipment": "ایستگاه‌های پرسی",
    "targetSkill": "پرس پرفشار و پوشش فضای پشت سر",
    "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-athlete-training-on-an-agility-ladder-41315-large.mp4",
    "thumbnailUrl": "https://images.openai.com/static-rsc-4/Z5d-O0aZIbdD1kpQSTBF9Fl12KKxzZaBVSYmsb2PPRZFgjeeCT5XF9h301DEWCB0nlbUmCtMgtdLw_6NVBcNfXKaG-IeEgXOnvx6gA2UJ46xaXLChB6MFDPW__shAAGYCyr6Bbdnwbn3X6GdLQvDzrJdszwIKHEsBhExxKQJ6RU?purpose=inline",
    "description": "یورش تند برای پرس توپ و عقب‌نشینی فوری به محض ارسال پاس حریف.",
    "steps": [
      "یورش تند برای پرس توپ و عقب‌نشینی فوری به محض ارسال پاس حریف."
    ],
    "coachingTips": "مرکز ثقل بدن پایین حفظ شود و نگاه سر بالا باشد.",
    "commonMistakes": "کوبیدن پاشنه پا روی زمین یا خم کردن کمر به جای زانوها."
  },
  {
    "id": "drill-7-1",
    "categoryKey": "agility",
    "categoryTitle": "چابکی",
    "subCategory": "تمرینات چابکی دونفره و گروهی (Partner & Group Agility)",
    "title": "آینه‌ای دونفره",
    "englishTitle": "Partner Mirror Drill",
    "difficulty": "متوسط",
    "duration": "۱۵ دقیقه",
    "setsReps": "۴ ست",
    "equipment": "مخروط‌های کادر دونفره",
    "targetSkill": "هماهنگی زوجی و واکنش مستقیم",
    "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-athlete-training-on-an-agility-ladder-41315-large.mp4",
    "thumbnailUrl": "https://images.openai.com/static-rsc-4/1DfQKTN0AIbCKm2q3NqXNLLpJjazdAhRdE6sK1CP1i3x0Jm94ek0czO7cLh234q201yKy3ChDOe7yGWNW8DfpV3ZdDjsszyI4EO0fwVtl3UKckKyq33mNmWZMNKD0N21GwvgerYUbz8TiRZ1Pxv05XyEA_BrIat7a4G4ns4MK94?purpose=inline",
    "description": "همگام‌سازی حرکات بدنی دو بازیکن در فواصل معین با جابجایی‌های تصادفی.",
    "steps": [
      "همگام‌سازی حرکات بدنی دو بازیکن در فواصل معین با جابجایی‌های تصادفی."
    ],
    "coachingTips": "مرکز ثقل بدن پایین حفظ شود و نگاه سر بالا باشد.",
    "commonMistakes": "کوبیدن پاشنه پا روی زمین یا خم کردن کمر به جای زانوها."
  },
  {
    "id": "drill-7-2",
    "categoryKey": "agility",
    "categoryTitle": "چابکی",
    "subCategory": "تمرینات چابکی دونفره و گروهی (Partner & Group Agility)",
    "title": "مسابقه امدادی چابکی",
    "englishTitle": "Agility Relay Race",
    "difficulty": "پیشرفته",
    "duration": "۱۵ دقیقه",
    "setsReps": "۴ ست",
    "equipment": "نردبان، مخروط و موانع ایستگاهی",
    "targetSkill": "رقابت سرعتی تیمی و هیجان تمرین",
    "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-athlete-training-on-an-agility-ladder-41315-large.mp4",
    "thumbnailUrl": "https://images.openai.com/static-rsc-4/17wBWs8aRofIlemvJk4J7bRyA8u2eiHCG3Waq5QiHKpEMOtyj3GYmrh_rJV-OI6iu7WwosLwrH1z8ysOWMPeRGP-yKTVJxJdLdNkDMeyJh02-x49EXh0AMnCIEfCYpW7nR7r6y-Omy7t1fiF_Ysm6PWszYY6UKWkvf2Ca7tlCPU?purpose=inline",
    "description": "رقابت دو گروه تیمی در مسیر موانع چابکی با تحویل نشان یا لمس دست هم‌تیمی.",
    "steps": [
      "رقابت دو گروه تیمی در مسیر موانع چابکی با تحویل نشان یا لمس دست هم‌تیمی."
    ],
    "coachingTips": "مرکز ثقل بدن پایین حفظ شود و نگاه سر بالا باشد.",
    "commonMistakes": "کوبیدن پاشنه پا روی زمین یا خم کردن کمر به جای زانوها."
  },
  {
    "id": "drill-8-1",
    "categoryKey": "balance",
    "categoryTitle": "تعادل و هماهنگی",
    "subCategory": "تمرینات هماهنگی عصبی و حرکتی (Coordination & Footwork)",
    "title": "زانو بلند و پاشنه به باسن",
    "englishTitle": "High Knees & Butt Kicks",
    "difficulty": "مبتدی",
    "duration": "۱۵ دقیقه",
    "setsReps": "۴ ست",
    "equipment": "زمین تمرین",
    "targetSkill": "دامنه حرکتی مفصل ران و گرم‌کردن اختصاصی",
    "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-athlete-training-on-an-agility-ladder-41315-large.mp4",
    "thumbnailUrl": "https://images.openai.com/static-rsc-4/Y4DJQP_witbZ8v5Nl_oPCwfttbGPwICZ-bGoCApon7H0suC7cFlEPQjT43x6xJekah8wdYmpDBH2t88IkfSH8qsY8_qgf-sohJHkLIfK1GvbGW3SseHz9iqC35W25H6VVKm3p01f6bGedsvmlM-W3DSxExG2xM1xTtmkTzJfFPQ?purpose=inline",
    "description": "گام‌برداری با بالا آوردن کامل زانو به موازات لگن و برگشت با ضربه پاشنه به عضلات سرینی.",
    "steps": [
      "گام‌برداری با بالا آوردن کامل زانو به موازات لگن و برگشت با ضربه پاشنه به عضلات سرینی."
    ],
    "coachingTips": "مرکز ثقل بدن پایین حفظ شود و نگاه سر بالا باشد.",
    "commonMistakes": "کوبیدن پاشنه پا روی زمین یا خم کردن کمر به جای زانوها."
  },
  {
    "id": "drill-8-2",
    "categoryKey": "balance",
    "categoryTitle": "تعادل و هماهنگی",
    "subCategory": "تمرینات هماهنگی عصبی و حرکتی (Coordination & Footwork)",
    "title": "دویدن گام A و گام B",
    "englishTitle": "A-Skip & B-Skip",
    "difficulty": "متوسط",
    "duration": "۱۵ دقیقه",
    "setsReps": "۴ ست",
    "equipment": "مسیر ۲۰ متری چمن",
    "targetSkill": "مکانیک صحیح دویدن و فرود روی سینه پا",
    "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-athlete-training-on-an-agility-ladder-41315-large.mp4",
    "thumbnailUrl": "https://images.openai.com/static-rsc-4/pmydzTHBXDR6WunSLdu5qaMdyBe-Z6ilvbCcrAVFUv_7elYEtG39J_h6T-PfynkdjLWx-oXG7Cw1_LEsIOL8CVkpdxpqmfv0aorpCDrFONlJJufMrX3qo53srxZvDWh31Nxog1Y9D2fqjiEPgIs8-K1aRmc3K3kKwARa2QEKp3M?purpose=inline",
    "description": "پرش‌های ریتمیک همراه با کشش و ضربه پنجه پا به سمت زمین.",
    "steps": [
      "پرش‌های ریتمیک همراه با کشش و ضربه پنجه پا به سمت زمین."
    ],
    "coachingTips": "مرکز ثقل بدن پایین حفظ شود و نگاه سر بالا باشد.",
    "commonMistakes": "کوبیدن پاشنه پا روی زمین یا خم کردن کمر به جای زانوها."
  },
  {
    "id": "drill-8-3",
    "categoryKey": "balance",
    "categoryTitle": "تعادل و هماهنگی",
    "subCategory": "تمرینات هماهنگی عصبی و حرکتی (Coordination & Footwork)",
    "title": "پرش اسکیت‌باز (Skater Jumps)",
    "englishTitle": "Skater Jumps",
    "difficulty": "پیشرفته",
    "duration": "۱۵ دقیقه",
    "setsReps": "۴ ست",
    "equipment": "موانع فرضی",
    "targetSkill": "ثبات عرضی زانو و تولید توان تک‌پا",
    "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-athlete-training-on-an-agility-ladder-41315-large.mp4",
    "thumbnailUrl": "https://images.openai.com/static-rsc-4/6LL75G38yGH9QvLZYtGPPYWoaoMolq_sYfRDGXKw2r4DG9r5YBm3C2vfhmTLvZP8eS4mR1oHeSohU5UwAhzmZkrWfF7157vxE_WvtHFXXgQqSK3W4lF6v0cundhWFNH-JtZou3grkchC2mVjhi00Im6TyNSrQoVv0BgKfBTuxwY?purpose=inline",
    "description": "پرش‌های جانبی انفجاری از یک پا به پای دیگر با توقف و کنترل تعادل در هر فرود.",
    "steps": [
      "پرش‌های جانبی انفجاری از یک پا به پای دیگر با توقف و کنترل تعادل در هر فرود."
    ],
    "coachingTips": "مرکز ثقل بدن پایین حفظ شود و نگاه سر بالا باشد.",
    "commonMistakes": "کوبیدن پاشنه پا روی زمین یا خم کردن کمر به جای زانوها."
  },
  {
    "id": "drill-9-1",
    "categoryKey": "speed",
    "categoryTitle": "سرعت",
    "subCategory": "تمرینات سرعت و چابکی ترکیبی (Speed & Agility)",
    "title": "شتاب‌گیری و کاهش سرعت (۵، ۱۰ و ۲۰ متری)",
    "englishTitle": "Acceleration & Deceleration (5m, 10m, 20m)",
    "difficulty": "پیشرفته",
    "duration": "۱۵ دقیقه",
    "setsReps": "۴ ست",
    "equipment": "مخروط و فتوسل الکترونیکی",
    "targetSkill": "انفجار بی‌هوازی فسفاژن و توان ترمز",
    "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-athlete-training-on-an-agility-ladder-41315-large.mp4",
    "thumbnailUrl": "https://images.openai.com/static-rsc-4/km8MTiOxnjxLRrO1F9F3U8AuSgsSweyU2iNNtPXbNATq1wipbihkHpO9__vsKl4OqPU3H8ojjUc64kdlh1uFxOrbxOAyLDuJHWirrce5J23RZFpSmzcCzwo90_4wOirdFY0iqNdnWc7r03CfVM2VNM3SvPZKg5yxHYtHNvfw9dk?purpose=inline",
    "description": "استارت‌های حداکثری در فواصل کلیدی فوتبال با فرود اصولی و چرخش در انتهای مسیر.",
    "steps": [
      "استارت‌های حداکثری در فواصل کلیدی فوتبال با فرود اصولی و چرخش در انتهای مسیر."
    ],
    "coachingTips": "مرکز ثقل بدن پایین حفظ شود و نگاه سر بالا باشد.",
    "commonMistakes": "کوبیدن پاشنه پا روی زمین یا خم کردن کمر به جای زانوها."
  },
  {
    "id": "drill-9-2",
    "categoryKey": "speed",
    "categoryTitle": "سرعت",
    "subCategory": "تمرینات سرعت و چابکی ترکیبی (Speed & Agility)",
    "title": "عبور از موانع کوتاه و دویدن",
    "englishTitle": "Hurdle and Sprint Combination",
    "difficulty": "پیشرفته",
    "duration": "۱۵ دقیقه",
    "setsReps": "۴ ست",
    "equipment": "موانع کوتاه ۱۵ سانتی‌متری + مسیر سرعت",
    "targetSkill": "تبدیل پرش عمودی به شتاب خطی افقی",
    "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-athlete-training-on-an-agility-ladder-41315-large.mp4",
    "thumbnailUrl": "https://images.openai.com/static-rsc-4/0AHg2md2FMdBVPcPHdkm5-k_iNR6kuQPP0H6rlSwY5g5CSbwQll-sSmY6o0lfb6f7WVdgQn1p7THvvZHdnoX3WzZcxjRwtzLdO-DhCUQi8eqvZTGOnj_m_8FoIiFLF_noBjjx9oXWZ9xa5Y32CS1gxdxfy6154fFxpki5xULx44?purpose=inline",
    "description": "۳ پرش پیوسته از روی موانع کوتاه و بلافاصله استارت سرعت ۲۰ متری به سمت توپ.",
    "steps": [
      "۳ پرش پیوسته از روی موانع کوتاه و بلافاصله استارت سرعت ۲۰ متری به سمت توپ."
    ],
    "coachingTips": "مرکز ثقل بدن پایین حفظ شود و نگاه سر بالا باشد.",
    "commonMistakes": "کوبیدن پاشنه پا روی زمین یا خم کردن کمر به جای زانوها."
  },
  {
    "id": "drill-10-1",
    "categoryKey": "agility",
    "categoryTitle": "چابکی",
    "subCategory": "تمرینات چابکی مخصوص شرایط مسابقه (Game-Specific Agility)",
    "title": "روندو و حفظ توپ در فضای محدود (Rondo)",
    "englishTitle": "Rondo & Possession Under Pressure",
    "difficulty": "پیشرفته",
    "duration": "۱۵ دقیقه",
    "setsReps": "۴ ست",
    "equipment": "توپ فوتبال و کاورهای تیمی",
    "targetSkill": "کنترل لمس اول، دید محیطی و تصمیم‌گیری زیر فشار پرس",
    "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-athlete-training-on-an-agility-ladder-41315-large.mp4",
    "thumbnailUrl": "https://images.openai.com/static-rsc-4/_v7vmDvqE4tdnxv_G7MwxRcSw9FjeGdUh6eEjc5pGeXGCL6cqu-8THTgmBpdnKCKF0UfSGXDDdBw4DMBYiTrHC4E7nZgxr09qC5tJCyI3gX9T_TF_awOzFMG2OiOM_VpXY37eQewrdlaytlxl7LpEeGoTp2nFgiMvadmnMZE-nY?purpose=inline",
    "description": "تمرین معروف ۴ در برابر ۲ یا ۵ در برابر ۲ با حداکثر یک یا دو ضرب در مربع‌های کوچک.",
    "steps": [
      "تمرین معروف ۴ در برابر ۲ یا ۵ در برابر ۲ با حداکثر یک یا دو ضرب در مربع‌های کوچک."
    ],
    "coachingTips": "مرکز ثقل بدن پایین حفظ شود و نگاه سر بالا باشد.",
    "commonMistakes": "کوبیدن پاشنه پا روی زمین یا خم کردن کمر به جای زانوها."
  },
  {
    "id": "drill-10-2",
    "categoryKey": "agility",
    "categoryTitle": "چابکی",
    "subCategory": "تمرینات چابکی مخصوص شرایط مسابقه (Game-Specific Agility)",
    "title": "بازی‌های در ابعاد کوچک ۱ به ۱ و ۲ به ۲",
    "englishTitle": "1v1 & 2v2 Small-Sided Game",
    "difficulty": "پیشرفته",
    "duration": "۱۵ دقیقه",
    "setsReps": "۴ ست",
    "equipment": "دروازه‌های کوچک و زمین فشرده",
    "targetSkill": "نبردهای تک‌به‌تک و جابجایی بعد از پاس",
    "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-athlete-training-on-an-agility-ladder-41315-large.mp4",
    "thumbnailUrl": "https://images.openai.com/static-rsc-4/ntnoIUXxoCVVxzbCok5EdhkqwOGBuxCwohIz8nf0s6rmwvWcxCc8VXBWAC9Gl5HSQvsMDMXy3bzOUcTtFifgzPzP4Mj42ZilOgu22pIkd5-IYposrwYEz9mLNFu1qKc8Ve7QEZ-Hynvkjf7xixG7of_SsPKmH97e6OENnVb54yI?purpose=inline",
    "description": "مسابقات فشرده ۳ دقیقه‌ای با شدت بازی بالا و تمرکز روی لمس اول جهت‌دار.",
    "steps": [
      "مسابقات فشرده ۳ دقیقه‌ای با شدت بازی بالا و تمرکز روی لمس اول جهت‌دار."
    ],
    "coachingTips": "مرکز ثقل بدن پایین حفظ شود و نگاه سر بالا باشد.",
    "commonMistakes": "کوبیدن پاشنه پا روی زمین یا خم کردن کمر به جای زانوها."
  },
  {
    "id": "drill-11-1",
    "categoryKey": "agility",
    "categoryTitle": "چابکی",
    "subCategory": "تمرینات چابکی با موانع (Hurdle Agility)",
    "title": "پرش جفت‌پا و تک‌پا از مانع",
    "englishTitle": "Two-Foot & Single-Leg Hurdle Jump",
    "difficulty": "متوسط",
    "duration": "۱۵ دقیقه",
    "setsReps": "۴ ست",
    "equipment": "موانع چابکی ۲۰ و ۳۰ سانتی‌متری",
    "targetSkill": "توان الاستیک تاندون آشیل و پرش در سرزنی",
    "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-athlete-training-on-an-agility-ladder-41315-large.mp4",
    "thumbnailUrl": "https://images.openai.com/static-rsc-4/FqUD4l6cr329MUohFrKq5_H_D6IVZCrR3toZVo40DsPVUpDGLrpdbE04LRpX6oE-82YAP7mxZXJKgdgKSQu9XTP_ZYXxBiZ5IIgysQhd65v9qtHQbmY3jCPcFjHWAh4YIlxVFhAHJx7sAdTruGIOcKQtJ8bb1Hjk46Og95AO6GM?purpose=inline",
    "description": "پرش‌های پیوسته از روی ۶ مانع بدون تماس با میله‌ها و فرود کاملاً ضربه‌گیر.",
    "steps": [
      "پرش‌های پیوسته از روی ۶ مانع بدون تماس با میله‌ها و فرود کاملاً ضربه‌گیر."
    ],
    "coachingTips": "مرکز ثقل بدن پایین حفظ شود و نگاه سر بالا باشد.",
    "commonMistakes": "کوبیدن پاشنه پا روی زمین یا خم کردن کمر به جای زانوها."
  },
  {
    "id": "drill-11-2",
    "categoryKey": "agility",
    "categoryTitle": "چابکی",
    "subCategory": "تمرینات چابکی با موانع (Hurdle Agility)",
    "title": "پرش جانبی و عبور زیگزاگی از موانع",
    "englishTitle": "Lateral Hurdle Hop & Zigzag",
    "difficulty": "پیشرفته",
    "duration": "۱۵ دقیقه",
    "setsReps": "۴ ست",
    "equipment": "موانع چابکی چیده شده مورب",
    "targetSkill": "چابکی هوایی و انقباضات برون‌گرا",
    "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-athlete-training-on-an-agility-ladder-41315-large.mp4",
    "thumbnailUrl": "https://images.openai.com/static-rsc-4/ZPx5PkfthsfH47vyGvJMFLv6oii8i72lTik2e4TU-G6BtcCWy2GREmVE7ltBqi4J4W-58qiP2JaAcwYTaPjnwwLsPqJCzb-oeMfRUsAo5qFz6Nc5YNKh_WTOOoecX_zA8SRPwR_6i9Z_1BT0Diaol0dcjWiiyfbqAN2NNhNNRFk?purpose=inline",
    "description": "پرش به پهلو از موانع و شتاب‌گیری فوری به سمت مخروط خروج.",
    "steps": [
      "پرش به پهلو از موانع و شتاب‌گیری فوری به سمت مخروط خروج."
    ],
    "coachingTips": "مرکز ثقل بدن پایین حفظ شود و نگاه سر بالا باشد.",
    "commonMistakes": "کوبیدن پاشنه پا روی زمین یا خم کردن کمر به جای زانوها."
  },
  {
    "id": "drill-12-1",
    "categoryKey": "technique",
    "categoryTitle": "تکنیکی",
    "subCategory": "تمرینات چابکی با توپ واکنشی و محرک‌های دیداری (Visual & Ball Reaction)",
    "title": "واکنش به توپ تنیس و دو توپ",
    "englishTitle": "Tennis Ball & Two-Ball Reaction",
    "difficulty": "پیشرفته",
    "duration": "۱۵ دقیقه",
    "setsReps": "۴ ست",
    "equipment": "توپ تنیس کوچک و توپ فوتبال",
    "targetSkill": "هماهنگی چشم و دست/پا و توجه انتخابی",
    "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-athlete-training-on-an-agility-ladder-41315-large.mp4",
    "thumbnailUrl": "/drill-thumb-agility.png",
    "description": "دریافت پاس فوتبال با پا هم‌زمان با گرفتن توپ تنیس رها شده توسط مربی با دست.",
    "steps": [
      "دریافت پاس فوتبال با پا هم‌زمان با گرفتن توپ تنیس رها شده توسط مربی با دست."
    ],
    "coachingTips": "مرکز ثقل بدن پایین حفظ شود و نگاه سر بالا باشد.",
    "commonMistakes": "کوبیدن پاشنه پا روی زمین یا خم کردن کمر به جای زانوها."
  },
  {
    "id": "drill-12-2",
    "categoryKey": "technique",
    "categoryTitle": "تکنیکی",
    "subCategory": "تمرینات چابکی با توپ واکنشی و محرک‌های دیداری (Visual & Ball Reaction)",
    "title": "واکنش، دریبل و شوت",
    "englishTitle": "Reaction, Dribble and Shoot",
    "difficulty": "پیشرفته",
    "duration": "۱۵ دقیقه",
    "setsReps": "۴ ست",
    "equipment": "دروازه، دروازه‌بان و نشانگر رنگی",
    "targetSkill": "تصمیم‌گیری تمام‌کنندگی در شرایط مسابقه",
    "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-athlete-training-on-an-agility-ladder-41315-large.mp4",
    "thumbnailUrl": "/drill-thumb-agility.png",
    "description": "واکنش به رنگ پرچم اعلامی، برش به آن سمت و ضربه نهایی به گوشه مشخص دروازه.",
    "steps": [
      "واکنش به رنگ پرچم اعلامی، برش به آن سمت و ضربه نهایی به گوشه مشخص دروازه."
    ],
    "coachingTips": "مرکز ثقل بدن پایین حفظ شود و نگاه سر بالا باشد.",
    "commonMistakes": "کوبیدن پاشنه پا روی زمین یا خم کردن کمر به جای زانوها."
  },
  {
    "id": "drill-13-1",
    "categoryKey": "strength",
    "categoryTitle": "قدرتی",
    "subCategory": "قدرت پایین‌تنه (Lower Body Strength)",
    "title": "اسکوات با وزن بدن",
    "englishTitle": "Bodyweight Squat",
    "difficulty": "مبتدی",
    "duration": "۱۵ دقیقه",
    "setsReps": "۴ ست",
    "equipment": "وزن بدن",
    "targetSkill": "قدرت پایه چهارسر و باسن",
    "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-athlete-training-on-an-agility-ladder-41315-large.mp4",
    "thumbnailUrl": "https://images.openai.com/static-rsc-4/CxfOtg9pGWQInGVDGNI8acyWURpQO5JrF-74ajR5bbizzZ0g4V88M-4EAxTUKeyFyHhxSLAAu98RHQ9Y_SDVD51oEkmb2l3IzkiMNfJfNDEMcWYZodnobofAp_9mqLPdFFI9CGItFTsaR3WpLHJymTnyx7Q3J9Ar17PRjouAuQI?purpose=inline",
    "description": "حرکت پایه‌ای اسکوات با انتقال لگن به عقب، صاف نگه‌داشتن سینه و زانوهای هم‌راستا با نوک انگشتان پا.",
    "steps": [
      "حرکت پایه‌ای اسکوات با انتقال لگن به عقب، صاف نگه‌داشتن سینه و زانوهای هم‌راستا با نوک انگشتان پا."
    ],
    "coachingTips": "مرکز ثقل بدن پایین حفظ شود و نگاه سر بالا باشد.",
    "commonMistakes": "کوبیدن پاشنه پا روی زمین یا خم کردن کمر به جای زانوها."
  },
  {
    "id": "drill-13-2",
    "categoryKey": "strength",
    "categoryTitle": "قدرتی",
    "subCategory": "قدرت پایین‌تنه (Lower Body Strength)",
    "title": "اسکوات پیستول (تک‌پای کامل)",
    "englishTitle": "Pistol Squat",
    "difficulty": "پیشرفته",
    "duration": "۱۵ دقیقه",
    "setsReps": "۴ ست",
    "equipment": "وزن بدن",
    "targetSkill": "اوج تعادل و قدرت تک‌پای فوتبال",
    "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-athlete-training-on-an-agility-ladder-41315-large.mp4",
    "thumbnailUrl": "https://images.openai.com/static-rsc-4/k26J_haOBuG-w9snEubf2m5EBsgzEpcWMT8uLWKlbBf7KeVnjsZ0UkAmclw2AZuB7V9kHSgUhS3JzpcGKbOaBNM2OBJeaeCA0sDzQwyKynv5aFfFNuu_5PBTXMvlIsftw1PHzLMhnsHIGKCWkiSQLrM0xuWRnQGIcLlv-5LnpOQ?purpose=inline",
    "description": "پایین رفتن کامل روی یک پا در حالی که پای دیگر کشیده و موازی زمین در جلو قرار دارد.",
    "steps": [
      "پایین رفتن کامل روی یک پا در حالی که پای دیگر کشیده و موازی زمین در جلو قرار دارد."
    ],
    "coachingTips": "مرکز ثقل بدن پایین حفظ شود و نگاه سر بالا باشد.",
    "commonMistakes": "کوبیدن پاشنه پا روی زمین یا خم کردن کمر به جای زانوها."
  },
  {
    "id": "drill-13-3",
    "categoryKey": "strength",
    "categoryTitle": "قدرتی",
    "subCategory": "قدرت پایین‌تنه (Lower Body Strength)",
    "title": "لانج راه رفتنی",
    "englishTitle": "Walking Lunge",
    "difficulty": "متوسط",
    "duration": "۱۵ دقیقه",
    "setsReps": "۴ ست",
    "equipment": "مسیر آزاد ۱۰ متری",
    "targetSkill": "تقویت تعادل دینامیک و عضلات همسترینگ و باسن",
    "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-athlete-training-on-an-agility-ladder-41315-large.mp4",
    "thumbnailUrl": "https://images.openai.com/static-rsc-4/MUdeHwkOEnOJaDTT8d7xs2TM2KIKCehtaVpArAADVDJYcT_0nu4HJIBQ0UeRr44p1Frxkp_yqNwNp6mudhNfCW6GnH5hUUcKJA_yKk4A99TZ-J_sPiQ4BzSwfELaFtLXhThjiUObaUX1W9mgPU7gLaccXZuFpA3nkEeZG6Yam4k?purpose=inline",
    "description": "گام‌های بلند روبه جلو همراه با خم کردن زانو تا زاویه ۹۰ درجه و انتقال پیوسته وزن بدن.",
    "steps": [
      "گام‌های بلند روبه جلو همراه با خم کردن زانو تا زاویه ۹۰ درجه و انتقال پیوسته وزن بدن."
    ],
    "coachingTips": "مرکز ثقل بدن پایین حفظ شود و نگاه سر بالا باشد.",
    "commonMistakes": "کوبیدن پاشنه پا روی زمین یا خم کردن کمر به جای زانوها."
  },
  {
    "id": "drill-13-4",
    "categoryKey": "strength",
    "categoryTitle": "قدرتی",
    "subCategory": "قدرت پایین‌تنه (Lower Body Strength)",
    "title": "اسکوات کازاک (Cossack Squat)",
    "englishTitle": "Cossack Squat",
    "difficulty": "پیشرفته",
    "duration": "۱۵ دقیقه",
    "setsReps": "۴ ست",
    "equipment": "وزن بدن",
    "targetSkill": "انعطاف کشاله ران و قدرت عرضی مفصل ران",
    "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-athlete-training-on-an-agility-ladder-41315-large.mp4",
    "thumbnailUrl": "https://images.openai.com/static-rsc-4/Qf5YqLTFU9XVdLgd3bE_sKgJ3Xsc8bR_OXGcBX-7H1gnQ4N5nkTtV2eae4IdICK2gxc3GvSGA_g5ZcwO5UrWl4HY-s0MfA2LEuEt3049tQDADeXddDbgVojBODOqGG0iVx3X4h5OBDhZ0dMYMK8-dP5OBK10RJtTxVdMQms2sVU?purpose=inline",
    "description": "نشستن به پهلو روی یک پا با باز بودن کامل پای مخالف و اشاره پنجه پای کشیده به سمت سقف.",
    "steps": [
      "نشستن به پهلو روی یک پا با باز بودن کامل پای مخالف و اشاره پنجه پای کشیده به سمت سقف."
    ],
    "coachingTips": "مرکز ثقل بدن پایین حفظ شود و نگاه سر بالا باشد.",
    "commonMistakes": "کوبیدن پاشنه پا روی زمین یا خم کردن کمر به جای زانوها."
  },
  {
    "id": "drill-15-1",
    "categoryKey": "strength",
    "categoryTitle": "قدرتی",
    "subCategory": "همسترینگ و پشت ران (Hamstrings)",
    "title": "نوردیک همسترینگ (Nordic Curl)",
    "englishTitle": "Nordic Hamstring Curl",
    "difficulty": "پیشرفته",
    "duration": "۱۵ دقیقه",
    "setsReps": "۴ ست",
    "equipment": "پای تکیه‌گاه مهار شده توسط یار یا مانع",
    "targetSkill": "طلایی‌ترین تمرین پیشگیری از پارگی همسترینگ در فوتبال",
    "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-athlete-training-on-an-agility-ladder-41315-large.mp4",
    "thumbnailUrl": "https://images.openai.com/static-rsc-4/HyCz0EtmTOAVxue9wb7Hk41q0z-rYa0ih1g94Eo9_Unj7BOn64tEd5dixVFeR5lIq18jdPiVTyaCn9T_Awj8_dwex3SH8uKh6JHrnpvZZHv3x1YS8GlSZU2u1GsCtaYbwzL6fg_p8NkZOUEAt3u6bmYTB5SsehcwKE499QHODbA?purpose=inline",
    "description": "زانو زدن روی زمین و سقوط کنترل شده بالاتنه رو به جلو فقط با ترمز انقباض برون‌گرای همسترینگ.",
    "steps": [
      "زانو زدن روی زمین و سقوط کنترل شده بالاتنه رو به جلو فقط با ترمز انقباض برون‌گرای همسترینگ."
    ],
    "coachingTips": "مرکز ثقل بدن پایین حفظ شود و نگاه سر بالا باشد.",
    "commonMistakes": "کوبیدن پاشنه پا روی زمین یا خم کردن کمر به جای زانوها."
  },
  {
    "id": "drill-15-2",
    "categoryKey": "strength",
    "categoryTitle": "قدرتی",
    "subCategory": "همسترینگ و پشت ران (Hamstrings)",
    "title": "پل باسن تک‌پا (Single-Leg Bridge)",
    "englishTitle": "Single-Leg Glute Bridge",
    "difficulty": "متوسط",
    "duration": "۱۵ دقیقه",
    "setsReps": "۴ ست",
    "equipment": "زیرانداز",
    "targetSkill": "تقویت اکستنشن لگن و ثبات تکیه‌گاه",
    "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-athlete-training-on-an-agility-ladder-41315-large.mp4",
    "thumbnailUrl": "https://images.openai.com/static-rsc-4/h1c30IVfNp1qdZmnOcaNnvqlnuLF_Y9so1PRYJSmk2UZe4V84rIx2LAv47Av_Tk3XpElbl9dDg7XuqRmThrOJW8tqEE-v4tox_83wbOWMJiimOtf71mGS3ap6fMb5QkLt3d2zx-iMoMOM4x4cRFosC9qd_17OPn23G5GMvOttX8?purpose=inline",
    "description": "دراز کشیدن به پشت، بالا بردن یک پا و فشار دادن پاشنه پای دیگر برای پرتاب لگن به بالا.",
    "steps": [
      "دراز کشیدن به پشت، بالا بردن یک پا و فشار دادن پاشنه پای دیگر برای پرتاب لگن به بالا."
    ],
    "coachingTips": "مرکز ثقل بدن پایین حفظ شود و نگاه سر بالا باشد.",
    "commonMistakes": "کوبیدن پاشنه پا روی زمین یا خم کردن کمر به جای زانوها."
  },
  {
    "id": "drill-20-1",
    "categoryKey": "strength",
    "categoryTitle": "قدرتی",
    "subCategory": "عضلات مرکزی (Core Strength)",
    "title": "پلانک ساعد و پلانک جانبی",
    "englishTitle": "Forearm Plank & Side Plank",
    "difficulty": "مبتدی",
    "duration": "۱۵ دقیقه",
    "setsReps": "۴ ست",
    "equipment": "زیرانداز",
    "targetSkill": "ثبات تنه در برخوردهای فیزیکی و نبردهای تن‌به‌تن",
    "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-athlete-training-on-an-agility-ladder-41315-large.mp4",
    "thumbnailUrl": "https://images.openai.com/static-rsc-4/6VV_WNISGcao3VhflcyCu6_1ijilCLDom6NiJPImjhFD-QCaeyOcch1eu21J08kFXB-4UQenB4YrtOQUyCUgkyHyZ7LwZIaeEv9jDk37yUdAhLT2b9YWDXgm8UtIi0EtmvAZqvpHpvIW2YAx23ocyEJyfRAi6Zx0dee2Z7BAgHc?purpose=inline",
    "description": "نگه‌داشتن خط مستقیم سر، ستون فقرات و پاشنه با انقباض شدید شکم و سرینی.",
    "steps": [
      "نگه‌داشتن خط مستقیم سر، ستون فقرات و پاشنه با انقباض شدید شکم و سرینی."
    ],
    "coachingTips": "مرکز ثقل بدن پایین حفظ شود و نگاه سر بالا باشد.",
    "commonMistakes": "کوبیدن پاشنه پا روی زمین یا خم کردن کمر به جای زانوها."
  },
  {
    "id": "drill-20-2",
    "categoryKey": "strength",
    "categoryTitle": "قدرتی",
    "subCategory": "عضلات مرکزی (Core Strength)",
    "title": "حرکت ددباگ و برد داگ (Dead Bug)",
    "englishTitle": "Dead Bug & Bird Dog",
    "difficulty": "متوسط",
    "duration": "۱۵ دقیقه",
    "setsReps": "۴ ست",
    "equipment": "زیرانداز",
    "targetSkill": "هماهنگی ضربدری دست و پای متضاد و پایداری کمری",
    "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-athlete-training-on-an-agility-ladder-41315-large.mp4",
    "thumbnailUrl": "https://images.openai.com/static-rsc-4/YUxXvveqB-lwpI3kR33AbAvmmVkP3QHg8TRRGBYyf_S8IlxG2bsPKSTLWNJkdoXFHxV4O6UC9yBeLsGmFNc06uPpqA1WameBDNgkcTBZCELCbWzf8XTHoT3Ym4SDsNozZO0YVKWFLiL1Ro8vSuqOoIZqAqokQFZg-tUKzndD7sg?purpose=inline",
    "description": "حرکت متناوب دست و پای مخالف با حفظ گودی طبیعی کمر چسبیده به زمین.",
    "steps": [
      "حرکت متناوب دست و پای مخالف با حفظ گودی طبیعی کمر چسبیده به زمین."
    ],
    "coachingTips": "مرکز ثقل بدن پایین حفظ شود و نگاه سر بالا باشد.",
    "commonMistakes": "کوبیدن پاشنه پا روی زمین یا خم کردن کمر به جای زانوها."
  },
  {
    "id": "drill-22-1",
    "categoryKey": "strength",
    "categoryTitle": "قدرتی",
    "subCategory": "قدرت انفجاری (Explosive Strength)",
    "title": "پرش اسکوات و پرش طولی (Squat Jump)",
    "englishTitle": "Squat Jump & Broad Jump",
    "difficulty": "پیشرفته",
    "duration": "۱۵ دقیقه",
    "setsReps": "۴ ست",
    "equipment": "فضای باز چمن",
    "targetSkill": "قدرت ضربه سر، شتاب استارت و پرش عمودی",
    "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-athlete-training-on-an-agility-ladder-41315-large.mp4",
    "thumbnailUrl": "https://images.openai.com/static-rsc-4/5ToBxWTBGVvNpp5PTKyx3fqd3CWpNMPDW_a3nxJn-YUijZj-Xl5WJH7OeeuTITm-8o5ABtRCkYWKJv5V0Ho9-EzddauXTEv6K7mva8TYSShwIezIhINeMdTHkVUP6mz9kYS8HmMZ6HSuEeZNOCyITHHx80wrQdGfCJoo0qxRSi8?purpose=inline",
    "description": "اسکوات سریع و پرتاب انفجاری بدن به سمت بالا با فرود بی‌صدا روی سینه پا.",
    "steps": [
      "اسکوات سریع و پرتاب انفجاری بدن به سمت بالا با فرود بی‌صدا روی سینه پا."
    ],
    "coachingTips": "مرکز ثقل بدن پایین حفظ شود و نگاه سر بالا باشد.",
    "commonMistakes": "کوبیدن پاشنه پا روی زمین یا خم کردن کمر به جای زانوها."
  },
  {
    "id": "drill-23-1",
    "categoryKey": "strength",
    "categoryTitle": "قدرتی",
    "subCategory": "کشاله ران و داخل ران (Adductors & Groin)",
    "title": "پلانک کپنهاگ (Copenhagen Plank)",
    "englishTitle": "Copenhagen Plank",
    "difficulty": "پیشرفته",
    "duration": "۱۵ دقیقه",
    "setsReps": "۴ ست",
    "equipment": "نیمکت یا یار کمکی جهت تکیه‌گاه پای بالایی",
    "targetSkill": "مهم‌ترین پروتکل علمی جلوگیری از فتق ورزشی و آسیب کشاله",
    "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-athlete-training-on-an-agility-ladder-41315-large.mp4",
    "thumbnailUrl": "https://images.openai.com/static-rsc-4/zdBQ1Jqpdm_3OwSUI6aEVYbvbpxnQfwOJVNTobc8ao4wXO6Bq-GTWW9cJfRPVKtgy99yM5MEjf9de_plUIC9CCV7pOEz3SKSInips0CTcWX4GcTz5rHyn4xWm0v7Xrl5aciIokmW6Q5Nb3-Mp2err0cm73RFDedwNolsyNzkvDI?purpose=inline",
    "description": "پلانک جانبی در حالی که فقط مچ پای بالایی روی نیمکت قرار دارد و پای پایینی معلق یا چسبیده است.",
    "steps": [
      "پلانک جانبی در حالی که فقط مچ پای بالایی روی نیمکت قرار دارد و پای پایینی معلق یا چسبیده است."
    ],
    "coachingTips": "مرکز ثقل بدن پایین حفظ شود و نگاه سر بالا باشد.",
    "commonMistakes": "کوبیدن پاشنه پا روی زمین یا خم کردن کمر به جای زانوها."
  },
  {
    "id": "drill-27-1",
    "categoryKey": "strength",
    "categoryTitle": "قدرتی",
    "subCategory": "قدرت اختصاصی فوتبال (Football-Specific)",
    "title": "کنترل فرود تک‌پا و کاهش شتاب فوتبال",
    "englishTitle": "Single-Leg Landing Control & Deceleration",
    "difficulty": "پیشرفته",
    "duration": "۱۵ دقیقه",
    "setsReps": "۴ ست",
    "equipment": "موانع کوتاه و توپ",
    "targetSkill": "تثبیت زانو هنگام تکل و ترمزهای شدید بعد از شوت",
    "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-athlete-training-on-an-agility-ladder-41315-large.mp4",
    "thumbnailUrl": "https://images.openai.com/static-rsc-4/-Dij25-Cv6-HCxkSGuk8ZLr-dBKkqhrcZbfiAopSPY5olYF4ib5q63Q0Mg832Y3WNKNom3oLHJIt9iGkgd8KWeTGgQaSseIxEBWmQzXXcQmH-pIh-9ejMNgJD4h1pQXTvD9w5ZCCunkAFNmAxXs2ed6Pqky7ENAO-5xy0Sgr9FM?purpose=inline",
    "description": "شبیه‌سازی فرود بعد از ضربه سر با توقف ۲ ثانیه‌ای روی پای غالب و غیرغالب بدون تکان خوردن زانو.",
    "steps": [
      "شبیه‌سازی فرود بعد از ضربه سر با توقف ۲ ثانیه‌ای روی پای غالب و غیرغالب بدون تکان خوردن زانو."
    ],
    "coachingTips": "مرکز ثقل بدن پایین حفظ شود و نگاه سر بالا باشد.",
    "commonMistakes": "کوبیدن پاشنه پا روی زمین یا خم کردن کمر به جای زانوها."
  },
  {
    "id": "en-1",
    "categoryKey": "endurance",
    "categoryTitle": "استقامت",
    "subCategory": "بی‌هوازی تکرارشونده",
    "title": "تمرین استقامت سرعت تکراری (RSA فوتبال)",
    "englishTitle": "Pro Football Drill",
    "difficulty": "متوسط",
    "duration": "۱۵ دقیقه",
    "setsReps": "۴ ست",
    "equipment": "توپ، مخروط، موانع",
    "targetSkill": "تمرین استقامت سرعت تکراری (RSA فوتبال)",
    "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-athlete-training-on-an-agility-ladder-41315-large.mp4",
    "thumbnailUrl": "/drill-thumb-agility.png",
    "description": "تمرین تخصصی تمرین استقامت سرعت تکراری (RSA فوتبال) متناسب با فشار مسابقه فوتبال.",
    "steps": [
      "آماده‌سازی موقعیت بدنی.",
      "اجرای حرکت با حداکثر تمرکز.",
      "ریکاوری بین ست‌ها."
    ],
    "coachingTips": "تنفس منظم و مرکز ثقل بهینه.",
    "commonMistakes": "عجله در اجرای تکنیک قبل از تثبیت تعادل."
  },
  {
    "id": "ta-1",
    "categoryKey": "tactics",
    "categoryTitle": "تاکتیکی",
    "subCategory": "پرس و قطع توپ",
    "title": "تمرین زاویه هدایت و پرس تکی تهاجمی",
    "englishTitle": "Pro Football Drill",
    "difficulty": "متوسط",
    "duration": "۱۵ دقیقه",
    "setsReps": "۴ ست",
    "equipment": "توپ، مخروط، موانع",
    "targetSkill": "تمرین زاویه هدایت و پرس تکی تهاجمی",
    "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-athlete-training-on-an-agility-ladder-41315-large.mp4",
    "thumbnailUrl": "/drill-thumb-agility.png",
    "description": "تمرین تخصصی تمرین زاویه هدایت و پرس تکی تهاجمی متناسب با فشار مسابقه فوتبال.",
    "steps": [
      "آماده‌سازی موقعیت بدنی.",
      "اجرای حرکت با حداکثر تمرکز.",
      "ریکاوری بین ست‌ها."
    ],
    "coachingTips": "تنفس منظم و مرکز ثقل بهینه.",
    "commonMistakes": "عجله در اجرای تکنیک قبل از تثبیت تعادل."
  },
  {
    "id": "fl-1",
    "categoryKey": "flexibility",
    "categoryTitle": "انعطاف‌پذیری",
    "subCategory": "موبیلیتی مفاصل لگن",
    "title": "موبیلیتی ۹۰/۹۰ لگن برای شوت‌زنی و چرخش",
    "englishTitle": "Pro Football Drill",
    "difficulty": "متوسط",
    "duration": "۱۵ دقیقه",
    "setsReps": "۴ ست",
    "equipment": "توپ، مخروط، موانع",
    "targetSkill": "موبیلیتی ۹۰/۹۰ لگن برای شوت‌زنی و چرخش",
    "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-athlete-training-on-an-agility-ladder-41315-large.mp4",
    "thumbnailUrl": "/drill-thumb-agility.png",
    "description": "تمرین تخصصی موبیلیتی ۹۰/۹۰ لگن برای شوت‌زنی و چرخش متناسب با فشار مسابقه فوتبال.",
    "steps": [
      "آماده‌سازی موقعیت بدنی.",
      "اجرای حرکت با حداکثر تمرکز.",
      "ریکاوری بین ست‌ها."
    ],
    "coachingTips": "تنفس منظم و مرکز ثقل بهینه.",
    "commonMistakes": "عجله در اجرای تکنیک قبل از تثبیت تعادل."
  },
  {
    "id": "gk-1",
    "categoryKey": "goalkeeping",
    "categoryTitle": "دروازه‌بانی",
    "subCategory": "شیرجه و واکنش زمینی",
    "title": "شیرجه کوتاه زمینی با تکنیک فرود ایمن",
    "englishTitle": "Pro Football Drill",
    "difficulty": "متوسط",
    "duration": "۱۵ دقیقه",
    "setsReps": "۴ ست",
    "equipment": "توپ، مخروط، موانع",
    "targetSkill": "شیرجه کوتاه زمینی با تکنیک فرود ایمن",
    "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-athlete-training-on-an-agility-ladder-41315-large.mp4",
    "thumbnailUrl": "/drill-thumb-agility.png",
    "description": "تمرین تخصصی شیرجه کوتاه زمینی با تکنیک فرود ایمن متناسب با فشار مسابقه فوتبال.",
    "steps": [
      "آماده‌سازی موقعیت بدنی.",
      "اجرای حرکت با حداکثر تمرکز.",
      "ریکاوری بین ست‌ها."
    ],
    "coachingTips": "تنفس منظم و مرکز ثقل بهینه.",
    "commonMistakes": "عجله در اجرای تکنیک قبل از تثبیت تعادل."
  },
  {
    "id": "wm-1",
    "categoryKey": "warmup",
    "categoryTitle": "گرم‌کردن و سردکردن",
    "subCategory": "آماده‌سازی پویا FIFA 11+",
    "title": "پروتکل داینامیک گرم‌کردن فیفا ۱۱+ پلاس",
    "englishTitle": "Pro Football Drill",
    "difficulty": "متوسط",
    "duration": "۱۵ دقیقه",
    "setsReps": "۴ ست",
    "equipment": "توپ، مخروط، موانع",
    "targetSkill": "پروتکل داینامیک گرم‌کردن فیفا ۱۱+ پلاس",
    "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-athlete-training-on-an-agility-ladder-41315-large.mp4",
    "thumbnailUrl": "/drill-thumb-agility.png",
    "description": "تمرین تخصصی پروتکل داینامیک گرم‌کردن فیفا ۱۱+ پلاس متناسب با فشار مسابقه فوتبال.",
    "steps": [
      "آماده‌سازی موقعیت بدنی.",
      "اجرای حرکت با حداکثر تمرکز.",
      "ریکاوری بین ست‌ها."
    ],
    "coachingTips": "تنفس منظم و مرکز ثقل بهینه.",
    "commonMistakes": "عجله در اجرای تکنیک قبل از تثبیت تعادل."
  }
];
