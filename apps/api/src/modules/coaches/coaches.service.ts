import { Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { AuthService } from '../auth/auth.service';

export interface CoachRequest {
  id: string;
  coachId: string;
  coachName: string;
  traineeId: string;
  playerName: string;
  playerPhone?: string;
  playerAge?: string;
  playerPosition?: string;
  goals: string;
  status: 'PENDING' | 'ACCEPTED' | 'ACTIVE';
  createdAt: string;
}

export interface CoachNotification {
  id: string;
  coachId: string;
  traineeId: string;
  traineeName: string;
  traineePhone?: string;
  planTitle: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}

export interface CoachChatMessage {
  id: string;
  coachId: string;
  traineeId: string;
  sender: 'coach' | 'trainee';
  senderName: string;
  text: string;
  mediaUrl?: string; // photo or video
  mediaType?: 'image' | 'video';
  createdAt: string;
}

@Injectable()
export class CoachesService {
  private requests: CoachRequest[] = [];
  private notifications: CoachNotification[] = [];
  private messages: CoachChatMessage[] = [];

  constructor(private readonly authService: AuthService) {
    this.loadPersistence();
  }

  private getDataDir(): string {
    const d = path.resolve(__dirname, '../../../data');
    if (!fs.existsSync(d)) {
      try { fs.mkdirSync(d, { recursive: true }); } catch {}
    }
    return d;
  }

  private loadPersistence() {
    try {
      const dir = this.getDataDir();
      const notifPath = path.join(dir, 'coach-notifications.json');
      if (fs.existsSync(notifPath)) {
        this.notifications = JSON.parse(fs.readFileSync(notifPath, 'utf-8'));
      }
      const msgPath = path.join(dir, 'coach-messages.json');
      if (fs.existsSync(msgPath)) {
        this.messages = JSON.parse(fs.readFileSync(msgPath, 'utf-8'));
      }
      const reqPath = path.join(dir, 'coach-requests.json');
      if (fs.existsSync(reqPath)) {
        this.requests = JSON.parse(fs.readFileSync(reqPath, 'utf-8'));
      }
    } catch {}
  }

  private savePersistence() {
    try {
      const dir = this.getDataDir();
      fs.writeFileSync(path.join(dir, 'coach-notifications.json'), JSON.stringify(this.notifications, null, 2), 'utf-8');
      fs.writeFileSync(path.join(dir, 'coach-messages.json'), JSON.stringify(this.messages, null, 2), 'utf-8');
      fs.writeFileSync(path.join(dir, 'coach-requests.json'), JSON.stringify(this.requests, null, 2), 'utf-8');
    } catch {}
  }

  // Returns ONLY real registered coaches (role: COACH)
  async findAll(): Promise<any[]> {
    return this.authService.getCoaches();
  }

  async findOne(id: string): Promise<any> {
    const realCoaches = this.authService.getCoaches();
    const coach = realCoaches.find((c) => c.id === id || c.phoneNumber === id);
    if (!coach) throw new NotFoundException('مربی مورد نظر یافت نشد یا ثبت‌نام نکرده است.');
    return coach;
  }

  // When student purchases or requests a plan from a coach
  async requestCoach(data: {
    coachId: string;
    coachName?: string;
    traineeId?: string;
    playerName: string;
    playerPhone?: string;
    playerAge?: string;
    playerPosition?: string;
    goals: string;
    planTitle?: string;
  }): Promise<CoachRequest> {
    const coach = await this.findOne(data.coachId).catch(() => ({
      id: data.coachId,
      fullName: data.coachName || 'مربی اختصاصی',
    }));

    const traineeId = data.traineeId || `tr-${Date.now()}`;
    const planTitle = data.planTitle || 'برنامه اختصاصی مربی';

    const req: CoachRequest = {
      id: `req-${Date.now()}`,
      coachId: coach.id,
      coachName: coach.fullName,
      traineeId,
      playerName: data.playerName,
      playerPhone: data.playerPhone || '',
      playerAge: data.playerAge || '',
      playerPosition: data.playerPosition || '',
      goals: data.goals,
      status: 'ACTIVE',
      createdAt: new Date().toLocaleDateString('fa-IR'),
    };

    this.requests.unshift(req);

    // Create Notification for the Coach
    const notif: CoachNotification = {
      id: `notif-${Date.now()}`,
      coachId: coach.id,
      traineeId,
      traineeName: data.playerName,
      traineePhone: data.playerPhone || '',
      planTitle,
      message: `شاگرد جدید: ${data.playerName} برنامه تمرینی «${planTitle}» را با شما فعال کرد. اکنون می‌توانید از بخش پیام‌ها با او در ارتباط باشید و ویدیو/عکس ارسال کنید.`,
      createdAt: new Date().toLocaleDateString('fa-IR'),
      isRead: false,
    };
    this.notifications.unshift(notif);

    // Create initial welcome message from Coach to Trainee
    const welcomeMsg: CoachChatMessage = {
      id: `msg-${Date.now()}`,
      coachId: coach.id,
      traineeId,
      sender: 'coach',
      senderName: coach.fullName,
      text: `سلام ${data.playerName} عزیز! به برنامه اختصاصی خوش آمدی. ویدیوها و گزارش‌های تمرینی‌ات را اینجا بفرست تا پس از بررسی، بازخورد فنی و آنالیز لمس اول را ارائه دهم.`,
      createdAt: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
    };
    this.messages.push(welcomeMsg);

    this.savePersistence();
    return req;
  }

  async getMyRequests(): Promise<CoachRequest[]> {
    return this.requests;
  }

  // Get notifications for a coach
  async getCoachNotifications(coachId?: string): Promise<CoachNotification[]> {
    if (!coachId) return this.notifications;
    return this.notifications.filter((n) => n.coachId === coachId || !n.coachId);
  }

  // Chat messages between Coach and Trainee
  async getMessages(coachId?: string, traineeId?: string): Promise<CoachChatMessage[]> {
    let list = this.messages;
    if (coachId) list = list.filter((m) => m.coachId === coachId);
    if (traineeId) list = list.filter((m) => m.traineeId === traineeId);
    return list;
  }

  async sendMessage(data: {
    coachId: string;
    traineeId: string;
    sender: 'coach' | 'trainee';
    senderName: string;
    text: string;
    mediaUrl?: string;
    mediaType?: 'image' | 'video';
  }): Promise<CoachChatMessage> {
    const msg: CoachChatMessage = {
      id: `msg-${Date.now()}`,
      coachId: data.coachId,
      traineeId: data.traineeId,
      sender: data.sender,
      senderName: data.senderName,
      text: data.text || '',
      mediaUrl: data.mediaUrl,
      mediaType: data.mediaType,
      createdAt: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
    };
    this.messages.push(msg);
    this.savePersistence();
    return msg;
  }
}
