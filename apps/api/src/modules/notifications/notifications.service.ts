import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { CreateNotificationDto, NotificationItem } from './notifications.dto';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  private notifications: NotificationItem[] = [];
  private readonly storageFilePath = path.resolve(process.cwd(), 'data', 'notifications.json');

  constructor() {
    this.loadFromDisk();
  }

  private loadFromDisk() {
    try {
      if (fs.existsSync(this.storageFilePath)) {
        const raw = fs.readFileSync(this.storageFilePath, 'utf-8');
        const list = JSON.parse(raw);
        if (Array.isArray(list)) {
          this.notifications = list;
          this.logger.log(`Loaded ${this.notifications.length} notifications from disk.`);
          return;
        }
      }
    } catch (err: any) {
      this.logger.warn(`Failed loading notifications: ${err.message}`);
    }
    this.notifications = [];
  }

  private saveToDisk() {
    try {
      const dir = path.dirname(this.storageFilePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(this.storageFilePath, JSON.stringify(this.notifications, null, 2), 'utf-8');
    } catch (err: any) {
      this.logger.error(`Failed saving notifications: ${err.message}`);
    }
  }

  findAll(): NotificationItem[] {
    return this.notifications;
  }

  create(dto: CreateNotificationDto): NotificationItem {
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: dto.title,
      message: dto.message,
      type: dto.type || 'system',
      createdAt: new Date().toISOString(),
      isRead: false,
    };
    this.notifications.unshift(newNotif);
    this.saveToDisk();
    return newNotif;
  }

  remove(id: string): { success: boolean } {
    this.notifications = this.notifications.filter((n) => n.id !== id);
    this.saveToDisk();
    return { success: true };
  }
}
