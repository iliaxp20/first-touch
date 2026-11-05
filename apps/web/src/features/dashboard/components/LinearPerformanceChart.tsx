import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Dumbbell, Apple } from 'lucide-react';

export interface DayPoint {
  day: string;
  workoutScore: number; // 0 - 100
  workoutMinutes: number;
  nutritionScore: number; // 0 - 100
  calories: number;
  isToday?: boolean;
}

interface LinearPerformanceChartProps {
  data?: DayPoint[];
  isLoading?: boolean;
}

const DEFAULT_WEEKLY_DATA: DayPoint[] = [
  { day: 'شنبه', workoutScore: 0, workoutMinutes: 0, nutritionScore: 0, calories: 0 },
  { day: 'یکشنبه', workoutScore: 0, workoutMinutes: 0, nutritionScore: 0, calories: 0 },
  { day: 'دوشنبه', workoutScore: 0, workoutMinutes: 0, nutritionScore: 0, calories: 0 },
  { day: 'سه‌شنبه', workoutScore: 0, workoutMinutes: 0, nutritionScore: 0, calories: 0 },
  { day: 'چهارشنبه', workoutScore: 0, workoutMinutes: 0, nutritionScore: 0, calories: 0 },
  { day: 'پنج‌شنبه', workoutScore: 0, workoutMinutes: 0, nutritionScore: 0, calories: 0 },
  { day: 'جمعه', workoutScore: 0, workoutMinutes: 0, nutritionScore: 0, calories: 0 },
];

