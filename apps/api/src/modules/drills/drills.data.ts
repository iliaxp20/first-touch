export interface AgilityDrillItem {
  id: string;
  categoryIndex: number;
  categoryTitle: string;
  mainType?: 'چابکی' | 'قدرتی وزن بدن' | 'سرعت' | 'تکنیکی' | 'تاکتیکی' | 'استقامت' | 'دروازه‌بانی' | 'گرم‌کردن';
  englishName: string;
  persianName: string;
  imageUrl?: string;
  videoUrl?: string;
  equipment: string;
  targetSkill: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'PRO';
  description: string;
  isPremium?: boolean;
  targetAge?: string;
  targetPosition?: string;
  durationMinutes?: number;
  duration?: string;
  setsReps?: string;
  setsAndReps?: string;
  coachingTips?: string;
  commonMistakes?: string;
  similarDrills?: string[];
  categoryKey?: string;
}

export const INITIAL_AGILITY_DRILLS: AgilityDrillItem[] = [
  {
    id: 'drill-adm-1794802946244',
    categoryIndex: 1,
    categoryTitle: 'تمرینات چابکی و شتاب',
    englishName: 'Agility Sprint',
    persianName: 'شتاب و تغییر جهت انفجاری',
    imageUrl: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=600&q=80',
    videoUrl: '/uploads/1795327247084-C63495EC-5FAC-443D-8C87-97E8EDD4FF88.mp4',
    description: 'استارت‌های انفجاری و چرخش ۹۰ درجه حول مخروط با حداکثر سرعت',
    difficulty: 'INTERMEDIATE',
    equipment: 'مخروط',
    targetSkill: 'سرعت و چابکی',
    categoryKey: 'agility',
    duration: '۲۰ دقیقه',
    setsReps: '۴ ست',
  },
];
