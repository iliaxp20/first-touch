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
  Video,
  Upload,
  Edit3,
  RotateCcw,
  Users,
  Play,
  Layers,
  Zap,
  Flame,
  Activity,
  Target,
  Compass,
  Scale,
  Sparkles,
  Shield,
  HeartPulse,
  Trophy,
  Timer,
  Tag,
} from 'lucide-react';
import {
  getReadyTrainingPlans,
  addReadyTrainingPlan,
  updateReadyTrainingPlan,
  deleteReadyTrainingPlan,
  getReadyNutritionPlans,
  addReadyNutritionPlan,
  updateReadyNutritionPlan,
  deleteReadyNutritionPlan,
  ReadyTrainingPlan,
  ReadyNutritionPlan,
} from '../plans/data/readyProgramsStore';
import {
  getTrainingCategories,
  addTrainingCategory,
  updateTrainingCategory,
  deleteTrainingCategory,
  resetTrainingCategories,
  TrainingCategoryMeta,
} from '../plans/data/freeTrainingCategories';

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
    return !!sessionStorage.getItem(SESSION_KEY);
  });

  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const [activeTab, setActiveTab] = useState<
    'training' | 'categories' | 'nutrition' | 'student_active'
  >('training');

  // Stored Plans & Categories
  const [trainingPlans, setTrainingPlans] = useState<ReadyTrainingPlan[]>([]);
  const [categories, setCategories] = useState<TrainingCategoryMeta[]>([]);
  const [nutritionPlans, setNutritionPlans] = useState<ReadyNutritionPlan[]>([]);
  const [studentActivePlans, setStudentActivePlans] = useState<any[]>([]);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Training Plan Editing Mode
  const [editingTrainingId, setEditingTrainingId] = useState<string | null>(null);

  // Training Form State
  const initialTrainingState = {
    title: '',
    ageGroup: 'نوجوانان (۱۲ تا ۱۵ سال)' as const,
    category: '',
    durationWeeks: 6,
    sessionsPerWeek: 4,
    totalSessions: 24,
    difficulty: 'متوسط' as const,
    isFree: false,
    goal: '',
    description: '',
    coachName: 'کادر ارشد فنی فرست تاچ',
    price: '۱۹۹,۰۰۰ تومان',
    priceNumber: 199000,
    equipment: 'مخروط، نردبان چابکی، توپ',
    drillsSummary: 'چابکی، شتاب گام اول، استقامت بی‌هوازی',
    videoUrl: '',
  };

  const [newTraining, setNewTraining] = useState(initialTrainingState);

  // Category Editing Mode
  const [editingCategoryKey, setEditingCategoryKey] = useState<string | null>(null);

  const initialCategoryState = {
    title: '',
    key: '',
    subContent: '',
    iconName: 'Zap',
    color: 'from-purple-500 to-indigo-600',
    drillsCount: 5,
  };

  const [newCategory, setNewCategory] = useState(initialCategoryState);

  // Nutrition Plan Editing Mode
  const [editingNutritionId, setEditingNutritionId] = useState<string | null>(null);

  const initialNutritionState = {
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
  };

  const [newNutrition, setNewNutrition] = useState(initialNutritionState);

  const loadData = () => {
    setTrainingPlans(getReadyTrainingPlans());
    setCategories(getTrainingCategories());
    setNutritionPlans(getReadyNutritionPlans());
    try {
      const raw = localStorage.getItem('first_touch_student_active_plans');
      setStudentActivePlans(raw ? JSON.parse(raw) : []);
    } catch {
      setStudentActivePlans([]);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const renderCategoryIcon = (iconName: string, className = 'h-4 w-4') => {
    switch (iconName) {
      case 'Zap':
        return <Zap className={className} />;
      case 'Flame':
        return <Flame className={className} />;
      case 'Dumbbell':
        return <Dumbbell className={className} />;
      case 'Activity':
        return <Activity className={className} />;
      case 'Target':
        return <Target className={className} />;
      case 'Compass':
        return <Compass className={className} />;
      case 'Scale':
        return <Scale className={className} />;
      case 'Sparkles':
        return <Sparkles className={className} />;
      case 'Shield':
        return <Shield className={className} />;
      case 'HeartPulse':
        return <HeartPulse className={className} />;
      case 'Trophy':
        return <Trophy className={className} />;
      case 'Timer':
        return <Timer className={className} />;
      default:
        return <Tag className={className} />;
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (attempts >= 5) {
      setAuthError('دسترسی به علت تلاش‌های ناموفق مکرر موقتاً مسدود گردید.');
      return;
    }

    setIsLoading(true);
    setAuthError(null);

    try {
      const response = await fetch('http://localhost:4000/auth/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: usernameInput.trim(),
          password: passwordInput,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'نام کاربری یا رمز عبور امنیتی ادمین نادرست است.');
      }

      setIsAuthenticated(true);
      sessionStorage.setItem(SESSION_KEY, data.token || 'granted');
      setAuthError(null);
    } catch (err: any) {
      setAttempts((prev) => prev + 1);
      setAuthError(err.message || 'خطا در ارتباط با سرور امنیتی ادمین.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem(SESSION_KEY);
    onClose();
  };

  // Video File Upload Handler
  const handleVideoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 60 * 1024 * 1024) {
      alert('حجم ویدیو نباید بیشتر از ۶۰ مگابایت باشد.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setNewTraining((prev) => ({ ...prev, videoUrl: result }));
      showToast('ویدیو با موفقیت بارگذاری شد.');
    };
    reader.readAsDataURL(file);
  };

  // =========================================================================
  // TRAINING PLANS HANDLERS
  // =========================================================================
  const handleSaveTrainingPlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTraining.title.trim()) return;

    const calculatedTotalSessions =
      Number(newTraining.durationWeeks) * Number(newTraining.sessionsPerWeek);

    const priceText = newTraining.isFree ? 'رایگان' : newTraining.price;
    const priceNum = newTraining.isFree ? 0 : Number(newTraining.priceNumber) || 0;

    const equipmentList = newTraining.equipment
      ? newTraining.equipment
          .split('،')
          .flatMap((s) => s.split(','))
          .map((s) => s.trim())
          .filter(Boolean)
      : [];

    const drillsList = newTraining.drillsSummary
      ? newTraining.drillsSummary
          .split('،')
          .flatMap((s) => s.split(','))
          .map((s) => s.trim())
          .filter(Boolean)
      : [];

    if (editingTrainingId) {
      const existing = trainingPlans.find((p) => p.id === editingTrainingId);
      const updatedPlan: ReadyTrainingPlan = {
        ...existing,
        id: editingTrainingId,
        title: newTraining.title,
        ageGroup: newTraining.ageGroup,
        category: newTraining.category || undefined,
        durationWeeks: Number(newTraining.durationWeeks),
        sessionsPerWeek: Number(newTraining.sessionsPerWeek),
        totalSessions: calculatedTotalSessions,
        difficulty: newTraining.difficulty,
        isFree: newTraining.isFree,
        goal: newTraining.goal,
        description: newTraining.description,
        equipment: equipmentList,
        coachName: newTraining.coachName,
        price: priceText,
        priceNumber: priceNum,
        rating: existing?.rating || 5.0,
        studentsCount: existing?.studentsCount || 1,
        drillsSummary: drillsList,
        videoUrl: newTraining.videoUrl || undefined,
      };

      updateReadyTrainingPlan(updatedPlan);
      showToast(`برنامه «${updatedPlan.title}» با موفقیت ویرایش و ذخیره شد.`);
      setEditingTrainingId(null);
    } else {
      const created = addReadyTrainingPlan({
        title: newTraining.title,
        ageGroup: newTraining.ageGroup,
        category: newTraining.category || undefined,
        durationWeeks: Number(newTraining.durationWeeks),
        sessionsPerWeek: Number(newTraining.sessionsPerWeek),
        totalSessions: calculatedTotalSessions,
        difficulty: newTraining.difficulty,
        isFree: newTraining.isFree,
        goal: newTraining.goal,
        description: newTraining.description,
        equipment: equipmentList,
        coachName: newTraining.coachName,
        price: priceText,
        priceNumber: priceNum,
        rating: 5.0,
        studentsCount: 1,
        drillsSummary: drillsList,
        videoUrl: newTraining.videoUrl || undefined,
      });

      showToast(`برنامه آماده «${created.title}» با موفقیت ثبت و منتشر گردید.`);
    }

    setNewTraining(initialTrainingState);
    loadData();
  };

  const handleStartEditTraining = (plan: ReadyTrainingPlan) => {
    setEditingTrainingId(plan.id);
    setNewTraining({
      title: plan.title,
      ageGroup: plan.ageGroup as any,
      category: plan.category || '',
      durationWeeks: plan.durationWeeks,
      sessionsPerWeek: plan.sessionsPerWeek,
      totalSessions: plan.totalSessions,
      difficulty: plan.difficulty as any,
      isFree: plan.isFree || plan.price === 'رایگان' || plan.priceNumber === 0,
      goal: plan.goal || '',
      description: plan.description || '',
      coachName: plan.coachName || 'کادر ارشد فنی فرست تاچ',
      price: plan.price || '۱۹۹,۰۰۰ تومان',
      priceNumber: plan.priceNumber || 199000,
      equipment: Array.isArray(plan.equipment)
        ? plan.equipment.join('، ')
        : plan.equipment || '',
      drillsSummary: Array.isArray(plan.drillsSummary)
        ? plan.drillsSummary.join('، ')
        : plan.drillsSummary || '',
      videoUrl: plan.videoUrl || '',
    });
    const el = document.getElementById('admin-training-form');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCancelEditTraining = () => {
    setEditingTrainingId(null);
    setNewTraining(initialTrainingState);
  };

  const handleDeleteTraining = (id: string, title: string) => {
    if (
      window.confirm(
        `آیا از حذف دائمی برنامه تمرینی «${title}» اطمینان دارید؟\nاین برنامه کاملاً حذف شده و مجدداً ظاهر نخواهد شد.`
      )
    ) {
      deleteReadyTrainingPlan(id);
      loadData();
      showToast(`برنامه «${title}» به صورت دائمی حذف گردید.`);
      if (editingTrainingId === id) {
        handleCancelEditTraining();
      }
    }
  };

  // =========================================================================
  // CATEGORIES MANAGEMENT HANDLERS
  // =========================================================================
  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.title.trim()) return;

    if (editingCategoryKey) {
      const updatedCat: TrainingCategoryMeta = {
        key: editingCategoryKey,
        title: newCategory.title.trim(),
        subContent: newCategory.subContent.trim(),
        iconName: newCategory.iconName,
        color: newCategory.color,
        drillsCount: Number(newCategory.drillsCount) || 5,
      };
      updateTrainingCategory(updatedCat);
      showToast(`دسته‌بندی «${updatedCat.title}» با موفقیت ویرایش شد.`);
      setEditingCategoryKey(null);
    } else {
      const created = addTrainingCategory({
        key: newCategory.key.trim() || undefined,
        title: newCategory.title.trim(),
        subContent: newCategory.subContent.trim(),
        iconName: newCategory.iconName,
        color: newCategory.color,
        drillsCount: Number(newCategory.drillsCount) || 5,
      });
      showToast(`دسته‌بندی «${created.title}» با موفقیت اضافه گردید.`);
    }

    setNewCategory(initialCategoryState);
    loadData();
  };

  const handleStartEditCategory = (cat: TrainingCategoryMeta) => {
    setEditingCategoryKey(cat.key);
    setNewCategory({
      title: cat.title,
      key: cat.key,
      subContent: cat.subContent,
      iconName: cat.iconName,
      color: cat.color,
      drillsCount: cat.drillsCount,
    });
    const el = document.getElementById('admin-category-form');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCancelEditCategory = () => {
    setEditingCategoryKey(null);
    setNewCategory(initialCategoryState);
  };

  const handleDeleteCategory = (key: string, title: string) => {
    if (
      window.confirm(
        `آیا از حذف دسته‌بندی «${title}» اطمینان دارید؟\nاین دسته‌بندی از فهرست انتخاب برنامه‌ها حذف خواهد شد.`
      )
    ) {
      deleteTrainingCategory(key);
      loadData();
      showToast(`دسته‌بندی «${title}» حذف گردید.`);
      if (editingCategoryKey === key) {
        handleCancelEditCategory();
      }
    }
  };

  const handleResetCategories = () => {
    if (
      window.confirm(
        'آیا از بازنشانی کلیه دسته‌بندی‌ها به ۱۰ دسته‌بندی پیش‌فرض آکادمی اطمینان دارید؟'
      )
    ) {
      resetTrainingCategories();
      loadData();
      showToast('دسته‌بندی‌ها با موفقیت به حالت پیش‌فرض بازگردانی شدند.');
    }
  };

  // =========================================================================
  // NUTRITION HANDLERS
  // =========================================================================
  const handleSaveNutritionPlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNutrition.title.trim()) return;

    if (editingNutritionId) {
      const existing = nutritionPlans.find((n) => n.id === editingNutritionId);
      const updated: ReadyNutritionPlan = {
        ...existing,
        id: editingNutritionId,
        title: newNutrition.title,
        ageGroup: newNutrition.ageGroup,
        dailyCalories: Number(newNutrition.dailyCalories),
        goal: newNutrition.goal,
        focus: newNutrition.focus,
        description: newNutrition.description,
        price: newNutrition.price,
        priceNumber: Number(newNutrition.priceNumber) || 199000,
        mealsSummary: [
          { name: 'صبحانه', food: newNutrition.breakfast, time: '۰۸:۰۰' },
          { name: 'ناهار', food: newNutrition.lunch, time: '۱۳:۳۰' },
          { name: 'شام', food: newNutrition.dinner, time: '۲۱:۰۰' },
        ],
      };
      updateReadyNutritionPlan(updated);
      showToast(`رژیم غذایی «${updated.title}» با موفقیت ویرایش شد.`);
      setEditingNutritionId(null);
    } else {
      const created = addReadyNutritionPlan({
        title: newNutrition.title,
        ageGroup: newNutrition.ageGroup,
        dailyCalories: Number(newNutrition.dailyCalories),
        goal: newNutrition.goal,
        focus: newNutrition.focus,
        description: newNutrition.description,
        price: newNutrition.price,
        priceNumber: Number(newNutrition.priceNumber) || 199000,
        mealsSummary: [
          { name: 'صبحانه', food: newNutrition.breakfast, time: '۰۸:۰۰' },
          { name: 'ناهار', food: newNutrition.lunch, time: '۱۳:۳۰' },
          { name: 'شام', food: newNutrition.dinner, time: '۲۱:۰۰' },
        ],
      });
      showToast(`برنامه غذایی «${created.title}» با موفقیت افزوده شد.`);
    }

    setNewNutrition(initialNutritionState);
    loadData();
  };

  const handleStartEditNutrition = (nut: ReadyNutritionPlan) => {
    setEditingNutritionId(nut.id);
    const b = nut.mealsSummary?.find((m) => m.name.includes('صبحانه'))?.food || '';
    const l = nut.mealsSummary?.find((m) => m.name.includes('ناهار'))?.food || '';
    const d = nut.mealsSummary?.find((m) => m.name.includes('شام'))?.food || '';

    setNewNutrition({
      title: nut.title,
      ageGroup: nut.ageGroup as any,
      dailyCalories: nut.dailyCalories,
      goal: nut.goal,
      focus: nut.focus || '',
      description: nut.description,
      price: nut.price,
      priceNumber: nut.priceNumber,
      breakfast: b || 'صبحانه پروتئینی کامل',
      lunch: l || 'ناهار پرکربوهیدرات و مرغ',
      dinner: d || 'شام سبک و ماهی',
    });
  };

  const handleDeleteNutrition = (id: string, title: string) => {
    if (window.confirm(`آیا از حذف این برنامه غذایی «${title}» اطمینان دارید؟`)) {
      deleteReadyNutritionPlan(id);
      loadData();
      showToast(`برنامه غذایی «${title}» حذف شد.`);
    }
  };

  // Student Active Plans Handlers
  const handleRemoveStudentActivePlan = (id: string, title: string) => {
    if (
      window.confirm(`آیا از حذف برنامه «${title}» از کارتابل فعال شاگرد اطمینان دارید؟`)
    ) {
      const updated = studentActivePlans.filter((p) => p.id !== id);
      setStudentActivePlans(updated);
      localStorage.setItem('first_touch_student_active_plans', JSON.stringify(updated));
      showToast(`برنامه فعال «${title}» از کارتابل شاگرد حذف گردید.`);
    }
  };

  const handleClearAllStudentActivePlans = () => {
    if (
      window.confirm('آیا از پاک‌سازی تمامی برنامه‌های فعال شاگردان اطمینان دارید؟')
    ) {
      setStudentActivePlans([]);
      localStorage.removeItem('first_touch_student_active_plans');
      showToast('کلیه برنامه‌های فعال شاگردان ریست گردید.');
    }
  };

  return (
    <div className="fixed inset-0 z-70 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-lg overflow-y-auto select-none">
      <div className="w-full max-w-5xl bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl text-slate-100 overflow-hidden flex flex-col max-h-[94vh]">
        {/* Hidden Portal Top Bar */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-rose-600/20 text-rose-400 border border-rose-500/30 flex items-center justify-center">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-rose-400 tracking-wider font-mono">
                  [FIRST TOUCH // ADMIN MANAGEMENT CONSOLE]
                </span>
                <span className="text-[10px] bg-rose-950 text-rose-300 border border-rose-800 px-2 py-0.5 rounded font-mono">
                  ROOT PRIVILEGES
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                درگاه محرمانه مدیریت جامع برنامه‌ها، دسته‌بندی‌ها، آپلود ویدیو و کارتابل شاگردان
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
                <label className="text-slate-300 font-bold block mb-1">رمز عبور امنیتی:</label>
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
                disabled={isLoading}
                className="w-full bg-rose-600 hover:bg-rose-700 text-white font-black text-xs h-11 rounded-xl shadow-lg shadow-rose-600/25 mt-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? 'در حال اعتبارسنجی با سرور...' : 'احراز هویت امن و ورود به کنسول'}
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
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-1.5 rounded-2xl bg-slate-900 border border-slate-800">
              <button
                type="button"
                onClick={() => setActiveTab('training')}
                className={`py-2.5 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
                  activeTab === 'training'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Dumbbell className="h-4 w-4" />
                <span>برنامه‌های تمرینی ({trainingPlans.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('categories')}
                className={`py-2.5 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
                  activeTab === 'categories'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Layers className="h-4 w-4" />
                <span>دسته‌بندی‌های تمرین ({categories.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('nutrition')}
                className={`py-2.5 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
                  activeTab === 'nutrition'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Apple className="h-4 w-4" />
                <span>برنامه‌های غذایی ({nutritionPlans.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('student_active')}
                className={`py-2.5 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
                  activeTab === 'student_active'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Users className="h-4 w-4" />
                <span>فعال شاگردان ({studentActivePlans.length})</span>
              </button>
            </div>

            {/* TAB 1: READY TRAINING PLANS MANAGEMENT */}
            {activeTab === 'training' && (
              <div className="space-y-6">
                {/* Form (Add or Edit) */}
                <Card
                  id="admin-training-form"
                  className={`bg-slate-900/95 border-slate-800 p-5 sm:p-6 rounded-2xl text-right space-y-4 ${
                    editingTrainingId ? 'ring-2 ring-purple-500 border-purple-500/50' : ''
                  }`}
                >
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h4 className="text-sm font-black text-white flex items-center gap-2">
                      {editingTrainingId ? (
                        <>
                          <Edit3 className="h-4 w-4 text-amber-400" />
                          <span>ویرایش برنامه تمرینی (کد: {editingTrainingId})</span>
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4 text-purple-400" />
                          <span>افزودن برنامه تمرینی جدید (آماده یا رایگان)</span>
                        </>
                      )}
                    </h4>

                    {editingTrainingId && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancelEditTraining}
                        className="text-xs h-8 px-3 border-slate-700 text-slate-300 hover:text-white gap-1.5 cursor-pointer"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                        انصراف از ویرایش
                      </Button>
                    )}
                  </div>

                  <form onSubmit={handleSaveTrainingPlan} className="space-y-4 text-xs">
                    {/* Row 1: Title, Age Group & Category */}
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                      <div className="sm:col-span-2">
                        <label className="text-slate-300 font-bold block mb-1">
                          عنوان برنامه تمرینی: *
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
                        <label className="text-slate-300 font-bold block mb-1">
                          رده سنی متناسب: *
                        </label>
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
                      <div>
                        <label className="text-slate-300 font-bold block mb-1">
                          دسته‌بندی تمرین:
                        </label>
                        <select
                          value={newTraining.category}
                          onChange={(e) =>
                            setNewTraining({ ...newTraining, category: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-purple-300 font-bold focus:outline-none focus:border-purple-500"
                        >
                          <option value="">بدون دسته‌بندی خاص (عمومی)</option>
                          {categories.map((c) => (
                            <option key={c.key} value={c.title}>
                              {c.title}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Row 2: Duration, Sessions, Difficulty, Price & Free Toggle */}
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                      <div>
                        <label className="text-slate-300 font-bold block mb-1">تعداد هفته‌ها:</label>
                        <input
                          type="number"
                          min={1}
                          max={24}
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
                          max={7}
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
                        <label className="text-slate-300 font-bold block mb-1">نوع برنامه:</label>
                        <label className="flex items-center gap-2 mt-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={newTraining.isFree}
                            onChange={(e) =>
                              setNewTraining({
                                ...newTraining,
                                isFree: e.target.checked,
                                price: e.target.checked ? 'رایگان' : '۱۹۹,۰۰۰ تومان',
                                priceNumber: e.target.checked ? 0 : 199000,
                              })
                            }
                            className="rounded text-purple-600 focus:ring-purple-500 h-4 w-4 bg-slate-950 border-slate-800"
                          />
                          <span className="text-xs font-bold text-emerald-400">برنامه رایگان</span>
                        </label>
                      </div>
                      <div>
                        <label className="text-slate-300 font-bold block mb-1">مبلغ / هزینه:</label>
                        <input
                          type="text"
                          disabled={newTraining.isFree}
                          value={newTraining.price}
                          onChange={(e) =>
                            setNewTraining({ ...newTraining, price: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-amber-400 font-black focus:outline-none focus:border-purple-500 disabled:opacity-40"
                        />
                      </div>
                    </div>

                    {/* Row 3: Coach Name & Goal */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-slate-300 font-bold block mb-1">
                          طراح / مربی مسئول برنامه:
                        </label>
                        <input
                          type="text"
                          value={newTraining.coachName}
                          onChange={(e) =>
                            setNewTraining({ ...newTraining, coachName: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-purple-500"
                        />
                      </div>
                      <div>
                        <label className="text-slate-300 font-bold block mb-1">
                          هدف اصلی برنامه (Goal):
                        </label>
                        <input
                          type="text"
                          placeholder="مثلاً: بهبود سرعت انفجاری، چابکی و موبیلیتی لگن"
                          value={newTraining.goal}
                          onChange={(e) =>
                            setNewTraining({ ...newTraining, goal: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-purple-500"
                        />
                      </div>
                    </div>

                    {/* Row 4: Equipment & Drills Summary */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-slate-300 font-bold block mb-1">
                          تجهیزات و وسایل مورد نیاز (با کاما جدا کنید):
                        </label>
                        <input
                          type="text"
                          placeholder="مخروط، نردبان چابکی، توپ، کش مقاومتی"
                          value={newTraining.equipment}
                          onChange={(e) =>
                            setNewTraining({ ...newTraining, equipment: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-purple-500"
                        />
                      </div>
                      <div>
                        <label className="text-slate-300 font-bold block mb-1">
                          عناوین و محور تمرینات (با کاما جدا کنید):
                        </label>
                        <input
                          type="text"
                          placeholder="شتاب گام اول، استقامت بی‌هوازی، کنترل پاس پرفشار"
                          value={newTraining.drillsSummary}
                          onChange={(e) =>
                            setNewTraining({ ...newTraining, drillsSummary: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-purple-500"
                        />
                      </div>
                    </div>

                    {/* Row 5: Methodology / Description */}
                    <div>
                      <label className="text-slate-300 font-bold block mb-1">
                        توضیحات و متدولوژی تمرین:
                      </label>
                      <textarea
                        rows={3}
                        placeholder="توضیحات علمی درباره نحوه اجرای برنامه و نکات کلیدی..."
                        value={newTraining.description}
                        onChange={(e) =>
                          setNewTraining({ ...newTraining, description: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-purple-500"
                      />
                    </div>

                    {/* Row 6: Video Upload & Video URL */}
                    <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
                      <div className="flex items-center gap-2 text-purple-400 font-bold">
                        <Video className="h-4 w-4" />
                        <span>پیوست ویدیوی تمرینی (آپلود مستقیم یا لینک)</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-slate-300 font-bold block mb-1">
                            آپلود مستقیم فایل ویدیو (MP4 / WebM):
                          </label>
                          <label className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-dashed border-purple-500/50 bg-purple-950/20 text-purple-300 hover:bg-purple-950/40 cursor-pointer text-xs font-bold transition-colors">
                            <Upload className="h-4 w-4" />
                            <span>انتخاب فایل ویدیویی از دستگاه...</span>
                            <input
                              type="file"
                              accept="video/*"
                              onChange={handleVideoFileUpload}
                              className="hidden"
                            />
                          </label>
                        </div>
                        <div>
                          <label className="text-slate-300 font-bold block mb-1">
                            یا درج آدرس مستقیم اینترنتی ویدیو (URL):
                          </label>
                          <input
                            type="text"
                            placeholder="https://example.com/drill-video.mp4"
                            dir="ltr"
                            value={newTraining.videoUrl}
                            onChange={(e) =>
                              setNewTraining({ ...newTraining, videoUrl: e.target.value })
                            }
                            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-purple-500 font-mono text-[11px]"
                          />
                        </div>
                      </div>

                      {/* Video Preview Frame if present */}
                      {newTraining.videoUrl && (
                        <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row items-center gap-3">
                          <div className="w-full sm:w-48 aspect-video rounded-lg overflow-hidden bg-black border border-slate-700">
                            <video
                              src={newTraining.videoUrl}
                              controls
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 text-[11px] text-slate-300 space-y-1">
                            <span className="text-emerald-400 font-bold flex items-center gap-1">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              ویدیو آماده نمایش و الصاق به برنامه است
                            </span>
                            <button
                              type="button"
                              onClick={() => setNewTraining({ ...newTraining, videoUrl: '' })}
                              className="text-rose-400 hover:text-rose-300 font-bold cursor-pointer text-xs block pt-1"
                            >
                              حذف ویدیوی پیوست شده
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Submit Button */}
                    <div className="flex items-center gap-3 pt-2">
                      <Button
                        type="submit"
                        variant="primary"
                        className="bg-purple-600 hover:bg-purple-700 text-white font-black text-xs px-6 h-10 rounded-xl cursor-pointer"
                      >
                        {editingTrainingId ? 'ذخیره تغییرات برنامه' : 'ثبت و انتشار برنامه تمرینی'}
                      </Button>
                      {editingTrainingId && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleCancelEditTraining}
                          className="text-xs h-10 px-4 border-slate-700 text-slate-300 hover:text-white cursor-pointer"
                        >
                          انصراف
                        </Button>
                      )}
                    </div>
                  </form>
                </Card>

                {/* List of Existing Plans */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black text-slate-400">
                      برنامه‌های آماده تمرینی فعال در دیتابیس ({trainingPlans.length} برنامه):
                    </h4>
                    <span className="text-[11px] text-slate-500">
                      هر برنامه‌ای که حذف شود هرگز برنمی‌گردد
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {trainingPlans.map((plan) => (
                      <div
                        key={plan.id}
                        className={`p-4 rounded-2xl bg-slate-900 border text-right text-xs transition-all flex flex-col justify-between space-y-3 ${
                          editingTrainingId === plan.id
                            ? 'border-purple-500 bg-purple-950/20'
                            : 'border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-950 text-purple-300 border border-purple-800">
                                {plan.ageGroup}
                              </span>
                              {plan.category && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-950 text-blue-300 border border-blue-800">
                                  {plan.category}
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-1.5">
                              {plan.isFree || plan.price === 'رایگان' ? (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-300 border border-emerald-800">
                                  رایگان
                                </span>
                              ) : (
                                <span className="text-[11px] font-black text-amber-400">
                                  {plan.price}
                                </span>
                              )}
                              {plan.videoUrl && (
                                <span
                                  className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-indigo-950 text-indigo-300 border border-indigo-800 flex items-center gap-1"
                                  title="دارای ویدیو"
                                >
                                  <Play className="h-2.5 w-2.5 fill-current" />
                                  ویدیو
                                </span>
                              )}
                            </div>
                          </div>

                          <h5 className="font-black text-white text-sm line-clamp-1">
                            {plan.title}
                          </h5>

                          <p className="text-[11px] text-slate-400">
                            {plan.durationWeeks} هفته | {plan.sessionsPerWeek} جلسه/هفته | سطح:{' '}
                            {plan.difficulty} | طراح: {plan.coachName}
                          </p>

                          {Boolean(plan.goal && plan.goal.trim()) && (
                            <p className="text-[11px] text-slate-400 line-clamp-1">
                              <span className="text-slate-500">هدف: </span>
                              {plan.goal}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                          <span className="text-[10px] text-slate-500 font-mono">
                            کد: {plan.id}
                          </span>

                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleStartEditTraining(plan)}
                              className="px-2.5 py-1.5 rounded-lg bg-purple-950/60 text-purple-300 border border-purple-800 hover:bg-purple-900 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                              title="ویرایش برنامه"
                            >
                              <Edit3 className="h-3.5 w-3.5" />
                              ویرایش
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteTraining(plan.id, plan.title)}
                              className="h-7 w-7 rounded-lg bg-rose-950/60 text-rose-400 border border-rose-900/60 hover:bg-rose-900/80 flex items-center justify-center shrink-0 cursor-pointer transition-colors"
                              title="حذف دائمی برنامه"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: TRAINING CATEGORIES MANAGEMENT */}
            {activeTab === 'categories' && (
              <div className="space-y-6">
                {/* Form: Add or Edit Category */}
                <Card
                  id="admin-category-form"
                  className={`bg-slate-900/95 border-slate-800 p-5 sm:p-6 rounded-2xl text-right space-y-4 ${
                    editingCategoryKey ? 'ring-2 ring-purple-500 border-purple-500/50' : ''
                  }`}
                >
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h4 className="text-sm font-black text-white flex items-center gap-2">
                      {editingCategoryKey ? (
                        <>
                          <Edit3 className="h-4 w-4 text-amber-400" />
                          <span>ویرایش دسته‌بندی تمرینی (کلید: {editingCategoryKey})</span>
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4 text-purple-400" />
                          <span>افزودن دسته‌بندی جدید به برنامه‌های تمرینی</span>
                        </>
                      )}
                    </h4>

                    {editingCategoryKey && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancelEditCategory}
                        className="text-xs h-8 px-3 border-slate-700 text-slate-300 hover:text-white gap-1.5 cursor-pointer"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                        انصراف
                      </Button>
                    )}
                  </div>

                  <form onSubmit={handleSaveCategory} className="space-y-3.5 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-slate-300 font-bold block mb-1">
                          عنوان فارسی دسته‌بندی: *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="مثلاً: چابکی و تغییر جهت، پلیومتریک، ..."
                          value={newCategory.title}
                          onChange={(e) =>
                            setNewCategory({ ...newCategory, title: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-purple-500"
                        />
                      </div>

                      <div>
                        <label className="text-slate-300 font-bold block mb-1">
                          شناسه انگلیسی یکتا (Slug):
                        </label>
                        <input
                          type="text"
                          disabled={!!editingCategoryKey}
                          dir="ltr"
                          placeholder="agility, speed, plyometrics..."
                          value={newCategory.key}
                          onChange={(e) =>
                            setNewCategory({ ...newCategory, key: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-purple-500 font-mono text-xs disabled:opacity-50"
                        />
                      </div>

                      <div>
                        <label className="text-slate-300 font-bold block mb-1">
                          آیکون نمایشی:
                        </label>
                        <div className="flex items-center gap-2">
                          <select
                            value={newCategory.iconName}
                            onChange={(e) =>
                              setNewCategory({ ...newCategory, iconName: e.target.value })
                            }
                            className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-purple-500"
                          >
                            <option value="Zap">Zap (صاعقه / چابکی)</option>
                            <option value="Flame">Flame (شعله / شتاب و سرعت)</option>
                            <option value="Dumbbell">Dumbbell (دمبل / قدرت)</option>
                            <option value="Activity">Activity (فعالیت / استقامت)</option>
                            <option value="Target">Target (هدف / تکنیک)</option>
                            <option value="Compass">Compass (قطب‌نما / تاکتیک)</option>
                            <option value="Scale">Scale (ترازو / تعادل)</option>
                            <option value="Sparkles">Sparkles (ستاره / انعطاف)</option>
                            <option value="Shield">Shield (سپر / دروازه‌بانی)</option>
                            <option value="HeartPulse">HeartPulse (ضربان / گرم‌کردن)</option>
                            <option value="Trophy">Trophy (جام قهرمانی)</option>
                            <option value="Timer">Timer (کرنومتر)</option>
                          </select>
                          <div className="h-9 w-9 rounded-xl bg-purple-950 border border-purple-800 flex items-center justify-center text-purple-300 shrink-0">
                            {renderCategoryIcon(newCategory.iconName, 'h-4 w-4')}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2">
                        <label className="text-slate-300 font-bold block mb-1">
                          سرفصل‌ها و توضیحات کوتاه زیرعنوان:
                        </label>
                        <input
                          type="text"
                          placeholder="مثلاً: نردبان چابکی، تغییر جهت ناگهانی، واکنش دیداری"
                          value={newCategory.subContent}
                          onChange={(e) =>
                            setNewCategory({ ...newCategory, subContent: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-purple-500"
                        />
                      </div>

                      <div>
                        <label className="text-slate-300 font-bold block mb-1">
                          رنگ پس‌زمینه کارت:
                        </label>
                        <select
                          value={newCategory.color}
                          onChange={(e) =>
                            setNewCategory({ ...newCategory, color: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-purple-500"
                        >
                          <option value="from-amber-500 to-orange-600">نارنجی و کهربایی</option>
                          <option value="from-rose-500 to-red-600">سرخابی و قرمز</option>
                          <option value="from-yellow-500 to-amber-600">طلایی و زرد</option>
                          <option value="from-emerald-500 to-teal-600">سبز زمردی و فیروزه‌ای</option>
                          <option value="from-blue-500 to-indigo-600">آبی و نیلی</option>
                          <option value="from-purple-500 to-violet-600">بنفش و ویولت</option>
                          <option value="from-cyan-500 to-blue-600">فیروزه‌ای و آبی آسمانی</option>
                          <option value="from-pink-500 to-rose-600">صورتی و رز</option>
                          <option value="from-emerald-600 to-green-700">سبز ارتشی دروازه‌بانی</option>
                          <option value="from-teal-500 to-emerald-600">سبز و کله‌غازی</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <Button
                        type="submit"
                        variant="primary"
                        className="bg-purple-600 hover:bg-purple-700 text-white font-black text-xs px-6 h-10 rounded-xl cursor-pointer"
                      >
                        {editingCategoryKey ? 'ذخیره تغییرات دسته‌بندی' : 'افزودن دسته‌بندی جدید'}
                      </Button>
                      {editingCategoryKey && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleCancelEditCategory}
                          className="text-xs h-10 px-4 border-slate-700 text-slate-300 hover:text-white cursor-pointer"
                        >
                          انصراف
                        </Button>
                      )}
                    </div>
                  </form>
                </Card>

                {/* Categories List */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-black text-slate-300">
                        دسته‌بندی‌های فعال برنامه‌های تمرینی ({categories.length} دسته‌بندی):
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        این دسته‌بندی‌ها مستقیماً در نوار تب‌های انتخاب تمرین و مودال دریافت برنامه نمایش داده می‌شوند.
                      </p>
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleResetCategories}
                      className="text-[11px] h-8 px-3 border-slate-800 text-slate-400 hover:text-white cursor-pointer"
                    >
                      <RotateCcw className="h-3 w-3 ml-1" />
                      بازنشانی به پیش‌فرض
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {categories.map((cat) => (
                      <div
                        key={cat.key}
                        className={`p-4 rounded-2xl bg-slate-900 border text-right text-xs transition-all flex flex-col justify-between space-y-3 ${
                          editingCategoryKey === cat.key
                            ? 'border-purple-500 bg-purple-950/20'
                            : 'border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div
                                className={`h-8 w-8 rounded-xl bg-gradient-to-tr ${cat.color} text-white flex items-center justify-center shadow-sm`}
                              >
                                {renderCategoryIcon(cat.iconName, 'h-4 w-4')}
                              </div>
                              <h5 className="font-black text-white text-sm">{cat.title}</h5>
                            </div>

                            <span className="text-[10px] text-slate-500 font-mono">
                              #{cat.key}
                            </span>
                          </div>

                          <p className="text-[11px] text-slate-400 line-clamp-2">
                            {cat.subContent || 'بدون زیرعنوان'}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                          <span className="text-[10px] text-purple-300 font-bold bg-purple-950/60 border border-purple-900/60 px-2 py-0.5 rounded-md">
                            {cat.drillsCount} تمرین مرتبط
                          </span>

                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleStartEditCategory(cat)}
                              className="px-2.5 py-1.5 rounded-lg bg-purple-950/60 text-purple-300 border border-purple-800 hover:bg-purple-900 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                              title="ویرایش دسته‌بندی"
                            >
                              <Edit3 className="h-3.5 w-3.5" />
                              ویرایش
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteCategory(cat.key, cat.title)}
                              className="h-7 w-7 rounded-lg bg-rose-950/60 text-rose-400 border border-rose-900/60 hover:bg-rose-900/80 flex items-center justify-center shrink-0 cursor-pointer transition-colors"
                              title="حذف دسته‌بندی"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: READY NUTRITION PLANS MANAGEMENT */}
            {activeTab === 'nutrition' && (
              <div className="space-y-6">
                <Card className="bg-slate-900/90 border-slate-800 p-5 rounded-2xl text-right space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h4 className="text-sm font-black text-white flex items-center gap-2">
                      {editingNutritionId ? (
                        <>
                          <Edit3 className="h-4 w-4 text-amber-400" />
                          <span>ویرایش برنامه غذایی</span>
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4 text-purple-400" />
                          <span>افزودن برنامه غذایی آماده جدید</span>
                        </>
                      )}
                    </h4>

                    {editingNutritionId && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setEditingNutritionId(null);
                          setNewNutrition(initialNutritionState);
                        }}
                        className="text-xs h-8 px-3 border-slate-700 text-slate-300 hover:text-white gap-1.5 cursor-pointer"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                        انصراف
                      </Button>
                    )}
                  </div>

                  <form onSubmit={handleSaveNutritionPlan} className="space-y-3 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2">
                        <label className="text-slate-300 font-bold block mb-1">
                          عنوان برنامه غذایی: *
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

                    <div className="flex items-center gap-3 pt-2">
                      <Button
                        type="submit"
                        variant="primary"
                        className="bg-purple-600 hover:bg-purple-700 text-white font-black text-xs px-5 h-9 rounded-xl cursor-pointer"
                      >
                        {editingNutritionId ? 'ذخیره تغییرات رژیم' : 'ثبت و انتشار رژیم غذایی'}
                      </Button>
                    </div>
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
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleStartEditNutrition(nut)}
                            className="h-8 w-8 rounded-lg bg-purple-950/60 text-purple-300 border border-purple-800 hover:bg-purple-900 flex items-center justify-center shrink-0 cursor-pointer"
                            title="ویرایش رژیم"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteNutrition(nut.id, nut.title)}
                            className="h-8 w-8 rounded-lg bg-rose-950/60 text-rose-400 border border-rose-900/60 hover:bg-rose-900/80 flex items-center justify-center shrink-0 cursor-pointer"
                            title="حذف رژیم"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: STUDENT ACTIVE ENROLLED PLANS */}
            {activeTab === 'student_active' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-black text-white flex items-center gap-2">
                      <Users className="h-4 w-4 text-purple-400" />
                      برنامه‌های فعال شاگردان در کارتابل
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">
                      مشاهده و امکان لغو یا بازنشانی برنامه‌هایی که در حال حاضر در داشبورد شاگرد فعال هستند.
                    </p>
                  </div>

                  {studentActivePlans.length > 0 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleClearAllStudentActivePlans}
                      className="text-rose-400 border-rose-900/60 hover:bg-rose-950/40 text-xs h-8 px-3 cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5 ml-1" />
                      پاک‌سازی کلیه برنامه‌های فعال
                    </Button>
                  )}
                </div>

                {studentActivePlans.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 rounded-2xl bg-slate-900/50 border border-dashed border-slate-800">
                    هیچ برنامه تمرینی در حال حاضر روی کارتابل شاگرد فعال نیست.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {studentActivePlans.map((plan: any) => (
                      <div
                        key={plan.id}
                        className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-right text-xs space-y-3 flex flex-col justify-between"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                              در حال اجرا در کارتابل
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {plan.id}
                            </span>
                          </div>

                          <h5 className="font-black text-white text-sm">{plan.title}</h5>

                          <p className="text-[11px] text-slate-400">
                            جلسات انجام شده: {plan.completedSessions || 0} از{' '}
                            {plan.totalSessions || 12} جلسه
                          </p>
                        </div>

                        <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                          <span className="text-[11px] text-slate-500">
                            طراح: {plan.coachName || 'کادر فنی'}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveStudentActivePlan(plan.id, plan.title)}
                            className="px-2.5 py-1.5 rounded-lg bg-rose-950/60 text-rose-300 border border-rose-800 hover:bg-rose-900 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            لغو و حذف از کارتابل
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
