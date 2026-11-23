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
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed to get training drills', err);
  }
  return [];
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

        const local = getTrainingDrills();
        const serverIds = new Set(mapped.map((d) => d.id));
        const merged = [...mapped, ...local.filter((l) => !serverIds.has(l.id))];
        saveTrainingDrills(merged);
        return merged;
      }
    }
  } catch (err) {
    console.warn('Failed to sync drills with server', err);
  }
  return getTrainingDrills();
};

export const FREE_TRAINING_DRILLS: FreeDrill[] = [];
