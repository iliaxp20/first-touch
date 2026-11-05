import { Controller, Get, Post, Body, Param, Query, Patch, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { ProgramsService } from './programs.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles, Role } from '../../common/decorators/roles.decorator';

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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.COACH, Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'طراحی و انتشار برنامه تمرینی جدید (توسط مربی یا ادمین با توکن معتبر)' })
  @ApiResponse({ status: 201, description: 'برنامه با موفقیت منتشر شد' })
  @ApiResponse({ status: 401, description: 'عدم احراز هویت' })
  @ApiResponse({ status: 403, description: 'عدم دسترسی' })
  async createProgram(@Body() body: any) {
    return this.programsService.create(body);
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
