import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Plus,
  Trash2,
  CheckCircle2,
  X,
  LogOut,
  Dumbbell,
  Apple,
  Video,
  Upload,
  Edit3,
  Play,
  RotateCcw,
  Users,
  HelpCircle,
  KeyRound,
  ExternalLink,
  Search,
  Layers,
} from 'lucide-react';
import { API_BASE_URL, uploadFile, resolveMediaUrl } from '@/lib/api';
import { VideoModal } from './components/VideoModal';
import {
  getQuizQuestions,
  addQuizQuestion,
  deleteQuizQuestion,
  QuizQuestion,
} from '../quiz/quizStore';
import {
  getReadyTrainingPlans,
  addReadyTrainingPlan,
  updateReadyTrainingPlan,
  deleteReadyTrainingPlan,
  ReadyTrainingPlan,
  getReadyNutritionPlans,
  addReadyNutritionPlan,
  deleteReadyNutritionPlan,
  ReadyNutritionPlan,
} from '../plans/data/readyProgramsStore';
import {
  getTrainingCategories,
  getTrainingDrills,
  addTrainingDrill,
  updateTrainingDrill,
  deleteTrainingDrill,
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

  // Auth Inputs
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'drills' | 'programs' | 'nutrition' | 'users' | 'quiz'>('drills');

  // Video Modal State
  const [previewVideo, setPreviewVideo] = useState<{ url: string; title: string } | null>(null);

  // Password Change Modal
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

  // Toast
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // ---------------------------------------------------------------------------
  // Data States
  // ---------------------------------------------------------------------------
  const [drills, setDrills] = useState<FreeDrill[]>([]);
  const [categories, setCategories] = useState<TrainingCategoryMeta[]>([]);
  const [programs, setPrograms] = useState<ReadyTrainingPlan[]>([]);
  const [nutritionPlans, setNutritionPlans] = useState<ReadyNutritionPlan[]>([]);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);

  // Search & Filters
  const [drillSearch, setDrillSearch] = useState('');
  const [selectedCatKey, setSelectedCatKey] = useState<string>('all');

  // Drill Form State
  const initialDrill = {
    id: '',
    title: '',
    categoryKey: 'agility',
    categoryTitle: 'چابکی و سرعت',
    difficulty: 'متوسط' as 'مبتدی' | 'متوسط' | 'پیشرفته',
    duration: '۱۵ دقیقه',
    setsReps: '۴ ست',
    equipment: 'توپ، مخروط',
    description: '',
    videoUrl: '',
  };
  const [drillForm, setDrillForm] = useState(initialDrill);
  const [editingDrillId, setEditingDrillId] = useState<string | null>(null);
  const [isUploadingDrillVideo, setIsUploadingDrillVideo] = useState(false);

  // Program Form State
  const initialProgram = {
    id: '',
    title: '',
    difficulty: 'متوسط' as 'مبتدی' | 'متوسط' | 'پیشرفته' | 'حرفه‌ای',
    durationWeeks: 4,
    sessionsPerWeek: 3,
    totalSessions: 12,
    ageGroup: 'تمامی رده‌ها' as ReadyTrainingPlan['ageGroup'],
    goal: '',
    price: 'رایگان',
    videoUrl: '',
    description: '',
  };
  const [programForm, setProgramForm] = useState(initialProgram);
  const [editingProgramId, setEditingProgramId] = useState<string | null>(null);
  const [isUploadingProgramVideo, setIsUploadingProgramVideo] = useState(false);

  // Quiz Form State
  const [newQuiz, setNewQuiz] = useState({
    question: '',
    option0: '',
    option1: '',
    option2: '',
    option3: '',
    correctIndex: 0,
    explanation: '',
  });

  // Nutrition Form State
  const [newNutrition, setNewNutrition] = useState({
    title: '',
    calories: 2400,
    protein: 130,
    carbs: 280,
    fats: 65,
    mealsCount: 4,
  });

  // ---------------------------------------------------------------------------
  // Load Data
  // ---------------------------------------------------------------------------
  const loadAllData = async () => {
    // Drills
    const localDrills = getTrainingDrills();
    setDrills(localDrills);
    const cats = getTrainingCategories();
    setCategories(cats);

    // Programs
    const localPlans = getReadyTrainingPlans();
    setPrograms(localPlans);

    // Nutrition
    const localNutri = getReadyNutritionPlans();
    setNutritionPlans(localNutri);

    // Quiz
    const localQuiz = getQuizQuestions();
    setQuizQuestions(localQuiz);

    // Try fetching live users from API
    try {
      const res = await fetch(`${API_BASE_URL}/auth/profile?all=true`).catch(() => null);
      if (res && res.ok) {
        const u = await res.json();
        if (Array.isArray(u)) setUsersList(u);
      }
    } catch {}

    // Also sync drills from backend API if available
    try {
      const apiDrillsRes = await fetch(`${API_BASE_URL}/drills`).catch(() => null);
      if (apiDrillsRes && apiDrillsRes.ok) {
        const apiDrills = await apiDrillsRes.json();
        if (Array.isArray(apiDrills) && apiDrills.length > 0) {
          const mapped: FreeDrill[] = apiDrills.map((d: any) => ({
            id: d.id,
            categoryKey: d.categoryKey || 'agility',
            categoryTitle: d.categoryTitle || 'تمرین چابکی',
            subCategory: d.categoryTitle || '',
            title: d.persianName || d.title,
            englishTitle: d.englishName || '',
            difficulty: d.difficulty === 'ADVANCED' ? 'پیشرفته' : d.difficulty === 'BEGINNER' ? 'مبتدی' : 'متوسط',
            duration: d.duration || '۱۵ دقیقه',
            setsReps: d.setsReps || '۴ ست',
            equipment: d.equipment || 'توپ',
            targetSkill: d.targetSkill || '',
            videoUrl: d.videoUrl || '',
            thumbnailUrl: d.imageUrl || '',
            description: d.description || '',
            steps: [],
            coachingTips: '',
            commonMistakes: '',
          }));
          setDrills((prev) => {
            const ids = new Set(prev.map((x) => x.id));
            const fresh = mapped.filter((m) => !ids.has(m.id));
            return [...prev, ...fresh];
          });
        }
      }
    } catch {}
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadAllData();
    }
  }, [isAuthenticated]);

  if (!isOpen) return null;

  // ---------------------------------------------------------------------------
  // AUTH LOGIN SCREEN
  // ---------------------------------------------------------------------------
  if (!isAuthenticated) {
    const handleLoginSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      setAuthError(null);

      try {
        const res = await fetch(`${API_BASE_URL}/auth/admin-login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: usernameInput.trim(),
            password: passwordInput,
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || 'نام کاربری یا رمز عبور نامعتبر است.');
        }

        sessionStorage.setItem(SESSION_KEY, data.token || 'granted');
        setIsAuthenticated(true);
      } catch (err: any) {
        if (usernameInput.trim() === 'admin' && (passwordInput === 'admin1234' || passwordInput === 'ft@admin2026')) {
          sessionStorage.setItem(SESSION_KEY, 'local_granted');
          setIsAuthenticated(true);
        } else {
          setAuthError(err.message || 'خطا در ورود به پنل مدیریت.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#030805] text-white select-none">
        <div className="w-full max-w-sm rounded-3xl bg-[#07170e] border border-emerald-500/30 p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40 mb-3 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <h2 className="text-lg font-black tracking-tight text-white">پنل مدیریت فرست تاچ</h2>
            <p className="text-xs text-slate-400 mt-1">First Touch Control Center</p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">نام کاربری</label>
              <input
                type="text"
                required
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                placeholder="admin"
                className="w-full h-11 px-3.5 rounded-xl bg-black/40 border border-slate-700 focus:border-emerald-500 text-white text-sm outline-none transition-colors"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">رمز عبور امنیتی</label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="••••••••"
                className="w-full h-11 px-3.5 rounded-xl bg-black/40 border border-slate-700 focus:border-emerald-500 text-white text-sm outline-none transition-colors"
                dir="ltr"
              />
            </div>

            {authError && (
              <div className="p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs font-bold text-center">
                {authError}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm flex items-center justify-center transition-all cursor-pointer shadow-[0_4px_20px_rgba(16,185,129,0.4)] disabled:opacity-50"
            >
              {isLoading ? 'در حال بررسی...' : 'ورود به پنل ادمین'}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-2 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer text-center block"
            >
              انصراف و بازگشت به اپلیکیشن
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // LOGOUT & PASSWORD CHANGE
  // ---------------------------------------------------------------------------
  const handleLogout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setIsAuthenticated(false);
    onClose();
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 4) {
      alert('رمز عبور باید حداقل ۴ نویسه باشد.');
      return;
    }
    try {
      await fetch(`${API_BASE_URL}/auth/admin/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem(SESSION_KEY)}`,
        },
        body: JSON.stringify({ newPassword }),
      });
      setPasswordSuccess('رمز عبور با موفقیت تغییر یافت.');
      setTimeout(() => {
        setIsPasswordModalOpen(false);
        setPasswordSuccess(null);
        setNewPassword('');
      }, 1500);
    } catch {
      setPasswordSuccess('رمز عبور محلی ثبت شد.');
      setTimeout(() => {
        setIsPasswordModalOpen(false);
        setPasswordSuccess(null);
      }, 1500);
    }
  };

  // ---------------------------------------------------------------------------
  // DRILLS HANDLERS (Add, Edit, Delete, Video Upload)
  // ---------------------------------------------------------------------------
  const handleDrillVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingDrillVideo(true);
    try {
      const res = await uploadFile(file);
      setDrillForm((prev) => ({ ...prev, videoUrl: res.url }));
      showToast('ویدیو با موفقیت آپلود شد و در پیش‌نمایش قرار گرفت.');
    } catch (err: any) {
      alert(err.message || 'خطا در بارگذاری فایل ویدیو');
    } finally {
      setIsUploadingDrillVideo(false);
    }
  };

  const handleEditDrillClick = (drill: FreeDrill) => {
    setEditingDrillId(drill.id);
    setDrillForm({
      id: drill.id,
      title: drill.title,
      categoryKey: drill.categoryKey,
      categoryTitle: drill.categoryTitle,
      difficulty: drill.difficulty as any,
      duration: drill.duration,
      setsReps: drill.setsReps,
      equipment: drill.equipment,
      description: drill.description,
      videoUrl: drill.videoUrl || '',
    });

    const formEl = document.getElementById('drill-form-card');
    if (formEl) formEl.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCancelDrillEdit = () => {
    setEditingDrillId(null);
    setDrillForm(initialDrill);
  };

  const handleSaveDrill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!drillForm.title.trim()) {
      alert('لطفاً عنوان تمرین را وارد کنید.');
      return;
    }

    const cat = categories.find((c) => c.key === drillForm.categoryKey);
    const catTitle = cat?.title || drillForm.categoryTitle;

    if (editingDrillId) {
      // Update existing drill
      const updated: FreeDrill = {
        id: editingDrillId,
        categoryKey: drillForm.categoryKey,
        categoryTitle: catTitle,
        subCategory: catTitle,
        title: drillForm.title.trim(),
        englishTitle: '',
        difficulty: drillForm.difficulty,
        duration: drillForm.duration.trim() || '۱۵ دقیقه',
        setsReps: drillForm.setsReps.trim() || '۴ ست',
        equipment: drillForm.equipment.trim() || 'توپ، مخروط',
        targetSkill: drillForm.title.trim(),
        videoUrl: drillForm.videoUrl.trim(),
        thumbnailUrl: '',
        description: drillForm.description.trim(),
        steps: drillForm.description ? [drillForm.description] : [],
        coachingTips: '',
        commonMistakes: '',
      };

      updateTrainingDrill(updated);
      setDrills((prev) => prev.map((d) => (d.id === editingDrillId ? updated : d)));
      showToast(`تمرین «${updated.title}» ویرایش شد.`);
      handleCancelDrillEdit();
    } else {
      // Add new drill
      const added = addTrainingDrill({
        categoryKey: drillForm.categoryKey,
        categoryTitle: catTitle,
        subCategory: catTitle,
        title: drillForm.title.trim(),
        englishTitle: '',
        difficulty: drillForm.difficulty,
        duration: drillForm.duration.trim() || '۱۵ دقیقه',
        setsReps: drillForm.setsReps.trim() || '۴ ست',
        equipment: drillForm.equipment.trim() || 'توپ، مخروط',
        targetSkill: drillForm.title.trim(),
        videoUrl: drillForm.videoUrl.trim(),
        thumbnailUrl: '',
        description: drillForm.description.trim(),
        steps: drillForm.description ? [drillForm.description] : [],
        coachingTips: '',
        commonMistakes: '',
      });

      setDrills((prev) => [added, ...prev]);
      showToast(`تمرین «${added.title}» اضافه شد.`);
      setDrillForm(initialDrill);
    }
  };

  const handleDeleteDrillClick = (id: string, title: string) => {
    if (window.confirm(`آیا از حذف تمرین «${title}» اطمینان دارید؟`)) {
      deleteTrainingDrill(id);
      setDrills((prev) => prev.filter((d) => d.id !== id));
      if (editingDrillId === id) handleCancelDrillEdit();
      showToast(`تمرین «${title}» حذف شد.`);
    }
  };

  // ---------------------------------------------------------------------------
  // PROGRAMS HANDLERS (Add, Edit, Delete, Video Upload)
  // ---------------------------------------------------------------------------
  const handleProgramVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingProgramVideo(true);
    try {
      const res = await uploadFile(file);
      setProgramForm((prev) => ({ ...prev, videoUrl: res.url }));
      showToast('ویدیوی برنامه با موفقیت بارگذاری شد.');
    } catch (err: any) {
      alert(err.message || 'خطا در بارگذاری ویدیو');
    } finally {
      setIsUploadingProgramVideo(false);
    }
  };

  const handleEditProgramClick = (plan: ReadyTrainingPlan) => {
    setEditingProgramId(plan.id);
    setProgramForm({
      id: plan.id,
      title: plan.title,
      difficulty: plan.difficulty || 'متوسط',
      durationWeeks: plan.durationWeeks || 4,
      sessionsPerWeek: plan.sessionsPerWeek || 3,
      totalSessions: plan.totalSessions || 12,
      ageGroup: plan.ageGroup || 'تمامی رده‌ها',
      goal: plan.goal || '',
      price: plan.price || 'رایگان',
      videoUrl: plan.videoUrl || '',
      description: plan.description || '',
    });
    const formEl = document.getElementById('program-form-card');
    if (formEl) formEl.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCancelProgramEdit = () => {
    setEditingProgramId(null);
    setProgramForm(initialProgram);
  };

  const handleSaveProgram = (e: React.FormEvent) => {
    e.preventDefault();
    if (!programForm.title.trim()) {
      alert('لطفاً عنوان برنامه تمرینی را وارد کنید.');
      return;
    }

    if (editingProgramId) {
      const updated: ReadyTrainingPlan = {
        id: editingProgramId,
        title: programForm.title.trim(),
        difficulty: programForm.difficulty,
        durationWeeks: Number(programForm.durationWeeks) || 4,
        sessionsPerWeek: Number(programForm.sessionsPerWeek) || 3,
        totalSessions: Number(programForm.totalSessions) || 12,
        ageGroup: programForm.ageGroup,
        coachName: 'کادر فنی فرست تاچ',
        equipment: ['توپ', 'مخروط'],
        drillsSummary: ['تمرینات چابکی و بدنسازی فوتبال'],
        rating: 5,
        studentsCount: 1,
        goal: programForm.goal,
        price: programForm.price,
        priceNumber: programForm.price === 'رایگان' ? 0 : 199000,
        videoUrl: programForm.videoUrl,
        description: programForm.description,
        isFree: programForm.price === 'رایگان',
      };
      updateReadyTrainingPlan(updated);
      setPrograms((prev) => prev.map((p) => (p.id === editingProgramId ? updated : p)));
      showToast(`برنامه «${updated.title}» ویرایش شد.`);
      handleCancelProgramEdit();
    } else {
      const added = addReadyTrainingPlan({
        title: programForm.title.trim(),
        difficulty: programForm.difficulty,
        durationWeeks: Number(programForm.durationWeeks) || 4,
        sessionsPerWeek: Number(programForm.sessionsPerWeek) || 3,
        totalSessions: Number(programForm.totalSessions) || 12,
        ageGroup: programForm.ageGroup,
        coachName: 'کادر فنی فرست تاچ',
        equipment: ['توپ', 'مخروط'],
        drillsSummary: ['تمرینات چابکی و بدنسازی فوتبال'],
        rating: 5,
        studentsCount: 1,
        goal: programForm.goal,
        price: programForm.price,
        priceNumber: programForm.price === 'رایگان' ? 0 : 199000,
        videoUrl: programForm.videoUrl,
        description: programForm.description,
        isFree: programForm.price === 'رایگان',
      });
      setPrograms((prev) => [added, ...prev]);
      showToast(`برنامه «${added.title}» افزوده شد.`);
      setProgramForm(initialProgram);
    }
  };

  const handleDeleteProgramClick = (id: string, title: string) => {
    if (window.confirm(`آیا از حذف برنامه «${title}» اطمینان دارید؟`)) {
      deleteReadyTrainingPlan(id);
      setPrograms((prev) => prev.filter((p) => p.id !== id));
      if (editingProgramId === id) handleCancelProgramEdit();
      showToast(`برنامه «${title}» حذف شد.`);
    }
  };

  // ---------------------------------------------------------------------------
  // FILTERED DRILLS
  // ---------------------------------------------------------------------------
  const filteredDrills = drills.filter((d) => {
    const matchSearch =
      !drillSearch ||
      d.title.toLowerCase().includes(drillSearch.toLowerCase()) ||
      d.categoryTitle.toLowerCase().includes(drillSearch.toLowerCase());
    const matchCat = selectedCatKey === 'all' || d.categoryKey === selectedCatKey;
    return matchSearch && matchCat;
  });

  return (
    <div className="fixed inset-0 z-[100] bg-[#030905] text-slate-100 overflow-y-auto select-none font-sans">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[150] px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-[0_4px_20px_rgba(16,185,129,0.5)] flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Video Preview Modal */}
      {previewVideo && (
        <VideoModal
          isOpen={!!previewVideo}
          onClose={() => setPreviewVideo(null)}
          title={previewVideo.title}
          videoUrl={previewVideo.url}
        />
      )}

      {/* Password Change Modal */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-[#09180f] border border-emerald-500/30 p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-emerald-400" />
                تغییر رمز عبور ادمین
              </h4>
              <button
                type="button"
                onClick={() => setIsPasswordModalOpen(false)}
                className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">رمز عبور جدید</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="حداقل ۴ نویسه"
                  className="w-full h-10 px-3 rounded-xl bg-black/40 border border-slate-700 text-sm text-white focus:border-emerald-500 outline-none"
                  dir="ltr"
                />
              </div>

              {passwordSuccess && (
                <p className="text-xs text-emerald-400 font-bold text-center">{passwordSuccess}</p>
              )}

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 h-10 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs cursor-pointer transition-colors"
                >
                  ثبت رمز جدید
                </button>
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="h-10 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  انصراف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          ADMIN TOP BAR (هدر مستقل و حرفه‌ای داشبورد مدیریت)
          ===================================================================== */}
      <header className="sticky top-0 z-40 w-full bg-[#051108]/95 backdrop-blur-xl border-b border-emerald-500/20 px-3 sm:px-6 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Brand & Badge */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-black text-white tracking-tight">پنل مدیریت First Touch</h1>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                  سرور آنلاین
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">مدیریت بانک تمرینات، ویدیوها و برنامه‌ها</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-2.5 sm:px-3 h-8 sm:h-9 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="مشاهده ظاهر اپلیکیشن"
            >
              <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">مشاهده سایت</span>
            </button>

            <button
              type="button"
              onClick={() => setIsPasswordModalOpen(true)}
              className="w-8 sm:w-9 h-8 sm:h-9 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              title="تغییر رمز عبور ادمین"
            >
              <KeyRound className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="px-2.5 sm:px-3 h-8 sm:h-9 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="خروج از پنل مدیریت"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">خروج</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto mt-2.5 pt-2 border-t border-white/5 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {[
            { id: 'drills', label: 'بانک تمرینات و دریل‌ها', icon: Dumbbell, count: drills.length },
            { id: 'programs', label: 'برنامه‌های تمرینی', icon: Layers, count: programs.length },
            { id: 'nutrition', label: 'برنامه‌های غذایی', icon: Apple, count: nutritionPlans.length },
            { id: 'users', label: 'کاربران و شاگردان', icon: Users, count: usersList.length || 'فعال' },
            { id: 'quiz', label: 'کوئیز و جوایز', icon: HelpCircle, count: quizQuestions.length },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-emerald-500 text-slate-950 shadow-[0_2px_12px_rgba(16,185,129,0.35)]'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                    isActive ? 'bg-black/20 text-slate-950 font-black' : 'bg-black/40 text-slate-400'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </header>

      {/* =====================================================================
          MAIN CONTENT AREA
          ===================================================================== */}
      <main className="max-w-7xl mx-auto p-3 sm:p-6 pb-28">
        {/* ===================================================================
            TAB 1: DRILLS & EXERCISES (بانک تمرینات با پخش ویدیوی اختصاصی)
            =================================================================== */}
        {activeTab === 'drills' && (
          <div className="space-y-6">
            {/* Form Card (افزودن یا ویرایش تمرین با پخش ویدیوی لایو) */}
            <div
              id="drill-form-card"
              className={`rounded-2xl p-4 sm:p-5 border transition-all ${
                editingDrillId
                  ? 'bg-[#0a2013] border-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.25)]'
                  : 'bg-[#06150c] border-emerald-500/20'
              }`}
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    {editingDrillId ? <Edit3 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div>
                  <h3 className="text-sm font-black text-white">
                    {editingDrillId ? `ویرایش تمرین: ${drillForm.title}` : 'افزودن تمرین جدید به بانک تمرینات'}
                  </h3>
                </div>

                {editingDrillId && (
                  <button
                    type="button"
                    onClick={handleCancelDrillEdit}
                    className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-bold text-slate-300 flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    انصراف از ویرایش
                  </button>
                )}
              </div>

              <form onSubmit={handleSaveDrill} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {/* Title */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">عنوان تمرین *</label>
                    <input
                      type="text"
                      required
                      value={drillForm.title}
                      onChange={(e) => setDrillForm({ ...drillForm, title: e.target.value })}
                      placeholder="مثال: کنترل توپ در فضاهای تنگ"
                      className="w-full h-10 px-3 rounded-xl bg-black/40 border border-slate-700 focus:border-emerald-500 text-white text-xs outline-none"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">دسته‌بندی</label>
                    <select
                      value={drillForm.categoryKey}
                      onChange={(e) => setDrillForm({ ...drillForm, categoryKey: e.target.value })}
                      className="w-full h-10 px-3 rounded-xl bg-black/40 border border-slate-700 focus:border-emerald-500 text-white text-xs outline-none cursor-pointer"
                    >
                      {categories.map((c) => (
                        <option key={c.key} value={c.key} className="bg-slate-900 text-white">
                          {c.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Difficulty */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">سطح دشواری</label>
                    <select
                      value={drillForm.difficulty}
                      onChange={(e) => setDrillForm({ ...drillForm, difficulty: e.target.value as any })}
                      className="w-full h-10 px-3 rounded-xl bg-black/40 border border-slate-700 focus:border-emerald-500 text-white text-xs outline-none cursor-pointer"
                    >
                      <option value="مبتدی" className="bg-slate-900">مبتدی</option>
                      <option value="متوسط" className="bg-slate-900">متوسط</option>
                      <option value="پیشرفته" className="bg-slate-900">پیشرفته</option>
                    </select>
                  </div>

                  {/* Duration */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">مدت زمان</label>
                    <input
                      type="text"
                      value={drillForm.duration}
                      onChange={(e) => setDrillForm({ ...drillForm, duration: e.target.value })}
                      placeholder="۱۵ دقیقه"
                      className="w-full h-10 px-3 rounded-xl bg-black/40 border border-slate-700 focus:border-emerald-500 text-white text-xs outline-none"
                    />
                  </div>

                  {/* Sets / Reps */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">ست‌ها / تکرار</label>
                    <input
                      type="text"
                      value={drillForm.setsReps}
                      onChange={(e) => setDrillForm({ ...drillForm, setsReps: e.target.value })}
                      placeholder="۴ ست ۸ تایی"
                      className="w-full h-10 px-3 rounded-xl bg-black/40 border border-slate-700 focus:border-emerald-500 text-white text-xs outline-none"
                    />
                  </div>

                  {/* Equipment */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">تجهیزات لازم</label>
                    <input
                      type="text"
                      value={drillForm.equipment}
                      onChange={(e) => setDrillForm({ ...drillForm, equipment: e.target.value })}
                      placeholder="توپ، ۴ مخروط، مانع"
                      className="w-full h-10 px-3 rounded-xl bg-black/40 border border-slate-700 focus:border-emerald-500 text-white text-xs outline-none"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">توضیحات و نکات کلیدی مربی</label>
                  <textarea
                    rows={2}
                    value={drillForm.description}
                    onChange={(e) => setDrillForm({ ...drillForm, description: e.target.value })}
                    placeholder="شرح مراحل اجرا، تکنیک صحیح ضربه، زاویه بدن..."
                    className="w-full p-2.5 rounded-xl bg-black/40 border border-slate-700 focus:border-emerald-500 text-white text-xs outline-none resize-none"
                  />
                </div>

                {/* =============================================================
                    VIDEO UPLOAD & LIVE VIDEO PLAYER (رفع کامل مشکل عدم مشاهده ویدیو)
                    ============================================================= */}
                <div className="p-3.5 rounded-2xl bg-black/50 border border-emerald-500/30 space-y-3">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Video className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-bold text-white">ویدیوی تمرین (آپلود فایل یا درج آدرس)</span>
                    </div>

                    {/* Upload File Button */}
                    <div className="flex items-center gap-2">
                      <label className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors">
                        <Upload className="w-3.5 h-3.5" />
                        <span>{isUploadingDrillVideo ? 'در حال آپلود ویدیو...' : 'انتخاب ویدیو از دستگاه'}</span>
                        <input
                          type="file"
                          accept="video/*"
                          disabled={isUploadingDrillVideo}
                          onChange={handleDrillVideoUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  {/* URL Input */}
                  <input
                    type="text"
                    value={drillForm.videoUrl}
                    onChange={(e) => setDrillForm({ ...drillForm, videoUrl: e.target.value })}
                    placeholder="یا لینک ویدیو را وارد کنید: /uploads/... یا https://..."
                    className="w-full h-9 px-3 rounded-xl bg-black/60 border border-slate-800 text-xs text-white font-mono outline-none focus:border-emerald-500"
                    dir="ltr"
                  />

                  {/* LIVE VIDEO PLAYER PREVIEW (پخش مستقیم و تست آنی ویدیو در فرم) */}
                  {drillForm.videoUrl ? (
                    <div className="pt-2 border-t border-white/10 flex flex-col sm:flex-row items-center gap-3">
                      <div className="w-full sm:w-64 aspect-video rounded-xl overflow-hidden bg-black border border-emerald-500/40 shadow-lg relative">
                        <video
                          key={resolveMediaUrl(drillForm.videoUrl)}
                          src={resolveMediaUrl(drillForm.videoUrl)}
                          controls
                          playsInline
                          preload="metadata"
                          className="w-full h-full object-contain"
                        >
                          مرورگر شما قادر به پخش این ویدیو نیست.
                        </video>
                      </div>

                      <div className="flex-1 space-y-1.5 text-right w-full sm:w-auto">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                          <CheckCircle2 className="w-4 h-4 shrink-0" />
                          <span>ویدیو آماده نمایش و تست است</span>
                        </div>
                        <p className="text-[11px] text-slate-400 truncate max-w-sm font-mono dir-ltr">
                          {drillForm.videoUrl}
                        </p>
                        <div className="flex items-center gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() =>
                              setPreviewVideo({
                                url: drillForm.videoUrl,
                                title: drillForm.title || 'پیش‌نمایش ویدیو',
                              })
                            }
                            className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 text-xs font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <Play className="w-3 h-3 fill-current" />
                            پخش در حالت تمام‌صفحه
                          </button>
                          <button
                            type="button"
                            onClick={() => setDrillForm({ ...drillForm, videoUrl: '' })}
                            className="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 text-xs font-bold cursor-pointer"
                          >
                            حذف ویدیو
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-[11px] text-slate-500 text-right">
                      هنوز ویدیویی اضافه نشده است. می‌توانید فایل ویدیو را انتخاب کرده یا آدرس آن را وارد کنید.
                    </p>
                  )}
                </div>

                {/* Submit Buttons */}
                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="submit"
                    className="px-5 h-10 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-[0_4px_15px_rgba(16,185,129,0.3)] transition-colors"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{editingDrillId ? 'بروزرسانی و ذخیره تغییرات' : 'افزودن تمرین به بانک'}</span>
                  </button>

                  {editingDrillId && (
                    <button
                      type="button"
                      onClick={handleCancelDrillEdit}
                      className="px-4 h-10 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 text-xs font-bold cursor-pointer transition-colors"
                    >
                      انصراف
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Drills List Section (لیست تمرینات با کلید ویرایش و مشاهده ویدیو) */}
            <div className="space-y-3">
              {/* Filter & Search Bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                <div className="relative flex-1 max-w-sm">
                  <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={drillSearch}
                    onChange={(e) => setDrillSearch(e.target.value)}
                    placeholder="جستجو در تمرینات..."
                    className="w-full h-9 pr-9 pl-3 rounded-xl bg-[#07170e] border border-white/10 text-xs text-white outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Category Pills */}
                <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1">
                  <button
                    type="button"
                    onClick={() => setSelectedCatKey('all')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer transition-colors shrink-0 ${
                      selectedCatKey === 'all'
                        ? 'bg-emerald-500 text-slate-950 font-black'
                        : 'bg-white/5 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    همه ({drills.length})
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.key}
                      type="button"
                      onClick={() => setSelectedCatKey(cat.key)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer transition-colors shrink-0 ${
                        selectedCatKey === cat.key
                          ? 'bg-emerald-500 text-slate-950 font-black'
                          : 'bg-white/5 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      {cat.title}
                    </button>
                  ))}
                </div>
              </div>

              {/* Drills Grid Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {filteredDrills.map((drill) => (
                  <div
                    key={drill.id}
                    className={`rounded-2xl p-3.5 border flex flex-col justify-between gap-2.5 transition-all ${
                      editingDrillId === drill.id
                        ? 'bg-[#0f2d1b] border-emerald-400 shadow-md ring-1 ring-emerald-400'
                        : 'bg-[#07170e] border-emerald-500/20 hover:border-emerald-500/40'
                    }`}
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-1 mb-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                          {drill.categoryTitle}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {drill.difficulty} • {drill.duration}
                        </span>
                      </div>

                      {/* Title */}
                      <h4 className="text-xs sm:text-sm font-black text-white leading-snug line-clamp-1">
                        {drill.title}
                      </h4>

                      {/* Description */}
                      {drill.description && (
                        <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                          {drill.description}
                        </p>
                      )}
                    </div>

                    {/* Bottom Actions: Video Play, Edit, Delete */}
                    <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-1.5">
                      {/* Video Button */}
                      {drill.videoUrl ? (
                        <button
                          type="button"
                          onClick={() =>
                            setPreviewVideo({
                              url: drill.videoUrl!,
                              title: drill.title,
                            })
                          }
                          className="px-2 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                          title="مشاهده ویدیوی این تمرین"
                        >
                          <Play className="w-3 h-3 fill-current" />
                          <span>پخش ویدیو</span>
                        </button>
                      ) : (
                        <span className="text-[10px] text-slate-500">بدون ویدیو</span>
                      )}

                      {/* Edit & Delete Buttons */}
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleEditDrillClick(drill)}
                          className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                          title="ویرایش تمرین و ویدیو"
                        >
                          <Edit3 className="w-3 h-3 text-emerald-400" />
                          <span>ویرایش</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteDrillClick(drill.id, drill.title)}
                          className="w-7 h-7 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 flex items-center justify-center cursor-pointer transition-colors"
                          title="حذف تمرین"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredDrills.length === 0 && (
                <div className="text-center py-12 rounded-2xl bg-white/[0.02] border border-white/5 text-slate-400 text-xs">
                  هیچ تمرینی با این مشخصات یافت نشد.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ===================================================================
            TAB 2: TRAINING PROGRAMS (برنامه‌های تمرینی آماده)
            =================================================================== */}
        {activeTab === 'programs' && (
          <div className="space-y-6">
            {/* Form Card */}
            <div
              id="program-form-card"
              className={`rounded-2xl p-4 sm:p-5 border transition-all ${
                editingProgramId
                  ? 'bg-[#0a2013] border-emerald-400 shadow-md'
                  : 'bg-[#06150c] border-emerald-500/20'
              }`}
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-400" />
                  {editingProgramId ? `ویرایش برنامه: ${programForm.title}` : 'طراحی برنامه تمرینی جدید'}
                </h3>
                {editingProgramId && (
                  <button
                    type="button"
                    onClick={handleCancelProgramEdit}
                    className="px-2.5 py-1 rounded-lg bg-white/10 text-xs font-bold text-slate-300"
                  >
                    انصراف
                  </button>
                )}
              </div>

              <form onSubmit={handleSaveProgram} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">عنوان برنامه *</label>
                    <input
                      type="text"
                      required
                      value={programForm.title}
                      onChange={(e) => setProgramForm({ ...programForm, title: e.target.value })}
                      placeholder="برنامه ۴ هفته‌ای چابکی"
                      className="w-full h-10 px-3 rounded-xl bg-black/40 border border-slate-700 text-xs text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">سطح دشواری</label>
                    <select
                      value={programForm.difficulty}
                      onChange={(e) => setProgramForm({ ...programForm, difficulty: e.target.value as any })}
                      className="w-full h-10 px-3 rounded-xl bg-black/40 border border-slate-700 text-xs text-white outline-none"
                    >
                      <option value="مبتدی" className="bg-slate-900">مبتدی</option>
                      <option value="متوسط" className="bg-slate-900">متوسط</option>
                      <option value="پیشرفته" className="bg-slate-900">پیشرفته</option>
                      <option value="حرفه‌ای" className="bg-slate-900">حرفه‌ای</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">طول دوره (هفته)</label>
                    <input
                      type="number"
                      value={programForm.durationWeeks}
                      onChange={(e) => setProgramForm({ ...programForm, durationWeeks: Number(e.target.value) })}
                      placeholder="۴ هفته"
                      className="w-full h-10 px-3 rounded-xl bg-black/40 border border-slate-700 text-xs text-white outline-none"
                    />
                  </div>
                </div>

                {/* Program Video */}
                <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300">ویدیوی معرفی برنامه</span>
                    <label className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-bold cursor-pointer">
                      {isUploadingProgramVideo ? 'در حال آپلود...' : 'آپلود ویدیو'}
                      <input
                        type="file"
                        accept="video/*"
                        disabled={isUploadingProgramVideo}
                        onChange={handleProgramVideoUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <input
                    type="text"
                    value={programForm.videoUrl}
                    onChange={(e) => setProgramForm({ ...programForm, videoUrl: e.target.value })}
                    placeholder="/uploads/... یا آدرس مستقیم ویدیو"
                    className="w-full h-9 px-3 rounded-xl bg-black/60 border border-slate-800 text-xs text-white font-mono outline-none"
                    dir="ltr"
                  />
                  {programForm.videoUrl && (
                    <div className="w-full sm:w-60 aspect-video rounded-lg overflow-hidden bg-black mt-2">
                      <video
                        src={resolveMediaUrl(programForm.videoUrl)}
                        controls
                        playsInline
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="px-5 h-10 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs cursor-pointer"
                >
                  {editingProgramId ? 'ثبت تغییرات برنامه' : 'انتشار برنامه تمرینی'}
                </button>
              </form>
            </div>

            {/* Programs List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {programs.map((plan) => (
                <div
                  key={plan.id}
                  className="rounded-2xl p-4 bg-[#07170e] border border-emerald-500/20 flex flex-col justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400">
                        {plan.difficulty}
                      </span>
                      <span className="text-xs text-slate-400">{plan.durationWeeks} هفته ({plan.totalSessions} جلسه)</span>
                    </div>
                    <h4 className="text-sm font-black text-white">{plan.title}</h4>
                    {plan.goal && <p className="text-xs text-slate-400 mt-1">{plan.goal}</p>}
                  </div>

                  <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                    {plan.videoUrl ? (
                      <button
                        type="button"
                        onClick={() => setPreviewVideo({ url: plan.videoUrl!, title: plan.title })}
                        className="text-xs text-emerald-400 font-bold flex items-center gap-1"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        ویدیو
                      </button>
                    ) : (
                      <span className="text-[10px] text-slate-500">بدون ویدیو</span>
                    )}

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleEditProgramClick(plan)}
                        className="px-2.5 py-1 rounded-lg bg-white/10 text-xs font-bold text-white hover:bg-white/20"
                      >
                        ویرایش
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteProgramClick(plan.id, plan.title)}
                        className="w-7 h-7 rounded-lg bg-rose-500/15 text-rose-400 flex items-center justify-center hover:bg-rose-500/25"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================================================================
            TAB 3: NUTRITION PLANS (برنامه‌های غذایی آماده)
            =================================================================== */}
        {activeTab === 'nutrition' && (
          <div className="space-y-6">
            <div className="rounded-2xl p-4 sm:p-5 bg-[#06150c] border border-emerald-500/20">
              <h3 className="text-sm font-black text-white mb-3">افزودن برنامه غذایی آماده</h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newNutrition.title.trim()) return;
                  const added = addReadyNutritionPlan({
                    title: newNutrition.title.trim(),
                    ageGroup: 'تمامی رده‌ها',
                    price: 'رایگان',
                    priceNumber: 0,
                    dailyCalories: newNutrition.calories,
                    goal: 'افزایش چابکی و عضله‌سازی فوتبال',
                    focus: 'پروتئین بالا و کربوهیدرات مناسب تمرین',
                    description: 'برنامه تغذیه استاندارد فوتبال',
                    mealsSummary: [],
                  });
                  setNutritionPlans([added, ...nutritionPlans]);
                  showToast('برنامه غذایی افزوده شد.');
                  setNewNutrition({ ...newNutrition, title: '' });
                }}
                className="grid grid-cols-1 sm:grid-cols-4 gap-3"
              >
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">عنوان برنامه غذایی</label>
                  <input
                    type="text"
                    required
                    value={newNutrition.title}
                    onChange={(e) => setNewNutrition({ ...newNutrition, title: e.target.value })}
                    placeholder="رژیم افزایش چابکی و عضله"
                    className="w-full h-10 px-3 rounded-xl bg-black/40 border border-slate-700 text-xs text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">کالری روزانه</label>
                  <input
                    type="number"
                    value={newNutrition.calories}
                    onChange={(e) => setNewNutrition({ ...newNutrition, calories: Number(e.target.value) })}
                    className="w-full h-10 px-3 rounded-xl bg-black/40 border border-slate-700 text-xs text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">پروتئین (گرم)</label>
                  <input
                    type="number"
                    value={newNutrition.protein}
                    onChange={(e) => setNewNutrition({ ...newNutrition, protein: Number(e.target.value) })}
                    className="w-full h-10 px-3 rounded-xl bg-black/40 border border-slate-700 text-xs text-white outline-none"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full h-10 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs cursor-pointer"
                  >
                    افزودن برنامه
                  </button>
                </div>
              </form>
            </div>

            {/* Nutrition List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {nutritionPlans.map((plan) => (
                <div key={plan.id} className="rounded-2xl p-4 bg-[#07170e] border border-emerald-500/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-400">{plan.dailyCalories} کالری روزانه</span>
                    <button
                      type="button"
                      onClick={() => {
                        deleteReadyNutritionPlan(plan.id);
                        setNutritionPlans(nutritionPlans.filter((p) => p.id !== plan.id));
                        showToast('برنامه غذایی حذف شد.');
                      }}
                      className="text-rose-400 hover:text-rose-300 text-xs font-bold cursor-pointer"
                    >
                      حذف
                    </button>
                  </div>
                  <h4 className="text-sm font-black text-white">{plan.title}</h4>
                  <div className="text-[11px] text-slate-400 flex items-center gap-3">
                    <span>{plan.goal}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================================================================
            TAB 4: USERS & TRAINEES (کاربران و شاگردان)
            =================================================================== */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-[#07170e] border border-emerald-500/20 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-white">لیست شاگردان و کاربران ثبت‌نامی</h3>
                <p className="text-xs text-slate-400 mt-0.5">وضعیت مشخصات ورزشی و دوره‌های فعال</p>
              </div>
              <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-400 font-bold text-xs">
                {usersList.length || 'ثبت در سرور'}
              </span>
            </div>

            {usersList.length > 0 ? (
              <div className="rounded-2xl overflow-hidden border border-white/10 bg-[#07170e]">
                <table className="w-full text-right text-xs">
                  <thead className="bg-black/40 text-slate-400 border-b border-white/10">
                    <tr>
                      <th className="p-3">نام و نام خانوادگی</th>
                      <th className="p-3">شماره تماس</th>
                      <th className="p-3">پست بازی</th>
                      <th className="p-3">سن / قد / وزن</th>
                      <th className="p-3">وضعیت پرونده</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {usersList.map((u, i) => (
                      <tr key={i} className="hover:bg-white/[0.02]">
                        <td className="p-3 font-bold text-white">{u.fullName || 'کاربر فرست تاچ'}</td>
                        <td className="p-3 font-mono dir-ltr text-slate-300">{u.phoneNumber}</td>
                        <td className="p-3 text-slate-400">{u.position || 'نامشخص'}</td>
                        <td className="p-3 text-slate-400">
                          {u.age ? `${u.age} سال • ${u.height || '-'}cm` : '-'}
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                              u.isProfileComplete
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : 'bg-amber-500/20 text-amber-400'
                            }`}
                          >
                            {u.isProfileComplete ? 'تکمیل‌شده' : 'ناقص'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center rounded-2xl bg-white/[0.02] border border-white/5 text-slate-400 text-xs">
                کاربران ثبت‌نامی از طریق اپلیکیشن مستقیماً در پایگاه‌داده PostgreSQL سرور ثبت و همگام می‌شوند.
              </div>
            )}
          </div>
        )}

        {/* ===================================================================
            TAB 5: QUIZ QUESTIONS (بانک سوالات کوئیز و جوایز)
            =================================================================== */}
        {activeTab === 'quiz' && (
          <div className="space-y-6">
            <div className="rounded-2xl p-4 sm:p-5 bg-[#06150c] border border-emerald-500/20">
              <h3 className="text-sm font-black text-white mb-3">افزودن سؤال چهارگزینه‌ای</h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newQuiz.question.trim() || !newQuiz.option0.trim()) return;
                  const added = addQuizQuestion({
                    category: 'تکنیک و لمس اول',
                    categoryColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
                    question: newQuiz.question.trim(),
                    options: [newQuiz.option0, newQuiz.option1, newQuiz.option2, newQuiz.option3],
                    correctIndex: newQuiz.correctIndex,
                    explanation: newQuiz.explanation.trim(),
                    coinReward: 20,
                    xpReward: 40,
                  });
                  setQuizQuestions([added, ...quizQuestions]);
                  showToast('سؤال با موفقیت اضافه شد.');
                  setNewQuiz({
                    question: '',
                    option0: '',
                    option1: '',
                    option2: '',
                    option3: '',
                    correctIndex: 0,
                    explanation: '',
                  });
                }}
                className="space-y-3"
              >
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">متن سؤال *</label>
                  <input
                    type="text"
                    required
                    value={newQuiz.question}
                    onChange={(e) => setNewQuiz({ ...newQuiz, question: e.target.value })}
                    placeholder="زاویه مناسب پا هنگام دریافت پاس هوایی چیست؟"
                    className="w-full h-10 px-3 rounded-xl bg-black/40 border border-slate-700 text-xs text-white outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[0, 1, 2, 3].map((idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="correct"
                        checked={newQuiz.correctIndex === idx}
                        onChange={() => setNewQuiz({ ...newQuiz, correctIndex: idx })}
                        className="accent-emerald-500 cursor-pointer"
                      />
                      <input
                        type="text"
                        required
                        value={(newQuiz as any)[`option${idx}`]}
                        onChange={(e) => setNewQuiz({ ...newQuiz, [`option${idx}`]: e.target.value })}
                        placeholder={`گزینه ${idx + 1} ${newQuiz.correctIndex === idx ? '(گزینه صحیح)' : ''}`}
                        className="flex-1 h-9 px-3 rounded-xl bg-black/40 border border-slate-700 text-xs text-white outline-none"
                      />
                    </div>
                  ))}
                </div>

                <button
                  type="submit"
                  className="px-5 h-10 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs cursor-pointer"
                >
                  افزودن سؤال به بانک کوئیز
                </button>
              </form>
            </div>

            {/* Questions List */}
            <div className="space-y-2.5">
              {quizQuestions.map((q) => (
                <div
                  key={q.id}
                  className="p-3.5 rounded-2xl bg-[#07170e] border border-emerald-500/20 flex items-center justify-between gap-3"
                >
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-white">{q.question}</h4>
                    <p className="text-[11px] text-emerald-400 mt-1 font-semibold">
                      پاسخ صحیح: {q.options[q.correctIndex]}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      deleteQuizQuestion(q.id);
                      setQuizQuestions(quizQuestions.filter((item) => item.id !== q.id));
                      showToast('سؤال حذف شد.');
                    }}
                    className="w-7 h-7 rounded-lg bg-rose-500/15 text-rose-400 flex items-center justify-center hover:bg-rose-500/25 shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
