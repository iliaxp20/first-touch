import { Controller, Get, Post, Body, Param, Query, Patch } from '@nestjs/common';
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

  @Get(':id')
  @ApiOperation({ summary: 'مشاهده جزئیات برنامه و تقویم اجرایی جلسات' })
  async getProgramById(@Param('id') id: string) {
    return this.programsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'طراحی و انتشار برنامه تمرینی جدید (توسط مربی یا ادمین)' })
  @ApiResponse({ status: 201, description: 'برنامه با موفقیت منتشر شد' })
  async createProgram(@Body() body: any) {
    return this.programsService.create(body);
  }

  @Patch(':id/session-toggle')
  @ApiOperation({ summary: 'ثبت و تغییر وضعیت تکمیل جلسه در تقویم اجرایی' })
  async toggleSession(
    @Param('id') id: string,
    @Body() body: { weekNumber: number; dayName: string },
  ) {
    return this.programsService.toggleSession(id, body.weekNumber, body.dayName);
  }
}
