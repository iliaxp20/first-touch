import { Injectable, NotFoundException } from '@nestjs/common';
import { INITIAL_TRAINING_PROGRAMS, TrainingProgramItem, ProgramSession } from './programs.data';

@Injectable()
export class ProgramsService {
  private programs: TrainingProgramItem[] = [...INITIAL_TRAINING_PROGRAMS];

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
          p.description.includes(q)
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
      id: `prog-${Date.now()}`,
      title: data.title || 'برنامه تمرینی جدید فوتبال',
      coachName: data.coachName || 'مربی رسمی فرست تاچ',
      coachTitle: data.coachTitle || 'مربی تخصصی فوتبال',
      goal: data.goal || 'توسعه مهارت‌های پایه و فیزیکی فوتبال',
      difficulty: data.difficulty || 'متوسط',
      ageGroup: data.ageGroup || 'عمومی',
      durationWeeks: data.durationWeeks || 4,
      sessionsPerWeek: data.sessionsPerWeek || 3,
      equipment: data.equipment || ['توپ فوتبال', 'مخروط'],
      description: data.description || 'برنامه طراحی شده توسط کادر فنی آکادمی',
      price: data.price || 'رایگان',
      isFree: data.price === 'رایگان' || data.isFree === true,
      studentsCount: 1,
      rating: 5.0,
      completedSessions: 0,
      totalSessions: (data.durationWeeks || 4) * (data.sessionsPerWeek || 3),
      imageUrl: data.imageUrl || 'https://images.openai.com/static-rsc-4/qr3bFQNLQ-6RnlAK30bK7sB2zv_wOR8ua0bYy2A6pz6NaS-REUyRJHehDjPdZGFLgIZr8LAC2UNzudc8JIjYfEGucgJ4GoGeiaQPMJRfmb5mdYVSqFKriMqUkrzijmKHl6mPLbbzwT7o7bJOlDEnxBOtvBhh7wroNSOvPDbPwWo?purpose=inline',
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

    this.programs.unshift(newProg);
    return newProg;
  }

  async toggleSession(programId: string, weekNumber: number, dayName: string): Promise<TrainingProgramItem> {
    const prog = await this.findOne(programId);
    const week = prog.schedule.find((w) => w.weekNumber === weekNumber);
    if (!week) throw new NotFoundException('هفته مورد نظر یافت نشد.');

    const session = week.sessions.find((s) => s.dayName === dayName);
    if (!session) throw new NotFoundException('جلسه تمرینی مورد نظر یافت نشد.');

    session.completed = !session.completed;

    // Recalculate completed sessions
    let completedCount = 0;
    for (const w of prog.schedule) {
      for (const s of w.sessions) {
        if (s.completed) completedCount++;
      }
    }
    prog.completedSessions = completedCount;

    return prog;
  }
}
