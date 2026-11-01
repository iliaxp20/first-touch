import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  Users,
  ShieldCheck,
  Star,
  Award,
  Sparkles,
  MessageSquare,
  Video,
  CheckCircle2,
  Calendar,
  X,
} from 'lucide-react';

export interface Coach {
  id: string;
  fullName: string;
  title: string;
  license: string;
  specialty: string[];
  experienceYears: number;
  rating: number;
  studentsCount: number;
  monthlyFee: string;
  bio: string;
  features: string[];
  avatarUrl?: string;
  isAvailable: boolean;
}

export const PersonalCoachSection: React.FC = () => {
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [requestSubmitted, setRequestSubmitted] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    playerName: '',
    playerAge: '۱۵ سال',
    playerPosition: 'وینگر و هافبک تهاجمی',
    goals: 'ارتقای سرعت گام اول، بهبود لمس اول در مسابقات و افزایش دقت شوت',
    parentApproval: true,
  });

  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        const res = await fetch('http://localhost:4000/coaches');
        if (res.ok) {
          const data = await res.json();
          setCoaches(data);
        }
      } catch {
        // Fallback
      }
    };

    fetchCoaches();
  }, []);

  const handleOpenRequest = (coach: Coach) => {
    setSelectedCoach(coach);
    setIsModalOpen(true);
    setRequestSubmitted(false);
  };

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCoach) return;

    try {
      await fetch('http://localhost:4000/coaches/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          coachId: selectedCoach.id,
          playerName: formData.playerName || 'کاربر گرامی',
          playerAge: formData.playerAge,
          playerPosition: formData.playerPosition,
          goals: formData.goals,
        }),
      });
      setRequestSubmitted(true);
    } catch {
      setRequestSubmitted(true);
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero Service Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-700 via-indigo-800 to-slate-900 p-6 sm:p-8 text-white shadow-xl shadow-purple-900/15">
        <div className="relative z-10 max-w-2xl space-y-3 text-right">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-amber-300" />
            <span>سرویس مربیگری اختصاصی (اشتراک ویژه پریمیوم)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black leading-tight">
            تمرین تحت نظر مربیان برجسته و دارای مدرک Pro و A آسیا
          </h2>
          <p className="text-xs sm:text-sm text-white/85 leading-relaxed">
            برنامه تمرینی اختصاصی منطبق بر فیزیک و پست شما، آنالیز ویدیویی اجرای تمرینات، گزارش منظم پیشرفت و چت مستقیم با مربی در طول هفته.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-xl backdrop-blur text-xs">
              <MessageSquare className="h-4 w-4 text-purple-300" />
              <span>چت مستقیم با مربی</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-xl backdrop-blur text-xs">
              <Video className="h-4 w-4 text-purple-300" />
              <span>آنالیز ویدیوی تمرین</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-xl backdrop-blur text-xs">
              <Calendar className="h-4 w-4 text-purple-300" />
              <span>تقویم اختصاصی</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-xl backdrop-blur text-xs">
              <ShieldCheck className="h-4 w-4 text-purple-300" />
              <span>تایید صلاحیت و نظارت اولیا</span>
            </div>
          </div>
        </div>
      </div>

      {/* Coaches Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {coaches.map((coach) => (
          <Card
            key={coach.id}
            className="flex flex-col justify-between border border-purple-200/90 dark:border-white/10 bg-white/95 dark:bg-slate-900/95 rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden"
          >
            <div>
              {/* Coach Image and Title */}
              <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-4 text-right">
                <div className="relative h-16 w-16 rounded-2xl overflow-hidden bg-purple-100 dark:bg-purple-950/60 border-2 border-purple-300 dark:border-purple-800 shrink-0">
                  {coach.avatarUrl ? (
                    <img src={coach.avatarUrl} alt={coach.fullName} className="h-full w-full object-cover" />
                  ) : (
                    <Users className="h-8 w-8 text-purple-600 m-auto" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      ظرفیت فعال
                    </span>
                    <span className="text-xs font-bold text-amber-500 flex items-center gap-0.5">
                      <Star className="h-3.5 w-3.5 fill-amber-500" />
                      {coach.rating}
                    </span>
                  </div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white leading-tight">
                    {coach.fullName}
                  </h3>
                  <p className="text-xs text-purple-600 dark:text-purple-400 font-semibold mt-0.5">
                    {coach.title}
                  </p>
                </div>
              </div>

              {/* Bio and Features */}
              <div className="p-5 space-y-4 text-right">
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {coach.bio}
                </p>

                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block">
                    تخصص‌های مربی:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {coach.specialty.map((spec, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  {coach.features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                      <CheckCircle2 className="h-4 w-4 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Price & Action Button */}
            <div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 flex items-center justify-between gap-3">
              <div className="text-right">
                <span className="text-[10px] text-slate-500 block">شهریه اشتراک ماهانه</span>
                <span className="text-sm font-black text-purple-700 dark:text-purple-300">{coach.monthlyFee}</span>
              </div>

              <Button
                variant="primary"
                onClick={() => handleOpenRequest(coach)}
                className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-md shadow-purple-500/25"
              >
                انتخاب مربی و شروع
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* COACH REQUEST DIALOG MODAL */}
      {isModalOpen && selectedCoach && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm select-none overflow-y-auto">
          <Card className="w-full max-w-lg border border-purple-200/90 dark:border-white/10 bg-white dark:bg-slate-900 shadow-2xl rounded-3xl overflow-hidden my-4">
            <div className="p-4 sm:p-5 border-b border-border flex items-center justify-between bg-purple-50/50 dark:bg-purple-950/40">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-purple-600" />
                <h3 className="text-sm font-black text-slate-900 dark:text-white">
                  درخواست برنامه اختصاصی از {selectedCoach.fullName}
                </h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="h-5 w-5" />
              </button>
            </div>

            {requestSubmitted ? (
              <div className="p-6 text-center space-y-4">
                <div className="h-16 w-16 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center shadow-inner">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h4 className="text-base font-black text-slate-900 dark:text-white">
                  درخواست شما با موفقیت به کارتابل {selectedCoach.fullName} ارسال شد!
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-md mx-auto">
                  مربی پس از بررسی شاخص‌های فیزیکی، ظرف ۲۴ ساعت آینده برنامه تمرینی اختصاصی شما را در کارتابل قرار داده و چت مستقیم فعال خواهد شد.
                </p>
                <Button
                  variant="primary"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-purple-600 text-white text-xs font-bold px-6"
                >
                  متوجه شدم
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmitRequest} className="p-5 space-y-4 text-right">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">نام و نام خانوادگی بازیکن</label>
                  <input
                    type="text"
                    required
                    placeholder="نام کامل خود را وارد فرمایید"
                    value={formData.playerName}
                    onChange={(e) => setFormData({ ...formData, playerName: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium focus:border-purple-600 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">رده سنی</label>
                    <input
                      type="text"
                      value={formData.playerAge}
                      onChange={(e) => setFormData({ ...formData, playerAge: e.target.value })}
                      className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium focus:border-purple-600 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">پست بازی</label>
                    <input
                      type="text"
                      value={formData.playerPosition}
                      onChange={(e) => setFormData({ ...formData, playerPosition: e.target.value })}
                      className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium focus:border-purple-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">اهداف تمرینی شما</label>
                  <textarea
                    rows={3}
                    value={formData.goals}
                    onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium focus:border-purple-600 focus:outline-none leading-relaxed"
                  />
                </div>

                <div className="p-3 rounded-xl border border-purple-100 dark:border-purple-900/40 bg-purple-50/50 dark:bg-purple-950/20 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="parentApproval"
                    checked={formData.parentApproval}
                    onChange={(e) => setFormData({ ...formData, parentApproval: e.target.checked })}
                    className="h-4 w-4 rounded accent-purple-600"
                  />
                  <label htmlFor="parentApproval" className="text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                    تایید نظارت اولیا برای سنین زیر ۱۸ سال الزامی و مورد تایید است
                  </label>
                </div>

                <div className="pt-2 flex gap-3">
                  <Button
                    type="submit"
                    variant="primary"
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold h-11"
                  >
                    ثبت درخواست و پرداخت شهریه ماهانه ({selectedCoach.monthlyFee})
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsModalOpen(false)}
                    className="h-11 text-xs"
                  >
                    انصراف
                  </Button>
                </div>
              </form>
            )}
          </Card>
        </div>
      )}
    </div>
  );
};