export const LinearPerformanceChart: React.FC<LinearPerformanceChartProps> = ({
  data = DEFAULT_WEEKLY_DATA,
}) => {
  const chartPoints = data && data.length > 0 ? data : DEFAULT_WEEKLY_DATA;
  const [metric, setMetric] = useState<'workout' | 'nutrition'>('workout');

  const todayIndex = chartPoints.findIndex((p) => p.isToday);
  const defaultHoverIdx = todayIndex >= 0 ? todayIndex : chartPoints.length - 1;
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(defaultHoverIdx);

  // SVG coordinate calculations
  const width = 600;
  const height = 180;
  const paddingX = 40;
  const paddingY = 30;

  const getCoordinates = (points: DayPoint[]) => {
    const usableW = width - paddingX * 2;
    const usableH = height - paddingY * 2;
    const step = points.length > 1 ? usableW / (points.length - 1) : usableW;

    return points.map((p, i) => {
      const val = metric === 'workout' ? p.workoutScore : p.nutritionScore;
      const x = paddingX + i * step;
      const y = height - paddingY - (Math.min(100, Math.max(0, val)) / 100) * usableH;
      return { x, y, point: p, val };
    });
  };

  const coords = getCoordinates(chartPoints);

  // Build SVG smooth cubic bezier path
  const buildSmoothPath = (pts: { x: number; y: number }[]) => {
    if (pts.length === 0) return '';
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i];
      const p1 = pts[i + 1];
      const cx = (p0.x + p1.x) / 2;
      d += ` C ${cx} ${p0.y}, ${cx} ${p1.y}, ${p1.x} ${p1.y}`;
    }
    return d;
  };

  const linePath = buildSmoothPath(coords);
  const areaPath = `${linePath} L ${coords[coords.length - 1].x} ${height - paddingY} L ${coords[0].x} ${height - paddingY} Z`;

  const activeColor = metric === 'workout' ? '#8b5cf6' : '#10b981';
  const activeColorHex = metric === 'workout' ? 'rgb(139 92 246)' : 'rgb(16 185 129)';

  const activePoint =
    hoveredIdx !== null && coords[hoveredIdx]
      ? coords[hoveredIdx]
      : coords[coords.length - 1] || coords[0];

  return (
    <div className="rounded-3xl bg-card border border-border/80 p-5 sm:p-6 shadow-sm space-y-4">
      {/* Chart Top Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center transition-colors"
            style={{
              backgroundColor: metric === 'workout' ? 'rgba(139, 92, 246, 0.12)' : 'rgba(16, 185, 129, 0.12)',
              color: activeColor,
            }}
          >
            {metric === 'workout' ? <Dumbbell className="h-5 w-5" /> : <Apple className="h-5 w-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-black text-foreground">
                {metric === 'workout' ? 'نمودار خطی بار تمرینات هفتگی' : 'نمودار خطی ثبات انرژی و تغذیه'}
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                ۷ روز اخیر
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {metric === 'workout'
                ? 'نمودار پیوسته دقایق و فشار تمرینات روزانه'
                : 'روند پایبندی به کالری و سوخت‌رسانی عضلانی'}
            </p>
          </div>
        </div>

        {/* Minimal Pill Switcher */}
        <div className="flex items-center p-1 rounded-2xl bg-muted/70 border border-border/60 text-xs font-bold">
          <button
            type="button"
            onClick={() => setMetric('workout')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              metric === 'workout'
                ? 'bg-card text-purple-600 dark:text-purple-400 shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            تمرینات
          </button>
          <button
            type="button"
            onClick={() => setMetric('nutrition')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              metric === 'nutrition'
                ? 'bg-card text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            تغذیه
          </button>
        </div>
      </div>

      {/* Hovered Point Detail Callout (Linear Minimal) */}
      <div className="flex items-center justify-between px-2 py-1.5 rounded-xl bg-muted/40 border border-border/50 text-xs">
        <span className="font-bold text-foreground flex items-center gap-1.5">
          <span
            className="w-2.5 h-2.5 rounded-full animate-pulse"
            style={{ backgroundColor: activeColor }}
          />
          <span>{activePoint.point.day}</span>
          {activePoint.point.isToday && (
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-primary/10 text-primary font-bold">
              امروز
            </span>
          )}
        </span>

        <span className="font-semibold text-muted-foreground">
          {metric === 'workout' ? (
            <>
              شاخص بار تمرین: <strong className="text-foreground">{activePoint.val}٪</strong> (
              {activePoint.point.workoutMinutes} دقیقه فعالیت)
            </>
          ) : (
            <>
              تحقق رژیم: <strong className="text-foreground">{activePoint.val}٪</strong> (
              {activePoint.point.calories.toLocaleString('fa-IR')} kcal)
            </>
          )}
        </span>
      </div>

      {/* Pure Smooth Linear SVG Graph */}
      <div className="relative w-full overflow-hidden select-none">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-44 sm:h-52 overflow-visible"
        >
          <defs>
            <linearGradient id="linearChartGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={activeColorHex} stopOpacity="0.28" />
              <stop offset="100%" stopColor={activeColorHex} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Horizontal Reference Grid Lines */}
          <line
            x1={paddingX}
            y1={height - paddingY - 120}
            x2={width - paddingX}
            y2={height - paddingY - 120}
            stroke="currentColor"
            className="text-border/40"
            strokeDasharray="4 4"
          />
          <line
            x1={paddingX}
            y1={height - paddingY - 60}
            x2={width - paddingX}
            y2={height - paddingY - 60}
            stroke="currentColor"
            className="text-border/40"
            strokeDasharray="4 4"
          />
          <line
            x1={paddingX}
            y1={height - paddingY}
            x2={width - paddingX}
            y2={height - paddingY}
            stroke="currentColor"
            className="text-border/60"
          />

          {/* Area Fill */}
          <motion.path
            key={`area-${metric}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            d={areaPath}
            fill="url(#linearChartGrad)"
          />

          {/* Main Gradient Line */}
          <motion.path
            key={`line-${metric}`}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            d={linePath}
            fill="none"
            stroke={activeColor}
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Interactive Points on Line */}
          {coords.map((c, i) => {
            const isHovered = hoveredIdx === i;
            return (
              <g
                key={i}
                className="cursor-pointer transition-transform"
                onMouseEnter={() => setHoveredIdx(i)}
                onClick={() => setHoveredIdx(i)}
              >
                {/* Invisible hover hotspot */}
                <circle cx={c.x} cy={c.y} r="18" fill="transparent" />

                {/* Point ring */}
                <circle
                  cx={c.x}
                  cy={c.y}
                  r={isHovered ? 7 : 4.5}
                  fill="#ffffff"
                  stroke={activeColor}
                  strokeWidth={isHovered ? 3.5 : 2.5}
                  className="transition-all duration-200"
                />

                {/* Day label below baseline */}
                <text
                  x={c.x}
                  y={height - paddingY + 20}
                  textAnchor="middle"
                  className={`text-[11px] font-bold ${
                    c.point.isToday
                      ? 'fill-foreground font-black'
                      : isHovered
                      ? 'fill-foreground'
                      : 'fill-muted-foreground'
                  }`}
                >
                  {c.point.day}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};
