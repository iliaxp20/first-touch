import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto, NotificationItem } from './notifications.dto';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  findAll(): NotificationItem[] {
    return this.notificationsService.findAll();
  }

  @Post()
  create(@Body() dto: CreateNotificationDto): NotificationItem {
    return this.notificationsService.create(dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): { success: boolean } {
    return this.notificationsService.remove(id);
  }
}
