import { Controller, Get, Post, Put, Body, Param, Query, Patch, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ProgramsService } from './programs.service';

@ApiTags('برنامه‌های تمرینی آماده (Training Programs)')
@Controller('programs')
export class ProgramsController {
  constructor(private readonly programsService: ProgramsService) {}

  @Get()
  @ApiOperation({ summary: 'دریافت فهرست برنامه‌های تمرینی آماده فوتبال' })
  @ApiQuery({ name: 'difficulty', required: false, enum: ['مبتدی', 'متوسط', 'پیشرفته'] })
  @ApiQuery({ name: 'isFree', required: false, type: Boolean })
  @ApiQuery({ name: 'search', required: false, type: String })
  async getPrograms(
    @Query('difficulty') difficulty?: string,
    @Query('isFree') isFree?: string,
    @Query('search') search?: string,
  ) {
    const isFreeBool = isFree === 'true' ? true : isFree === 'false' ? false : undefined;
    return this.programsService.findAll(difficulty, isFreeBool, search);
  }

  @Get('weekly-performance')
  @ApiOperation({ summary: 'دریافت آمار خطی عملکرد واقعی هفتگی بر اساس جلسات ثبتی' })
  async getWeeklyPerformance() {
    return this.programsService.getWeeklyPerformance();
  }

  @Get('athlete-metrics')
  @ApiOperation({ summary: 'دریافت معیارهای فیزیکی واقعی بازیکن (وزن، دور بازو، دور ران، چربی)' })
  async getAthleteMetrics() {
    return this.programsService.getAthleteMetrics();
  }

  @Put('athlete-metrics')
  @ApiOperation({ summary: 'به‌روزرسانی رکوردهای فیزیکی و سایز بازیکن' })
  async updateAthleteMetrics(@Body() body: any) {
    return this.programsService.saveAthleteMetrics(body);
  }

  @Get('health-sleep')
  @ApiOperation({ summary: 'دریافت آمار واقعی خواب و سلامت بازیکن' })
  async getHealthSleep() {
    return this.programsService.getHealthSleep();
  }

  @Put('health-sleep')
  @ApiOperation({ summary: 'ثبت و به‌روزرسانی وضعیت خواب و سلامت' })
  async updateHealthSleep(@Body() body: any) {
    return this.programsService.saveHealthSleep(body);
  }

  @Get('student-report')
  @ApiOperation({ summary: 'دریافت کارنامه ماهانه و ارزیابی واقعی کادر فنی' })
  async getStudentReport() {
    return this.programsService.getStudentReport();
  }

  @Put('student-report')
  @ApiOperation({ summary: 'ثبت و ارزیابی ماهانه دانش‌آموز توسط مربی' })
  async updateStudentReport(@Body() body: any) {
    return this.programsService.saveStudentReport(body);
  }

  @Get('suggested-drills')
  @ApiOperation({ summary: 'دریافت تمرینات پیشنهادی صفحه اصلی' })
  async getSuggestedDrills() {
    return this.programsService.getSuggestedDrills();
  }

  @Put('suggested-drills')
  @ApiOperation({ summary: 'ویرایش و انتشار تمرینات پیشنهادی توسط مدیر' })
  async updateSuggestedDrills(@Body() body: any) {
    const list = Array.isArray(body) ? body : body.drills;
    return this.programsService.saveSuggestedDrills(list);
  }

  @Get(':id')
  @ApiOperation({ summary: 'مشاهده جزئیات برنامه و تقویم اجرایی جلسات' })
  async getProgramById(@Param('id') id: string) {
    return this.programsService.findOne(id);
  }

  @Post('sync')
  @ApiOperation({ summary: 'همگام‌سازی و ثبت برنامه تمرینی فعال شاگرد در سرور' })
  @ApiResponse({ status: 200, description: 'برنامه با موفقیت در سرور ثبت گردید' })
  async syncProgram(@Body() body: any) {
    return this.programsService.syncProgram(body);
  }

  @Post()
  @ApiOperation({ summary: 'طراحی و انتشار برنامه تمرینی جدید' })
  @ApiResponse({ status: 201, description: 'برنامه با موفقیت منتشر شد' })
  async createProgram(@Body() body: any) {
    return this.programsService.create(body);
  }

  @Put(':id')
  @ApiOperation({ summary: 'ویرایش برنامه تمرینی' })
  @ApiResponse({ status: 200, description: 'برنامه با موفقیت به‌روزرسانی شد' })
  async updateProgram(@Param('id') id: string, @Body() body: any) {
    return this.programsService.update(id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'حذف برنامه تمرینی' })
  @ApiResponse({ status: 200, description: 'برنامه با موفقیت حذف شد' })
  async deleteProgram(@Param('id') id: string) {
    return this.programsService.delete(id);
  }

  @Patch(':id/session-toggle')
  @ApiOperation({ summary: 'ثبت و تغییر وضعیت تکمیل جلسه در تقویم اجرایی' })
  @ApiResponse({ status: 200, description: 'وضعیت جلسه تغییر یافت' })
  async toggleSession(
    @Param('id') id: string,
    @Body() body: { weekNumber: number; dayName: string },
  ) {
    return this.programsService.toggleSession(id, body.weekNumber, body.dayName);
  }
}
