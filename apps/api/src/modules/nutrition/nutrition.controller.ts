import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { NutritionService } from './nutrition.service';

@ApiTags('سیستم هوشمند تغذیه فوتبال (Nutrition)')
@Controller('nutrition')
export class NutritionController {
  constructor(private readonly nutritionService: NutritionService) {}

  @Get('age-plans')
  @ApiOperation({ summary: 'دریافت برنامه‌های تغذیه بر اساس رده سنی (۷ سال تا بزرگسالان)' })
  async getAgePlans() {
    return this.nutritionService.getAgePlans();
  }

  @Get('goal-plans')
  @ApiOperation({ summary: 'دریافت برنامه‌های تغذیه بر اساس هدف (افزایش وزن، مدیریت وزن)' })
  async getGoalPlans() {
    return this.nutritionService.getGoalPlans();
  }

  @Get('timing')
  @ApiOperation({ summary: 'راهنمای تغذیه قبل، حین و بعد از تمرین فوتبال' })
  async getTiming() {
    return this.nutritionService.getWorkoutTimingGuide();
  }

  @Get('foods')
  @ApiOperation({ summary: 'بانک مواد غذایی ایرانی و جدول کالری تقریبی' })
  @ApiQuery({ name: 'category', required: false, enum: ['نان و غلات', 'پروتئین‌ها', 'لبنیات', 'میوه‌ها', 'مغزها و چربی‌های مفید'] })
  @ApiQuery({ name: 'search', required: false, type: String })
  async getFoods(
    @Query('category') category?: string,
    @Query('search') search?: string,
  ) {
    return this.nutritionService.getFoodDatabase(category, search);
  }

  @Post('foods')
  @ApiOperation({ summary: 'افزودن ماده غذایی جدید به جدول کالری (پنل مدیریت)' })
  async addFood(@Body() body: any) {
    return this.nutritionService.addFoodItem(body);
  }

  @Post('age-plans')
  @ApiOperation({ summary: 'ثبت رژیم غذایی سنی جدید (پنل مدیریت)' })
  async addAgePlan(@Body() body: any) {
    return this.nutritionService.addAgePlan(body);
  }
}
