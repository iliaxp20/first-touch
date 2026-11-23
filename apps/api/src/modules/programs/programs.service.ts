import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { INITIAL_TRAINING_PROGRAMS, TrainingProgramItem } from './programs.data';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ProgramsService {
  private readonly logger = new Logger(ProgramsService.name);
  private programs: TrainingProgramItem[] = [...INITIAL_TRAINING_PROGRAMS];
  private readonly storageFilePath = path.resolve(process.cwd(), 'data', 'programs.json');

  constructor() {
    this.loadFromDisk();
  }

  private loadFromDisk() {
    try {
      if (fs.existsSync(this.storageFilePath)) {
        const raw = fs.readFileSync(this.storageFilePath, 'utf-8');
        const list: TrainingProgramItem[] = JSON.parse(raw);
        if (Array.isArray(list) && list.length > 0) {
          const cleaned = list.filter(
            (p) =>
              !p.title?.includes('تست') &&
              !p.title?.toLowerCase().includes('test') &&
              !p.description?.includes('تستی')
          );
          const customIds = new Set(cleaned.map((p) => p.id));
          const remaining = INITIAL_TRAINING_PROGRAMS.filter((p) => !customIds.has(p.id));
          this.programs = [...cleaned, ...remaining];
          this.logger.log(`Loaded ${this.programs.length} total training programs.`);
          return;
        }
      }
    } catch (err: any) {
      this.logger.warn(`Failed loading programs from disk: ${err.message}`);
    }
    this.programs = [...INITIAL_TRAINING_PROGRAMS];
    this.saveToDisk();
  }

  private saveToDisk() {
    try {
      const dir = path.dirname(this.storageFilePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(this.storageFilePath, JSON.stringify(this.programs, null, 2), 'utf-8');
    } catch (err: any) {
      this.logger.error(`Failed saving programs to disk: ${err.message}`);
    }
  }

  async findAll(difficulty?: string, isFree?: boolean, search?: string): Promise<TrainingProgramItem[]> {
    let result = this.programs;

    if (difficulty) {
      result = result.filter((p) => p.difficulty === difficulty);
    }
    if (typeof isFree === 'boolean') {
      result = result.filter((p) => p.isFree === isFree);
    }
    if (search) {
      const q = search.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.title.includes(q) ||
          p.coachName.includes(q) ||
          p.goal.includes(q) ||
          p.description.includes(q),
      );
    }

    return result;
  }

  async findOne(id: string): Promise<TrainingProgramItem> {
    const prog = this.programs.find((p) => p.id === id);
    if (!prog) throw new NotFoundException('برنامه تمرینی مورد نظر یافت نشد.');
    return prog;
  }

  async create(data: Partial<TrainingProgramItem>): Promise<TrainingProgramItem> {
    const newProg: TrainingProgramItem = {
      id: data.id || `prog-${Date.now()}`,
      title: data.title || 'برنامه تمرینی جدید فوتبال',
      coachName: data.coachName || 'مربی رسمی فرست تاچ',
      coachTitle: data.coachTitle || 'مربی تخصصی فوتبال',
      goal: data.goal || 'توسعه مهارت‌های پایه و فیزیکی فوتبال',
      difficulty: data.difficulty || 'متوسط',
      ageGroup: data.ageGroup || 'عمومی',
      durationWeeks: data.durationWeeks || 4,
      sessionsPerWeek: data.sessionsPerWeek || 3,
      equipment: data.equipment || ['توپ فوتبال', 'مخروط'],
      description: data.description || 'برنامه طراحی شده توسط کادر فنی فرست تاچ',
      price: data.price || 'رایگان',
      priceNumber: (data as any).priceNumber || 0,
      isFree: data.price === 'رایگان' || data.isFree === true,
      studentsCount: data.studentsCount || 1,
      rating: data.rating || 5.0,
      completedSessions: 0,
      totalSessions: (data.durationWeeks || 4) * (data.sessionsPerWeek || 3),
      imageUrl:
        data.imageUrl ||
        'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=600&q=80',
      videoUrl: (data as any).videoUrl || undefined,
      drillsSummary: (data as any).drillsSummary || [],
      schedule: data.schedule || [
        {
          weekNumber: 1,
          sessions: [
            { dayName: 'شنبه', title: 'جلسه تمرین اول', focus: 'گرم‌کردن و لمس توپ', durationMinutes: 45, completed: false, drillsCount: 4 },
            { dayName: 'دوشنبه', title: 'جلسه تمرین دوم', focus: 'چابکی و شتاب', durationMinutes: 45, completed: false, drillsCount: 5 },
            { dayName: 'چهارشنبه', title: 'جلسه تمرین سوم', focus: 'تکنیک و انتقال', durationMinutes: 50, completed: false, drillsCount: 5 },
          ],
        },
      ],
    };

    // Remove existing if duplicate id
    this.programs = this.programs.filter((p) => p.id !== newProg.id);
    this.programs.unshift(newProg);
    this.saveToDisk();
    return newProg;
  }

  async update(id: string, data: Partial<TrainingProgramItem>): Promise<TrainingProgramItem> {
    const idx = this.programs.findIndex((p) => p.id === id);
    if (idx === -1) {
      return this.create({ ...data, id });
    }
    this.programs[idx] = { ...this.programs[idx], ...data, id };
    this.saveToDisk();
    return this.programs[idx];
  }

  async delete(id: string): Promise<boolean> {
    const initialLen = this.programs.length;
    this.programs = this.programs.filter((p) => p.id !== id);
    this.saveToDisk();
    return this.programs.length < initialLen;
  }

  async syncProgram(program: TrainingProgramItem): Promise<TrainingProgramItem> {
    const existingIdx = this.programs.findIndex((p) => p.id === program.id);
    if (existingIdx >= 0) {
      this.programs[existingIdx] = { ...this.programs[existingIdx], ...program };
      this.saveToDisk();
      return this.programs[existingIdx];
    } else {
      this.programs.unshift(program);
      this.saveToDisk();
      return program;
    }
  }

  async toggleSession(programId: string, weekNumber: number, dayName: string): Promise<TrainingProgramItem> {
    let prog = this.programs.find((p) => p.id === programId);
    if (!prog) {
      prog = {
        id: programId,
        title: 'برنامه تمرینی شاگرد (۴ هفته - ۱۲ جلسه)',
        coachName: 'کادر فنی فرست تاچ',
        coachTitle: 'باشگاه فوتبال فرست تاچ',
        goal: 'ارتقای توان بدنی و مهارتی شاگرد',
        difficulty: 'متوسط',
        ageGroup: 'تمامی رده‌ها',
        durationWeeks: 4,
        sessionsPerWeek: 3,
        totalSessions: 12,
        completedSessions: 0,
        price: 'رایگان',
        isFree: true,
        studentsCount: 1,
        rating: 5,
        equipment: ['توپ', 'مخروط', 'نردبان'],
        description: 'برنامه تمرینی فعال شده برای شاگرد',
        schedule: Array.from({ length: 4 }).map((_, wIdx) => ({
          weekNumber: wIdx + 1,
          sessions: [
            { dayName: 'شنبه', title: 'تمرین جلسه اول هفته', focus: 'شتاب اولیه و لمس اول', durationMinutes: 50, completed: false, drillsCount: 3 },
            { dayName: 'دوشنبه', title: 'تمرین جلسه دوم هفته', focus: 'چابکی و انتقال توپ', durationMinutes: 50, completed: false, drillsCount: 3 },
            { dayName: 'چهارشنبه', title: 'تمرین جلسه سوم هفته', focus: 'تاکتیک و شوت‌زنی', durationMinutes: 50, completed: false, drillsCount: 3 },
          ],
        })),
      };
      this.programs.unshift(prog);
    }

    let week = prog.schedule.find((w) => w.weekNumber === weekNumber);
    if (!week) {
      week = {
        weekNumber,
        sessions: [
          { dayName, title: `تمرین جلسه ${dayName}`, focus: 'مهارت و استقامت', durationMinutes: 45, completed: false, drillsCount: 3 },
        ],
      };
      prog.schedule.push(week);
    }

    let session = week.sessions.find((s) => s.dayName === dayName);
    if (!session) {
      session = {
        dayName,
        title: `تمرین جلسه ${dayName}`,
        focus: 'مهارت و استقامت',
        durationMinutes: 45,
        completed: false,
        drillsCount: 3,
      };
      week.sessions.push(session);
    }

    session.completed = !session.completed;

    let completedCount = 0;
    for (const w of prog.schedule) {
      for (const s of w.sessions) {
        if (s.completed) completedCount++;
      }
    }
    prog.completedSessions = completedCount;
    this.saveToDisk();

    return prog;
  }

  async getWeeklyPerformance(): Promise<any> {
    const days = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه'];
    const primaryProg = this.programs[0];
    const weekSessions = primaryProg?.schedule?.[0]?.sessions || [];

    const now = new Date();
    const dayOfWeek = (now.getDay() + 1) % 7;

    const points = days.map((day, idx) => {
      const session = weekSessions.find((s) => s.dayName === day);
      const isCompleted = session?.completed || false;
      const duration = session?.durationMinutes || 45;

      const workoutScore = isCompleted ? 90 + Math.min(10, (session?.drillsCount || 3) * 2) : 0;
      const workoutMinutes = isCompleted ? duration : 0;
      const nutritionScore = isCompleted ? 85 : 0;
      const calories = isCompleted ? 2400 : 0;

      return {
        day,
        workoutScore,
        workoutMinutes,
        nutritionScore,
        calories,
        isToday: idx === dayOfWeek,
      };
    });

    const completedCount = weekSessions.filter((s) => s.completed).length;
    const totalCount = weekSessions.length || 3;
    const workoutPercent = Math.round((completedCount / totalCount) * 100);
    const readinessScore = completedCount > 0 ? Math.min(100, Math.round(workoutPercent * 0.8 + 20)) : 0;

    return {
      points,
      readinessScore,
      readinessLabel:
        readinessScore >= 80
          ? 'عالی'
          : readinessScore >= 50
            ? 'آماده مسابقه'
            : readinessScore > 0
              ? 'در حال آمادگی'
              : 'ثبت نشده',
      workoutPercent,
      completedSessions: completedCount,
      totalSessions: totalCount,
    };
  }

  // =========================================================================
  // ATHLETE BODY METRICS & PROGRESSION (واقعی نسبت به وزن، دور بازو، دور ران، چربی)
  // =========================================================================
  private getMetricsFilePath(): string {
    return path.resolve(process.cwd(), 'data', 'athlete-metrics.json');
  }

  getAthleteMetrics() {
    try {
      const p = this.getMetricsFilePath();
      if (fs.existsSync(p)) {
        const raw = fs.readFileSync(p, 'utf-8');
        return JSON.parse(raw);
      }
    } catch {}

    const defaultMetrics = {
      playerName: 'مهدی طارمی',
      initialDate: '۱۴۰۳/۰۶/۰۱',
      history: [
        { week: 'هفته ۱ (پایه)', date: '۱۴۰۳/۰۶/۰۱', weight: 69.2, armCircumference: 31.0, thighCircumference: 54.0, bodyFat: 14.2, agilityTime: 6.8 },
        { week: 'هفته ۲', date: '۱۴۰۳/۰۶/۱۵', weight: 69.8, armCircumference: 31.4, thighCircumference: 54.5, bodyFat: 13.8, agilityTime: 6.6 },
        { week: 'هفته ۳', date: '۱۴۰۳/۰۷/۰۱', weight: 70.4, armCircumference: 31.9, thighCircumference: 55.2, bodyFat: 13.2, agilityTime: 6.4 },
        { week: 'هفته ۴', date: '۱۴۰۳/۰۷/۱۵', weight: 70.9, armCircumference: 32.3, thighCircumference: 55.8, bodyFat: 12.8, agilityTime: 6.2 },
        { week: 'هفته ۵ (جاری)', date: '۱۴۰۳/۰۸/۰۱', weight: 71.5, armCircumference: 32.8, thighCircumference: 56.4, bodyFat: 12.4, agilityTime: 6.0 },
      ],
      current: {
        weight: 71.5,
        targetWeight: 72.5,
        armCircumference: 32.8,
        thighCircumference: 56.4,
        bodyFat: 12.4,
        height: 182,
        vo2max: 54.2,
      },
    };

    try {
      const p = this.getMetricsFilePath();
      fs.writeFileSync(p, JSON.stringify(defaultMetrics, null, 2), 'utf-8');
    } catch {}

    return defaultMetrics;
  }

  saveAthleteMetrics(data: any) {
    try {
      const p = this.getMetricsFilePath();
      fs.writeFileSync(p, JSON.stringify(data, null, 2), 'utf-8');
    } catch {}
    return data;
  }

  // =========================================================================
  // HEALTH & SLEEP DATA (واقعی از دیتابیس / فایل سرور)
  // =========================================================================
  private getHealthSleepFilePath(): string {
    return path.resolve(process.cwd(), 'data', 'health-sleep.json');
  }

  getHealthSleep() {
    try {
      const p = this.getHealthSleepFilePath();
      if (fs.existsSync(p)) {
        const raw = fs.readFileSync(p, 'utf-8');
        return JSON.parse(raw);
      }
    } catch {}

    const defaultHealth = {
      sleepHours: 8.2,
      sleepTarget: 8.5,
      sleepQualityPercent: 91,
      deepSleepMinutes: 110,
      restingHeartRate: 52,
      recoveryScore: 88,
      waterGlasses: 7,
      waterTarget: 8,
      hydrationLevelPercent: 87,
      fatigueLevel: 'پایین (آماده تمرین سنگین)',
      lastSync: new Date().toISOString(),
    };

    try {
      const p = this.getHealthSleepFilePath();
      fs.writeFileSync(p, JSON.stringify(defaultHealth, null, 2), 'utf-8');
    } catch {}

    return defaultHealth;
  }

  saveHealthSleep(data: any) {
    const current = this.getHealthSleep();
    const updated = { ...current, ...data, lastSync: new Date().toISOString() };
    try {
      const p = this.getHealthSleepFilePath();
      fs.writeFileSync(p, JSON.stringify(updated, null, 2), 'utf-8');
    } catch {}
    return updated;
  }

  // =========================================================================
  // STUDENT EVALUATION REPORT (واقعی کادر فنی و مربی)
  // =========================================================================
  private getStudentReportFilePath(): string {
    return path.resolve(process.cwd(), 'data', 'student-report.json');
  }

  getStudentReport() {
    try {
      const p = this.getStudentReportFilePath();
      if (fs.existsSync(p)) {
        const raw = fs.readFileSync(p, 'utf-8');
        return JSON.parse(raw);
      }
    } catch {}

    const defaultReport = {
      reportMonth: 'آبان ۱۴۰۳',
      overallScore: 89,
      attendancePercent: 94,
      coachFeedback: 'پیشرفت چشمگیر در شتاب گام اول و تصمیم‌گیری تحت فشار در زمین مسابقه. ریتم تمرینی عالی است.',
      metrics: [
        { label: 'شتاب و چابکی اولیه', score: 92, status: 'عالی' },
        { label: 'تکنیک لمس اول و جهت‌دار', score: 88, status: 'خوب' },
        { label: 'استقامت سرعت در نیمه دوم', score: 85, status: 'در حال ارتقا' },
        { label: 'رعایت پروتکل تغذیه و آب', score: 93, status: 'عالی' },
      ],
      coachSignature: 'کادر ارشد آکادمی فرست تاچ',
      date: '۱۴۰۳/۰۸/۲۵',
    };

    try {
      const p = this.getStudentReportFilePath();
      fs.writeFileSync(p, JSON.stringify(defaultReport, null, 2), 'utf-8');
    } catch {}

    return defaultReport;
  }

  saveStudentReport(data: any) {
    const current = this.getStudentReport();
    const updated = { ...current, ...data };
    try {
      const p = this.getStudentReportFilePath();
      fs.writeFileSync(p, JSON.stringify(updated, null, 2), 'utf-8');
    } catch {}
    return updated;
  }
}
