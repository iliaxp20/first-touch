import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { CoachesService } from './coaches.service';

@ApiTags('مربی اختصاصی و ارتباط با شاگرد (Personal Coach & Trainee Chat)')
@Controller('coaches')
export class CoachesController {
  constructor(private readonly coachesService: CoachesService) {}

  @Get()
  @ApiOperation({ summary: 'دریافت فهرست مربیان واقعی ثبت‌نام‌شده سیستم' })
  async getCoaches() {
    return this.coachesService.findAll();
  }

  @Get('requests')
  @ApiOperation({ summary: 'مشاهده درخواست‌های فعال مربی' })
  async getRequests() {
    return this.coachesService.getMyRequests();
  }

  @Get('notifications')
  @ApiOperation({ summary: 'دریافت اعلان‌های ارسالی برای مربی (هنگام خرید برنامه توسط شاگرد)' })
  @ApiQuery({ name: 'coachId', required: false })
  async getNotifications(@Query('coachId') coachId?: string) {
    return this.coachesService.getCoachNotifications(coachId);
  }

  @Get('messages')
  @ApiOperation({ summary: 'دریافت پیام‌های چت میان مربی و شاگرد' })
  @ApiQuery({ name: 'coachId', required: false })
  @ApiQuery({ name: 'traineeId', required: false })
  async getMessages(
    @Query('coachId') coachId?: string,
    @Query('traineeId') traineeId?: string,
  ) {
    return this.coachesService.getMessages(coachId, traineeId);
  }

  @Post('messages')
  @ApiOperation({ summary: 'ارسال پیام جدید همراه با عکس و فیلم بین مربی و شاگرد' })
  @ApiResponse({ status: 201, description: 'پیام ارسال شد' })
  async sendMessage(@Body() body: any) {
    return this.coachesService.sendMessage(body);
  }

  @Get(':id')
  @ApiOperation({ summary: 'مشاهده مشخصات مربی با شناسه' })
  async getCoachById(@Param('id') id: string) {
    return this.coachesService.findOne(id);
  }

  @Post('request')
  @ApiOperation({ summary: 'ارسال درخواست یا خرید برنامه اختصاصی مربی و ایجاد نوتیفیکیشن' })
  @ApiResponse({ status: 201, description: 'درخواست با موفقیت ثبت شد' })
  async requestCoach(@Body() body: any) {
    return this.coachesService.requestCoach(body);
  }
}
