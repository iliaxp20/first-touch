import { API_BASE_URL, uploadFile } from '@/lib/api';
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
  HelpCircle,
  KeyRound,
  Utensils,
} from 'lucide-react';
import {
  QuizQuestion,
  getQuizQuestions,
  addQuizQuestion,
  deleteQuizQuestion,
} from '../quiz/quizStore';
import {
  getReadyTrainingPlans,
  addReadyTrainingPlan,
  updateReadyTrainingPlan,
  deleteReadyTrainingPlan,
  syncProgramsWithServer,
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
  getTrainingDrills,
  addTrainingDrill,
  deleteTrainingDrill,
  syncDrillsWithServer,
  FreeDrill,
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
    'training' | 'categories' | 'nutrition' | 'student_active' | 'quiz' | 'custom_foods'
  >('training');

  // Stored Plans & Categories
  const [trainingPlans, setTrainingPlans] = useState<ReadyTrainingPlan[]>([]);
  const [categories, setCategories] = useState<TrainingCategoryMeta[]>([]);
  const [nutritionPlans, setNutritionPlans] = useState<ReadyNutritionPlan[]>([]);
  const [studentActivePlans, setStudentActivePlans] = useState<any[]>([]);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [customFoods, setCustomFoods] = useState<any[]>([]);
  const [newFood, setNewFood] = useState({
    name: '',
    category: 'پروتئین',
    calories: 150,
    protein: 25,
    carbs: 0,
    fat: 3,
    portion: '۱۰۰ گرم',
  });

  // Admin Change Password Modal State
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [confirmAdminPassword, setConfirmAdminPassword] = useState('');
  const [changePasswordLoading, setChangePasswordLoading] = useState(false);
  const [changePasswordError, setChangePasswordError] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const initialQuizState = {
    category: 'تکنیک و لمس اول',
    question: '',
    option0: '',
    option1: '',
    option2: '',
    option3: '',
    correctIndex: 0,
    explanation: '',
    coinReward: 15,
    xpReward: 35,
  };
  const [newQuiz, setNewQuiz] = useState(initialQuizState);

  // Training Plan Editing Mode
  const [editingTrainingId, setEditingTrainingId] = useState<string | null>(null);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [isUploadingDrillVideo, setIsUploadingDrillVideo] = useState(false);

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
    color: 'from-emerald-500 to-indigo-600',
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

  // Drills State (Admin Managed)
  const [drills, setDrills] = useState<FreeDrill[]>([]);
  const initialDrillState = {
    title: '',
    categoryKey: 'agility',
    subCategory: '',
    difficulty: 'متوسط' as 'مبتدی' | 'متوسط' | 'پیشرفته' | 'حرفه‌ای',
    duration: '۱۰ دقیقه',
    setsReps: '۴ ست',
    equipment: 'توپ، مخروط',
    targetSkill: '',
    videoUrl: '',
    description: '',
  };
  const [newDrill, setNewDrill] = useState(initialDrillState);

  const loadCustomFoods = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/nutrition/foods`);
      if (res.ok) {
        const data = await res.json();
        setCustomFoods(data.filter((f: any) => f.isCustom));
      }
    } catch {}
  };

  const loadData = () => {
    setTrainingPlans(getReadyTrainingPlans());
    setCategories(getTrainingCategories());
    setNutritionPlans(getReadyNutritionPlans());
    setDrills(getTrainingDrills());
    setQuizQuestions(getQuizQuestions());
    loadCustomFoods();
    syncDrillsWithServer().then((sDrills) => {
      if (sDrills && sDrills.length > 0) setDrills(sDrills);
    });
    syncProgramsWithServer().then((sPlans) => {
      if (sPlans && sPlans.length > 0) setTrainingPlans(sPlans);
    });
    try {
      const raw = localStorage.getItem('first_touch_student_active_plans');
      setStudentActivePlans(raw ? JSON.parse(raw) : []);
    } catch {
      setStudentActivePlans([]);
    }
  };

  const handleSaveQuizQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuiz.question.trim() || !newQuiz.option0.trim() || !newQuiz.option1.trim()) {
      alert('لطفاً صورت سوال و حداقل دو گزینه اول را وارد کنید.');
      return;
    }

    addQuizQuestion({
      category: newQuiz.category,
      categoryColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      question: newQuiz.question.trim(),
      options: [
        newQuiz.option0.trim(),
        newQuiz.option1.trim(),
        newQuiz.option2.trim() || 'هیچ‌کدام',
        newQuiz.option3.trim() || 'همه موارد',
      ],
      correctIndex: Number(newQuiz.correctIndex) || 0,
      explanation: newQuiz.explanation.trim() || 'پاسخ صحیح مطابق اصول علمی فوتبال و فیفا است.',
      coinReward: Number(newQuiz.coinReward) || 15,
      xpReward: Number(newQuiz.xpReward) || 35,
    });

    setQuizQuestions(getQuizQuestions());
    setNewQuiz(initialQuizState);
    showToast('سوال مسابقه با موفقیت ذخیره گردید.');
  };

  const handleDeleteQuizQuestion = (id: number, text: string) => {
    if (window.confirm(`آیا از حذف سوال «${text.slice(0, 30)}...» اطمینان دارید؟`)) {
      deleteQuizQuestion(id);
      setQuizQuestions(getQuizQuestions());
      showToast('سوال مسابقه حذف گردید.');
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  if (!isOpen) return null;

  const handleSaveCustomFood = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFood.name.trim()) return;

    try {
      const token = sessionStorage.getItem(SESSION_KEY);
      const res = await fetch(`${API_BASE_URL}/nutrition/foods`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newFood.name.trim(),
          category: newFood.category,
          calories: Number(newFood.calories) || 0,
          protein: Number(newFood.protein) || 0,
          carbs: Number(newFood.carbs) || 0,
          fat: Number(newFood.fat) || 0,
          portion: newFood.portion.trim() || '۱۰۰ گرم',
        }),
      });
      if (res.ok) {
        showToast(`غذای «${newFood.name}» با موفقیت به بانک غذاها اضافه شد.`);
        setNewFood({
          name: '',
          category: 'پروتئین',
          calories: 150,
          protein: 25,
          carbs: 0,
          fat: 3,
          portion: '۱۰۰ گرم',
        });
        loadCustomFoods();
      }
    } catch {
      alert('خطا در ثبت غذا');
    }
  };

  const handleDeleteCustomFood = async (id: string, name: string) => {
    if (!window.confirm(`آیا از حذف غذای «${name}» اطمینان دارید؟`)) return;
    try {
      const token = sessionStorage.getItem(SESSION_KEY);
      const res = await fetch(`${API_BASE_URL}/nutrition/foods/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        showToast(`غذای «${name}» حذف گردید.`);
        loadCustomFoods();
      }
    } catch {
      alert('خطا در حذف غذا');
    }
  };

  const handleChangeAdminPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminPassword) {
      setChangePasswordError('لطفاً رمز جدید را وارد کنید.');
      return;
    }
    if (newAdminPassword !== confirmAdminPassword) {
      setChangePasswordError('رمز عبور جدید و تکرار آن یکسان نیستند.');
      return;
    }

    setChangePasswordLoading(true);
    setChangePasswordError(null);
    try {
      const token = sessionStorage.getItem(SESSION_KEY);
      const res = await fetch(`${API_BASE_URL}/auth/admin/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ newPassword: newAdminPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'خطا در تغییر رمز عبور');
      showToast('رمز عبور پنل مدیریت با موفقیت بروزرسانی شد.');
      setIsChangePasswordOpen(false);
      setNewAdminPassword('');
      setConfirmAdminPassword('');
    } catch (err: any) {
      setChangePasswordError(err.message || 'خطا در تغییر رمز عبور');
    } finally {
      setChangePasswordLoading(false);
    }
  };

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
      const response = await fetch(`${API_BASE_URL}/auth/admin-login`, {
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

  // Video File Upload Handler for Training Programs
  const handleVideoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 100 * 1024 * 1024) {
      alert('حجم ویدیو نباید بیشتر از ۱۰۰ مگابایت باشد.');
      return;
    }

    try {
      setIsUploadingVideo(true);
      showToast('در حال بارگذاری فایل ویدیو در سرور...');
      const uploaded = await uploadFile(file);
      setNewTraining((prev) => ({ ...prev, videoUrl: uploaded.url }));
      showToast('ویدیو با موفقیت بارگذاری شد.');
    } catch (err: any) {
      console.error('Video upload failed', err);
      if (file.size <= 2 * 1024 * 1024) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setNewTraining((prev) => ({ ...prev, videoUrl: event.target?.result as string }));
          showToast('ویدیو به صورت محلی بارگذاری شد.');
        };
        reader.readAsDataURL(file);
      } else {
        alert('خطا در بارگذاری ویدیو به سرور: ' + (err.message || 'خطای شبکه'));
      }
    } finally {
      setIsUploadingVideo(false);
    }
  };

  // Video File Upload Handler for Drills
  const handleDrillVideoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 100 * 1024 * 1024) {
      alert('حجم ویدیو نباید بیشتر از ۱۰۰ مگابایت باشد.');
      return;
    }

    try {
      setIsUploadingDrillVideo(true);
      showToast('در حال بارگذاری ویدیوی تمرین...');
      const uploaded = await uploadFile(file);
      setNewDrill((prev) => ({ ...prev, videoUrl: uploaded.url }));
      showToast('ویدیوی تمرین با موفقیت ذخیره شد.');
    } catch (err: any) {
      console.error('Drill video upload failed', err);
      if (file.size <= 2 * 1024 * 1024) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setNewDrill((prev) => ({ ...prev, videoUrl: event.target?.result as string }));
          showToast('ویدیوی تمرین محلی بارگذاری شد.');
        };
        reader.readAsDataURL(file);
      } else {
        alert('خطا در بارگذاری ویدیو: ' + (err.message || 'خطای شبکه'));
      }
    } finally {
      setIsUploadingDrillVideo(false);
    }
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
        'آیا از بازنشانی کلیه دسته‌بندی‌ها به ۱۰ دسته‌بندی پیش‌فرض سامانه اطمینان دارید؟'
      )
    ) {
      resetTrainingCategories();
      loadData();
      showToast('دسته‌بندی‌ها با موفقیت به حالت پیش‌فرض بازگردانی شدند.');
    }
  };

  // =========================================================================
  // DRILLS MANAGEMENT HANDLERS
  // =========================================================================
  const handleSaveDrill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDrill.title.trim()) {
      alert('لطفاً عنوان تمرین را وارد کنید.');
      return;
    }

    const targetCat = categories.find((c) => c.key === newDrill.categoryKey);
    const catTitle = targetCat?.title || 'تمرین تخصصی';
    const catKey = newDrill.categoryKey || categories[0]?.key || 'agility';

    addTrainingDrill({
      categoryKey: catKey,
      categoryTitle: catTitle,
      subCategory: newDrill.subCategory.trim() || catTitle,
      title: newDrill.title.trim(),
      englishTitle: '',
      difficulty: newDrill.difficulty,
      duration: newDrill.duration.trim() || '۱۰ دقیقه',
      setsReps: newDrill.setsReps.trim() || '۴ ست',
      equipment: newDrill.equipment.trim() || 'توپ، مخروط',
      targetSkill: newDrill.targetSkill.trim() || newDrill.title.trim(),
      videoUrl: newDrill.videoUrl.trim() || 'https://assets.mixkit.co/videos/preview/mixkit-athlete-training-on-an-agility-ladder-41315-large.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=600&q=80',
      description: newDrill.description.trim() || newDrill.title.trim(),
      steps: newDrill.description.trim() ? [newDrill.description.trim()] : [],
      coachingTips: '',
      commonMistakes: '',
    });

    try {
      await fetch(`${API_BASE_URL}/drills`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          categoryIndex: targetCat ? categories.indexOf(targetCat) + 1 : 1,
          categoryTitle: catTitle,
          persianName: newDrill.title.trim(),
          englishName: 'Custom Drill',
          videoUrl: newDrill.videoUrl.trim() || undefined,
          description: newDrill.description.trim() || newDrill.title.trim(),
          difficulty: newDrill.difficulty === 'مبتدی' ? 'BEGINNER' : newDrill.difficulty === 'پیشرفته' ? 'ADVANCED' : 'INTERMEDIATE',
          equipment: newDrill.equipment.trim() || 'توپ، مخروط',
          targetSkill: newDrill.targetSkill.trim() || newDrill.title.trim(),
          categoryKey: catKey,
          duration: newDrill.duration.trim() || '۱۰ دقیقه',
          setsReps: newDrill.setsReps.trim() || '۴ ست',
        }),
      });
    } catch {}

    showToast(`تمرین «${newDrill.title}» با موفقیت اضافه شد.`);
    setNewDrill({
      ...initialDrillState,
      categoryKey: categories[0]?.key || 'agility',
    });
    setDrills(getTrainingDrills());
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('ft_drills_updated'));
    }
  };

  const handleDeleteDrill = (id: string, title: string) => {
    if (window.confirm(`آیا از حذف تمرین «${title}» اطمینان دارید؟`)) {
      deleteTrainingDrill(id);
      setDrills(getTrainingDrills());
      showToast(`تمرین «${title}» حذف گردید.`);
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
    <>
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
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsChangePasswordOpen(true)}
                  className="px-3 py-1.5 rounded-xl border border-amber-900/60 text-amber-400 hover:bg-amber-950/40 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <KeyRound className="h-3.5 w-3.5" />
                  تغییر رمز
                </button>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 rounded-xl border border-rose-900/60 text-rose-400 hover:bg-rose-950/40 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  خروج امن
                </button>
              </div>
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
              <div className="pt-2">
                <span className="inline-block px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 font-mono text-[11px] font-bold">
                  کاربری: admin • رمز پیش‌فرض: admin (قابل تغییر از داخل پنل)
                </span>
              </div>
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
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 p-1.5 rounded-2xl bg-slate-900 border border-slate-800">
              <button
                type="button"
                onClick={() => setActiveTab('training')}
                className={`py-2.5 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
                  activeTab === 'training'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Dumbbell className="h-4 w-4" />
                <span>تمرینی ({trainingPlans.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('categories')}
                className={`py-2.5 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
                  activeTab === 'categories'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Layers className="h-4 w-4" />
                <span>دسته‌بندی‌ها ({categories.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('nutrition')}
                className={`py-2.5 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
                  activeTab === 'nutrition'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Apple className="h-4 w-4" />
                <span>غذایی ({nutritionPlans.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('student_active')}
                className={`py-2.5 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
                  activeTab === 'student_active'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Users className="h-4 w-4" />
                <span>شاگردان ({studentActivePlans.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('quiz')}
                className={`py-2.5 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
                  activeTab === 'quiz'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <HelpCircle className="h-4 w-4" />
                <span>مسابقه ({quizQuestions.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('custom_foods')}
                className={`py-2.5 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors col-span-2 sm:col-span-1 ${
                  activeTab === 'custom_foods'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Utensils className="h-4 w-4" />
                <span>بانک غذاها ({customFoods.length})</span>
              </button>
            </div>

            {/* TAB 1: READY TRAINING PLANS MANAGEMENT */}
            {activeTab === 'training' && (
              <div className="space-y-6">
                {/* Form (Add or Edit) */}
                <Card
                  id="admin-training-form"
                  className={`bg-slate-900/95 border-slate-800 p-5 sm:p-6 rounded-2xl text-right space-y-4 ${
                    editingTrainingId ? 'ring-2 ring-emerald-500 border-emerald-500/50' : ''
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
                          <Plus className="h-4 w-4 text-emerald-400" />
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
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
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
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
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
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-emerald-300 font-bold focus:outline-none focus:border-emerald-500"
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
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
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
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
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
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
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
                            className="rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4 bg-slate-950 border-slate-800"
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
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-amber-400 font-black focus:outline-none focus:border-emerald-500 disabled:opacity-40"
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
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
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
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
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
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
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
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
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
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    {/* Row 6: Video Upload & Video URL */}
                    <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
                      <div className="flex items-center gap-2 text-emerald-400 font-bold">
                        <Video className="h-4 w-4" />
                        <span>پیوست ویدیوی تمرینی (آپلود مستقیم یا لینک)</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-slate-300 font-bold block mb-1">
                            آپلود مستقیم فایل ویدیو (MP4 / WebM):
                          </label>
                          <label className={`flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-dashed border-emerald-500/50 bg-emerald-950/20 text-emerald-300 hover:bg-emerald-950/40 cursor-pointer text-xs font-bold transition-colors ${isUploadingVideo ? 'opacity-50 pointer-events-none' : ''}`}>
                            <Upload className="h-4 w-4" />
                            <span>{isUploadingVideo ? 'در حال آپلود ویدیو به سرور...' : 'انتخاب فایل ویدیویی از دستگاه...'}</span>
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
                            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-emerald-500 font-mono text-[11px]"
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
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs px-6 h-10 rounded-xl cursor-pointer"
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
                            ? 'border-emerald-500 bg-emerald-950/20'
                            : 'border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-300 border border-emerald-800">
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
                              className="px-2.5 py-1.5 rounded-lg bg-emerald-950/60 text-emerald-300 border border-emerald-800 hover:bg-emerald-900 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
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
                    editingCategoryKey ? 'ring-2 ring-emerald-500 border-emerald-500/50' : ''
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
                          <Plus className="h-4 w-4 text-emerald-400" />
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
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
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
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500 font-mono text-xs disabled:opacity-50"
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
                            className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
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
                          <div className="h-9 w-9 rounded-xl bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-300 shrink-0">
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
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
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
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                        >
                          <option value="from-amber-500 to-orange-600">نارنجی و کهربایی</option>
                          <option value="from-rose-500 to-red-600">سرخابی و قرمز</option>
                          <option value="from-yellow-500 to-amber-600">طلایی و زرد</option>
                          <option value="from-emerald-500 to-teal-600">سبز زمردی و فیروزه‌ای</option>
                          <option value="from-blue-500 to-indigo-600">آبی و نیلی</option>
                          <option value="from-emerald-500 to-teal-600">بنفش و ویولت</option>
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
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs px-6 h-10 rounded-xl cursor-pointer"
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
                            ? 'border-emerald-500 bg-emerald-950/20'
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
                          <span className="text-[10px] text-emerald-300 font-bold bg-emerald-950/60 border border-emerald-900/60 px-2 py-0.5 rounded-md">
                            {cat.drillsCount} تمرین مرتبط
                          </span>

                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleStartEditCategory(cat)}
                              className="px-2.5 py-1.5 rounded-lg bg-emerald-950/60 text-emerald-300 border border-emerald-800 hover:bg-emerald-900 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
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

                {/* Section: Drills Management (Custom Real Drills) */}
                <div className="pt-6 border-t border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-black text-white flex items-center gap-2">
                        <Dumbbell className="h-4 w-4 text-emerald-400" />
                        <span>مدیریت تمرینات و حرکات تخصصی (Drills)</span>
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        تمرینات واقعی اضافه شده توسط مدیر که بازیکنان در دسته‌بندی‌ها مشاهده و انتخاب می‌کنند ({drills.length} تمرین ثبت شده).
                      </p>
                    </div>
                  </div>

                  {/* Add Drill Form */}
                  <Card className="bg-slate-900/95 border-slate-800 p-4 sm:p-5 rounded-2xl text-right space-y-3">
                    <h5 className="text-xs font-black text-slate-200 flex items-center gap-1.5">
                      <Plus className="h-3.5 w-3.5 text-emerald-400" />
                      <span>افزودن تمرین جدید به دسته‌بندی</span>
                    </h5>

                    <form onSubmit={handleSaveDrill} className="space-y-3 text-xs">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="text-slate-300 font-bold block mb-1">
                            دسته‌بندی مربوطه: *
                          </label>
                          <select
                            value={newDrill.categoryKey}
                            onChange={(e) =>
                              setNewDrill({ ...newDrill, categoryKey: e.target.value })
                            }
                            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                          >
                            {categories.map((c) => (
                              <option key={c.key} value={c.key}>
                                {c.title}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="text-slate-300 font-bold block mb-1">
                            عنوان تمرین: *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="مثلاً: تمرین شتاب ۱۰ متر، اسکات بلغاری..."
                            value={newDrill.title}
                            onChange={(e) =>
                              setNewDrill({ ...newDrill, title: e.target.value })
                            }
                            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                          />
                        </div>

                        <div>
                          <label className="text-slate-300 font-bold block mb-1">
                            سطح سختی:
                          </label>
                          <select
                            value={newDrill.difficulty}
                            onChange={(e) =>
                              setNewDrill({
                                ...newDrill,
                                difficulty: e.target.value as any,
                              })
                            }
                            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                          >
                            <option value="مبتدی">مبتدی</option>
                            <option value="متوسط">متوسط</option>
                            <option value="پیشرفته">پیشرفته</option>
                            <option value="حرفه‌ای">حرفه‌ای</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="text-slate-300 font-bold block mb-1">
                            مدت زمان / ست و تکرار:
                          </label>
                          <input
                            type="text"
                            placeholder="مثلاً: ۱۰ دقیقه / ۴ ست"
                            value={newDrill.duration}
                            onChange={(e) =>
                              setNewDrill({ ...newDrill, duration: e.target.value })
                            }
                            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                          />
                        </div>

                        <div>
                          <label className="text-slate-300 font-bold block mb-1">
                            تجهیزات مورد نیاز:
                          </label>
                          <input
                            type="text"
                            placeholder="مثلاً: توپ، مخروط، نردبان چابکی"
                            value={newDrill.equipment}
                            onChange={(e) =>
                              setNewDrill({ ...newDrill, equipment: e.target.value })
                            }
                            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                          />
                        </div>

                        <div>
                          <label className="text-slate-300 font-bold block mb-1">
                            مهارت هدف تمرین:
                          </label>
                          <input
                            type="text"
                            placeholder="مثلاً: شتاب اولیه، لمس اول جهت‌دار"
                            value={newDrill.targetSkill}
                            onChange={(e) =>
                              setNewDrill({ ...newDrill, targetSkill: e.target.value })
                            }
                            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-slate-300 font-bold block mb-1">
                          توضیحات و نکات مربیگری:
                        </label>
                        <textarea
                          rows={2}
                          placeholder="توضیح اجرای صحیح حرکت تمرینی..."
                          value={newDrill.description}
                          onChange={(e) =>
                            setNewDrill({ ...newDrill, description: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      {/* Drill Video Upload & Direct URL */}
                      <div className="space-y-1.5 p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                        <label className="text-slate-300 font-bold flex items-center justify-between text-xs">
                          <span className="flex items-center gap-1.5 text-emerald-400">
                            <Video className="h-4 w-4" />
                            ویدیو یا ویدیوی آموزشی تمرین:
                          </span>
                          <span className="text-[10px] text-slate-400">
                            آپلود فایل ویدیویی یا لینک مستقیم (اختیاری)
                          </span>
                        </label>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <div className="shrink-0">
                            <input
                              type="file"
                              id="drill-video-file-input"
                              className="hidden"
                              accept="video/*"
                              onChange={handleDrillVideoFileUpload}
                            />
                            <label
                              htmlFor="drill-video-file-input"
                              className={`h-9 px-3.5 rounded-xl border border-dashed border-emerald-500/50 hover:border-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                                isUploadingDrillVideo ? 'opacity-50 pointer-events-none' : ''
                              }`}
                            >
                              <Upload className="h-3.5 w-3.5" />
                              {isUploadingDrillVideo ? 'در حال آپلود...' : 'آپلود فایل ویدیو'}
                            </label>
                          </div>
                          <div className="flex-1">
                            <input
                              type="text"
                              placeholder="https://example.com/drill.mp4 یا آپلود با دکمه روبرو"
                              dir="ltr"
                              value={newDrill.videoUrl}
                              onChange={(e) =>
                                setNewDrill({ ...newDrill, videoUrl: e.target.value })
                              }
                              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-emerald-500 font-mono text-[11px]"
                            />
                          </div>
                        </div>

                        {newDrill.videoUrl && (
                          <div className="pt-2 border-t border-slate-800 flex items-center gap-3">
                            <div className="w-28 aspect-video rounded-lg overflow-hidden bg-black border border-slate-700 shrink-0">
                              <video
                                src={newDrill.videoUrl}
                                controls
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 text-[11px] text-slate-300">
                              <p className="text-emerald-400 font-bold truncate">ویدیو با موفقیت پیوست شد</p>
                              <button
                                type="button"
                                onClick={() => setNewDrill({ ...newDrill, videoUrl: '' })}
                                className="text-rose-400 hover:text-rose-300 font-bold cursor-pointer text-[11px]"
                              >
                                حذف ویدیو
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex justify-end pt-1">
                        <Button
                          type="submit"
                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black px-4 h-9 rounded-xl shadow-md cursor-pointer gap-1.5"
                        >
                          <Plus className="h-4 w-4" />
                          ثبت و ذخیره تمرین
                        </Button>
                      </div>
                    </form>
                  </Card>

                  {/* Registered Drills List */}
                  {drills.length === 0 ? (
                    <div className="p-6 text-center border border-dashed border-slate-800 rounded-2xl text-slate-500 text-xs">
                      هنوز تمرین اختصاصی توسط مدیر اضافه نشده است. می‌توانید با استفاده از فرم بالا تمرینات را برای هر دسته‌بندی ایجاد فرمایید.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {drills.map((d) => (
                        <div
                          key={d.id}
                          className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-2.5 text-xs text-right"
                        >
                          <div>
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-300 border border-emerald-800">
                                {d.categoryTitle}
                              </span>
                              <span className="text-[10px] text-slate-400 font-bold">
                                {d.difficulty} • {d.duration}
                              </span>
                            </div>
                            <div className="flex items-center justify-between gap-1">
                              <h5 className="font-black text-white text-sm line-clamp-1">
                                {d.title}
                              </h5>
                              {d.videoUrl && (
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-indigo-950 text-indigo-300 border border-indigo-800 flex items-center gap-1 shrink-0" title="دارای ویدیو">
                                  <Play className="h-2.5 w-2.5 fill-current" />
                                  ویدیو
                                </span>
                              )}
                            </div>
                            {d.description && (
                              <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">
                                {d.description}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                            <span className="text-[10px] text-slate-500 truncate max-w-[160px]">
                              {d.targetSkill || d.equipment}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleDeleteDrill(d.id, d.title)}
                              className="h-7 w-7 rounded-lg bg-rose-950/60 text-rose-400 border border-rose-900/60 hover:bg-rose-900/80 flex items-center justify-center shrink-0 cursor-pointer transition-colors"
                              title="حذف تمرین"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
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
                          <Plus className="h-4 w-4 text-emerald-400" />
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
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
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
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
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
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
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
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-amber-400 font-black focus:outline-none focus:border-emerald-500"
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
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
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
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
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
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
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
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <Button
                        type="submit"
                        variant="primary"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs px-5 h-9 rounded-xl cursor-pointer"
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
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-300 border border-emerald-800">
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
                            className="h-8 w-8 rounded-lg bg-emerald-950/60 text-emerald-300 border border-emerald-800 hover:bg-emerald-900 flex items-center justify-center shrink-0 cursor-pointer"
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
                      <Users className="h-4 w-4 text-emerald-400" />
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

            {/* TAB 5: FOOTBALL QUIZ MANAGEMENT */}
            {activeTab === 'quiz' && (
              <div className="space-y-6">
                {/* Form to Add New Quiz Question */}
                <Card className="bg-slate-900/95 border-slate-800 p-5 sm:p-6 rounded-2xl text-right space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h4 className="text-sm font-black text-white flex items-center gap-2">
                      <Plus className="h-4 w-4 text-emerald-400" />
                      <span>افزودن سوال جدید به مسابقه هوش فوتبالی</span>
                    </h4>
                  </div>

                  <form onSubmit={handleSaveQuizQuestion} className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="font-bold text-slate-300">دسته‌بندی موضوعی</label>
                        <select
                          value={newQuiz.category}
                          onChange={(e) => setNewQuiz((prev) => ({ ...prev, category: e.target.value }))}
                          className="w-full h-10 px-3 rounded-xl border border-slate-700 bg-slate-800 text-white font-bold"
                        >
                          <option value="تکنیک و لمس اول">تکنیک و لمس اول</option>
                          <option value="قوانین داوری فیفا">قوانین داوری فیفا</option>
                          <option value="تاکتیک و جایگیری">تاکتیک و جایگیری</option>
                          <option value="تغذیه و ریکاوری">تغذیه و ریکاوری</option>
                          <option value="تاکتیک دفاعی">تاکتیک دفاعی</option>
                          <option value="هوش بازی و روانشناسی">هوش بازی و روانشناسی</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1.5">
                          <label className="font-bold text-slate-300">جایزه سکه</label>
                          <input
                            type="number"
                            value={newQuiz.coinReward}
                            onChange={(e) => setNewQuiz((prev) => ({ ...prev, coinReward: Number(e.target.value) }))}
                            className="w-full h-10 px-3 rounded-xl border border-slate-700 bg-slate-800 text-white font-mono"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="font-bold text-slate-300">امتیاز XP</label>
                          <input
                            type="number"
                            value={newQuiz.xpReward}
                            onChange={(e) => setNewQuiz((prev) => ({ ...prev, xpReward: Number(e.target.value) }))}
                            className="w-full h-10 px-3 rounded-xl border border-slate-700 bg-slate-800 text-white font-mono"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-bold text-slate-300">متن سوال</label>
                      <textarea
                        rows={2}
                        value={newQuiz.question}
                        onChange={(e) => setNewQuiz((prev) => ({ ...prev, question: e.target.value }))}
                        placeholder="متن دقیق سوال مسابقه را بنویسید..."
                        className="w-full p-3 rounded-xl border border-slate-700 bg-slate-800 text-white"
                      />
                    </div>

                    {/* 4 Options */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div className="space-y-1">
                        <label className="font-bold text-slate-300 flex items-center justify-between">
                          <span>گزینه ۱</span>
                          <input
                            type="radio"
                            name="correctOpt"
                            checked={newQuiz.correctIndex === 0}
                            onChange={() => setNewQuiz((prev) => ({ ...prev, correctIndex: 0 }))}
                            title="گزینه صحیح"
                          />
                        </label>
                        <input
                          type="text"
                          value={newQuiz.option0}
                          onChange={(e) => setNewQuiz((prev) => ({ ...prev, option0: e.target.value }))}
                          placeholder="گزینه اول"
                          className="w-full h-9 px-3 rounded-xl border border-slate-700 bg-slate-800 text-white"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-slate-300 flex items-center justify-between">
                          <span>گزینه ۲</span>
                          <input
                            type="radio"
                            name="correctOpt"
                            checked={newQuiz.correctIndex === 1}
                            onChange={() => setNewQuiz((prev) => ({ ...prev, correctIndex: 1 }))}
                            title="گزینه صحیح"
                          />
                        </label>
                        <input
                          type="text"
                          value={newQuiz.option1}
                          onChange={(e) => setNewQuiz((prev) => ({ ...prev, option1: e.target.value }))}
                          placeholder="گزینه دوم"
                          className="w-full h-9 px-3 rounded-xl border border-slate-700 bg-slate-800 text-white"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-slate-300 flex items-center justify-between">
                          <span>گزینه ۳</span>
                          <input
                            type="radio"
                            name="correctOpt"
                            checked={newQuiz.correctIndex === 2}
                            onChange={() => setNewQuiz((prev) => ({ ...prev, correctIndex: 2 }))}
                            title="گزینه صحیح"
                          />
                        </label>
                        <input
                          type="text"
                          value={newQuiz.option2}
                          onChange={(e) => setNewQuiz((prev) => ({ ...prev, option2: e.target.value }))}
                          placeholder="گزینه سوم"
                          className="w-full h-9 px-3 rounded-xl border border-slate-700 bg-slate-800 text-white"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-slate-300 flex items-center justify-between">
                          <span>گزینه ۴</span>
                          <input
                            type="radio"
                            name="correctOpt"
                            checked={newQuiz.correctIndex === 3}
                            onChange={() => setNewQuiz((prev) => ({ ...prev, correctIndex: 3 }))}
                            title="گزینه صحیح"
                          />
                        </label>
                        <input
                          type="text"
                          value={newQuiz.option3}
                          onChange={(e) => setNewQuiz((prev) => ({ ...prev, option3: e.target.value }))}
                          placeholder="گزینه چهارم"
                          className="w-full h-9 px-3 rounded-xl border border-slate-700 bg-slate-800 text-white"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-bold text-slate-300">توضیحات پاسخ صحیح (جهت یادگیری بازیکن)</label>
                      <input
                        type="text"
                        value={newQuiz.explanation}
                        onChange={(e) => setNewQuiz((prev) => ({ ...prev, explanation: e.target.value }))}
                        placeholder="دلیل علمی یا قانونی درستی این گزینه..."
                        className="w-full h-9 px-3 rounded-xl border border-slate-700 bg-slate-800 text-white"
                      />
                    </div>

                    <div className="pt-2 flex justify-end">
                      <Button
                        type="submit"
                        variant="primary"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs px-6 h-9 rounded-xl cursor-pointer"
                      >
                        ذخیره و افزودن به سوالات مسابقه
                      </Button>
                    </div>
                  </form>
                </Card>

                {/* List of Existing Quiz Questions */}
                <div className="space-y-3">
                  <h4 className="text-sm font-black text-white">
                    بانک سوالات فعال ({quizQuestions.length} سوال)
                  </h4>
                  <div className="grid grid-cols-1 gap-3">
                    {quizQuestions.map((q, idx) => (
                      <div
                        key={q.id}
                        className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-right space-y-2.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-300 border border-emerald-800">
                            سوال {idx + 1} • {q.category}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleDeleteQuizQuestion(q.id, q.question)}
                            className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-950/50 cursor-pointer"
                            title="حذف سوال"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <h5 className="text-xs font-black text-white">{q.question}</h5>
                        <div className="grid grid-cols-2 gap-1.5 text-[11px] text-slate-400">
                          {q.options.map((opt, oIdx) => (
                            <div
                              key={oIdx}
                              className={`p-1.5 rounded-lg border ${
                                oIdx === q.correctIndex
                                  ? 'bg-emerald-950/40 border-emerald-700 text-emerald-300 font-bold'
                                  : 'bg-slate-800/40 border-slate-700/60'
                              }`}
                            >
                              {opt}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 6: CUSTOM FOODS MANAGEMENT */}
            {activeTab === 'custom_foods' && (
              <div className="space-y-6">
                <Card className="bg-slate-900/95 border-slate-800 p-5 sm:p-6 rounded-2xl text-right space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h4 className="text-sm font-black text-white flex items-center gap-2">
                      <Plus className="h-4 w-4 text-emerald-400" />
                      <span>افزودن غذای جدید به بانک تغذیه اپلیکیشن</span>
                    </h4>
                    <span className="text-xs text-slate-400">
                      غذاهای ثبت‌شده فوراً در محاسبه‌گر کالری شاگردان همگام‌سازی می‌شود
                    </span>
                  </div>

                  <form onSubmit={handleSaveCustomFood} className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-slate-300 font-bold block mb-1">نام غذا:</label>
                        <input
                          type="text"
                          placeholder="مثلاً: فیله بوقلمون گریل شده"
                          value={newFood.name}
                          onChange={(e) => setNewFood({ ...newFood, name: e.target.value })}
                          required
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="text-slate-300 font-bold block mb-1">دسته‌بندی:</label>
                        <select
                          value={newFood.category}
                          onChange={(e) => setNewFood({ ...newFood, category: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500 font-bold"
                        >
                          <option value="پروتئین">پروتئین</option>
                          <option value="کربوهیدرات">کربوهیدرات</option>
                          <option value="سبزیجات و میوه">سبزیجات و میوه</option>
                          <option value="چربی‌های سالم">چربی‌های سالم</option>
                          <option value="لبنیات و نوشیدنی">لبنیات و نوشیدنی</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-slate-300 font-bold block mb-1">واحد / مقدار:</label>
                        <input
                          type="text"
                          placeholder="مثلاً: ۱۰۰ گرم یا ۱ لیوان"
                          value={newFood.portion}
                          onChange={(e) => setNewFood({ ...newFood, portion: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="text-slate-300 font-bold block mb-1">کالری (kcal):</label>
                        <input
                          type="number"
                          value={newFood.calories}
                          onChange={(e) => setNewFood({ ...newFood, calories: Number(e.target.value) })}
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="text-slate-300 font-bold block mb-1">پروتئین (گرم):</label>
                        <input
                          type="number"
                          value={newFood.protein}
                          onChange={(e) => setNewFood({ ...newFood, protein: Number(e.target.value) })}
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="text-slate-300 font-bold block mb-1">کربوهیدرات (گرم):</label>
                        <input
                          type="number"
                          value={newFood.carbs}
                          onChange={(e) => setNewFood({ ...newFood, carbs: Number(e.target.value) })}
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="text-slate-300 font-bold block mb-1">چربی (گرم):</label>
                        <input
                          type="number"
                          value={newFood.fat}
                          onChange={(e) => setNewFood({ ...newFood, fat: Number(e.target.value) })}
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <Button
                        type="submit"
                        variant="primary"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs px-6 h-10 rounded-xl cursor-pointer"
                      >
                        افزودن به بانک غذاهای اپلیکیشن
                      </Button>
                    </div>
                  </form>
                </Card>

                {/* List of Custom Foods */}
                <div className="space-y-3">
                  <h4 className="text-sm font-black text-white">
                    غذاهای سفارشی مدیریت ({customFoods.length} مورد)
                  </h4>
                  {customFoods.length === 0 ? (
                    <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-2xl text-slate-500 text-xs">
                      هنوز غذای سفارشی اضافه نشده است. می‌توانید با فرم بالا غذاهای دلخواه را ثبت نمایید.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {customFoods.map((food) => (
                        <div
                          key={food.id}
                          className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-right space-y-2 flex flex-col justify-between"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                                {food.category}
                              </span>
                              <h5 className="text-xs font-black text-white mt-1.5">{food.name}</h5>
                              <p className="text-[11px] text-slate-400">مقدار: {food.portion}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleDeleteCustomFood(food.id, food.name)}
                              className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-950/50 cursor-pointer"
                              title="حذف غذا"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>

                          <div className="grid grid-cols-4 gap-1 text-[10px] text-center bg-slate-950 p-2 rounded-xl font-mono text-slate-300">
                            <div>
                              <div className="text-slate-500">کالری</div>
                              <div className="font-bold text-amber-400">{food.calories}</div>
                            </div>
                            <div>
                              <div className="text-slate-500">پروتئین</div>
                              <div className="font-bold text-emerald-400">{food.protein}g</div>
                            </div>
                            <div>
                              <div className="text-slate-500">کربو</div>
                              <div className="font-bold text-blue-400">{food.carbs}g</div>
                            </div>
                            <div>
                              <div className="text-slate-500">چربی</div>
                              <div className="font-bold text-rose-400">{food.fat}g</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>
        )}
        </div>
      </div>

        {/* CHANGE ADMIN PASSWORD MODAL */}
        {isChangePasswordOpen && (
          <div className="fixed inset-0 z-80 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
            <Card className="w-full max-w-sm p-6 bg-slate-950 border border-slate-800 rounded-3xl text-right shadow-2xl relative space-y-4">
              <button
                type="button"
                onClick={() => setIsChangePasswordOpen(false)}
                className="absolute top-4 left-4 p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
                  <KeyRound className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-white">تغییر رمز عبور مدیریت</h4>
                  <p className="text-[11px] text-slate-400">رمز جدید جایگزین رمز پیش‌فرض خواهد شد</p>
                </div>
              </div>

              {changePasswordError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold">
                  {changePasswordError}
                </div>
              )}

              <form onSubmit={handleChangeAdminPassword} className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">رمز عبور جدید:</label>
                  <input
                    type="password"
                    placeholder="رمز عبور دلخواه..."
                    value={newAdminPassword}
                    onChange={(e) => setNewAdminPassword(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">تکرار رمز عبور جدید:</label>
                  <input
                    type="password"
                    placeholder="تکرار رمز عبور..."
                    value={confirmAdminPassword}
                    onChange={(e) => setConfirmAdminPassword(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setIsChangePasswordOpen(false)}
                    className="text-slate-400 hover:text-white"
                  >
                    انصراف
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={changePasswordLoading}
                    className="bg-amber-600 hover:bg-amber-700 text-white font-bold"
                  >
                    {changePasswordLoading ? 'در حال ثبت...' : 'ذخیره رمز جدید'}
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        )}
    </>
  );
};
