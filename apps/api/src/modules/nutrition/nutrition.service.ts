import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import {
  IRANIAN_FOOD_DATABASE,
  DEFAULT_NUTRITION_TARGET,
  PRESET_NUTRITION_PLANS,
  FoodCalorieItem,
  DailyNutritionTarget,
  LoggedFoodItem,
  DailyLogSummary,
  PresetNutritionPlan,
} from './nutrition.data';

export interface LogFoodDto {
  date?: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  foodId?: string;
  count?: number; // تعداد (1, 2, 3...)
  isCompleted?: boolean;
  customFood?: {
    name: string;
    portion?: string;
    count?: number;
    unitName?: string;
    calories: number;
    protein: number;
    carbs?: number;
    fat?: number;
  };
}

@Injectable()
export class NutritionService {
  private foodDatabase: FoodCalorieItem[] = [...IRANIAN_FOOD_DATABASE];
  private dailyTarget: DailyNutritionTarget = { ...DEFAULT_NUTRITION_TARGET };
  private presetPlans: PresetNutritionPlan[] = [...PRESET_NUTRITION_PLANS];

  // Store logs by date string (YYYY-MM-DD), starts empty
  private dailyLogs: Map<string, LoggedFoodItem[]> = new Map();

  private getTodayKey(): string {
    const now = new Date();
    return now.toISOString().split('T')[0];
  }

  async getPresetPlans(): Promise<PresetNutritionPlan[]> {
    return this.presetPlans;
  }

  async applyPresetPlan(planId: string, dateStr?: string): Promise<DailyLogSummary> {
    const plan = this.presetPlans.find((p) => p.id === planId);
    if (!plan) {
      throw new NotFoundException('برنامه تغذیه مورد نظر یافت نشد');
    }

    const dateKey = dateStr || this.getTodayKey();

    // 1. Update target calories and macros
    this.dailyTarget = {
      calories: plan.dailyCalories,
      protein: plan.protein,
      carbs: plan.carbs,
      fat: plan.fat,
      planTitle: plan.title,
      planType: plan.type,
    };

    // 2. Clear old planned items for this date and insert new checklist items
    const existing = this.dailyLogs.get(dateKey) || [];
    const userAddedOnly = existing.filter((item) => !item.isPlannedItem);

    const newPlannedItems: LoggedFoodItem[] = plan.plannedItems.map((item, idx) => ({
      id: `planned-${Date.now()}-${idx}`,
      name: item.name,
      portion: item.portion,
      count: item.count,
      unitName: item.unitName || 'سهم',
      calories: item.calories,
      protein: item.protein,
      carbs: item.carbs,
      fat: item.fat,
      mealType: item.mealType,
      loggedAt: new Date().toISOString(),
      isPlannedItem: true,
      isCompleted: false, // User checks it off when eaten!
    }));

    this.dailyLogs.set(dateKey, [...newPlannedItems, ...userAddedOnly]);
    return this.getDailyLog(dateKey);
  }

  async resetPlan(dateStr?: string): Promise<DailyLogSummary> {
    const dateKey = dateStr || this.getTodayKey();
    this.dailyLogs.delete(dateKey);
    this.dailyTarget = {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      planTitle: '',
      planType: 'none',
    };
    return this.getDailyLog(dateKey);
  }

  async togglePlannedItem(itemId: string, dateStr?: string): Promise<DailyLogSummary> {
    const dateKey = dateStr || this.getTodayKey();
    let items = this.dailyLogs.get(dateKey) || [];
    let item = items.find((i) => i.id === itemId);

    if (!item) {
      // Check if it matches an item from preset plans
      for (const preset of this.presetPlans) {
        const found = preset.plannedItems.find((p, idx) => `preset-${idx}` === itemId || p.name === itemId);
        if (found) {
          item = {
            id: itemId,
            name: found.name,
            portion: found.portion,
            count: found.count || 1,
            unitName: found.unitName || 'سهم',
            calories: found.calories,
            protein: found.protein,
            carbs: found.carbs,
            fat: found.fat,
            mealType: found.mealType,
            loggedAt: new Date().toISOString(),
            isPlannedItem: true,
            isCompleted: false,
          };
          items.push(item);
          break;
        }
      }

      if (!item) {
        item = {
          id: itemId,
          name: 'وعده غذایی ثبتی',
          portion: 'یک وعده',
          count: 1,
          unitName: 'سهم',
          calories: 350,
          protein: 20,
          carbs: 40,
          fat: 10,
          mealType: 'snack',
          loggedAt: new Date().toISOString(),
          isPlannedItem: true,
          isCompleted: false,
        };
        items.push(item);
      }
    }

    item.isCompleted = !item.isCompleted;
    this.dailyLogs.set(dateKey, [...items]);
    return this.getDailyLog(dateKey);
  }

