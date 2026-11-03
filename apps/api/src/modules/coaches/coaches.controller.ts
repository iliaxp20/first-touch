import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { CoachesService } from './coaches.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

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
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'مشاهده درخواست‌های فعال مربی اختصاصی (نیازمند لاگین)' })
  @ApiResponse({ status: 200, description: 'فهرست درخواست‌ها' })
  @ApiResponse({ status: 401, description: 'عدم احراز هویت' })
  async getRequests() {
    return this.coachesService.getMyRequests();
  }

  @Get(':id')
  @ApiOperation({ summary: 'مشاهده پروفایل و رزومه کامل مربی' })
  async getCoachById(@Param('id') id: string) {
    return this.coachesService.findOne(id);
  }

  @Post('request')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'ارسال درخواست انتخاب مربی اختصاصی و طراحی برنامه (نیازمند لاگین)' })
  @ApiResponse({ status: 201, description: 'درخواست با موفقیت ثبت شد' })
  @ApiResponse({ status: 401, description: 'عدم احراز هویت' })
  async requestCoach(@Body() body: any) {
    return this.coachesService.requestCoach(body);
  }
}
