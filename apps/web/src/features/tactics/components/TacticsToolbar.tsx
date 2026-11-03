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
  Maximize2,
  Minimize2,
  Check,
  MousePointer2,
  PenTool,
  MoveUpRight,
  Minus,
  Square,
  Circle,
  Trash2,
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
  isZenMode: boolean;
  onToggleZenMode: () => void;
}

const COLORS = [
  { name: 'زرد', value: '#facc15' },
  { name: 'قرمز', value: '#ef4444' },
  { name: 'آبی', value: '#3b82f6' },
  { name: 'سفید', value: '#ffffff' },
  { name: 'سبز', value: '#10b981' },
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
  isZenMode,
  onToggleZenMode,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const url = `${window.location.origin}/tactics/${boardId}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-2">
      {/* Top Main Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-card/85 backdrop-blur-md border border-border/80 px-4 py-2.5 rounded-2xl shadow-sm">
        {/* Title & Live Status */}
        <div className="flex items-center gap-3">
          <h2 className="text-sm sm:text-base font-black text-foreground">{title}</h2>

          {/* Real-time Viewers Badge (API WebSocket - Not fake) */}
          <button
            type="button"
            onClick={onOpenViewers}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-bold transition-colors cursor-pointer"
            title="مشاهده کاربران آنلاین روی تخته"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <Users className="h-3.5 w-3.5" />
            <span>{viewersCount} نفر آنلاین</span>
          </button>
        </div>

        {/* Action Buttons (Voice, Chat, Share, Zen) */}
        <div className="flex flex-wrap items-center gap-2">
          {/* WebRTC Voice Button */}
          {!isVoiceActive ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onToggleVoice}
              className="gap-1.5 text-xs text-foreground hover:border-emerald-500 hover:text-emerald-500"
              title="اتصال به گفتگوی صوتی زنده تیمی (WebRTC)"
            >
              <Mic className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">وویس تیمی</span>
            </Button>
          ) : (
            <div className="flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-1">
              <button
                type="button"
                onClick={onToggleMute}
                className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors ${
                  isMuted
                    ? 'bg-rose-500/15 text-rose-500 hover:bg-rose-500/25'
                    : 'bg-emerald-500 text-white'
                }`}
                title={isMuted ? 'میکروفون بسته است' : 'میکروفون باز است'}
              >
                {isMuted ? <MicOff className="h-3.5 w-3.5" /> : <Mic className="h-3.5 w-3.5 animate-pulse" />}
                <span className="text-[11px] hidden sm:inline">{isMuted ? 'بی‌صدا' : 'در حال پخش'}</span>
              </button>

              <button
                type="button"
                onClick={onToggleVoice}
                className="p-1 text-slate-400 hover:text-rose-500 rounded text-xs"
                title="قطع کامل وویس"
              >
                ✕
              </button>
            </div>
          )}

          {/* Live Chat Button */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onToggleChat}
            className="relative gap-1.5 text-xs text-foreground"
            title="چت متنی لحظه‌ای"
          >
            <MessageSquare className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">چت زنده</span>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-primary-foreground text-[10px] font-black flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </Button>

          {/* Share Link Button */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="gap-1.5 text-xs text-foreground"
            title="کپی لینک اختصاصی این تخته"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Share2 className="h-3.5 w-3.5" />}
            <span>{copied ? 'کپی شد' : 'اشتراک لینک'}</span>
          </Button>

          {/* Reset Board */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onResetBoard}
            className="p-2 text-muted-foreground hover:text-foreground"
            title="بازنشانی چیدمان مهره‌ها"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </Button>

          {/* Zen / Fullscreen Mode */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onToggleZenMode}
            className="p-2 text-muted-foreground hover:text-foreground"
            title={isZenMode ? 'خروج از تمام‌صفحه' : 'حالت تمام‌صفحه و پنهان‌سازی نوبار'}
          >
            {isZenMode ? <Minimize2 className="h-4 w-4 text-primary" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Sub-Toolbar: Tactical Tools (Pen, Arrow, Shapes, Colors, Clear) */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 bg-card/65 backdrop-blur-md border border-border/60 px-3 py-1.5 rounded-2xl text-xs">
        {/* Left: Tools Palette */}
        <div className="flex items-center gap-1">
          {/* Select / Move */}
          <button
            type="button"
            onClick={() => onChangeTool('select')}
            className={`p-1.5 rounded-xl flex items-center gap-1.5 font-bold transition-all ${
              activeTool === 'select'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
            title="جابجایی مهره‌ها و توپ"
          >
            <MousePointer2 className="h-3.5 w-3.5" />
            <span className="text-[11px] hidden sm:inline">حرکت مهره‌ها</span>
          </button>

          {/* Freehand Pen */}
          <button
            type="button"
            onClick={() => onChangeTool('pen')}
            className={`p-1.5 rounded-xl flex items-center gap-1.5 font-bold transition-all ${
              activeTool === 'pen'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
            title="رسم آزاد با قلم"
          >
            <PenTool className="h-3.5 w-3.5" />
            <span className="text-[11px] hidden sm:inline">قلم</span>
          </button>

          {/* Tactical Arrow */}
          <button
            type="button"
            onClick={() => onChangeTool('arrow')}
            className={`p-1.5 rounded-xl flex items-center gap-1.5 font-bold transition-all ${
              activeTool === 'arrow'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
            title="فلش مسیر حرکت یا پاس"
          >
            <MoveUpRight className="h-3.5 w-3.5" />
            <span className="text-[11px] hidden sm:inline">فلش</span>
          </button>

          {/* Line */}
          <button
            type="button"
            onClick={() => onChangeTool('line')}
            className={`p-1.5 rounded-xl flex items-center gap-1.5 font-bold transition-all ${
              activeTool === 'line'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
            title="خط مستقیم تاکتیکی"
          >
            <Minus className="h-3.5 w-3.5" />
            <span className="text-[11px] hidden sm:inline">خط</span>
          </button>

          {/* Rectangle (Box) */}
          <button
            type="button"
            onClick={() => onChangeTool('rect')}
            className={`p-1.5 rounded-xl flex items-center gap-1.5 font-bold transition-all ${
              activeTool === 'rect'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
            title="باکس / بلوک دفاعی"
          >
            <Square className="h-3.5 w-3.5" />
            <span className="text-[11px] hidden sm:inline">باکس</span>
          </button>

          {/* Circle (Pressing Zone) */}
          <button
            type="button"
            onClick={() => onChangeTool('circle')}
            className={`p-1.5 rounded-xl flex items-center gap-1.5 font-bold transition-all ${
              activeTool === 'circle'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
            title="منطقه پرس / دایره"
          >
            <Circle className="h-3.5 w-3.5" />
            <span className="text-[11px] hidden sm:inline">دایره</span>
          </button>
        </div>

        {/* Right: Colors & Clear */}
        <div className="flex items-center gap-2">
          {/* Colors */}
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-xl bg-muted/40 border border-border/40">
            {COLORS.map((c) => (
              <button
                key={c.value}
                type="button"
                onClick={() => onChangeColor(c.value)}
                style={{ backgroundColor: c.value }}
                className={`w-4 h-4 rounded-full border border-black/30 transition-transform ${
                  activeColor === c.value ? 'scale-125 ring-2 ring-primary ring-offset-1' : 'hover:scale-110 opacity-80'
                }`}
                title={c.name}
              />
            ))}
          </div>

          {/* Clear Drawings Button */}
          <button
            type="button"
            onClick={onClearDrawings}
            className="p-1.5 rounded-xl text-muted-foreground hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-1 text-[11px] font-bold transition-colors"
            title="پاک کردن تمامی خطوط و اشکال رسم شده"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">پاک‌کردن خطوط</span>
          </button>
        </div>
      </div>
    </div>
  );
};
