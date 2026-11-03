import { Controller, Get, Post, Body, Query, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { DrillsService } from './drills.service';
import { CreateDrillDto } from './dto/create-drill.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles, Role } from '../../common/decorators/roles.decorator';

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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.COACH, Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'افزودن تمرین چابکی جدید (تنها مربی یا ادمین با توکن معتبر)' })
  @ApiResponse({ status: 201, description: 'تمرین با موفقیت ایجاد شد' })
  @ApiResponse({ status: 401, description: 'عدم احراز هویت' })
  @ApiResponse({ status: 403, description: 'عدم دسترسی' })
  async createDrill(@Body() dto: CreateDrillDto) {
    return this.drillsService.create(dto);
  }
}
