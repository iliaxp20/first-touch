import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  ShieldAlert,
  Lock,
  Plus,
  Trash2,
  CheckCircle2,
  X,
  LogOut,
  Apple,
  Dumbbell,
  Eye,
  EyeOff,
} from 'lucide-react';
import {
  getReadyTrainingPlans,
  addReadyTrainingPlan,
  deleteReadyTrainingPlan,
  getReadyNutritionPlans,
  addReadyNutritionPlan,
  deleteReadyNutritionPlan,
  ReadyTrainingPlan,
  ReadyNutritionPlan,
} from '../plans/data/readyProgramsStore';

// STRICT HIDDEN ADMIN CREDENTIALS
const ADMIN_USER = 'ft_master_admin_2026';
const ADMIN_PASS = 'Ft#SecureX99!Alpha2026@Pass';
const SESSION_KEY = 'ft_secret_admin_session_auth';

interface SecretAdminPortalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SecretAdminPortal: React.FC<SecretAdminPortalProps> = ({
  isOpen,
  onClose,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem(SESSION_KEY) === 'granted_2026';
  });

  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);

  const [activeTab, setActiveTab] = useState<'training' | 'nutrition'>('training');

  // Stored Plans
  const [trainingPlans, setTrainingPlans] = useState<ReadyTrainingPlan[]>([]);
  const [nutritionPlans, setNutritionPlans] = useState<ReadyNutritionPlan[]>([]);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // New Training Plan Form
  const [newTraining, setNewTraining] = useState({
    title: '',
    ageGroup: 'نوجوانان (۱۲ تا ۱۵ سال)' as const,
    durationWeeks: 6,
    sessionsPerWeek: 4,
    totalSessions: 24,
    difficulty: 'متوسط' as const,
    goal: '',
    description: '',
    coachName: 'کادر ارشد فنی فرست تاچ',
    price: '۱۹۹,۰۰۰ تومان',
    priceNumber: 199000,
    equipment: 'مخروط، نردبان چابکی، توپ',
    drillsSummary: 'چابکی، شتاب گام اول، استقامت بی‌هوازی',
  });

  // New Nutrition Plan Form
  const [newNutrition, setNewNutrition] = useState({
    title: '',
    ageGroup: 'نوجوانان (۱۲ تا ۱۵ سال)' as const,
    dailyCalories: 2800,
    goal: 'تغذیه صفحات رشد و توان عضلانی بدون چربی',
    focus: 'پروتئین باکیفیت و کربوهیدرات کمپلکس',
    description: 'رژیم غذایی علمی فوتبال ۵ وعده‌ای جهت بازسازی گلیکوژن',
    price: '۱۹۹,۰۰۰ تومان',
    priceNumber: 199000,
    breakfast: '۴ سفیده تخم‌مرغ + جو دوسر با عسل و شیر کم‌چرب',
    lunch: 'برنج کته با فیله مرغ زعفرانی و سبزیجات بخارپز',
    dinner: 'ماهی قزل‌آلا یا بوقلمون با سیب‌زمینی پخته',
  });

  useEffect(() => {
    if (isAuthenticated) {
      setTrainingPlans(getReadyTrainingPlans());
      setNutritionPlans(getReadyNutritionPlans());
    }
  }, [isAuthenticated]);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (attempts >= 5) {
      setAuthError('دسترسی به علت تلاش‌های ناموفق مکرر مسدود گردید.');
      return;
    }

    if (usernameInput === ADMIN_USER && passwordInput === ADMIN_PASS) {
      setIsAuthenticated(true);
      sessionStorage.setItem(SESSION_KEY, 'granted_2026');
      setAuthError(null);
    } else {
      setAttempts((prev) => prev + 1);
      setAuthError('نام کاربری یا رمز عبور امنیتی ادمین نادرست است.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem(SESSION_KEY);
    onClose();
  };

  const handleCreateTrainingPlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTraining.title.trim()) return;

    const created = addReadyTrainingPlan({
      title: newTraining.title,
      ageGroup: newTraining.ageGroup,
      durationWeeks: Number(newTraining.durationWeeks),
      sessionsPerWeek: Number(newTraining.sessionsPerWeek),
      totalSessions: Number(newTraining.durationWeeks) * Number(newTraining.sessionsPerWeek),
      difficulty: newTraining.difficulty,
      goal: newTraining.goal || 'ارتقای توان فوتبال متناسب با سن',
      description: newTraining.description || 'برنامه آماده رسمی تدوین شده توسط کادر فنی آکادمی فرست تاچ.',
      equipment: newTraining.equipment.split('،').map((s) => s.trim()),
      coachName: newTraining.coachName,
      price: newTraining.price,
      priceNumber: newTraining.priceNumber,
      rating: 5.0,
      studentsCount: 1,
      drillsSummary: newTraining.drillsSummary.split('،').map((s) => s.trim()),
    });

    setTrainingPlans(getReadyTrainingPlans());
    setToastMsg(`برنامه آماده «${created.title}» با موفقیت ثبت و منتشر گردید.`);
    setTimeout(() => setToastMsg(null), 3500);

    // Reset Form
    setNewTraining({
      ...newTraining,
      title: '',
      goal: '',
      description: '',
    });
  };

  const handleDeleteTraining = (id: string) => {
    if (window.confirm('آیا از حذف این برنامه آماده تمرینی اطمینان دارید؟')) {
      deleteReadyTrainingPlan(id);
      setTrainingPlans(getReadyTrainingPlans());
    }
  };

  const handleCreateNutritionPlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNutrition.title.trim()) return;

    const created = addReadyNutritionPlan({
      title: newNutrition.title,
      ageGroup: newNutrition.ageGroup,
      dailyCalories: Number(newNutrition.dailyCalories),
      goal: newNutrition.goal,
      focus: newNutrition.focus,
      description: newNutrition.description,
      price: newNutrition.price,
      priceNumber: newNutrition.priceNumber,
      mealsSummary: [
        { name: 'صبحانه', food: newNutrition.breakfast, time: '۰۸:۰۰' },
        { name: 'ناهار', food: newNutrition.lunch, time: '۱۳:۳۰' },
        { name: 'شام', food: newNutrition.dinner, time: '۲۱:۰۰' },
      ],
    });

    setNutritionPlans(getReadyNutritionPlans());
    setToastMsg(`برنامه غذایی «${created.title}» با موفقیت افزوده شد.`);
    setTimeout(() => setToastMsg(null), 3500);

    setNewNutrition({
      ...newNutrition,
      title: '',
      goal: '',
    });
  };

  const handleDeleteNutrition = (id: string) => {
    if (window.confirm('آیا از حذف این برنامه غذایی اطمینان دارید؟')) {
      deleteReadyNutritionPlan(id);
      setNutritionPlans(getReadyNutritionPlans());
    }
  };

  return (
    <div className="fixed inset-0 z-70 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-lg overflow-y-auto select-none">
      <div className="w-full max-w-4xl bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl text-slate-100 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Hidden Portal Top Bar */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-rose-600/20 text-rose-400 border border-rose-500/30 flex items-center justify-center">
              <ShieldAlert className="h-4 w-4" />
            </div>
            <div>
              <span className="text-xs font-black text-rose-400 tracking-wider font-mono">
                [SECURE TERMINAL // ADMIN CONSOLE]
              </span>
              <p className="text-[11px] text-slate-400">
                درگاه محرمانه مدیریت برنامه‌های آماده فرست تاچ (غیرقابل مشاهده عمومی)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-xl border border-rose-900/60 text-rose-400 hover:bg-rose-950/40 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5" />
                خروج امن
              </button>
            )}
            <button
              onClick={onClose}
              className="h-8 w-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* =========================================================================
            STATE 1: STRICT LOGIN GATE (NOT AUTHENTICATED)
            ========================================================================= */}
        {!isAuthenticated ? (
          <div className="p-8 sm:p-12 flex flex-col items-center justify-center space-y-6 max-w-md mx-auto w-full text-center">
            <div className="h-16 w-16 rounded-3xl bg-rose-950/60 border border-rose-800/60 text-rose-400 flex items-center justify-center shadow-lg shadow-rose-950/50">
              <Lock className="h-8 w-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-black text-white">ورود به پنل محرمانه مدیریت سایت</h3>
              <p className="text-xs text-slate-400">
                این صفحه صرفاً مخصوص مدیران ارشد سیستم است و دسترسی عمومی ندارد.
              </p>
            </div>

            {authError && (
              <div className="w-full p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold animate-in shake">
                {authError}
              </div>
            )}

            <form onSubmit={handleLogin} className="w-full space-y-3.5 text-right text-xs">
              <div>
                <label className="text-slate-300 font-bold block mb-1">نام کاربری ادمین:</label>
                <input
                  type="text"
                  placeholder="Username..."
                  dir="ltr"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono text-xs focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">رمز عبور امنیتی پیچیده:</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Security Token..."
                    dir="ltr"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono text-xs focus:outline-none focus:border-rose-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full bg-rose-600 hover:bg-rose-700 text-white font-black text-xs h-11 rounded-xl shadow-lg shadow-rose-600/25 mt-2 cursor-pointer"
              >
                احراز هویت و ورود به کنسول
              </Button>
            </form>
          </div>
        ) : (
          /* =========================================================================
              STATE 2: AUTHENTICATED SECRET ADMIN CONSOLE
              ========================================================================= */
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            {toastMsg && (
              <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>{toastMsg}</span>
              </div>
            )}

            {/* Navigation Tabs */}
            <div className="grid grid-cols-2 gap-3 p-1 rounded-2xl bg-slate-900 border border-slate-800">
              <button
                type="button"
                onClick={() => setActiveTab('training')}
                className={`py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors ${
                  activeTab === 'training'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Dumbbell className="h-4 w-4" />
                مدیریت برنامه‌های آماده تمرینی (۱۹۹ هزار تومان)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('nutrition')}
                className={`py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors ${
                  activeTab === 'nutrition'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Apple className="h-4 w-4" />
                مدیریت برنامه‌های غذایی آماده (۱۹۹ هزار تومان)
              </button>
            </div>

            {/* TAB 1: READY TRAINING PLANS MANAGEMENT */}
            {activeTab === 'training' && (
              <div className="space-y-6">
                {/* Add Form */}
                <Card className="bg-slate-900/90 border-slate-800 p-5 rounded-2xl text-right space-y-4">
                  <h4 className="text-sm font-black text-white flex items-center gap-2">
                    <Plus className="h-4 w-4 text-purple-400" />
                    افزودن برنامه تمرینی آماده جدید برای رده‌های سنی
                  </h4>

                  <form onSubmit={handleCreateTrainingPlan} className="space-y-3 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2">
                        <label className="text-slate-300 font-bold block mb-1">
                          عنوان برنامه تمرینی:
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="مثلاً: برنامه انفجاری پیش‌فصل نونهالان زیر ۱۲ سال"
                          value={newTraining.title}
                          onChange={(e) =>
                            setNewTraining({ ...newTraining, title: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-purple-500"
                        />
                      </div>
                      <div>
                        <label className="text-slate-300 font-bold block mb-1">رده سنی:</label>
                        <select
                          value={newTraining.ageGroup}
                          onChange={(e) =>
                            setNewTraining({
                              ...newTraining,
                              ageGroup: e.target.value as any,
                            })
                          }
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-purple-500"
                        >
                          <option value="نونهالان (زیر ۱۲ سال)">نونهالان (زیر ۱۲ سال)</option>
                          <option value="نوجوانان (۱۲ تا ۱۵ سال)">نوجوانان (۱۲ تا ۱۵ سال)</option>
                          <option value="جوانان (۱۶ تا ۱۹ سال)">جوانان (۱۶ تا ۱۹ سال)</option>
                          <option value="بزرگسالان (+۱۹ سال)">بزرگسالان (+۱۹ سال)</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="text-slate-300 font-bold block mb-1">تعداد هفته:</label>
                        <input
                          type="number"
                          min={2}
                          max={16}
                          value={newTraining.durationWeeks}
                          onChange={(e) =>
                            setNewTraining({
                              ...newTraining,
                              durationWeeks: Number(e.target.value),
                            })
                          }
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-purple-500"
                        />
                      </div>
                      <div>
                        <label className="text-slate-300 font-bold block mb-1">
                          جلسات در هفته:
                        </label>
                        <input
                          type="number"
                          min={1}
                          max={6}
                          value={newTraining.sessionsPerWeek}
                          onChange={(e) =>
                            setNewTraining({
                              ...newTraining,
                              sessionsPerWeek: Number(e.target.value),
                            })
                          }
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-purple-500"
                        />
                      </div>
                      <div>
                        <label className="text-slate-300 font-bold block mb-1">سطح دشواری:</label>
                        <select
                          value={newTraining.difficulty}
                          onChange={(e) =>
                            setNewTraining({
                              ...newTraining,
                              difficulty: e.target.value as any,
                            })
                          }
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-purple-500"
                        >
                          <option value="مبتدی">مبتدی</option>
                          <option value="متوسط">متوسط</option>
                          <option value="پیشرفته">پیشرفته</option>
                          <option value="حرفه‌ای">حرفه‌ای</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-slate-300 font-bold block mb-1">هزینه:</label>
                        <input
                          type="text"
                          value={newTraining.price}
                          onChange={(e) =>
                            setNewTraining({ ...newTraining, price: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-amber-400 font-black focus:outline-none focus:border-purple-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-slate-300 font-bold block mb-1">
                        عناوین تمرینات و محورها (با کاما جدا کنید):
                      </label>
                      <input
                        type="text"
                        value={newTraining.drillsSummary}
                        onChange={(e) =>
                          setNewTraining({ ...newTraining, drillsSummary: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-purple-500"
                      />
                    </div>

                    <div>
                      <label className="text-slate-300 font-bold block mb-1">
                        شرح و متدولوژی تمرین:
                      </label>
                      <textarea
                        rows={2}
                        value={newTraining.description}
                        onChange={(e) =>
                          setNewTraining({ ...newTraining, description: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-purple-500"
                      />
                    </div>

                    <Button
                      type="submit"
                      variant="primary"
                      className="bg-purple-600 hover:bg-purple-700 text-white font-black text-xs px-5 h-9 rounded-xl cursor-pointer"
                    >
                      ثبت و انتشار در بخش شاگرد (۱۹۹ هزار تومان)
                    </Button>
                  </form>
                </Card>

                {/* List of Existing Plans */}
                <div className="space-y-3">
                  <h4 className="text-xs font-black text-slate-400">
                    برنامه‌های آماده تمرینی فعال در سایت ({trainingPlans.length} برنامه):
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {trainingPlans.map((plan) => (
                      <div
                        key={plan.id}
                        className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-start justify-between gap-3 text-right text-xs"
                      >
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-950 text-purple-300 border border-purple-800">
                            {plan.ageGroup}
                          </span>
                          <h5 className="font-black text-white">{plan.title}</h5>
                          <p className="text-[11px] text-slate-400">
                            {plan.durationWeeks} هفته | {plan.sessionsPerWeek} جلسه در هفته |{' '}
                            {plan.price}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteTraining(plan.id)}
                          className="h-8 w-8 rounded-lg bg-rose-950/60 text-rose-400 border border-rose-900/60 hover:bg-rose-900/80 flex items-center justify-center shrink-0 cursor-pointer"
                          title="حذف برنامه"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: READY NUTRITION PLANS MANAGEMENT */}
            {activeTab === 'nutrition' && (
              <div className="space-y-6">
                <Card className="bg-slate-900/90 border-slate-800 p-5 rounded-2xl text-right space-y-4">
                  <h4 className="text-sm font-black text-white flex items-center gap-2">
                    <Plus className="h-4 w-4 text-purple-400" />
                    افزودن برنامه غذایی آماده جدید
                  </h4>

                  <form onSubmit={handleCreateNutritionPlan} className="space-y-3 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2">
                        <label className="text-slate-300 font-bold block mb-1">
                          عنوان برنامه غذایی:
                        </label>
                        <input
                          type="text"
                          required
                          value={newNutrition.title}
                          onChange={(e) =>
                            setNewNutrition({ ...newNutrition, title: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-purple-500"
                        />
                      </div>
                      <div>
                        <label className="text-slate-300 font-bold block mb-1">رده سنی:</label>
                        <select
                          value={newNutrition.ageGroup}
                          onChange={(e) =>
                            setNewNutrition({
                              ...newNutrition,
                              ageGroup: e.target.value as any,
                            })
                          }
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-purple-500"
                        >
                          <option value="نونهالان (زیر ۱۲ سال)">نونهالان (زیر ۱۲ سال)</option>
                          <option value="نوجوانان (۱۲ تا ۱۵ سال)">نوجوانان (۱۲ تا ۱۵ سال)</option>
                          <option value="جوانان (۱۶ تا ۱۹ سال)">جوانان (۱۶ تا ۱۹ سال)</option>
                          <option value="بزرگسالان (+۱۹ سال)">بزرگسالان (+۱۹ سال)</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-slate-300 font-bold block mb-1">کالری روزانه:</label>
                        <input
                          type="number"
                          value={newNutrition.dailyCalories}
                          onChange={(e) =>
                            setNewNutrition({
                              ...newNutrition,
                              dailyCalories: Number(e.target.value),
                            })
                          }
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-purple-500"
                        />
                      </div>
                      <div>
                        <label className="text-slate-300 font-bold block mb-1">هزینه:</label>
                        <input
                          type="text"
                          value={newNutrition.price}
                          onChange={(e) =>
                            setNewNutrition({ ...newNutrition, price: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-amber-400 font-black focus:outline-none focus:border-purple-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-slate-300 font-bold block mb-1">هدف رژیم:</label>
                      <input
                        type="text"
                        value={newNutrition.goal}
                        onChange={(e) =>
                          setNewNutrition({ ...newNutrition, goal: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-purple-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-slate-300 font-bold block mb-1">صبحانه:</label>
                        <input
                          type="text"
                          value={newNutrition.breakfast}
                          onChange={(e) =>
                            setNewNutrition({ ...newNutrition, breakfast: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-purple-500"
                        />
                      </div>
                      <div>
                        <label className="text-slate-300 font-bold block mb-1">ناهار:</label>
                        <input
                          type="text"
                          value={newNutrition.lunch}
                          onChange={(e) =>
                            setNewNutrition({ ...newNutrition, lunch: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-purple-500"
                        />
                      </div>
                      <div>
                        <label className="text-slate-300 font-bold block mb-1">شام:</label>
                        <input
                          type="text"
                          value={newNutrition.dinner}
                          onChange={(e) =>
                            setNewNutrition({ ...newNutrition, dinner: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-purple-500"
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      variant="primary"
                      className="bg-purple-600 hover:bg-purple-700 text-white font-black text-xs px-5 h-9 rounded-xl cursor-pointer"
                    >
                      ثبت و انتشار رژیم غذایی (۱۹۹ هزار تومان)
                    </Button>
                  </form>
                </Card>

                <div className="space-y-3">
                  <h4 className="text-xs font-black text-slate-400">
                    رژیم‌های غذایی آماده موجود ({nutritionPlans.length}):
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {nutritionPlans.map((nut) => (
                      <div
                        key={nut.id}
                        className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-start justify-between gap-3 text-right text-xs"
                      >
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-950 text-purple-300 border border-purple-800">
                            {nut.ageGroup}
                          </span>
                          <h5 className="font-black text-white">{nut.title}</h5>
                          <p className="text-[11px] text-slate-400">
                            {nut.dailyCalories} کالری | {nut.price}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteNutrition(nut.id)}
                          className="h-8 w-8 rounded-lg bg-rose-950/60 text-rose-400 border border-rose-900/60 hover:bg-rose-900/80 flex items-center justify-center shrink-0 cursor-pointer"
                          title="حذف رژیم"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
