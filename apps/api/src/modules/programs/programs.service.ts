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
          this.programs = list;
          this.logger.log(`Loaded ${list.length} training programs from disk.`);
          return;
        }
      }
    } catch (err: any) {
      this.logger.warn(`Failed loading programs from disk: ${err.message}`);
    }
    // Save defaults to disk if not exists
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
}
