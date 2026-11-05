import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { TacticalTool } from '../types/tactics.types';
import {
  Share2,
  Users,
  RotateCcw,
  Mic,
  MicOff,
  MessageSquare,
  Check,
  Save,
  ArrowRight,
  MousePointer2,
  PenTool,
  MoveUpRight,
  Minus,
  Square,
  Circle,
  Trash2,
  RotateCw,
  Lock,
  Eraser,
} from 'lucide-react';

interface TacticsToolbarProps {
  title: string;
  boardId: string;
  viewersCount: number;
  activeTool: TacticalTool;
  onChangeTool: (tool: TacticalTool) => void;
  activeColor: string;
  onChangeColor: (color: string) => void;
  onClearDrawings: () => void;
  onOpenViewers: () => void;
  onToggleChat: () => void;
  unreadCount?: number;
  isVoiceActive: boolean;
  isMuted: boolean;
  onToggleVoice: () => void;
  onToggleMute: () => void;
  onResetBoard: () => void;
  isMobileLandscape?: boolean;
  onToggleMobileLandscape?: () => void;
  isCreator?: boolean;
  onSaveBoard?: () => void;
  isSaved?: boolean;
  onBack?: () => void;
}

const COLORS = [
  { name: 'زرد', value: '#facc15' },
  { name: 'قرمز', value: '#ef4444' },
  { name: 'آبی', value: '#3b82f6' },
  { name: 'سفید', value: '#ffffff' },
  { name: 'سبز', value: '#10b981' },
];

const TOOLS: { key: TacticalTool; label: string; icon: React.ElementType }[] = [
  { key: 'select', label: 'مهره‌ها', icon: MousePointer2 },
  { key: 'pen', label: 'قلم آزاد', icon: PenTool },
  { key: 'arrow', label: 'فلش', icon: MoveUpRight },
  { key: 'line', label: 'خط', icon: Minus },
  { key: 'rect', label: 'ناحیه', icon: Square },
  { key: 'circle', label: 'کانون', icon: Circle },
  { key: 'eraser', label: 'پاک‌کن', icon: Eraser },
];

