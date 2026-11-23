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
      id: 'drill-adm-1794802946244',
      title: 'شتاب و تغییر جهت انفجاری',
      duration: '20 min',
      difficultyLabel: 'متوسط',
      difficultyBars: [true, true, false],
      barColor: 'emerald',
      image: '/drill-thumb-agility.png',
      videoUrl: '/uploads/1795327247084-C63495EC-5FAC-443D-8C87-97E8EDD4FF88.mp4',
    },
    {
      id: 'drill-passing',
      title: 'پاس‌کاری دقیق و چرخش',
      duration: '15 min',
      difficultyLabel: 'آسان',
      difficultyBars: [true, false, false],
      barColor: 'emerald',
      image: '/drill-thumb-passing.png',
      videoUrl: '/uploads/1795327270453-188C1646-FB83-4F65-B537-18EC2F7C8145.mp4',
    },
    {
      id: 'drill-cones',
      title: 'کنترل توپ و استارت کوتاه',
      duration: '15 min',
      difficultyLabel: 'متوسط',
      difficultyBars: [true, true, false],
      barColor: 'emerald',
      image: '/drill-thumb-cones.png',
      videoUrl: '/uploads/1795327354521-ECF2C5EF-5D1C-4398-B624-2E4FE9FE1DF5.mp4',
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
    subContent: 'شتاب اولیه، تغییر جهت، واکنش',
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
        const valid = parsed.filter(
          (d: FreeDrill) =>
            d &&
            d.id &&
            !d.id.startsWith('drill-1-') &&
            !d.id.startsWith('drill-passing') &&
            !d.id.startsWith('drill-cones') &&
            !d.title?.includes('شافل') &&
            (d.videoUrl?.includes('/uploads/') || d.id?.startsWith('drill-adm-'))
        );
        if (valid.length > 0) return valid;
      }
    }
  } catch (err) {
    console.error('Failed to get training drills', err);
  }
  return [
    {
      id: 'drill-adm-1794802946244',
      categoryKey: 'agility',
      categoryTitle: 'تمرینات چابکی و شتاب',
      subCategory: 'تمرینات چابکی و شتاب',
      title: 'شتاب و تغییر جهت انفجاری',
      englishTitle: 'Agility Sprint',
      difficulty: 'متوسط',
      duration: '۲۰ دقیقه',
      setsReps: '۴ ست',
      equipment: 'مخروط',
      targetSkill: 'سرعت و چابکی',
      videoUrl: '/uploads/1795327247084-C63495EC-5FAC-443D-8C87-97E8EDD4FF88.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=600&q=80',
      description: 'استارت‌های انفجاری و چرخش ۹۰ درجه حول مخروط با حداکثر سرعت',
      steps: ['استارت‌های انفجاری و چرخش ۹۰ درجه حول مخروط با حداکثر سرعت'],
      coachingTips: 'حفظ مرکز ثقل پایین در زمان چرخش',
      commonMistakes: 'برخورد به موانع یا گام‌های بیش از حد بلند',
    },
  ];
};

export const saveTrainingDrills = (drills: FreeDrill[]): void => {
  try {
    const cleanDrills = drills.filter(
      (d) =>
        d &&
        d.id &&
        !d.id.startsWith('drill-1-') &&
        !d.id.startsWith('drill-passing') &&
        !d.id.startsWith('drill-cones') &&
        !d.title?.includes('شافل') &&
        (d.videoUrl?.includes('/uploads/') || d.id?.startsWith('drill-adm-'))
    );
    localStorage.setItem(DRILLS_STORAGE_KEY, JSON.stringify(cleanDrills));
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
              d &&
              d.id &&
              !d.id.startsWith('drill-1-') &&
              !d.persianName?.includes('شافل') &&
              !d.title?.includes('شافل') &&
              (d.videoUrl?.includes('/uploads/') || d.id?.startsWith('drill-adm-'))
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

        saveTrainingDrills(mapped);
        return mapped;
      }
    }
  } catch (err) {
    console.warn('Failed to sync drills with server', err);
  }
  return getTrainingDrills();
};

export const FREE_TRAINING_DRILLS: FreeDrill[] = [];
