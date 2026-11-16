import React from 'react';
import { X, Play } from 'lucide-react';
import { resolveMediaUrl } from '@/lib/api';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  videoUrl: string;
}

export const VideoModal: React.FC<VideoModalProps> = ({
  isOpen,
  onClose,
  title,
  videoUrl,
}) => {
  if (!isOpen || !videoUrl) return null;

  const resolved = resolveMediaUrl(videoUrl);

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in select-none"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl rounded-2xl bg-[#07130b] border border-emerald-500/30 shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-black/40">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Play className="w-3.5 h-3.5 fill-current" />
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-white truncate">
              {title || 'نمایش ویدیوی تمرین'}
            </h4>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Video Player */}
        <div className="relative w-full aspect-video bg-black flex items-center justify-center">
          <video
            key={resolved}
            src={resolved}
            controls
            autoPlay
            playsInline
            preload="auto"
            className="w-full h-full object-contain"
          >
            مرورگر شما از پخش مستقیم ویدیو پشتیبانی نمی‌کند.
          </video>
        </div>

        {/* Footer with URL copy */}
        <div className="p-3 bg-black/50 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
          <span className="truncate max-w-[80%] font-mono text-[10px] text-slate-500">
            {resolved}
          </span>
          <button
            type="button"
            onClick={() => {
              navigator.clipboard?.writeText(resolved);
              alert('لینک ویدیو کپی شد');
            }}
            className="text-emerald-400 hover:text-emerald-300 font-bold cursor-pointer shrink-0"
          >
            کپی آدرس ویدیو
          </button>
        </div>
      </div>
    </div>
  );
};
