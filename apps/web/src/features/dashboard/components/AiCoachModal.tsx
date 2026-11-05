import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  X,
  User,
  Zap,
  Dumbbell,
  Apple,
  Droplets,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
}

interface AiCoachModalProps {
  isOpen: boolean;
  onClose: () => void;
  readinessScore: number;
  readinessLabel: string;
  workoutPercent: number;
  waterGlasses: number;
  caloriesConsumed: number;
  playerName: string;
}

export const AiCoachModal: React.FC<AiCoachModalProps> = ({
  isOpen,
  onClose,
  readinessScore,
  readinessLabel,
  workoutPercent,
  waterGlasses,
  caloriesConsumed,
  playerName,
}) => {
  const [inputPrompt, setInputPrompt] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const initialGreeting: Message = {
    id: 'msg-0',
    sender: 'ai',
    text: `درود ${playerName}! من دستیار هوش مصنوعی تخصصی فرست تاچ هستم. 

داده‌های زنده امروزت را بررسی کردم:
• **شاخص آمادگی:** ${readinessScore}٪ (${readinessLabel})
• **پیشرفت تمرینات:** ${workoutPercent}٪
• **آب مصرفی:** ${waterGlasses} لیوان (هدف: حداقل ۸ لیوان)
• **سوخت دریافتی:** ${caloriesConsumed} کیلوکالری

در هر زمینه‌ای از قبیل اصلاح تکنیک لمس اول، راهکارهای افزایش شتاب، رژیم ریکاوری یا تحلیل وضعیت بدنی سوالی داری، بپرس تا راهنماییت کنم.`,
    timestamp: 'هم‌اکنون',
  };

  const [messages, setMessages] = useState<Message[]>([initialGreeting]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [isOpen, messages, isTyping]);

  if (!isOpen) return null;

  const quickPrompts = [
    {
      title: 'تحلیل آمادگی امروز من',
      icon: Zap,
      prompt: `شاخص آمادگی من امروز ${readinessScore}٪ است. توصیه مربیگری و ریکاوری برای من چیست؟`,
    },
    {
      title: 'تقویت لمس اول تحت فشار',
      icon: Dumbbell,
      prompt: 'برای اینکه لمس اول جهت‌دار تحت پرس مدافعان بهبود پیدا کنه، چه تمریناتی پیشنهاد می‌کنی؟',
    },
    {
      title: 'بهترین تغذیه بعد از تمرین',
      icon: Apple,
      prompt: 'بعد از یک جلسه پرفشار ۴۵ دقیقه‌ای، ترکیب کربوهیدرات و پروتئین پیشنهادی چیه؟',
    },
    {
      title: 'میزان مصرف آب روزانه',
      icon: Droplets,
      prompt: `من تا الان ${waterGlasses} لیوان آب نوشیدم. برای عملکرد بهینه به چند لیوان دیگه نیاز دارم؟`,
    },
  ];

  const generateAiReply = (userText: string): string => {
    const lower = userText.toLowerCase();

    if (lower.includes('شاخص') || lower.includes('آمادگی') || lower.includes('امروز')) {
      if (readinessScore >= 80) {
        return `✅ **تحلیل وضعیت اوج آمادگی (${readinessScore}٪):**
عضلات شما در شرایط عالی ریکاوری و انباشت گلیکوژن قرار دارند.
• تمرکز امروز: تمرینات چابکی انفجاری، شوت‌زنی و تصمیم‌گیری سریع تحت فشار بالا.
• توجه: مصرف حداقل ۸ لیوان آب را در طول روز حفظ کنید تا از گرفتگی عضلات همسترینگ پیشگیری شود.`;
      } else if (readinessScore >= 50) {
        return `⚡ **تحلیل وضعیت آمادگی متوسط (${readinessScore}٪):**
بدن شما در ریتم مسابقه قرار دارد ولی با افزایش مصرف آب به حداقل ۸ لیوان و ثبت وعده‌های بعد از تمرین می‌توانید به بالای ۸۰٪ برسید.
• توصیه: ۱۰ دقیقه گرم‌کردن پویا قبل از تمرین اصلی انجام دهید.`;
      } else {
        return `⚠️ **تحلیل وضعیت بازتوانی و ثبت (${readinessScore}٪):**
شاخص شما نشان‌دهنده نیاز به تکمیل فعالیت‌های ثبت‌شده یا استراحت فعال است.
• اگر تمرین امروز را انجام دادید، حتماً تیک جلسه را در تقویم ثبت کنید.
• حداقل ۲ تا ۳ لیوان آب دیگر بنوشید تا به حداقل ۸ لیوان برسید و خواب ۸ ساعته امشب را اولویت دهید.`;
      }
    }

    if (lower.includes('لمس اول') || lower.includes('تکنیک') || lower.includes('پرس')) {
      return `⚽ **راهکار تخصصی لمس اول (Directional First Touch):**
۱. **دید محیطی قبل از رسیدن توپ (Scanning):** حداقل ۲ بار قبل از دریافت پاس، شانه خود را بچرخانید تا فضای پشت سر و موقعیت مدافع را ببینید.
۲. **شکل بدن نیم‌رخ (Side-on):** هیچ‌وقت با سینه مستقیم به سمت توپ نایستید؛ زاویه ۴۵ درجه به شما امکان لمس اول روبه‌جلو را می‌دهد.
۳. **قفل کردن مچ پا:** مچ پای دریافت‌کننده در لحظه برخورد باید محکم و استوار باشد و با نوک پا به سمت فضای امن هدایت شود.
۴. **تمرین پیشنهادی:** ۵ ست ۲۰ تکراره پاس دیواری با تغییر جهت پای راست به چپ و بالعکس.`;
    }

    if (lower.includes('تغذیه') || lower.includes('کالری') || lower.includes('پروتئین')) {
      return `🥗 **نسخه تغذیه ریکاوری فوتبال:**
• **نسبت طلایی:** نسبت ۳ به ۱ کربوهیدرات به پروتئین در ۴۵ دقیقه اول پس از تمرین.
• **نمونه وعده سریع:** یک لیوان شیر موز عسل همراه با ۲ عدد تخم‌مرغ آب‌پز روی نان تست سبوس‌دار.
• **الکترولیت‌ها:** مصرف یک عدد پرتقال یا موز برای بازگرداندن پتاسیم از دست رفته در تعریق.`;
    }

    if (lower.includes('آب') || lower.includes('لیوان') || lower.includes('هیدراتاسیون')) {
      const remaining = Math.max(0, 8 - waterGlasses);
      return `💧 **برنامه مصرف آب هوشمند بازیکن:**
شما تا کنون ${waterGlasses} لیوان آب نوشیده‌اید (نیاز تا حداقل ۸ لیوان: ${remaining} لیوان).
• پیش از شروع تمرین: ۲ لیوان آب در فاصله ۲ ساعت مانده به شروع جلسه.
• در طول تمرین: هر ۱۵ تا ۲۰ دقیقه نصف لیوان آب جرعه‌جرعه.
• پس از تمرین: ۲ تا ۳ لیوان آب جهت بازتوانی و جبران تعریق بدنی.`;
    }

    return `🎯 **راهنمای فنی مربیگری:**
سوال ارزشمندی مطرح کردید. در فوتبال مدرن، ارتباط بین آمادگی جسمانی، لمس اول و انضباط تاکتیکی کلید پیروزی است.
• پیشنهاد می‌کنم برنامه تمرینی این هفته را در بخش تمرینات چک کنید و قبل از شروع هر تمرین، اهداف جلسه را مرور فرمایید.
• آیا مایلید یک تمرین خاص برای پست تخصصی‌تان پیشنهاد کنم؟`;
  };

  const handleSendPrompt = (textToSend?: string) => {
    const query = (textToSend || inputPrompt).trim();
    if (!query || isTyping) return;

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt('');
    setIsTyping(true);

    setTimeout(() => {
      const replyText = generateAiReply(query);
      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: replyText,
        timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm select-none animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl h-[88vh] max-h-[700px] flex flex-col rounded-3xl bg-card border border-border/80 shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-border/60 bg-muted/30">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-violet-500 text-white flex items-center justify-center shadow-md shadow-purple-500/25">
                <Bot className="h-5 w-5" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-card" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-black text-foreground">
                  دستیار هوش مصنوعی فرست تاچ
                </h3>
                <span className="text-[10px] px-2 py-0.2 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold border border-purple-500/20">
                  AI Coach
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground font-semibold">
                تحلیل وضعیت • پاسخگویی تاکتیکی و تمرینی ۲۴/۷
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-2xl bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Chat Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-xs sm:text-sm">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'ai' && (
                <div className="w-7 h-7 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center border border-purple-500/20 shrink-0 mt-0.5">
                  <Bot className="h-4 w-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-3.5 sm:p-4 leading-relaxed whitespace-pre-line ${
                  m.sender === 'user'
                    ? 'bg-primary text-primary-foreground font-bold shadow-sm rounded-tr-none'
                    : 'bg-muted/50 border border-border/70 text-foreground rounded-tl-none font-medium'
                }`}
              >
                {m.text}
                <div
                  className={`text-[9px] mt-1.5 ${
                    m.sender === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                  }`}
                >
                  {m.timestamp}
                </div>
              </div>

              {m.sender === 'user' && (
                <div className="w-7 h-7 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 shrink-0 mt-0.5">
                  <User className="h-4 w-4" />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-2.5 items-center text-muted-foreground text-xs">
              <div className="w-7 h-7 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center border border-purple-500/20 shrink-0">
                <Bot className="h-4 w-4 animate-spin" />
              </div>
              <span className="italic">مربی هوشمند در حال تایپ پاسخ تخصصی...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts Chips */}
        <div className="px-4 py-2 bg-muted/20 border-t border-border/50 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {quickPrompts.map((qp, idx) => {
            const Icon = qp.icon;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendPrompt(qp.prompt)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card hover:bg-muted text-[11px] font-bold text-foreground border border-border/80 shrink-0 transition-colors shadow-2xs"
              >
                <Icon className="h-3 w-3 text-purple-500" />
                <span>{qp.title}</span>
              </button>
            );
          })}
        </div>

        {/* Input Footer */}
        <div className="p-3 sm:p-4 border-t border-border/70 bg-card">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendPrompt();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder="از مربی هوش مصنوعی هر سوالی داری بپرس..."
              className="flex-1 h-11 px-4 rounded-2xl bg-muted/40 border border-border/80 focus:border-primary focus:bg-background outline-none text-xs sm:text-sm text-foreground transition-all"
            />
            <Button
              type="submit"
              disabled={!inputPrompt.trim() || isTyping}
              className="h-11 px-4 rounded-2xl gap-2 font-black text-xs"
            >
              <span>ارسال</span>
              <Send className="h-3.5 w-3.5" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
