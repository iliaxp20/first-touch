import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { X, Copy, Check, Share2, Presentation, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CreateBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  creatorName?: string;
  creatorPhone?: string;
  onBoardCreated?: (board: any) => void;
}

export const CreateBoardModal: React.FC<CreateBoardModalProps> = ({
  isOpen,
  onClose,
  creatorName,
  creatorPhone,
  onBoardCreated,
}) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [createdBoardId, setCreatedBoardId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('لطفاً عنوان تخته تاکتیک را وارد نمایید.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:4000/tactics/boards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          creatorName: creatorName || 'مربی',
          creatorPhone: creatorPhone || '',
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.board?.id) {
        throw new Error(data.message || 'خطا در ایجاد تخته تاکتیک');
      }

      // Persist to local storage list
      try {
        const savedListStr = localStorage.getItem('ft_saved_tactics_boards');
        const currentList = savedListStr ? JSON.parse(savedListStr) : [];
        const updatedList = [
          {
            id: data.board.id,
            title: data.board.title || title.trim(),
            createdAt: data.board.createdAt || new Date().toISOString(),
            creatorName: data.board.creatorName || creatorName || 'مربی',
          },
          ...currentList.filter((b: any) => b.id !== data.board.id),
        ];
        localStorage.setItem('ft_saved_tactics_boards', JSON.stringify(updatedList));
        localStorage.setItem(`ft_creator_${data.board.id}`, 'true');
      } catch (e) {
        console.warn('Could not save board to localStorage', e);
      }

      onBoardCreated?.(data.board);
      setCreatedBoardId(data.board.id);
    } catch (err: any) {
      setError(err.message || 'خطا در ارتباط با سرور.');
    } finally {
      setIsLoading(false);
    }
  };

  const shareUrl = createdBoardId
    ? `${window.location.origin}/tactics/${createdBoardId}`
    : '';

  const handleCopyLink = () => {
    if (!shareUrl) return;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleEnterRoom = () => {
    if (createdBoardId) {
      onClose();
      navigate(`/tactics/${createdBoardId}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <Card className="w-full max-w-md p-6 bg-card border-border shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
        >
          <X className="h-5 w-5" />
        </button>

        {!createdBoardId ? (
          <div>
            <div className="flex items-center gap-2 mb-3 text-emerald-600 dark:text-emerald-400">
              <Presentation className="h-6 w-6" />
              <h2 className="text-xl font-black text-foreground">ایجاد تخته تاکتیک جدید</h2>
            </div>
            <p className="text-xs text-muted-foreground mb-5 leading-relaxed">
              تخته اختصاصی با امکان چیدمان بازیکنان، رسم استراتژی، مکالمه صوتی تیمی و هماهنگی آنلاین با بازیکنان.
            </p>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-foreground mb-1.5">
                  عنوان تخته تاکتیک
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="مثال: آنالیز ضدحمله دربی، بازی پرسینگ..."
                  autoFocus
                  className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              {error && <p className="text-xs text-rose-500 font-medium">{error}</p>}

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <Button type="button" variant="ghost" size="sm" onClick={onClose}>
                  انصراف
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={isLoading || !title.trim()}
                  className="px-5 font-bold"
                >
                  {isLoading ? 'در حال ساخت...' : 'ایجاد تخته'}
                </Button>
              </div>
            </form>
          </div>
        ) : (
          <div className="text-center space-y-4 py-2">
            <div className="mx-auto w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Check className="h-6 w-6 stroke-[2.5]" />
            </div>

            <div>
              <h3 className="text-lg font-black text-foreground">تخته تاکتیک با موفقیت ایجاد شد!</h3>
              <p className="text-xs text-muted-foreground mt-1">
                لینک زیر را برای بازیکنان یا کادر فنی ارسال نمایید تا هم‌زمان روی تخته حضور پیدا کنند.
              </p>
            </div>

            <div className="flex items-center gap-2 p-2 rounded-xl bg-muted/60 border border-border">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 bg-transparent text-xs text-muted-foreground px-2 focus:outline-none select-all text-left font-mono"
                dir="ltr"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCopyLink}
                className="gap-1 text-xs shrink-0"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? 'کپی شد' : 'کپی'}</span>
              </Button>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCopyLink}
                className="flex-1 gap-1 text-xs"
              >
                <Share2 className="h-3.5 w-3.5" />
                <span>اشتراک با تیم</span>
              </Button>
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={handleEnterRoom}
                className="flex-1 gap-1 text-xs font-bold"
              >
                <span>ورود به تخته</span>
                <ArrowLeft className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
