import { Injectable, NotFoundException } from '@nestjs/common';
import {
  AGE_NUTRITION_PLANS,
  GOAL_NUTRITION_PLANS,
  WORKOUT_TIMING_GUIDE,
  IRANIAN_FOOD_DATABASE,
  AgeNutritionPlan,
  FoodCalorieItem,
} from './nutrition.data';

@Injectable()
export class NutritionService {
  private agePlans = [...AGE_NUTRITION_PLANS];
  private goalPlans = [...GOAL_NUTRITION_PLANS];
  private timingGuide = WORKOUT_TIMING_GUIDE;
  private foodDatabase = [...IRANIAN_FOOD_DATABASE];

  async getAgePlans(): Promise<AgeNutritionPlan[]> {
    return this.agePlans;
  }

  async getGoalPlans() {
    return this.goalPlans;
  }

  async getWorkoutTimingGuide() {
    return this.timingGuide;
  }

  async getFoodDatabase(category?: string, search?: string): Promise<FoodCalorieItem[]> {
    let result = this.foodDatabase;

    if (category) {
      result = result.filter((f) => f.category === category);
    }
    if (search) {
      const q = search.toLowerCase().trim();
      result = result.filter((f) => f.name.includes(q) || f.category.includes(q));
    }

    return result;
  }

  async addFoodItem(food: Omit<FoodCalorieItem, 'id'>): Promise<FoodCalorieItem> {
    const newItem: FoodCalorieItem = {
      id: `f-${Date.now()}`,
      ...food,
    };
    this.foodDatabase.unshift(newItem);
    return newItem;
  }

  async addAgePlan(plan: Partial<AgeNutritionPlan>): Promise<AgeNutritionPlan> {
    const newPlan: AgeNutritionPlan = {
      id: `nut-age-${Date.now()}`,
      ageGroup: plan.ageGroup || 'رده جدید',
      ageRange: plan.ageRange || 'عمومی',
      focus: plan.focus || 'رشد و آمادگی ورزشی',
      dailyCalories: plan.dailyCalories || 2000,
      description: plan.description || 'برنامه تغذیه اختصاصی ثبت شده توسط متخصص',
      meals: plan.meals || [],
      keyNutrients: plan.keyNutrients || ['کربوهیدرات', 'پروتئین', 'املاح'],
    };
    this.agePlans.unshift(newPlan);
    return newPlan;
  }
}
