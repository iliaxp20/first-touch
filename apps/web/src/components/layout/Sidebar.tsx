import React from 'react';
import { LayoutDashboard, Compass, CalendarCheck2, CreditCard, Users, Settings, X } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '../ui/Button';

export type NavItemKey = 'dashboard' | 'tactics' | 'plans' | 'subscriptions' | 'students' | 'settings';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeItem?: NavItemKey;
  onSelect?: (item: NavItemKey) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, activeItem, onSelect }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { key: 'dashboard' as NavItemKey, label: 'داشبورد', path: '/', icon: LayoutDashboard },
    { key: 'tactics' as NavItemKey, label: 'تخته تاکتیک', path: '/tactics', icon: Compass, badge: 'جدید' },
    { key: 'plans' as NavItemKey, label: 'برنامه‌های تمرینی', path: '/practice', icon: CalendarCheck2 },
    { key: 'subscriptions' as NavItemKey, label: 'اشتراک و درآمد', path: '/subscriptions', icon: CreditCard },
    { key: 'students' as NavItemKey, label: 'لیست شاگردان', path: '/subscriptions', icon: Users },
    { key: 'settings' as NavItemKey, label: 'تنظیمات', path: '/settings', icon: Settings },
  ];

  const getCurrentActiveKey = (): NavItemKey => {
    const path = location.pathname;
    if (path === '/tactics') return 'tactics';
    if (path === '/practice' || path.startsWith('/plans') || path.startsWith('/exercises')) return 'plans';
    if (path === '/settings' || path === '/profile') return 'settings';
    if (path === '/subscriptions') return 'subscriptions';
    if (activeItem) return activeItem;
    return 'dashboard';
  };

  const currentActive = getCurrentActiveKey();

  const handleItemClick = (item: typeof navItems[0]) => {
    navigate(item.path);
    if (onSelect) {
      onSelect(item.key);
    }
    onClose();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          'fixed inset-y-0 right-0 z-50 flex w-72 flex-col border-l border-border bg-card p-4 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex items-center justify-between pb-4 lg:hidden border-b border-border mb-3">
          <span className="font-bold text-foreground">منوی فرست تاچ</span>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="flex-1 space-y-1.5 pt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentActive === item.key;
            return (
              <button
                key={item.key}
                onClick={() => handleItemClick(item)}
                className={cn(
                  'flex w-full items-center justify-between rounded-xl px-3.5 py-3 text-sm font-semibold transition-all select-none cursor-pointer',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/25'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon className={cn('h-5 w-5', isActive ? 'text-primary-foreground' : 'text-muted-foreground')} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={cn(
                      'rounded-full px-2 py-0.5 text-[10px] font-bold',
                      isActive ? 'bg-background/20 text-white' : 'bg-primary/10 text-primary'
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Coach Pitch Motivation Box */}
        <div className="rounded-xl border border-border/80 bg-background p-4 mt-auto">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold text-foreground">نکته مربیگری امروز</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            تمرین مداوم روی لمس اول توپ، سرعت گردش بازی و دقت تصمیم‌گیری را افزایش می‌دهد.
          </p>
        </div>
      </aside>
    </>
  );
};
