import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  ArrowRight,
  Scale,
  Plus,
  CheckCircle2,
  X,
  Camera,
  Image as ImageIcon,
  Trash2,
  Eye,
} from 'lucide-react';
import { API_BASE_URL, uploadFile, resolveMediaUrl } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export interface WeightRecord {
  id: string;
  week: string;
  date: string;
  weight: number;
  photoUrl?: string;
  note?: string;
}

export const ProgressReportPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [metricsData, setMetricsData] = useState<any>(null);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [previewPhotoUrl, setPreviewPhotoUrl] = useState<string | null>(null);

  // Form state
  const [newWeight, setNewWeight] = useState('');
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [newNote, setNewNote] = useState('');
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  const triggerHaptic = () => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([14]);
      } catch {}
    }
  };

  const loadMetrics = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/programs/athlete-metrics`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.history && data.history.length > 0) {
          setMetricsData(data);
          return;
        }
      }
    } catch {}

    // Fallback to localStorage or profile
    try {
      const local = localStorage.getItem('ft_athlete_progress_metrics');
      if (local) {
        const parsed = JSON.parse(local);
        if (parsed && Array.isArray(parsed.history) && parsed.history.length > 0) {
          setMetricsData(parsed);
          return;
        }
      }
    } catch {}

    const profileWeight = currentUser?.weight ? Number(currentUser.weight) : 72;
    const playerName =
      currentUser?.fullName ||
      (currentUser?.phoneNumber ? `کاربر ${currentUser.phoneNumber.slice(-4)}` : 'ورزشکار فرست تاچ');

    const initialHistory: WeightRecord[] = [
      {
        id: 'rec-base',
        week: 'رکورد پایه',
        date: new Date().toLocaleDateString('fa-IR'),
        weight: profileWeight,
      },
    ];

    const baseline = {
      playerName,
      initialDate: new Date().toLocaleDateString('fa-IR'),
      currentWeight: profileWeight,
      baseWeight: profileWeight,
      history: initialHistory,
    };
    setMetricsData(baseline);
  };

  useEffect(() => {
    loadMetrics();
  }, [currentUser]);

  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingPhoto(true);
    try {
      const res = await uploadFile(file);
      if (res && res.url) {
        setNewPhotoUrl(res.url);
      }
    } catch (err) {
      // Offline fallback: convert to Data URL so photo preview & saving still works
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setNewPhotoUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleSaveMeasurement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!metricsData) return;

    const w = Number(newWeight) || metricsData.currentWeight || 72;
    const newWeekNum = (metricsData.history?.length || 0) + 1;
    const nowFa = new Date().toLocaleDateString('fa-IR');

    const newRecord: WeightRecord = {
      id: `weight-${Date.now()}`,
      week: `هفته ${newWeekNum}`,
      date: nowFa,
      weight: Math.round(w * 10) / 10,
      photoUrl: newPhotoUrl || undefined,
      note: newNote.trim() || undefined,
    };

    const updated = {
      ...metricsData,
      currentWeight: Math.round(w * 10) / 10,
      history: [...(metricsData.history || []), newRecord],
    };

    setMetricsData(updated);
    try {
      localStorage.setItem('ft_athlete_progress_metrics', JSON.stringify(updated));
    } catch {}

    // Reset form
    setNewWeight('');
    setNewPhotoUrl('');
    setNewNote('');
    setIsLogModalOpen(false);
    triggerHaptic();

    try {
      await fetch(`${API_BASE_URL}/programs/athlete-metrics`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
    } catch {}
  };

  const handleDeleteRecord = async (id: string) => {
    if (!metricsData) return;
    const filtered = (metricsData.history || []).filter((h: WeightRecord) => h.id !== id);
    if (filtered.length === 0) return;

    const last = filtered[filtered.length - 1];
    const updated = {
      ...metricsData,
      currentWeight: last.weight,
      history: filtered,
    };
    setMetricsData(updated);
    try {
      localStorage.setItem('ft_athlete_progress_metrics', JSON.stringify(updated));
      await fetch(`${API_BASE_URL}/programs/athlete-metrics`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
    } catch {}
  };

  const history: WeightRecord[] = metricsData?.history || [];
  const baseRecord = history[0];
  const lastRecord = history[history.length - 1];
  const currentWeight = lastRecord?.weight || metricsData?.currentWeight || 72;
  const baseWeight = baseRecord?.weight || metricsData?.baseWeight || currentWeight;
  const diffFromBase = Math.round((currentWeight - baseWeight) * 10) / 10;
  const photosCount = history.filter((h) => Boolean(h.photoUrl)).length;

  // SVG Chart calculation for Weight
  const values = history.map((h) => Number(h.weight) || 70);
  const minVal = values.length > 0 ? Math.floor(Math.min(...values) - 2) : 60;
  const maxVal = values.length > 0 ? Math.ceil(Math.max(...values) + 2) : 90;
  const range = maxVal - minVal || 1;

  const chartWidth = 500;
  const chartHeight = 200;
  const paddingX = 40;
  const paddingY = 30;

  const points = values.map((val: number, i: number) => {
    const x = paddingX + (i / Math.max(1, values.length - 1)) * (chartWidth - paddingX * 2);
    const y = chartHeight - paddingY - ((val - minVal) / range) * (chartHeight - paddingY * 2);
    return { x, y, val, label: history[i]?.week || '' };
  });

  const pathD = points.reduce((acc: string, pt: any, i: number) => {
    return i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
  }, '');

  const areaD =
    points.length > 0
      ? `${pathD} L ${points[points.length - 1].x} ${chartHeight - paddingY} L ${points[0].x} ${
          chartHeight - paddingY
        } Z`
      : '';

  return (
    <div className="w-full max-w-lg mx-auto px-2 sm:px-3 pt-2 pb-32 select-none text-foreground dark:text-white">
      {/* Top Header */}
      <header className="flex items-center justify-between py-2 px-1 mb-4">
        <button
          type="button"
          onClick={() => {
            triggerHaptic();
            navigate('/');
          }}
          className="h-10 w-10 rounded-2xl bg-white/10 dark:bg-white/[0.05] border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/20 transition-colors cursor-pointer"
          title="بازگشت به پیشخان"
        >
          <ArrowRight className="h-5 w-5" />
        </button>

        <div className="text-center">
          <h1 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center justify-center gap-2">
            <Scale className="h-5 w-5 text-emerald-400" />
            <span>گزارش وزن و تصاویر پیشرفت</span>
          </h1>
          <p className="text-[11px] text-muted-foreground font-semibold">
            ثبت مداوم وزن بدن به همراه تصاویر مستند
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            triggerHaptic();
            setIsLogModalOpen(true);
          }}
          className="h-10 w-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center hover:bg-emerald-500/30 transition-colors cursor-pointer shadow-md shadow-emerald-500/20"
          title="ثبت وزن و عکس جدید"
        >
          <Plus className="h-5 w-5" />
        </button>
      </header>

      {/* 3 Compact Overview Cards: Current Weight, Baseline, Photos */}
      <div className="grid grid-cols-3 gap-2 sm:gap-2.5 mb-4">
        {/* Card 1: Current Weight */}
        <div className="p-3 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 shadow-[0_0_20px_rgba(16,185,129,0.15)] text-right">
          <div className="flex items-center justify-between text-[11px] text-emerald-400 font-bold mb-1">
            <span>وزن فعلی</span>
            <Scale className="h-3.5 w-3.5" />
          </div>
          <div className="text-lg sm:text-xl font-black text-foreground">
            {currentWeight} <span className="text-xs font-normal text-muted-foreground">kg</span>
          </div>
          <span className="text-[10px] font-bold block mt-0.5 text-emerald-400">
            {diffFromBase > 0 ? `+${diffFromBase}` : diffFromBase} kg تغییر
          </span>
        </div>

        {/* Card 2: Base Weight */}
        <div className="p-3 rounded-2xl border border-border/60 bg-muted/20 text-right">
          <div className="flex items-center justify-between text-[11px] text-muted-foreground font-bold mb-1">
            <span>وزن پایه</span>
            <TrendingUp className="h-3.5 w-3.5 text-slate-400" />
          </div>
          <div className="text-lg sm:text-xl font-black text-foreground">
            {baseWeight} <span className="text-xs font-normal text-muted-foreground">kg</span>
          </div>
          <span className="text-[10px] text-muted-foreground font-bold block mt-0.5">
            نقطه شروع
          </span>
        </div>

        {/* Card 3: Photos Logged */}
        <div className="p-3 rounded-2xl border border-border/60 bg-muted/20 text-right">
          <div className="flex items-center justify-between text-[11px] text-muted-foreground font-bold mb-1">
            <span>عکس‌ها</span>
            <Camera className="h-3.5 w-3.5 text-sky-400" />
          </div>
          <div className="text-lg sm:text-xl font-black text-foreground">
            {photosCount} <span className="text-xs font-normal text-muted-foreground">تصویر</span>
          </div>
          <span className="text-[10px] text-sky-400 font-bold block mt-0.5">
            مستندات بدنی
          </span>
        </div>
      </div>

      {/* Main Weight Trend Chart */}
      <div className="p-4 rounded-3xl bg-card dark:bg-[#07160e] border border-border dark:border-emerald-500/30 shadow-[0_15px_40px_rgba(0,0,0,0.5)] mb-4 space-y-3">
        <div className="flex items-center justify-between border-b border-border dark:border-emerald-500/20 pb-2">
          <div>
            <h3 className="text-sm font-black text-foreground flex items-center gap-2">
              <span>نمودار روند وزن بدن</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400">
                {currentWeight} کیلوگرم
              </span>
            </h3>
            <p className="text-[11px] text-muted-foreground font-semibold mt-0.5">
              {history.length > 1
                ? `${diffFromBase > 0 ? '+' : ''}${diffFromBase} کیلوگرم تغییر نسبت به وزن پایه`
                : 'رکورد مبنای شروع'}
            </p>
          </div>
          <span className="text-[10px] text-muted-foreground font-bold">هفتگی</span>
        </div>

        {/* SVG Interactive Chart */}
        <div className="w-full overflow-hidden relative">
          <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto">
            <defs>
              <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Horizontal Grid lines */}
            {[0.25, 0.5, 0.75].map((ratio) => {
              const y = paddingY + ratio * (chartHeight - paddingY * 2);
              return (
                <line
                  key={ratio}
                  x1={paddingX}
                  y1={y}
                  x2={chartWidth - paddingX}
                  y2={y}
                  stroke="currentColor"
                  strokeOpacity="0.1"
                  strokeDasharray="4 4"
                />
              );
            })}

            {/* Gradient Area Fill */}
            {areaD && (
              <path
                d={areaD}
                fill="url(#weightGrad)"
                className="transition-all duration-500"
              />
            )}

            {/* Main Trend Line */}
            {pathD && (
              <path
                d={pathD}
                fill="none"
                stroke="#10b981"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-all duration-500"
              />
            )}

            {/* Point circles & labels */}
            {points.map((pt: any, idx: number) => (
              <g key={idx}>
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r="5"
                  fill="#07160e"
                  stroke="#10b981"
                  strokeWidth="2.5"
                  className="transition-all duration-300"
                />
                <text
                  x={pt.x}
                  y={pt.y - 10}
                  textAnchor="middle"
                  fill="currentColor"
                  fontSize="11"
                  fontWeight="bold"
                >
                  {pt.val}
                </text>
                <text
                  x={pt.x}
                  y={chartHeight - 8}
                  textAnchor="middle"
                  fill="currentColor"
                  opacity="0.6"
                  fontSize="9"
                >
                  {pt.label}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>

      {/* Progress History & Photos Timeline */}
      <div className="p-4 rounded-3xl bg-card dark:bg-[#07160e] border border-border dark:border-emerald-500/30 shadow-[0_10px_30px_rgba(0,0,0,0.4)] space-y-3">
        <div className="flex items-center justify-between border-b border-border dark:border-emerald-500/20 pb-2">
          <h4 className="text-xs font-black text-foreground flex items-center gap-1.5">
            <Camera className="h-4 w-4 text-emerald-400" />
            <span>تاریخچه وزن و تصاویر پیشرفت</span>
          </h4>
          <span className="text-[10px] text-muted-foreground">{history.length} رکورد ثبت شده</span>
        </div>

        <div className="divide-y divide-border/40 text-xs">
          {history.map((row: WeightRecord, i: number) => {
            const hasPhoto = Boolean(row.photoUrl);
            const delta =
              i === 0
                ? 'پایه'
                : `${row.weight - (history[i - 1]?.weight || row.weight) > 0 ? '+' : ''}${
                    Math.round((row.weight - (history[i - 1]?.weight || row.weight)) * 10) / 10
                  } kg`;

            return (
              <div key={row.id || i} className="py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  {/* Photo thumbnail */}
                  {hasPhoto ? (
                    <div
                      onClick={() => setPreviewPhotoUrl(row.photoUrl!)}
                      className="relative h-12 w-12 rounded-xl overflow-hidden border border-emerald-500/40 bg-slate-900 cursor-pointer group shadow-sm shrink-0"
                      title="مشاهده تصویر پیشرفت"
                    >
                      <img
                        src={resolveMediaUrl(row.photoUrl!)}
                        alt={row.week}
                        className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Eye className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  ) : (
                    <div className="h-12 w-12 rounded-xl border border-dashed border-border bg-muted/20 flex items-center justify-center text-muted-foreground shrink-0">
                      <ImageIcon className="h-5 w-5 opacity-40" />
                    </div>
                  )}

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-foreground text-xs">{row.week}</span>
                      <span className="text-[10px] text-muted-foreground font-semibold">
                        {row.date}
                      </span>
                    </div>
                    {row.note && (
                      <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1">
                        {row.note}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-right">
                  <div>
                    <span className="text-sm font-black text-emerald-400 block font-mono">
                      {row.weight} kg
                    </span>
                    <span className="text-[10px] text-muted-foreground font-semibold block">
                      {delta}
                    </span>
                  </div>

                  {i > 0 && (
                    <button
                      type="button"
                      onClick={() => handleDeleteRecord(row.id)}
                      className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                      title="حذف این رکورد"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Log Measurement Modal (Weight + Photo ONLY) */}
      <AnimatePresence>
        {isLogModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in select-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-3xl bg-card dark:bg-[#07160e] border border-border dark:border-emerald-500/30 p-5 shadow-[0_25px_60px_rgba(0,0,0,0.8)] text-foreground dark:text-white space-y-4"
            >
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <Scale className="h-4 w-4" />
                  </div>
                  <h3 className="text-sm font-black">ثبت وزن بدن و عکس پیشرفت</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsLogModalOpen(false)}
                  className="h-8 w-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleSaveMeasurement} className="space-y-4 text-xs">
                {/* Weight Input */}
                <div>
                  <label className="font-bold block mb-1 text-slate-800 dark:text-slate-200">
                    وزن جدید بدن (کیلوگرم):
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={newWeight}
                      onChange={(e) => setNewWeight(e.target.value)}
                      placeholder={String(currentWeight || 72)}
                      className="w-full pr-3 pl-12 py-2.5 rounded-xl bg-muted/40 border border-border text-foreground font-mono text-sm font-bold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-bold">
                      kg
                    </span>
                  </div>
                </div>

                {/* Photo Upload Input */}
                <div>
                  <label className="font-bold block mb-1.5 text-slate-800 dark:text-slate-200">
                    عکس پیشرفت بدن (اختیاری):
                  </label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handlePhotoSelect}
                    className="hidden"
                  />

                  {newPhotoUrl ? (
                    <div className="relative rounded-2xl overflow-hidden border border-emerald-500/40 aspect-video bg-slate-900 group">
                      <img
                        src={resolveMediaUrl(newPhotoUrl)}
                        alt="پیش‌نمایش تصویر"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setNewPhotoUrl('')}
                        className="absolute top-2 left-2 h-7 w-7 rounded-full bg-black/70 hover:bg-rose-600 text-white flex items-center justify-center transition-colors cursor-pointer"
                        title="حذف تصویر"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/70 text-emerald-400 text-[10px] font-bold">
                        تصویر آماده ثبت
                      </span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploadingPhoto}
                      className="w-full py-6 px-4 rounded-2xl border-2 border-dashed border-border hover:border-emerald-500/60 bg-muted/20 hover:bg-emerald-500/5 transition-all flex flex-col items-center justify-center gap-2 cursor-pointer group"
                    >
                      <div className="h-10 w-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                        {isUploadingPhoto ? (
                          <div className="h-5 w-5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Camera className="h-5 w-5" />
                        )}
                      </div>
                      <span className="font-bold text-xs text-foreground">
                        {isUploadingPhoto ? 'در حال بارگذاری تصویر...' : 'انتخاب یا گرفتن عکس جدید'}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        فرمت‌های JPG، PNG و WEBP پشتیبانی می‌شوند
                      </span>
                    </button>
                  )}
                </div>

                {/* Optional Note */}
                <div>
                  <label className="font-bold block mb-1 text-slate-800 dark:text-slate-200">
                    یادداشت (اختیاری):
                  </label>
                  <input
                    type="text"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="مثلاً: وضعیت بدنی پس از تمرین استقامتی..."
                    className="w-full px-3 py-2 rounded-xl bg-muted/40 border border-border text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                {/* Actions */}
                <div className="pt-2 flex items-center gap-2">
                  <button
                    type="submit"
                    disabled={isUploadingPhoto}
                    className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    ثبت وزن و تصویر
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsLogModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-muted hover:bg-muted/80 text-muted-foreground font-bold text-xs cursor-pointer"
                  >
                    انصراف
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Full Photo Preview Lightbox */}
      <AnimatePresence>
        {previewPhotoUrl && (
          <div
            onClick={() => setPreviewPhotoUrl(null)}
            className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in cursor-pointer select-none"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-lg w-full rounded-3xl overflow-hidden bg-black border border-white/20 shadow-2xl"
            >
              <button
                type="button"
                onClick={() => setPreviewPhotoUrl(null)}
                className="absolute top-3 left-3 z-10 h-9 w-9 rounded-full bg-black/70 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
              <img
                src={resolveMediaUrl(previewPhotoUrl)}
                alt="تصویر پیشرفت"
                className="w-full max-h-[80vh] object-contain"
              />
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