  async updateItemCount(itemId: string, count: number, dateStr?: string): Promise<DailyLogSummary> {
    const dateKey = dateStr || this.getTodayKey();
    const items = this.dailyLogs.get(dateKey) || [];
    const item = items.find((i) => i.id === itemId);

    if (!item) {
      throw new NotFoundException('آیتم مورد نظر یافت نشد');
    }

    const oldCount = item.count > 0 ? item.count : 1;
    const newCount = count > 0 ? count : 1;
    const multiplier = newCount / oldCount;

    item.count = newCount;
    item.calories = Math.round(item.calories * multiplier);
    item.protein = Math.round(item.protein * multiplier * 10) / 10;
    item.carbs = Math.round(item.carbs * multiplier * 10) / 10;
    item.fat = Math.round(item.fat * multiplier * 10) / 10;

    this.dailyLogs.set(dateKey, [...items]);
    return this.getDailyLog(dateKey);
  }

  async getFoodDatabase(category?: string, search?: string): Promise<FoodCalorieItem[]> {
    let result = this.foodDatabase;

    if (category && category !== 'همه') {
      result = result.filter((f) => f.category === category);
    }
    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          f.category.toLowerCase().includes(q) ||
          (f.searchTerms && f.searchTerms.some((term) => term.toLowerCase().includes(q))),
      );
    }

    return result;
  }

  async addFoodItem(food: Omit<FoodCalorieItem, 'id'>): Promise<FoodCalorieItem> {
    const newItem: FoodCalorieItem = {
      id: `f-custom-${Date.now()}`,
      name: food.name,
      category: food.category || 'غذاهای اصلی',
      portion: food.portion || '۱ عدد',
      unitName: food.unitName || 'عدد',
      calories: Number(food.calories) || 0,
      protein: Number(food.protein) || 0,
      carbs: Number(food.carbs) || 0,
      fat: Number(food.fat) || 0,
      isCustom: true,
    };
    this.foodDatabase.unshift(newItem);
    return newItem;
  }

  async getDailyTarget(): Promise<DailyNutritionTarget> {
    return this.dailyTarget;
  }

  async updateDailyTarget(target: Partial<DailyNutritionTarget>): Promise<DailyNutritionTarget> {
    const calories = Number(target.calories) || this.dailyTarget.calories;
    const planTitle = target.planTitle || (calories > 0 ? 'برنامه دستی اختصاصی' : '');
    const planType = target.planType || (calories > 0 ? 'ready' : 'none');

    this.dailyTarget = {
      ...this.dailyTarget,
      ...target,
      calories,
      protein: Number(target.protein) || this.dailyTarget.protein,
      carbs: Number(target.carbs) || this.dailyTarget.carbs,
      fat: Number(target.fat) || this.dailyTarget.fat,
      currentWeight: target.currentWeight !== undefined ? Number(target.currentWeight) : this.dailyTarget.currentWeight,
      targetWeight: target.targetWeight !== undefined ? Number(target.targetWeight) : this.dailyTarget.targetWeight,
      weightGoal: target.weightGoal || this.dailyTarget.weightGoal || 'maintain',
      planTitle,
      planType,
    };
    return this.dailyTarget;
  }

  async getDailyLog(dateStr?: string): Promise<DailyLogSummary> {
    const dateKey = dateStr || this.getTodayKey();
    const items = this.dailyLogs.get(dateKey) || [];

    const meals = {
      breakfast: items.filter((i) => i.mealType === 'breakfast'),
      lunch: items.filter((i) => i.mealType === 'lunch'),
      dinner: items.filter((i) => i.mealType === 'dinner'),
      snack: items.filter((i) => i.mealType === 'snack' || (i.mealType as string).includes('Snack')),
    };

    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;

    for (const item of items) {
      // Items only count when checked off as completed!
      if (item.isCompleted) {
        totalCalories += item.calories;
        totalProtein += item.protein;
        totalCarbs += item.carbs;
        totalFat += item.fat;
      }
    }

    totalCalories = Math.round(totalCalories);
    totalProtein = Math.round(totalProtein * 10) / 10;
    totalCarbs = Math.round(totalCarbs * 10) / 10;
    totalFat = Math.round(totalFat * 10) / 10;

    const remainingCalories = Math.round(this.dailyTarget.calories - totalCalories);
    const caloriesProgressPct = Math.min(100, Math.round((totalCalories / this.dailyTarget.calories) * 100));
    const proteinProgressPct = Math.min(100, Math.round((totalProtein / this.dailyTarget.protein) * 100));

    return {
      date: dateKey,
      target: this.dailyTarget,
      totalCalories,
      totalProtein,
      totalCarbs,
      totalFat,
      remainingCalories,
      caloriesProgressPct,
      proteinProgressPct,
      meals,
    };
  }

  async logFood(dto: LogFoodDto): Promise<DailyLogSummary> {
    const dateKey = dto.date || this.getTodayKey();
    const count = Number(dto.count) > 0 ? Math.round(Number(dto.count)) : 1;

    let loggedItem: LoggedFoodItem;

    if (dto.foodId) {
      const food = this.foodDatabase.find((f) => f.id === dto.foodId);
      if (!food) {
        throw new NotFoundException(`ماده غذایی با شناسه ${dto.foodId} یافت نشد`);
      }

      loggedItem = {
        id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        foodId: food.id,
        name: food.name,
        portion: `${count} ${food.unitName}`,
        count,
        unitName: food.unitName,
        calories: Math.round(food.calories * count),
        protein: Math.round(food.protein * count * 10) / 10,
        carbs: Math.round(food.carbs * count * 10) / 10,
        fat: Math.round(food.fat * count * 10) / 10,
        mealType: dto.mealType || 'lunch',
        loggedAt: new Date().toISOString(),
        isCompleted: dto.isCompleted !== undefined ? Boolean(dto.isCompleted) : false,
        isCustom: !!food.isCustom,
      };
    } else if (dto.customFood) {
      const { name, calories, protein, carbs, fat, unitName } = dto.customFood;
      if (!name || calories === undefined) {
        throw new BadRequestException('نام غذا و کالری برای ثبت الزامی است');
      }

      const unit = unitName || 'عدد';
      loggedItem = {
        id: `log-cust-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        name: name.trim(),
        portion: `${count} ${unit}`,
        count,
        unitName: unit,
        calories: Math.round(Number(calories) * count),
        protein: Math.round(Number(protein || 0) * count * 10) / 10,
        carbs: Math.round((Number(carbs) || 0) * count * 10) / 10,
        fat: Math.round((Number(fat) || 0) * count * 10) / 10,
        mealType: dto.mealType || 'lunch',
        loggedAt: new Date().toISOString(),
        isCompleted: dto.isCompleted !== undefined ? Boolean(dto.isCompleted) : false,
        isCustom: true,
      };
    } else {
      throw new BadRequestException('باید یا foodId یا customFood ارسال شود');
    }

    const items = this.dailyLogs.get(dateKey) || [];
    items.push(loggedItem);
    this.dailyLogs.set(dateKey, items);

    return this.getDailyLog(dateKey);
  }

  async deleteLoggedFood(logId: string, dateStr?: string): Promise<DailyLogSummary> {
    const dateKey = dateStr || this.getTodayKey();
    const items = this.dailyLogs.get(dateKey) || [];
    const filtered = items.filter((item) => item.id !== logId);

    this.dailyLogs.set(dateKey, filtered);
    return this.getDailyLog(dateKey);
  }
}
