import React, { useState, useEffect } from 'react';
import { TacticalPlayer } from '../types/tactics.types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { X, UserCheck } from 'lucide-react';

interface EditPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  player: TacticalPlayer | null;
  onSave: (playerId: string, name: string, number: number, position: string) => void;
}

const POSITIONS = ['GK', 'CB', 'LB', 'RB', 'DM', 'CM', 'AM', 'RW', 'LW', 'ST'];

export const EditPlayerModal: React.FC<EditPlayerModalProps> = ({
  isOpen,
  onClose,
  player,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [number, setNumber] = useState(1);
  const [position, setPosition] = useState('CM');

  useEffect(() => {
    if (player) {
      setName(player.name || '');
      setNumber(player.number || 1);
      setPosition(player.position || 'CM');
    }
  }, [player]);

  if (!isOpen || !player) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(player.id, name.trim() || player.name, Number(number) || 1, position);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <Card className="w-full max-w-sm p-6 bg-card border-border shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-xl bg-primary/10 text-primary">
            <UserCheck className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-black text-foreground">ویرایش مشخصات بازیکن</h3>
            <p className="text-[11px] text-muted-foreground">
              تغییرات در لحظه از طریق وب‌سوکت برای همه نمایش داده می‌شود
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-foreground mb-1">نام بازیکن</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثلاً: مهدی طارمی"
              autoFocus
              className="w-full px-3 py-2 rounded-xl border border-input bg-background text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-foreground mb-1">شماره پیراهن</label>
              <input
                type="number"
                min="1"
                max="99"
                value={number}
                onChange={(e) => setNumber(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 rounded-xl border border-input bg-background text-foreground text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            <div>
              <label className="block font-bold text-foreground mb-1">پست بازیکن</label>
              <select
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-input bg-background text-foreground text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                {POSITIONS.map((pos) => (
                  <option key={pos} value={pos}>
                    {pos}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" size="sm" onClick={onClose}>
              انصراف
            </Button>
            <Button type="submit" variant="primary" size="sm">
              ذخیره و همگام‌سازی
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
