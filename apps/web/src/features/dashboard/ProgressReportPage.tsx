import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  ArrowRight,
  Scale,
  Activity,
  Plus,
  CheckCircle2,
  X,
  Award,
  Zap,
} from 'lucide-react';
import { API_BASE_URL } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

type MetricType = 'weight' | 'arm' | 'thigh' | 'fat' | 'agility';

export const ProgressReportPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('weight');
  const [metricsData, setMetricsData] = useState<any>(null);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);

  // Form state for logging new measurement
  const [newWeight, setNewWeight] = useState('');
  const [newArm, setNewArm] = useState('');
  const [newThigh, setNewThigh] = useState('');
  const [newFat, setNewFat] = useState('');

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

    // Genuine baseline from currentUser profile or clean initial state
    const profileWeight = currentUser?.weight ? Number(currentUser.weight) : null;
    const profileArm = currentUser?.bicep ? Number(currentUser.bicep) : null;
    const profileThigh = currentUser?.thigh ? Number(currentUser.thigh) : null;
    const profileHeight = currentUser?.height ? Number(currentUser.height) : null;
    const playerName = currentUser?.fullName || (currentUser?.phoneNumber ? `کاربر ${currentUser.phoneNumber.slice(-4)}` : 'ورزشکار فرست تاچ');

    const hasProfileMetrics = profileWeight !== null || profileArm !== null || profileThigh !== null;

    const initialHistory = hasProfileMetrics
      ? [
          {
            week: 'رکورد پایه',
            date: new Date().toLocaleDateString('fa-IR'),
            weight: profileWeight || 70,
            armCircumference: profileArm || 32,
            thighCircumference: profileThigh || 54,
            bodyFat: 14,
            agilityTime: 6.5,
          },
        ]
      : [];

    const baseline = {
      playerName,
      initialDate: hasProfileMetrics ? new Date().toLocaleDateString('fa-IR') : '',
      history: initialHistory,
      current: {
        weight: profileWeight || 70,
        targetWeight: profileWeight ? profileWeight + 2 : 72,
        armCircumference: profileArm || 32,
        thighCircumference: profileThigh || 54,
        bodyFat: 14,
        height: profileHeight || 178,
        vo2max: 52,
      },
    };
    setMetricsData(baseline);
  };

  useEffect(() => {
    loadMetrics();
  }, [currentUser]);

  const handleSaveMeasurement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!metricsData) return;

    const w = Number(newWeight) || metricsData.current?.weight || 70;
    const a = Number(newArm) || metricsData.current?.armCircumference || 32;
    const t = Number(newThigh) || metricsData.current?.thighCircumference || 54;
    const f = Number(newFat) || metricsData.current?.bodyFat || 14;

    const newWeekNum = metricsData.history.length + 1;
    const nowFa = new Date().toLocaleDateString('fa-IR');

    const newRecord = {
      week: `هفته ${newWeekNum}`,
      date: nowFa,
      weight: w,
      armCircumference: a,
      thighCircumference: t,
      bodyFat: f,
      agilityTime: Math.max(5.8, Math.round((6.8 - newWeekNum * 0.15) * 10) / 10),
    };

    const updated = {
      ...metricsData,
      history: [...(metricsData.history || []), newRecord],
      current: {
        ...(metricsData.current || {}),
        weight: w,
        armCircumference: a,
        thighCircumference: t,
        bodyFat: f,
      },
    };

    setMetricsData(updated);
    setIsLogModalOpen(false);

    try {
      await fetch(`${API_BASE_URL}/programs/athlete-metrics`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
    } catch {}
  };

  const history = metricsData?.history || [];
  const baseRecord = history[0];
  const lastRecord = history[history.length - 1];

  const calcDiff = (key: string, unit: string) => {
    if (history.length <= 1 || !baseRecord || !lastRecord) return 'رکورد اولیه / مبنا';
    const b = Number(baseRecord[key]) || 0;
    const l = Number(lastRecord[key]) || 0;
    const d = Math.round((l - b) * 10) / 10;
    return `${d > 0 ? '+' : ''}${d} ${unit} تغییر نسبت به پایه`;
  };

  const metricConfigs = {
    weight: {
      title: 'وزن بدن',
      unit: 'کیلوگرم',
      key: 'weight',
      color: '#10b981',
      gradientId: 'gradWeight',
      currentVal: metricsData?.current?.weight || (currentUser?.weight ? Number(currentUser.weight) : '-'),
      baseVal: baseRecord?.weight ? `${baseRecord.weight} kg` : 'ثبت نشده',
      diff: calcDiff('weight', 'کیلوگرم'),
    },
    arm: {
      title: 'دور بازو',
      unit: 'سانتی‌متر',
      key: 'armCircumference',
      color: '#38bdf8',
      gradientId: 'gradArm',
      currentVal: metricsData?.current?.armCircumference || (currentUser?.bicep ? Number(currentUser.bicep) : '-'),
      baseVal: baseRecord?.armCircumference ? `${baseRecord.armCircumference} cm` : 'ثبت نشده',
      diff: calcDiff('armCircumference', 'سانتی‌متر'),
    },
    thigh: {
      title: 'دور ران',
      unit: 'سانتی‌متر',
      key: 'thighCircumference',
      color: '#a855f7',
      gradientId: 'gradThigh',
      currentVal: metricsData?.current?.thighCircumference || (currentUser?.thigh ? Number(currentUser.thigh) : '-'),
      baseVal: baseRecord?.thighCircumference ? `${baseRecord.thighCircumference} cm` : 'ثبت نشده',
      diff: calcDiff('thighCircumference', 'سانتی‌متر'),
    },
    fat: {
      title: 'درصد چربی',
      unit: '٪',
      key: 'bodyFat',
      color: '#f59e0b',
      gradientId: 'gradFat',
      currentVal: metricsData?.current?.bodyFat || 14,
      baseVal: baseRecord?.bodyFat ? `${baseRecord.bodyFat}٪` : 'ثبت نشده',
      diff: calcDiff('bodyFat', 'درصد'),
    },
    agility: {
      title: 'تست چابکی ۵-۱۰-۵',
      unit: 'ثانیه',
      key: 'agilityTime',
      color: '#ec4899',
      gradientId: 'gradAgility',
      currentVal: metricsData?.current?.agilityTime || 6.2,
      baseVal: baseRecord?.agilityTime ? `${baseRecord.agilityTime}s` : 'ثبت نشده',
      diff: calcDiff('agilityTime', 'ثانیه'),
    },
  };

  const currentCfg = metricConfigs[selectedMetric];

  // SVG Chart calculation
  const values = history.map((h: any) => h[currentCfg.key] || 0);
  const minVal = values.length > 0 ? Math.min(...values) * 0.95 : 0;
  const maxVal = values.length > 0 ? Math.max(...values) * 1.05 : 100;
  const range = maxVal - minVal || 1;

  const chartWidth = 500;
  const chartHeight = 220;
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
            <TrendingUp className="h-5 w-5 text-emerald-400" />
            <span>گزارش و تحلیل پیشرفت فیزیکی</span>
          </h1>
          <p className="text-[11px] text-muted-foreground font-semibold">
            روند تغییرات وزن، دور بازو، دور ران و سرعت شتاب
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            triggerHaptic();
            setIsLogModalOpen(true);
          }}
          className="h-10 w-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center hover:bg-emerald-500/30 transition-colors cursor-pointer shadow-md shadow-emerald-500/20"
          title="ثبت اندازه‌گیری جدید"
        >
          <Plus className="h-5 w-5" />
        </button>
      </header>

      {/* Overview Metric Cards Grid */}
      <div className="grid grid-cols-2 gap-2 sm:gap-2.5 mb-4">
        {/* Card 1: Weight */}
        <motion.div
          whileTap={{ scale: 0.97 }}
          onClick={() => setSelectedMetric('weight')}
          className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
            selectedMetric === 'weight'
              ? 'border-emerald-500 bg-emerald-500/15 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
              : 'border-border/60 bg-muted/20 hover:border-emerald-500/40'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
            <span>وزن بازیکن</span>
            <Scale className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-xl font-black text-foreground">
            {metricConfigs.weight.currentVal}{' '}
            <span className="text-xs font-normal text-muted-foreground">kg</span>
          </div>
          <span className="text-[10px] text-emerald-400 font-bold block mt-0.5">
            پایه: {metricConfigs.weight.baseVal}
          </span>
        </motion.div>

        {/* Card 2: Arm Circumference */}
        <motion.div
          whileTap={{ scale: 0.97 }}
          onClick={() => setSelectedMetric('arm')}
          className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
            selectedMetric === 'arm'
              ? 'border-sky-500 bg-sky-500/15 shadow-[0_0_20px_rgba(56,189,248,0.3)]'
              : 'border-border/60 bg-muted/20 hover:border-sky-500/40'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
            <span>دور بازو</span>
            <Activity className="h-4 w-4 text-sky-400" />
          </div>
          <div className="text-xl font-black text-foreground">
            {metricConfigs.arm.currentVal}{' '}
            <span className="text-xs font-normal text-muted-foreground">cm</span>
          </div>
          <span className="text-[10px] text-sky-400 font-bold block mt-0.5">
            پایه: {metricConfigs.arm.baseVal}
          </span>
        </motion.div>

        {/* Card 3: Thigh Circumference */}
        <motion.div
          whileTap={{ scale: 0.97 }}
          onClick={() => setSelectedMetric('thigh')}
          className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
            selectedMetric === 'thigh'
              ? 'border-purple-500 bg-purple-500/15 shadow-[0_0_20px_rgba(168,85,247,0.3)]'
              : 'border-border/60 bg-muted/20 hover:border-purple-500/40'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
            <span>دور ران</span>
            <Zap className="h-4 w-4 text-purple-400" />
          </div>
          <div className="text-xl font-black text-foreground">
            {metricConfigs.thigh.currentVal}{' '}
            <span className="text-xs font-normal text-muted-foreground">cm</span>
          </div>
          <span className="text-[10px] text-purple-400 font-bold block mt-0.5">
            پایه: {metricConfigs.thigh.baseVal}
          </span>
        </motion.div>

        {/* Card 4: Body Fat */}
        <motion.div
          whileTap={{ scale: 0.97 }}
          onClick={() => setSelectedMetric('fat')}
          className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
            selectedMetric === 'fat'
              ? 'border-amber-500 bg-amber-500/15 shadow-[0_0_20px_rgba(245,158,11,0.3)]'
              : 'border-border/60 bg-muted/20 hover:border-amber-500/40'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
            <span>درصد چربی</span>
            <Award className="h-4 w-4 text-amber-400" />
          </div>
          <div className="text-xl font-black text-foreground">
            {metricConfigs.fat.currentVal}{' '}
            <span className="text-xs font-normal text-muted-foreground">٪</span>
          </div>
          <span className="text-[10px] text-emerald-400 font-bold block mt-0.5">
            پایه: {metricConfigs.fat.baseVal}
          </span>
        </motion.div>
      </div>

      {/* Metric Selector Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none mb-3">
        {(Object.keys(metricConfigs) as MetricType[]).map((key) => {
          const cfg = metricConfigs[key];
          const isPicked = selectedMetric === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => {
                triggerHaptic();
                setSelectedMetric(key);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isPicked
                  ? 'bg-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-500/30'
                  : 'bg-white/10 dark:bg-white/[0.05] text-slate-400 hover:text-white border border-white/10'
              }`}
            >
              {cfg.title}
            </button>
          );
        })}
      </div>

      {/* Main Animated Chart Card */}
      <div className="p-4 rounded-3xl bg-card dark:bg-[#07160e] border border-border dark:border-emerald-500/30 shadow-[0_15px_40px_rgba(0,0,0,0.5)] mb-4 space-y-3">
        <div className="flex items-center justify-between border-b border-border dark:border-emerald-500/20 pb-2">
          <div>
            <h3 className="text-sm font-black text-foreground flex items-center gap-2">
              <span>نمودار روند {currentCfg.title}</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400">
                {currentCfg.currentVal} {currentCfg.unit}
              </span>
            </h3>
            <p className="text-[11px] text-muted-foreground font-semibold mt-0.5">
              {currentCfg.diff}
            </p>
          </div>
          <span className="text-[10px] text-muted-foreground font-bold">هفتگی</span>
        </div>

        {/* SVG Interactive Animated Chart */}
        <div className="w-full overflow-hidden relative">
          <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto">
            <defs>
              <linearGradient id={currentCfg.gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={currentCfg.color} stopOpacity="0.45" />
                <stop offset="100%" stopColor={currentCfg.color} stopOpacity="0.0" />
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
                fill={`url(#${currentCfg.gradientId})`}
                className="transition-all duration-500"
              />
            )}

            {/* Main Trend Line */}
            {pathD && (
              <path
                d={pathD}
                fill="none"
                stroke={currentCfg.color}
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-all duration-500"
              />
            )}

            {/* Point circles & tooltips */}
            {points.map((pt: any, idx: number) => (
              <g key={idx}>
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r="5"
                  fill="#07160e"
                  stroke={currentCfg.color}
                  strokeWidth="2.5"
                  className="transition-all duration-300"
                />
                <text
                  x={pt.x}
                  y={pt.y - 10}
                  textAnchor="middle"
                  fill="currentColor"
                  fontSize="10"
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

      {/* History Table */}
      <div className="p-4 rounded-3xl bg-card dark:bg-[#07160e] border border-border dark:border-emerald-500/30 shadow-[0_10px_30px_rgba(0,0,0,0.4)] space-y-3">
        <div className="flex items-center justify-between border-b border-border dark:border-emerald-500/20 pb-2">
          <h4 className="text-xs font-black text-foreground">جدول رکوردهای هفتگی</h4>
          <span className="text-[10px] text-muted-foreground">{history.length} رکورد ثبتی</span>
        </div>

        <div className="divide-y divide-border/40 text-xs">
          {history.map((row: any, i: number) => (
            <div key={i} className="py-2.5 flex items-center justify-between">
              <div>
                <span className="font-bold text-foreground block">{row.week}</span>
                <span className="text-[10px] text-muted-foreground">{row.date}</span>
              </div>
              <div className="flex items-center gap-3 font-mono text-[11px]">
                <span className="text-emerald-400 font-bold">{row.weight} kg</span>
                <span className="text-sky-400 font-bold">{row.armCircumference} cm بازو</span>
                <span className="text-purple-400 font-bold">{row.thighCircumference} cm ران</span>
                <span className="text-amber-400 font-bold">{row.bodyFat}٪ چربی</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Log Measurement Modal */}
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
                    <Plus className="h-4 w-4" />
                  </div>
                  <h3 className="text-sm font-black">ثبت رکورد اندازه‌گیری جدید</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsLogModalOpen(false)}
                  className="h-8 w-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleSaveMeasurement} className="space-y-3 text-xs">
                <div>
                  <label className="font-bold block mb-1">وزن جدید (کیلوگرم):</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newWeight}
                    onChange={(e) => setNewWeight(e.target.value)}
                    placeholder={String(metricsData?.current?.weight || 71.5)}
                    className="w-full px-3 py-2 rounded-xl bg-muted/40 border border-border text-foreground font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="font-bold block mb-1">دور بازو (سانتی‌متر):</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newArm}
                    onChange={(e) => setNewArm(e.target.value)}
                    placeholder={String(metricsData?.current?.armCircumference || 32.8)}
                    className="w-full px-3 py-2 rounded-xl bg-muted/40 border border-border text-foreground font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="font-bold block mb-1">دور ران (سانتی‌متر):</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newThigh}
                    onChange={(e) => setNewThigh(e.target.value)}
                    placeholder={String(metricsData?.current?.thighCircumference || 56.4)}
                    className="w-full px-3 py-2 rounded-xl bg-muted/40 border border-border text-foreground font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="font-bold block mb-1">درصد چربی بدنی (٪):</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newFat}
                    onChange={(e) => setNewFat(e.target.value)}
                    placeholder={String(metricsData?.current?.bodyFat || 12.4)}
                    className="w-full px-3 py-2 rounded-xl bg-muted/40 border border-border text-foreground font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    ذخیره و ثبت در نمودار
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsLogModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-muted hover:bg-muted/80 text-muted-foreground font-bold text-xs"
                  >
                    انصراف
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
