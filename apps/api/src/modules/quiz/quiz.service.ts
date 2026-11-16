import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { CreateQuizQuestionDto } from './dto/create-quiz-question.dto';

export interface QuizQuestionItem {
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

const DEFAULT_QUESTIONS: QuizQuestionItem[] = [
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
];

@Injectable()
export class QuizService {
  private readonly logger = new Logger(QuizService.name);
  private readonly dataDir = path.resolve(__dirname, '../../../data');
  private readonly dataFilePath = path.join(this.dataDir, 'quiz-questions.json');
  private questions: QuizQuestionItem[] = [];

  constructor() {
    this.ensureDataFile();
  }

  private ensureDataFile() {
    try {
      if (!fs.existsSync(this.dataDir)) {
        fs.mkdirSync(this.dataDir, { recursive: true });
      }
      if (!fs.existsSync(this.dataFilePath)) {
        fs.writeFileSync(this.dataFilePath, JSON.stringify(DEFAULT_QUESTIONS, null, 2), 'utf-8');
        this.questions = [...DEFAULT_QUESTIONS];
      } else {
        const raw = fs.readFileSync(this.dataFilePath, 'utf-8');
        this.questions = JSON.parse(raw);
      }
    } catch (e) {
      this.logger.warn(`Failed loading quiz file, using defaults: ${e.message}`);
      this.questions = [...DEFAULT_QUESTIONS];
    }
  }

  private persist() {
    try {
      fs.writeFileSync(this.dataFilePath, JSON.stringify(this.questions, null, 2), 'utf-8');
    } catch (e) {
      this.logger.error(`Error saving quiz file: ${e.message}`);
    }
  }

  findAll(): QuizQuestionItem[] {
    return this.questions;
  }

  create(dto: CreateQuizQuestionDto): QuizQuestionItem {
    const newId = this.questions.length > 0 ? Math.max(...this.questions.map((q) => q.id)) + 1 : 1;
    const item: QuizQuestionItem = {
      id: newId,
      category: dto.category,
      categoryColor: dto.categoryColor || 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      question: dto.question,
      options: dto.options,
      correctIndex: Number(dto.correctIndex),
      explanation: dto.explanation,
      coinReward: Number(dto.coinReward) || 15,
      xpReward: Number(dto.xpReward) || 35,
    };
    this.questions.unshift(item);
    this.persist();
    return item;
  }

  delete(id: number): { success: boolean } {
    this.questions = this.questions.filter((q) => q.id !== Number(id));
    this.persist();
    return { success: true };
  }
}