export const TacticsToolbar: React.FC<TacticsToolbarProps> = ({
  title,
  boardId,
  viewersCount,
  activeTool,
  onChangeTool,
  activeColor,
  onChangeColor,
  onClearDrawings,
  onOpenViewers,
  onToggleChat,
  unreadCount = 0,
  isVoiceActive,
  isMuted,
  onToggleVoice,
  onToggleMute,
  onResetBoard,
  isMobileLandscape = false,
  onToggleMobileLandscape,
  isCreator = true,
  onSaveBoard,
  isSaved = false,
  onBack,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const url = `${window.location.origin}/tactics/${boardId}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-2 select-none">
      {/* 1. Top Card: Title Bar & Action Controls */}
      <div className="bg-card/90 backdrop-blur-md border border-border/80 p-2.5 sm:px-4 sm:py-3 rounded-2xl shadow-sm space-y-2.5">
        {/* Row 1: Back, Title, Viewers Badge, Fullscreen Button */}
        <div className="flex items-center justify-between gap-2">
          {/* Back & Board Title */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0">
            {onBack && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="h-8 w-8 p-0 rounded-xl text-muted-foreground hover:text-foreground shrink-0"
                title="بازگشت به لیست تخته‌ها"
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}

            <h2 className="text-xs sm:text-base font-black text-foreground truncate max-w-[180px] sm:max-w-md">
              {title}
            </h2>
          </div>

          {/* Right: Viewers Count & Mobile Landscape Rotate Button */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={onOpenViewers}
              className="flex items-center gap-1 px-2 py-1 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[11px] font-bold transition-colors cursor-pointer"
              title="مشاهده کاربران آنلاین روی تخته"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <Users className="h-3 w-3" />
              <span>{viewersCount} نفر</span>
            </button>

            {/* Mobile Only: Rotate Landscape Toggle */}
            {onToggleMobileLandscape && (
              <button
                type="button"
                onClick={onToggleMobileLandscape}
                className={`sm:hidden flex items-center gap-1 px-2.5 py-1 rounded-xl border text-[11px] font-bold transition-all ${
                  isMobileLandscape
                    ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                    : 'bg-muted/70 hover:bg-muted text-foreground border-border'
                }`}
                title={isMobileLandscape ? 'بازگشت به حالت عادی' : 'چرخش تخته به حالت افقی (Landscape)'}
              >
                <RotateCw className={`h-3 w-3 ${isMobileLandscape ? 'text-primary-foreground' : 'text-primary'}`} />
                <span>{isMobileLandscape ? 'عمودی' : 'افقی'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Row 2: Equal Action Buttons with Icons & Text (Save, Voice, Chat, Share, Reset) */}
        <div className="grid grid-cols-5 gap-1.5">
          {/* 1. Save Button */}
          <button
            type="button"
            onClick={onSaveBoard}
            className={`h-8 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 transition-all ${
              isSaved
                ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-600 dark:text-emerald-400'
                : 'bg-primary text-primary-foreground shadow-sm hover:opacity-90'
            }`}
            title="ذخیره وضعیت مهره‌ها و طراحی‌ها"
          >
            {isSaved ? <Check className="h-3.5 w-3.5" /> : <Save className="h-3.5 w-3.5" />}
            <span>{isSaved ? 'ذخیره شد' : 'ذخیره'}</span>
          </button>

          {/* 2. Voice Button (Active for Creator only) */}
          {!isVoiceActive ? (
            isCreator ? (
              <button
                type="button"
                onClick={onToggleVoice}
                className="h-8 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 border border-border bg-background hover:bg-muted text-foreground transition-colors"
                title="اتصال به گفتگوی صوتی زنده (مربی)"
              >
                <Mic className="h-3.5 w-3.5 text-muted-foreground" />
                <span>وویس</span>
              </button>
            ) : (
              <button
                type="button"
                disabled
                className="h-8 rounded-xl text-[10px] font-bold flex items-center justify-center gap-1 border border-border/50 bg-muted/40 text-muted-foreground/60 cursor-not-allowed opacity-75"
                title="تنها مربی و سازنده این تخته می‌تواند گفتگوی صوتی را باز کند"
              >
                <Lock className="h-3 w-3 text-muted-foreground" />
                <span>وویس مربی</span>
              </button>
            )
          ) : (
            <div className="h-8 rounded-xl flex items-center justify-between p-0.5 bg-emerald-500/10 border border-emerald-500/30">
              <button
                type="button"
                onClick={onToggleMute}
                className={`flex-1 h-full rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 ${
                  isMuted ? 'text-rose-500' : 'bg-emerald-500 text-white'
                }`}
                title={isMuted ? 'میکروفون بسته است' : 'میکروفون باز است'}
              >
                {isMuted ? <MicOff className="h-3 w-3" /> : <Mic className="h-3 w-3 animate-pulse" />}
                <span>{isMuted ? 'بی‌صدا' : 'صدا باز'}</span>
              </button>
              {isCreator && (
                <button
                  type="button"
                  onClick={onToggleVoice}
                  className="w-5 text-slate-400 hover:text-rose-500 text-xs font-bold"
                  title="قطع وویس تخته"
                >
                  ✕
                </button>
              )}
            </div>
          )}

          {/* 3. Chat Button */}
          <button
            type="button"
            onClick={onToggleChat}
            className="relative h-8 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 border border-border bg-background hover:bg-muted text-foreground transition-colors"
            title="چت زنده با اعضای تیم"
          >
            <MessageSquare className="h-3.5 w-3.5 text-muted-foreground" />
            <span>چت زنده</span>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-primary text-primary-foreground text-[9px] font-black flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {/* 4. Share Link Button */}
          <button
            type="button"
            onClick={handleCopy}
            className="h-8 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 border border-border bg-background hover:bg-muted text-foreground transition-colors"
            title="کپی لینک اختصاصی تخته"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400">کپی شد</span>
              </>
            ) : (
              <>
                <Share2 className="h-3.5 w-3.5 text-muted-foreground" />
                <span>اشتراک</span>
              </>
            )}
          </button>

          {/* 5. Reset Board Button */}
          <button
            type="button"
            onClick={onResetBoard}
            className="h-8 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 border border-border bg-background hover:bg-muted text-foreground transition-colors"
            title="بازنشانی مهره‌ها به چیدمان اولیه"
          >
            <RotateCcw className="h-3.5 w-3.5 text-muted-foreground" />
            <span>بازنشانی</span>
          </button>
        </div>
      </div>

      {/* 2. Sub-Toolbar: Tactical Tools Palette with Icons & Persian Labels */}
      <div className="bg-card/85 backdrop-blur-md border border-border/80 p-2 sm:p-2.5 rounded-2xl shadow-sm space-y-2">
        {/* Row A: 7 Tools Grid with both Icons AND Persian text */}
        <div className="grid grid-cols-7 gap-1">
          {TOOLS.map((t) => {
            const Icon = t.icon;
            const isActive = activeTool === t.key;
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => onChangeTool(t.key)}
                className={`flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1.5 py-1.5 sm:py-1 px-1 rounded-xl font-bold transition-all ${
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-sm scale-[1.02]'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
                title={t.label}
              >
                <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="text-[10px] sm:text-xs leading-none">{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Row B: Colors & Clear Action (No empty gaps) */}
        <div className="flex items-center justify-between gap-2 pt-1.5 border-t border-border/50 text-xs">
          {/* Right: Color Selection */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] sm:text-[11px] font-bold text-muted-foreground">
              رنگ رسم:
            </span>
            <div className="flex items-center gap-1 sm:gap-1.5">
              {COLORS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => onChangeColor(c.value)}
                  style={{ backgroundColor: c.value }}
                  className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border transition-all ${
                    activeColor === c.value
                      ? 'border-foreground scale-110 ring-2 ring-primary/40 shadow-sm'
                      : 'border-black/20 hover:scale-105'
                  }`}
                  title={`رنگ ${c.name}`}
                />
              ))}
            </div>
          </div>

          {/* Left: Clear All Drawings */}
          <button
            type="button"
            onClick={onClearDrawings}
            className="flex items-center gap-1 px-2 py-1 rounded-xl text-rose-500 hover:bg-rose-500/10 text-[10px] sm:text-[11px] font-bold transition-colors"
            title="پاک کردن تمام خطوط و اشکال رسم‌شده"
          >
            <Trash2 className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            <span>پاکسازی خطوط</span>
          </button>
        </div>
      </div>
    </div>
  );
};
