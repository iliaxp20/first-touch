import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Check, Zap, TrendingUp } from 'lucide-react';

export const SubscriptionCard: React.FC = () => {
  const tiers = [
    {
      name: 'اشتراک ۱ ماهه شاگرد',
      price: '۴۹۰,۰۰۰',
      period: 'ماهانه',
      description: 'مناسب برای شروع تمرینات تخصصی و ارزیابی اولیه',
      features: [
        'دریافت برنامه تمرینی هفتگی اختصاصی',
        'دسترسی به تخته تاکتیک مربی',
        'ارسال ۲ ویدیو در ماه جهت آنالیز تکنیک',
        'پشتیبانی پیامکی داخل اپلیکیشن',
      ],
      popular: false,
    },
    {
      name: 'اشتراک ۳ ماهه ویژه (کوچینگ کامل)',
      price: '۱,۲۹۰,۰۰۰',
      period: 'فصلی',
      description: 'بهترین انتخاب برای پیشرفت چشمگیر و حضور در تست‌های باشگاهی',
      features: [
        'تمام امکانات پلن ۱ ماهه',
        'برنامه اصلاح تغذیه ورزشی فوتبال',
        'آنالیز ویدیویی هفتگی بدون محدودیت',
        'جلسه ویدیویی آنلاین ماهانه با مربی',
        'تخفیف ویژه دوره‌های بعد',
      ],
      popular: true,
    },
    {
      name: 'اشتراک سالانه آکادمی',
      price: '۴,۵۰۰,۰۰۰',
      period: 'سالانه',
      description: 'همراهی گام‌به‌گام مربی در کل فصل مسابقاتی',
      features: [
        'پوشش کامل تمرینات پیش‌فصل و در حین فصل',
        'گزارش جامع پیشرفت ماهانه (Physical & Tactical)',
        'پشتیبانی VIP و خط مستقیم با مربی',
        'اولویت حضور در بازی‌های دوستانه و تست‌ها',
      ],
      popular: false,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-foreground">پلن‌های اشتراک و ثبت‌نام شاگردان</h1>
        <p className="text-sm text-muted-foreground mt-1">
          تعریف تعرفه‌ها و پلن‌های عضویت مربی جهت خرید مستقیم توسط شاگردان با درگاه شتاب.
        </p>
      </div>

      {/* Revenue Snapshot */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 bg-primary/5 border-primary/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground">درآمد این ماه مربی</span>
            <TrendingUp className="h-4 w-4 text-primary" />
          </div>
          <p className="text-xl font-black text-foreground mt-2">۲۴,۸۰۰,۰۰۰ تومان</p>
          <span className="text-[11px] text-primary font-semibold">+۱۸٪ نسبت به ماه گذشته</span>
        </Card>
        <Card className="p-4">
          <span className="text-xs font-bold text-muted-foreground">شاگردان فعال دارای اشتراک</span>
          <p className="text-xl font-black text-foreground mt-2">۳۸ نفر</p>
          <span className="text-[11px] text-muted-foreground">۴ اشتراک در آستانه انقضا</span>
        </Card>
        <Card className="p-4">
          <span className="text-xs font-bold text-muted-foreground">نرخ تمدید اشتراک</span>
          <p className="text-xl font-black text-foreground mt-2">۸۴٪</p>
          <span className="text-[11px] text-emerald-500 font-semibold">بسیار مطلوب</span>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        {tiers.map((tier, idx) => (
          <Card
            key={idx}
            className={`flex flex-col justify-between relative ${
              tier.popular ? 'border-primary shadow-lg ring-1 ring-primary/50' : 'border-border'
            }`}
          >
            {tier.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[11px] font-black px-3 py-0.5 rounded-full shadow">
                پیشنهاد ویژه
              </div>
            )}

            <CardHeader>
              <CardTitle className="text-lg">{tier.name}</CardTitle>
              <CardDescription className="text-xs mt-1">{tier.description}</CardDescription>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-2xl font-black text-foreground">{tier.price}</span>
                <span className="text-xs text-muted-foreground">تومان / {tier.period}</span>
              </div>
            </CardHeader>

            <CardContent>
              <ul className="space-y-2.5 text-xs text-foreground/90">
                {tier.features.map((feat, fIdx) => (
                  <li key={fIdx} className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </CardContent>

            <CardFooter>
              <Button
                variant={tier.popular ? 'primary' : 'outline'}
                className="w-full gap-2 font-bold"
              >
                <Zap className="h-4 w-4" />
                ویرایش یا خرید اشتراک
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};
