import { API_BASE_URL } from '@/lib/api';

export interface QuizQuestion {
  id: number;
  category: string;
  categoryColor: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  xpReward: number;
  coinReward: number;
}

export const DEFAULT_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    category: 'تکنیک و لمس اول',
    categoryColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    question: 'هنگام دریافت پاس زمینی پرسرعت تحت پرس مستقیم مدافع حریف، مهم‌ترین اصل در اجرای لمس اول جهت‌دار چیست؟',
    options: [
      'استپ کردن کامل توپ زیر پا و متوقف کردن سرعت بازی',
      'باز کردن جهت بدن و لمس اول به سمت فضای خالی دور از زاویه تکل حریف',
      'پاس بدون نگاه با پشت پا به عقب',
      'شوت کردن مستقیم توپ به سمت زمین حریف',
    ],
    correctIndex: 1,
    explanation: 'لمس اول جهت‌دار (Directional First Touch) باید توپ را در یک حرکت وارد زاویه ایمن و فضای خالی کند.',
    xpReward: 35,
    coinReward: 15,
  },
  {
    id: 2,
    category: 'قوانین داوری فیفا',
    categoryColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    question: 'بر اساس آخرین قوانین برد بین‌المللی فوتبال (IFAB)، کدام عضو بدن بازیکن در محاسبه آفساید لحاظ نمی‌شود؟',
    options: [
      'دست‌ها و بازوها (از پایین زیربغل)',
      'شانه و ترقوه',
      'نوک انگشتان پا',
      'سر و چانه',
    ],
    correctIndex: 0,
    explanation: 'دست‌ها و بازوها به دلیل اینکه مجاز به بازی با دست نیستند، در سنجش خط آفساید لحاظ نمی‌شوند.',
    xpReward: 30,
    coinReward: 10,
  },
  {
    id: 3,
    category: 'تاکتیک و جایگیری',
    categoryColor: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20',
    question: 'اصطلاح Half-Space (نیم‌فضا) در تحلیل تاکتیکی نوین فوتبال به کدام ناحیه زمین اطلاق می‌شود؟',
    options: [
      'محوطه شش قدم جلوی دروازه‌بان',
      'فضای کانال عمودی میان مرکز زمین (Center) و کناره‌های زمین (Flank)',
      'دایره وسط نیمه حریف',
      'پشت مدافعان آخر در عمق دفاع',
    ],
    correctIndex: 1,
    explanation: 'نیم‌فضاها زوایای پاس و شوت مورب بسیار بهتری نسبت به کناره‌ها و مرکز ایجاد می‌کنند.',
    xpReward: 40,
    coinReward: 20,
  },
  {
    id: 4,
    category: 'تغذیه و ریکاوری',
    categoryColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    question: 'پنجره طلایی بازسازی ذخایر گلیکوژن عضلات پس از ۹۰ دقیقه مسابقه سنگین چه زمانی است؟',
    options: [
      '۳۰ الی ۴۵ دقیقه ابتدایی بلافاصله پس از اتمام مسابقه',
      '۴ ساعت پس از حمام و استراحت کامل',
      'صبح روز بعد در وعده صبحانه',
      'هیچ نیازی به مصرف فوری مواد قندی نیست',
    ],
    correctIndex: 0,
    explanation: 'در بازه ۳۰ تا ۴۵ دقیقه پس از بازی، آنزیم گلیکوژن سنتتاز در اوج فعالیت است.',
    xpReward: 30,
    coinReward: 15,
  },
  {
    id: 5,
    category: 'تاکتیک دفاعی',
    categoryColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    question: 'در دفاع تک به تک (1v1 Defending)، موقعیت صحیح جهت بدن (Body Shape) نسبت به مهاجم چیست؟',
    options: [
      'ایستادن با سینه صاف و پاهای کاملاً موازی',
      'موقعیت نیم‌رخ (Side-on) روی پنجه پاها جهت هدایت مهاجم به سمت ضعیف',
      'تکل کشویی فوری با اولین استپ حریف',
      'چرخیدن پشت به مهاجم',
    ],
    correctIndex: 1,
    explanation: 'فرم بدن نیم‌رخ (Jockey) به مدافع اجازه می‌دهد تعادل و شتاب معکوس خود را حفظ کند.',
    xpReward: 35,
    coinReward: 15,
  },
];

const STORAGE_KEY = 'first_touch_quiz_questions_store';

export function getQuizQuestions(): QuizQuestion[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return DEFAULT_QUIZ_QUESTIONS;
}

export function saveQuizQuestions(questions: QuizQuestion[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(questions));
    window.dispatchEvent(new CustomEvent('ft_quiz_updated', { detail: questions }));
  } catch {}
}

export function addQuizQuestion(q: Omit<QuizQuestion, 'id'>): QuizQuestion {
  const current = getQuizQuestions();
  const newId = current.length > 0 ? Math.max(...current.map((item) => item.id)) + 1 : 1;
  const newQuestion: QuizQuestion = {
    ...q,
    id: newId,
  };
  const updated = [newQuestion, ...current];
  saveQuizQuestions(updated);

  // Sync to API
  fetch(`${API_BASE_URL}/quiz/questions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newQuestion),
  }).catch(() => {});

  return newQuestion;
}

export function deleteQuizQuestion(id: number): void {
  const current = getQuizQuestions();
  const updated = current.filter((q) => q.id !== id);
  saveQuizQuestions(updated);

  fetch(`${API_BASE_URL}/quiz/questions/${id}`, {
    method: 'DELETE',
  }).catch(() => {});
}

export function resetQuizQuestions(): QuizQuestion[] {
  saveQuizQuestions(DEFAULT_QUIZ_QUESTIONS);
  return DEFAULT_QUIZ_QUESTIONS;
}

export async function syncQuizQuestionsWithServer(): Promise<QuizQuestion[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/quiz/questions`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        saveQuizQuestions(data);
        return data;
      }
    }
  } catch {}
  return getQuizQuestions();
}
