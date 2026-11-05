import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Phone, User, ShieldCheck } from 'lucide-react';

interface GuestPhoneModalProps {
  isOpen: boolean;
  onSubmit: (name: string, phone: string) => void;
}

export const GuestPhoneModal: React.FC<GuestPhoneModalProps> = ({ isOpen, onSubmit }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = phone.trim();
    if (!cleanPhone || cleanPhone.length < 10) {
      setError('لطفاً شماره تلفن همراه معتبر (مثال: 09121234567) وارد نمایید.');
      return;
    }

    const cleanName = name.trim() || `کاربر (${cleanPhone.slice(-4)})`;
    onSubmit(cleanName, cleanPhone);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
      <Card className="w-full max-w-sm p-6 bg-card border-border shadow-2xl space-y-4">
        <div className="text-center space-y-1.5">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-2">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h2 className="text-lg font-black text-foreground">ورود به جلسه تاکتیک تیمی</h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            جهت اتصال به چت زنده، گفتگوی صوتی تیمی و تخته تاکتیک، شماره همراه خود را وارد کنید:
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              شماره تلفن همراه (الزامی)
            </label>
            <div className="relative">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="09123456789"
                dir="ltr"
                autoFocus
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 text-left font-mono"
              />
              <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              نام و نام خانوادگی
            </label>
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="مثلاً: علی رضایی"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          {error && <p className="text-xs text-rose-500 font-medium">{error}</p>}

          <Button type="submit" variant="primary" size="md" className="w-full gap-2 mt-2">
            پیوستن به تخته تاکتیک
          </Button>
        </form>
      </Card>
    </div>
  );
};
