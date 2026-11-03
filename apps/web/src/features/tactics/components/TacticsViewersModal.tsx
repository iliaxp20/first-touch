import React from 'react';
import { ConnectedViewer } from '../types/tactics.types';
import { Card } from '@/components/ui/Card';
import { X, Users, Mic, MicOff, Volume2 } from 'lucide-react';

interface TacticsViewersModalProps {
  isOpen: boolean;
  onClose: () => void;
  viewers: ConnectedViewer[];
  currentUserId: string;
}

export const TacticsViewersModal: React.FC<TacticsViewersModalProps> = ({
  isOpen,
  onClose,
  viewers,
  currentUserId,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <Card className="w-full max-w-sm p-5 bg-card border-border shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-black text-foreground">حاضرین در تخته تاکتیک</h3>
            <p className="text-[11px] text-muted-foreground">
              {viewers.length} کاربر آنلاین بر بستر وب‌سوکت زنده
            </p>
          </div>
        </div>

        <div className="divide-y divide-border/60 max-h-72 overflow-y-auto -mx-1 px-1">
          {viewers.map((viewer) => {
            const isMe = viewer.id === currentUserId;
            return (
              <div key={viewer.id} className="py-2.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 border border-primary/20 text-primary font-bold flex items-center justify-center text-xs">
                      {viewer.name.charAt(0)}
                    </div>
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-card animate-pulse" />
                  </div>

                  <div>
                    <span className="font-bold text-foreground block">
                      {viewer.name} {isMe && <span className="text-primary text-[10px] font-normal">(شما)</span>}
                    </span>
                    {viewer.phone && (
                      <span className="text-[10px] text-muted-foreground font-mono block">
                        {viewer.phone.slice(0, 4)}***{viewer.phone.slice(-4)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {viewer.isSpeaking ? (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full animate-pulse">
                      <Volume2 className="h-3.5 w-3.5" />
                      در حال صحبت
                    </span>
                  ) : viewer.isMuted ? (
                    <span className="p-1.5 rounded-lg bg-muted text-muted-foreground" title="میکروفون بسته">
                      <MicOff className="h-3.5 w-3.5" />
                    </span>
                  ) : (
                    <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500" title="میکروفون فعال">
                      <Mic className="h-3.5 w-3.5" />
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};
