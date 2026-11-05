export type IntensityLevel = 'سبک' | 'متوسط' | 'بالا' | 'فشرده';

export interface DailyWorkoutTask {
  id: string;
  title: string;
  category: string;
  durationMinutes: number;
  intensity: IntensityLevel;
  completed: boolean;
  drillsCount: number;
  focusArea: string;
  videoThumb?: string;
}

export interface DailyMealTask {
  id: string;
  mealType: 'breakfast' | 'snack_pre' | 'lunch' | 'snack_post' | 'dinner';
  mealTitle: string;
  timeEstimate: string;
  itemsSummary: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  completed: boolean;
}

export interface MacroTarget {
  target: number;
  consumed: number;
  unit: string;
}

export interface PlayerStats {
  readinessScore: number; // 0 - 100
  streakDays: number;
  playerLevel: number;
  playerLevelTitle: string;
  currentXp: number;
  targetXp: number;
  completedSessionsWeek: number;
  totalSessionsWeek: number;
  totalMinutesWeek: number;
  hydrationMl: number;
  targetHydrationMl: number;
  sleepHours: number;
  recoveryStatus: 'عالی' | 'خوب' | 'نیاز به استراحت';
}

export interface WeeklyDayActivity {
  dayName: string;
  dateStr: string;
  isCompleted: boolean;
  minutes: number;
  isToday: boolean;
}
