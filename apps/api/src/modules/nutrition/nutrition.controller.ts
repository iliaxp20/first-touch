import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Query,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiParam, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { NutritionService, LogFoodDto } from './nutrition.service';
import { DailyNutritionTarget, FoodCalorieItem } from './nutrition.data';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles, Role } from '../../common/decorators/roles.decorator';

@ApiTags('سیستم هوشمند تغذیه و کالری‌شمار فوتبال (Nutrition)')
@Controller('nutrition')
export class NutritionController {
  constructor(private readonly nutritionService: NutritionService) {}

  @Get('target')
  @ApiOperation({ summary: 'دریافت اهداف روزانه کالری و درشت‌مغذی‌ها' })
  async getDailyTarget() {
    return this.nutritionService.getDailyTarget();
  }

  @Put('target')
  @ApiOperation({ summary: 'ویرایش کالری هدف و درشت‌مغذی‌ها' })
  @ApiResponse({ status: 200, description: 'هدف تغذیه‌ای به‌روزرسانی شد' })
  async updateDailyTarget(@Body() target: Partial<DailyNutritionTarget>) {
    return this.nutritionService.updateDailyTarget(target);
  }

  @Get('preset-plans')
  @ApiOperation({ summary: 'دریافت لیست برنامه‌های غذایی آماده، رایگان و مربی اختصاصی' })
  async getPresetPlans() {
    return this.nutritionService.getPresetPlans();
  }

  @Post('apply-preset')
  @ApiOperation({ summary: 'اعمال برنامه غذایی روی کارنامه روزانه' })
  @ApiResponse({ status: 200, description: 'برنامه غذایی اعمال شد' })
  async applyPresetPlan(@Body('planId') planId: string, @Body('date') date?: string) {
    return this.nutritionService.applyPresetPlan(planId, date);
  }

  @Post('reset-plan')
  @ApiOperation({ summary: 'حذف یا ریست کردن برنامه غذایی امروز' })
  @ApiResponse({ status: 200, description: 'برنامه غذایی ریست شد' })
  async resetPlan(@Body('date') date?: string) {
    return this.nutritionService.resetPlan(date);
  }

  @Patch('toggle-item/:id')
  @ApiOperation({ summary: 'تغییر وضعیت تیک خوردن وعده در برنامه غذایی' })
  @ApiParam({ name: 'id' })
  @ApiQuery({ name: 'date', required: false })
  @ApiResponse({ status: 200, description: 'وضعیت تغییر یافت' })
  async togglePlannedItem(@Param('id') id: string, @Query('date') date?: string) {
    return this.nutritionService.togglePlannedItem(id, date);
  }

  @Patch('update-count/:id')
  @ApiOperation({ summary: 'ویرایش تعداد وعده یا غذای ثبت شده' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 200, description: 'تعداد به‌روزرسانی شد' })
  async updateItemCount(
    @Param('id') id: string,
    @Body('count') count: number,
    @Body('date') date?: string,
  ) {
    return this.nutritionService.updateItemCount(id, Number(count) || 1, date);
  }

  @Get('daily-log')
  @ApiOperation({ summary: 'دریافت کارنامه واقعی امروز بدون ماک دیتا' })
  @ApiQuery({ name: 'date', required: false })
  async getDailyLog(@Query('date') date?: string) {
    return this.nutritionService.getDailyLog(date);
  }

  @Post('log-food')
  @ApiOperation({ summary: 'ثبت غذای خورده شده' })
  @ApiResponse({ status: 201, description: 'غذا ثبت شد' })
  async logFood(@Body() dto: LogFoodDto) {
    return this.nutritionService.logFood(dto);
  }

  @Delete('log-food/:id')
  @ApiOperation({ summary: 'حذف یک غذای ثبت شده از کارنامه' })
  @ApiParam({ name: 'id' })
  @ApiQuery({ name: 'date', required: false })
  @ApiResponse({ status: 200, description: 'غذا حذف شد' })
  async deleteLoggedFood(@Param('id') id: string, @Query('date') date?: string) {
    return this.nutritionService.deleteLoggedFood(id, date);
  }

  @Get('foods')
  @ApiOperation({ summary: 'بانک مواد غذایی ایرانی' })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'search', required: false })
  async getFoods(
    @Query('category') category?: string,
    @Query('search') search?: string,
  ) {
    return this.nutritionService.getFoodDatabase(category, search);
  }

  @Post('foods')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.COACH, Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'افزودن غذای جدید به بانک (تنها توسط مربی یا ادمین)' })
  @ApiResponse({ status: 201, description: 'غذا افزوده شد' })
  @ApiResponse({ status: 401, description: 'عدم احراز هویت' })
  @ApiResponse({ status: 403, description: 'عدم دسترسی' })
  async addFood(@Body() body: Omit<FoodCalorieItem, 'id'>) {
    return this.nutritionService.addFoodItem(body);
  }
}
