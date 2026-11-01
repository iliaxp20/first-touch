import { Controller, Get, Post, Body, Query, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { DrillsService } from './drills.service';
import { CreateDrillDto } from './dto/create-drill.dto';

@ApiTags('بانک تمرینات چابکی (Agility Drills)')
@Controller('drills')
export class DrillsController {
  constructor(private readonly drillsService: DrillsService) {}

  @Get()
  @ApiOperation({ summary: 'دریافت فهرست تمرینات چابکی (با فیلتر دسته‌بندی و جستجو)' })
  @ApiQuery({ name: 'categoryIndex', required: false, type: Number, description: 'شماره دسته‌بندی (۱ تا ۱۲)' })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'عبارت جستجو' })
  async getDrills(
    @Query('categoryIndex') categoryIndex?: number,
    @Query('search') search?: string,
  ) {
    return this.drillsService.findAll(categoryIndex ? Number(categoryIndex) : undefined, search);
  }

  @Get('categories')
  @ApiOperation({ summary: 'دریافت فهرست ۱۲ دسته‌بندی اصلی تمرینات چابکی فوتبال' })
  async getCategories() {
    return this.drillsService.getCategories();
  }

  @Get(':id')
  @ApiOperation({ summary: 'دریافت مشخصات یک تمرین با شناسه' })
  async getDrillById(@Param('id') id: string) {
    return this.drillsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'افزودن تمرین چابکی جدید (از پنل ادمین یا مربی)' })
  @ApiResponse({ status: 201, description: 'تمرین با موفقیت ایجاد شد' })
  async createDrill(@Body() dto: CreateDrillDto) {
    return this.drillsService.create(dto);
  }
}
