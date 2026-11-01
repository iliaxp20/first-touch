import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CoachesService } from './coaches.service';

@ApiTags('مربی اختصاصی فوتبال (Personal Coach)')
@Controller('coaches')
export class CoachesController {
  constructor(private readonly coachesService: CoachesService) {}

  @Get()
  @ApiOperation({ summary: 'دریافت فهرست مربیان مجرب اختصاصی فوتبال' })
  async getCoaches() {
    return this.coachesService.findAll();
  }

  @Get('requests')
  @ApiOperation({ summary: 'مشاهده درخواست‌های فعال مربی اختصاصی' })
  async getRequests() {
    return this.coachesService.getMyRequests();
  }

  @Get(':id')
  @ApiOperation({ summary: 'مشاهده پروفایل و رزومه کامل مربی' })
  async getCoachById(@Param('id') id: string) {
    return this.coachesService.findOne(id);
  }

  @Post('request')
  @ApiOperation({ summary: 'ارسال درخواست انتخاب مربی اختصاصی و طراحی برنامه' })
  async requestCoach(@Body() body: any) {
    return this.coachesService.requestCoach(body);
  }
}
