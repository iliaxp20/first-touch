import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { MicOff, X, RefreshCw } from 'lucide-react';

interface MicPermissionModalProps {
  isOpen: boolean;
  errorMessage: string | null;
  onClose: () => void;
  onRetry: () => void;
}

export const MicPermissionModal: React.FC<MicPermissionModalProps> = ({
  isOpen,
  errorMessage,
  onClose,
  onRetry,
}) => {
  if (!isOpen || !errorMessage) return null;

  return (
    <div
      dir="rtl"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in select-none"
    >
      <Card className="w-full max-w-sm p-5 bg-card border border-border shadow-2xl relative space-y-4 text-right">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-1.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          title="بستن"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Minimal Header */}
        <div className="flex items-center gap-3 pt-1">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/20 flex items-center justify-center shrink-0">
            <MicOff className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">
              خطای دسترسی به میکروفون
            </h3>
            <span className="text-[11px] text-muted-foreground">مرورگر گوگل کروم</span>
          </div>
        </div>

        {/* Pure Error Message Only */}
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold leading-relaxed">
          {errorMessage}
        </div>

        {/* Minimal Action Buttons */}
        <div className="flex items-center gap-2 pt-1">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            className="flex-1 text-xs"
          >
            بستن
          </Button>
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={onRetry}
            className="flex-1 gap-1.5 text-xs font-bold"
          >
            <RefreshCw className="h-3 w-3" />
            <span>تلاش مجدد</span>
          </Button>
        </div>
      </Card>
    </div>
  );
};
