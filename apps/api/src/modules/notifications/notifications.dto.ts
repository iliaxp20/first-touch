export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type?: 'training' | 'nutrition' | 'system' | 'urgent';
  createdAt: string;
  isRead?: boolean;
}

export class CreateNotificationDto {
  title!: string;
  message!: string;
  type?: 'training' | 'nutrition' | 'system' | 'urgent';
}
