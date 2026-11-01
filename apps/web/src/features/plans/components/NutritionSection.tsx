import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import {
  Apple,
  Utensils,
  Flame,
  Search,
  Clock,
  Droplets,
  Zap,
  ShieldAlert,
  CheckCircle2,
} from 'lucide-react';

export interface AgeNutritionPlan {
  id: string;
  ageGroup: string;
  ageRange: string;
  focus: string;
  dailyCalories?: number;
  description: string;
  warningNote?: string;
  meals: {
    mealName: string;
    foods: string;
    approxCalories?: number;
  }[];
  keyNutrients: string[];
  imageUrl?: string;
}

export interface FoodCalorieItem {
  id: string;
  name: string;
  category: string;
  portion: string;
  calories: number;
}

export const NutritionSection: React.FC = () => {
  const [subTab, setSubTab] = useState<'age-plans' | 'goals' | 'workout-timing' | 'calorie-table'>('age-plans');
  const [agePlans, setAgePlans] = useState<AgeNutritionPlan[]>([]);
  const [goalPlans, setGoalPlans] = useState<any[]>([]);
  const [workoutTiming, setWorkoutTiming] = useState<any>(null);
  const [foods, setFoods] = useState<FoodCalorieItem[]>([]);
  const [selectedAgePlanId, setSelectedAgePlanId] = useState<string>('nut-age-3');
  const [selectedGoalId, setSelectedGoalId] = useState<string>('goal-weight-gain');
  const [foodSearch, setFoodSearch] = useState('');
  const [foodCategory, setFoodCategory] = useState<string>('همه');

  useEffect(() => {
    const fetchNutritionData = async () => {
      try {
        const [ageRes, goalRes, timingRes, foodsRes] = await Promise.all([
          fetch('http://localhost:4000/nutrition/age-plans'),
          fetch('http://localhost:4000/nutrition/goal-plans'),
          fetch('http://localhost:4000/nutrition/timing'),
          fetch('http://localhost:4000/nutrition/foods'),
        ]);

        if (ageRes.ok) setAgePlans(await ageRes.json());
        if (goalRes.ok) setGoalPlans(await goalRes.json());
        if (timingRes.ok) setWorkoutTiming(await timingRes.json());
        if (foodsRes.ok) setFoods(await foodsRes.json());
      } catch {
        // Fallback
      }
    };

    fetchNutritionData();
  }, []);

  const activeAgePlan = agePlans.find((p) => p.id === selectedAgePlanId) || agePlans[0];
  const activeGoalPlan = goalPlans.find((g) => g.id === selectedGoalId) || goalPlans[0];

  const filteredFoods = foods.filter((f) => {
    const matchesCat = foodCategory === 'همه' || f.category === foodCategory;
    const matchesSearch = !foodSearch.trim() || f.name.includes(foodSearch.trim()) || f.category.includes(foodSearch.trim());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6 select-none">
      {/* Sub Navigation Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
        <button
          type="button"
          onClick={() => setSubTab('age-plans')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
            subTab === 'age-plans'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-500/25'
              : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
          }`}
        >
          <Utensils className="h-4 w-4" />
          برنامه تغذیه بر اساس رده سنی (۷ سال تا بزرگسالان)
        </button>

        <button
          type="button"
          onClick={() => setSubTab('goals')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
            subTab === 'goals'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-500/25'
              : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
          }`}
        >
          <Flame className="h-4 w-4" />
          تغذیه بر اساس هدف (افزایش و مدیریت وزن)
        </button>

        <button
          type="button"
          onClick={() => setSubTab('workout-timing')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
            subTab === 'workout-timing'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-500/25'
              : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
          }`}
        >
          <Clock className="h-4 w-4" />
          تغذیه قبل، حین و بعد از تمرین فوتبال
        </button>

        <button
          type="button"
          onClick={() => setSubTab('calorie-table')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
            subTab === 'calorie-table'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-500/25'
              : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
          }`}
        >
          <Apple className="h-4 w-4" />
          بانک کالری مواد غذایی ایرانی
        </button>
      </div>

      {/* 1. AGE BASED PLANS */}
      {subTab === 'age-plans' && (
        <div className="space-y-5">
          {/* Age Pills Selector */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {agePlans.map((plan) => {
              const isSelected = selectedAgePlanId === plan.id;
              return (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => setSelectedAgePlanId(plan.id)}
                  className={`p-3 rounded-2xl border text-right transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-purple-600 bg-purple-50/80 dark:bg-purple-950/40 shadow-sm ring-2 ring-purple-500/20'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 hover:border-purple-300'
                  }`}
                >
                  <span className="text-xs font-black text-slate-900 dark:text-white block">{plan.ageGroup}</span>
                  <span className="text-[11px] font-bold text-purple-600 dark:text-purple-400 mt-1">{plan.ageRange}</span>
                </button>
              );
            })}
          </div>

          {activeAgePlan && (
            <Card className="border border-purple-200/90 dark:border-white/10 bg-white/95 dark:bg-slate-900/95 rounded-3xl p-5 sm:p-7 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4 text-right">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                      رده {activeAgePlan.ageGroup} ({activeAgePlan.ageRange})
                    </span>
                    {activeAgePlan.dailyCalories && (
                      <span className="text-xs font-bold text-slate-500">
                        میانگین کالری تقریبی: <strong className="text-slate-900 dark:text-white">{activeAgePlan.dailyCalories} کالری</strong>
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">
                    تمرکز اصلی: {activeAgePlan.focus}
                  </h3>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {activeAgePlan.keyNutrients.map((n, i) => (
                    <span key={i} className="text-[11px] font-bold px-2.5 py-1 rounded-xl bg-purple-50 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                      {n}
                    </span>
                  ))}
                </div>
              </div>

              {activeAgePlan.warningNote && (
                <div className="p-3.5 rounded-2xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/70 dark:bg-amber-950/20 flex items-start gap-2.5 text-right text-xs">
                  <ShieldAlert className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-amber-800 dark:text-amber-300 leading-relaxed font-semibold">
                    {activeAgePlan.warningNote}
                  </p>
                </div>
              )}

              {/* Meals List */}
              <div className="space-y-3">
                <h4 className="text-xs font-black text-slate-900 dark:text-white text-right">
                  الگوی پیشنهادی وعده‌های غذایی روزانه:
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-right">
                  {activeAgePlan.meals.map((meal, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-purple-700 dark:text-purple-300">{meal.mealName}</span>
                        {meal.approxCalories && (
                          <span className="text-[11px] font-bold text-slate-500">{meal.approxCalories} کالری</span>
                        )}
                      </div>
                      <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                        {meal.foods}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* 2. GOAL BASED PLANS */}
      {subTab === 'goals' && (
        <div className="space-y-5 text-right">
          <div className="flex gap-3">
            {goalPlans.map((goal) => {
              const isSelected = selectedGoalId === goal.id;
              return (
                <button
                  key={goal.id}
                  type="button"
                  onClick={() => setSelectedGoalId(goal.id)}
                  className={`flex-1 p-4 rounded-2xl border text-right transition-all ${
                    isSelected
                      ? 'border-purple-600 bg-purple-50/80 dark:bg-purple-950/40 shadow-sm ring-2 ring-purple-500/20'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'
                  }`}
                >
                  <h4 className="text-sm font-black text-slate-900 dark:text-white">{goal.title}</h4>
                  <p className="text-xs text-purple-600 dark:text-purple-400 font-bold mt-1">حدود {goal.dailyCalories} کالری روزانه</p>
                </button>
              );
            })}
          </div>

          {activeGoalPlan && (
            <Card className="border border-purple-200/90 dark:border-white/10 bg-white/95 dark:bg-slate-900/95 rounded-3xl p-5 sm:p-7 space-y-5">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-base font-black text-slate-900 dark:text-white">{activeGoalPlan.title}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">{activeGoalPlan.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {activeGoalPlan.meals.map((m: any, idx: number) => (
                  <div key={idx} className="p-3.5 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40">
                    <span className="text-xs font-black text-purple-700 dark:text-purple-300 block mb-1">{m.mealName}</span>
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">{m.foods}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}

      {/* 3. WORKOUT TIMING (PRE, INTRA, POST) */}
      {subTab === 'workout-timing' && workoutTiming && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-right">
          {/* Pre */}
          <Card className="p-5 border border-purple-200/90 dark:border-white/10 bg-white dark:bg-slate-900 rounded-3xl space-y-4">
            <div className="h-10 w-10 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center font-black">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-black text-slate-900 dark:text-white">{workoutTiming.preWorkout.title}</h4>
              <p className="text-xs text-slate-500 mt-0.5">{workoutTiming.preWorkout.purpose}</p>
            </div>
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              {workoutTiming.preWorkout.recommendations.map((r: string, i: number) => (
                <div key={i} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{r}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Intra */}
          <Card className="p-5 border border-purple-200/90 dark:border-white/10 bg-white dark:bg-slate-900 rounded-3xl space-y-4">
            <div className="h-10 w-10 rounded-2xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center font-black">
              <Droplets className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-black text-slate-900 dark:text-white">{workoutTiming.intraWorkout.title}</h4>
              <p className="text-xs text-slate-500 mt-0.5">{workoutTiming.intraWorkout.purpose}</p>
            </div>
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              {workoutTiming.intraWorkout.recommendations.map((r: string, i: number) => (
                <div key={i} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{r}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Post */}
          <Card className="p-5 border border-purple-200/90 dark:border-white/10 bg-white dark:bg-slate-900 rounded-3xl space-y-4">
            <div className="h-10 w-10 rounded-2xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center font-black">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-black text-slate-900 dark:text-white">{workoutTiming.postWorkout.title}</h4>
              <p className="text-xs text-slate-500 mt-0.5">{workoutTiming.postWorkout.purpose}</p>
            </div>
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              {workoutTiming.postWorkout.recommendations.map((r: string, i: number) => (
                <div key={i} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{r}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* 4. IRANIAN CALORIE TABLE */}
      {subTab === 'calorie-table' && (
        <Card className="border border-purple-200/90 dark:border-white/10 bg-white/95 dark:bg-slate-900/95 rounded-3xl p-5 sm:p-6 space-y-5 text-right">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">بانک کالری مواد غذایی ایرانی</h3>
              <p className="text-xs text-slate-500">مشاهده ارزش کالری نان‌های سنتی، برنج، پروتئین‌ها و مغزها</p>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="جستجوی ماده غذایی (سنگک، مرغ، موز)..."
                value={foodSearch}
                onChange={(e) => setFoodSearch(e.target.value)}
                className="w-full h-10 pr-10 pl-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium focus:outline-none focus:border-purple-600"
              />
            </div>
          </div>

          {/* Categories Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
            {['همه', 'نان و غلات', 'پروتئین‌ها', 'لبنیات', 'میوه‌ها', 'مغزها و چربی‌های مفید'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setFoodCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  foodCategory === cat
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Foods Table */}
          <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 overflow-hidden">
            <table className="w-full text-xs text-right">
              <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold">
                <tr>
                  <th className="p-3">ماده غذایی</th>
                  <th className="p-3">دسته‌بندی</th>
                  <th className="p-3">مقدار سهم</th>
                  <th className="p-3 text-left">کالری تقریبی</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredFoods.map((item) => (
                  <tr key={item.id} className="hover:bg-purple-50/40 dark:hover:bg-purple-950/20 transition-colors">
                    <td className="p-3 font-bold text-slate-900 dark:text-white">{item.name}</td>
                    <td className="p-3 text-purple-600 dark:text-purple-400 font-semibold">{item.category}</td>
                    <td className="p-3 text-slate-500 dark:text-slate-400">{item.portion}</td>
                    <td className="p-3 font-black text-slate-900 dark:text-white text-left dir-ltr">{item.calories} kcal</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};
