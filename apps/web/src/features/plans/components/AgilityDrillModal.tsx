import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  Search,
  Plus,
  Check,
  X,
  Layers,
  Filter,
  FileCheck,
  Eye,
} from 'lucide-react';
import { DrillDetailModal } from './DrillDetailModal';

export interface AgilityDrill {
  id: string;
  categoryIndex: number;
  categoryTitle: string;
  englishName: string;
  persianName: string;
  imageUrl?: string;
  equipment: string;
  targetSkill: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'PRO';
  description: string;
}

export interface DrillCategory {
  index: number;
  title: string;
  count: number;
}

interface AgilityDrillModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddDrillsToPlan?: (selectedDrills: AgilityDrill[], planTitle: string) => void;
}

export const AgilityDrillModal: React.FC<AgilityDrillModalProps> = ({
  isOpen,
  onClose,
  onAddDrillsToPlan,
}) => {
  const [categories, setCategories] = useState<DrillCategory[]>([]);
  const [drills, setDrills] = useState<AgilityDrill[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedDrills, setSelectedDrills] = useState<AgilityDrill[]>([]);
  const [isNewDrillModalOpen, setIsNewDrillModalOpen] = useState(false);
  const [detailDrill, setDetailDrill] = useState<AgilityDrill | null>(null);
  const [newPlanTitle, setNewPlanTitle] = useState('');

  // Form state for creating custom drill (Admin / Coach)
  const [formData, setFormData] = useState({
    categoryIndex: 1,
    persianName: '',
    englishName: '',
    equipment: 'نردبان چابکی',
    targetSkill: 'چابکی و لمس اول',
    difficulty: 'INTERMEDIATE' as const,
    description: '',
    imageUrl: '',
  });

  // Fetch categories & drills from NestJS API
  useEffect(() => {
    if (!isOpen) return;

    const fetchCategories = async () => {
      try {
        const res = await fetch('http://localhost:4000/drills/categories');
        if (res.ok) {
          const data = await res.json();
          setCategories(data);
        }
      } catch {
        // Fallback categories
        setCategories([
          { index: 1, title: '۱. تمرینات نردبان چابکی (Agility Ladder)', count: 20 },
          { index: 2, title: '۲. تمرینات چابکی با مخروط (Cone Agility Drills)', count: 20 },
          { index: 3, title: '۳. تمرینات تغییر جهت (Change of Direction)', count: 15 },
          { index: 4, title: '۴. تمرینات چابکی واکنشی (Reactive Agility)', count: 8 },
          { index: 5, title: '۵. تمرینات چابکی با توپ (Ball Agility Drills)', count: 6 },
          { index: 6, title: '۶. تمرینات چابکی دفاعی (Defensive Agility)', count: 3 },
          { index: 7, title: '۷. تمرینات چابکی دونفره و گروهی (Partner & Group)', count: 2 },
          { index: 8, title: '۸. تمرینات هماهنگی عصبی و حرکتی (Coordination)', count: 3 },
          { index: 9, title: '۹. تمرینات سرعت و چابکی ترکیبی (Speed & Agility)', count: 2 },
          { index: 10, title: '۱۰. تمرینات چابکی شرایط مسابقه (Game-Specific)', count: 2 },
          { index: 11, title: '۱۱. تمرینات چابکی با موانع (Hurdle Agility)', count: 2 },
          { index: 12, title: '۱۲. تمرینات دیداری و واکنشی (Visual & Ball Reaction)', count: 2 },
        ]);
      }
    };

    fetchCategories();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const fetchDrills = async () => {
      setLoading(true);
      try {
        let url = 'http://localhost:4000/drills';
        const params = new URLSearchParams();
        if (selectedCategory) params.append('categoryIndex', selectedCategory.toString());
        if (searchQuery.trim()) params.append('search', searchQuery.trim());
        if (params.toString()) url += `?${params.toString()}`;

        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setDrills(data);
        }
      } catch {
        // Handled gracefully
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchDrills, 120);
    return () => clearTimeout(timer);
  }, [isOpen, selectedCategory, searchQuery]);

  const toggleSelectDrill = (drill: AgilityDrill) => {
    setSelectedDrills((prev) => {
      const exists = prev.some((d) => d.id === drill.id);
      if (exists) {
        return prev.filter((d) => d.id !== drill.id);
      } else {
        return [...prev, drill];
      }
    });
  };

  const handleCreateDrillSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.persianName.trim() || !formData.englishName.trim()) return;

    const matchedCat = categories.find((c) => c.index === formData.categoryIndex);

    try {
      const res = await fetch('http://localhost:4000/drills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          categoryTitle: matchedCat ? matchedCat.title : `دسته ${formData.categoryIndex}`,
        }),
      });

      if (res.ok) {
        const created = await res.json();
        setDrills((prev) => [created, ...prev]);
        setIsNewDrillModalOpen(false);
        setFormData({
          categoryIndex: 1,
          persianName: '',
          englishName: '',
          equipment: 'نردبان چابکی',
          targetSkill: 'چابکی و لمس اول',
          difficulty: 'INTERMEDIATE',
          description: '',
          imageUrl: '',
        });
      }
    } catch {
      // Fallback
      setIsNewDrillModalOpen(false);
    }
  };

  const handleApplyToPlan = () => {
    if (selectedDrills.length === 0) return;
    const title = newPlanTitle.trim() || `برنامه چابکی تخصصی با ${selectedDrills.length} تمرین منتخب`;
    if (onAddDrillsToPlan) {
      onAddDrillsToPlan(selectedDrills, title);
    }
    setSelectedDrills([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-sm overflow-y-auto select-none">
      <Card className="w-full max-w-6xl max-h-[92vh] flex flex-col border border-purple-200/90 dark:border-white/10 bg-white dark:bg-slate-900 shadow-2xl shadow-purple-950/25 relative overflow-hidden rounded-3xl">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-border/80 bg-gradient-to-r from-purple-500/10 via-violet-500/5 to-transparent flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-purple-600 text-white flex items-center justify-center font-black shadow-md shadow-purple-500/30">
              <Layers className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                  بانک جامع تمرینات چابکی فوتبال
                </h2>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                  ۱۲ دسته تخصصی
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                مجموعه استاندارد تمرینات نردبان، مخروط، تغییر جهت، کار با توپ و موقعیت مسابقه متصل به سرور و دیتابیس
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsNewDrillModalOpen(true)}
              className="gap-1.5 text-xs font-bold border-purple-300 dark:border-purple-800 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950/50"
            >
              <Plus className="h-4 w-4" />
              افزودن تمرین جدید (ثبت دیتابیس)
            </Button>
            <button
              onClick={onClose}
              className="h-9 w-9 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="p-4 border-b border-border/60 bg-slate-50/50 dark:bg-slate-950/30 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="جستجوی تمرین بر اساس نام فارسی (مثلاً یک پا در هر خانه، شاتل، کرویف) یا انگلیسی..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pr-10 pl-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-all placeholder:text-slate-400"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setSelectedCategory(null)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === null
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
              }`}
            >
              همه ({categories.reduce((acc, c) => acc + c.count, 0)})
            </button>
          </div>
        </div>

        {/* Category Horizontal Filter Pills */}
        <div className="px-4 py-2.5 border-b border-border/50 bg-slate-50/30 dark:bg-slate-950/20 overflow-x-auto flex items-center gap-1.5 scrollbar-thin">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.index;
            return (
              <button
                key={cat.index}
                type="button"
                onClick={() => setSelectedCategory(isSelected ? null : cat.index)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                  isSelected
                    ? 'bg-purple-600 text-white shadow-sm font-bold'
                    : 'bg-white/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-purple-300'
                }`}
              >
                {cat.title} ({cat.count})
              </button>
            );
          })}
        </div>

        {/* Drill Cards Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          {loading ? (
            <div className="py-20 text-center space-y-3">
              <div className="h-10 w-10 mx-auto rounded-full border-3 border-purple-200 border-t-purple-600 animate-spin" />
              <p className="text-xs text-slate-500 font-semibold">در حال بارگذاری تمرینات از سرور...</p>
            </div>
          ) : drills.length === 0 ? (
            <div className="py-20 text-center space-y-2">
              <Filter className="h-10 w-10 text-slate-400 mx-auto opacity-40" />
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">تمرینی با این مشخصات یافت نشد</p>
              <p className="text-xs text-slate-400">می‌توانید عبارت جستجو را پاک کنید یا تمرین جدیدی اضافه نمایید.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {drills.map((drill) => {
                const isSelected = selectedDrills.some((d) => d.id === drill.id);

                return (
                  <div
                    key={drill.id}
                    onClick={() => toggleSelectDrill(drill)}
                    className={`relative rounded-2xl border p-4 flex flex-col justify-between transition-all cursor-pointer group select-none ${
                      isSelected
                        ? 'border-purple-600 bg-purple-50/70 dark:bg-purple-950/40 shadow-md ring-2 ring-purple-500/20'
                        : 'border-slate-200/90 dark:border-white/10 bg-white dark:bg-slate-800/80 hover:border-purple-300 dark:hover:border-purple-800 hover:shadow-sm'
                    }`}
                  >
                    <div>
                      {/* Image Preview if available */}
                      {drill.imageUrl && (
                        <div className="h-28 w-full rounded-xl overflow-hidden mb-3 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 relative">
                          <img
                            src={drill.imageUrl}
                            alt={drill.persianName}
                            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                          <span className="absolute bottom-1.5 right-1.5 text-[9px] bg-black/60 text-white px-2 py-0.5 rounded backdrop-blur">
                            {drill.equipment}
                          </span>
                        </div>
                      )}

                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 block mb-0.5">
                            {drill.categoryTitle}
                          </span>
                          <h4 className="text-sm font-black text-slate-900 dark:text-white leading-tight">
                            {drill.persianName}
                          </h4>
                          <span className="text-[11px] text-slate-400 font-mono block mt-0.5 dir-ltr text-right">
                            {drill.englishName}
                          </span>
                        </div>

                        {/* Selection Checkbox */}
                        <div
                          className={`h-6 w-6 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                            isSelected
                              ? 'bg-purple-600 text-white shadow-sm'
                              : 'border-2 border-slate-300 dark:border-slate-600 group-hover:border-purple-400'
                          }`}
                        >
                          {isSelected && <Check className="h-4 w-4 stroke-[3]" />}
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed mb-3">
                        {drill.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-[11px]">
                      <span className="text-slate-500 dark:text-slate-400">
                        مهارت: <strong className="text-slate-800 dark:text-slate-200">{drill.targetSkill}</strong>
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDetailDrill(drill);
                          }}
                          className="px-2 py-0.5 rounded text-[10px] font-bold text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="h-3 w-3" />
                          <span>جزئیات</span>
                        </button>
                        <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-purple-100/80 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300">
                          {drill.difficulty === 'BEGINNER'
                            ? 'مبتدی'
                            : drill.difficulty === 'INTERMEDIATE'
                            ? 'متوسط'
                            : drill.difficulty === 'ADVANCED'
                            ? 'پیشرفته'
                            : 'حرفه‌ای'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer with Selection Actions */}
        <div className="p-4 border-t border-border/80 bg-slate-50/80 dark:bg-slate-950/60 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold text-slate-700 dark:text-slate-300">
              تعداد تمرینات انتخاب‌شده:
            </span>
            <span className="h-6 px-2.5 rounded-full bg-purple-600 text-white font-black flex items-center justify-center text-xs">
              {selectedDrills.length}
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {selectedDrills.length > 0 && (
              <input
                type="text"
                placeholder="نام برنامه تمرینی جدید (اختیاری)..."
                value={newPlanTitle}
                onChange={(e) => setNewPlanTitle(e.target.value)}
                className="h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium w-full sm:w-64 focus:outline-none focus:border-purple-600"
              />
            )}

            <Button
              variant="primary"
              disabled={selectedDrills.length === 0}
              onClick={handleApplyToPlan}
              className="h-10 px-5 text-xs font-black bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-500/25 shrink-0 gap-1.5"
            >
              <FileCheck className="h-4 w-4" />
              ایجاد برنامه با {selectedDrills.length} تمرین منتخب
            </Button>
          </div>
        </div>
      </Card>

      {/* CREATE NEW DRILL MODAL (ADMIN / COACH POSTGRESQL INSERTION) */}
      {isNewDrillModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none">
          <Card className="w-full max-w-lg border border-purple-200 dark:border-white/10 bg-white dark:bg-slate-900 shadow-2xl rounded-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-border bg-purple-50/60 dark:bg-purple-950/40 flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Plus className="h-4 w-4 text-purple-600" />
                ثبت تمرین چابکی جدید در پایگاه داده
              </h3>
              <button
                onClick={() => setIsNewDrillModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDrillSubmit} className="p-4 sm:p-5 space-y-3.5">
              <div className="space-y-1 text-right">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">دسته‌بندی تمرین</label>
                <select
                  value={formData.categoryIndex}
                  onChange={(e) => setFormData({ ...formData, categoryIndex: Number(e.target.value) })}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-purple-600"
                >
                  {categories.map((c) => (
                    <option key={c.index} value={c.index}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-right">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">نام فارسی تمرین</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: پرش ضربدری از مانع"
                    value={formData.persianName}
                    onChange={(e) => setFormData({ ...formData, persianName: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">نام انگلیسی تمرین</label>
                  <input
                    type="text"
                    required
                    dir="ltr"
                    placeholder="e.g. Crossover Hurdle Hop"
                    value={formData.englishName}
                    onChange={(e) => setFormData({ ...formData, englishName: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-600 text-left"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-right">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">تجهیزات مورد نیاز</label>
                  <input
                    type="text"
                    placeholder="مثال: مخروط، نردبان، موانع"
                    value={formData.equipment}
                    onChange={(e) => setFormData({ ...formData, equipment: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">مهارت هدف</label>
                  <input
                    type="text"
                    placeholder="مثال: چابکی عرضی، لمس اول"
                    value={formData.targetSkill}
                    onChange={(e) => setFormData({ ...formData, targetSkill: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-600"
                  />
                </div>
              </div>

              <div className="space-y-1 text-right">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">آدرس تصویر یا دیاگرام (اختیاری)</label>
                <input
                  type="url"
                  dir="ltr"
                  placeholder="https://..."
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-600 text-left"
                />
              </div>

              <div className="space-y-1 text-right">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">شرح تکنیکی تمرین</label>
                <textarea
                  rows={2}
                  placeholder="نکات اجرای صحیح گام‌ها و فرود..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-600"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <Button
                  type="submit"
                  variant="primary"
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold"
                >
                  ثبت دائم در پایگاه داده
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsNewDrillModalOpen(false)}
                  className="flex-1 text-xs"
                >
                  انصراف
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
      {/* Drill Detail Modal */}
      {detailDrill && (
        <DrillDetailModal
          isOpen={!!detailDrill}
          onClose={() => setDetailDrill(null)}
          drill={detailDrill}
        />
      )}
    </div>
  );
};
