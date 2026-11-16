import { Controller, Post, Put, Get, Delete, Body, Query, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { LoginPasswordDto } from './dto/login-password.dto';
import { AdminLoginDto } from './dto/admin-login.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@ApiTags('احراز هویت (Auth)')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('send-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'ارسال کد OTP به شماره موبایل' })
  @ApiResponse({ status: 200, description: 'کد با موفقیت ارسال شد' })
  async sendOtp(@Body() dto: SendOtpDto) {
    return this.authService.sendOtp(dto);
  }

  @Post('verify-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'تایید کد OTP و ورود به سیستم' })
  @ApiResponse({ status: 200, description: 'ورود موفق' })
  async verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.authService.verifyOtp(dto);
  }

  @Put('profile')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'تکمیل و به‌روزرسانی مشخصات پروفایل کاربر' })
  @ApiResponse({ status: 200, description: 'پروفایل با موفقیت ذخیره شد' })
  async updateProfile(@Body() dto: UpdateProfileDto) {
    return this.authService.updateProfile(dto);
  }

  @Get('profile')
  @ApiOperation({ summary: 'دریافت اطلاعات پرونده و پروفایل کاربر' })
  @ApiResponse({ status: 200, description: 'اطلاعات پروفایل دریافت شد' })
  async getProfile(@Query('phoneNumber') phoneNumber: string) {
    return this.authService.getProfile(phoneNumber);
  }

  @Post('login-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'ورود با نام کاربری و کلمه عبور' })
  @ApiResponse({ status: 200, description: 'ورود موفق' })
  async loginPassword(@Body() dto: LoginPasswordDto) {
    return this.authService.loginWithPassword(dto);
  }

  @Post('admin-login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'احراز هویت امن مدیر ارشد سیستم' })
  @ApiResponse({ status: 200, description: 'ورود موفق ادمین' })
  async adminLogin(@Body() dto: AdminLoginDto) {
    return this.authService.adminLogin(dto);
  }

  @Post('admin/change-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'تغییر رمز عبور پنل مدیریت' })
  async changeAdminPassword(@Body('newPassword') newPassword: string) {
    return this.authService.changeAdminPassword(newPassword);
  }

  @Get('admin/stats')
  @ApiOperation({ summary: 'آمار زنده داشبورد مدیریت و تعداد کاربران' })
  async getAdminStats() {
    return this.authService.getAdminStats();
  }

  @Get('admin/users')
  @ApiOperation({ summary: 'فهرست کاربران ثبت‌نام‌شده سیستم' })
  async getAdminUsers(
    @Query('search') search?: string,
    @Query('role') role?: string,
  ) {
    return this.authService.getAdminUsers(search, role);
  }

  @Delete('admin/users/:phoneNumber')
  @ApiOperation({ summary: 'حذف کاربر توسط مدیر' })
  async deleteUser(@Param('phoneNumber') phoneNumber: string) {
    return this.authService.deleteUser(phoneNumber);
  }

  @Put('admin/users/:phoneNumber/role')
  @ApiOperation({ summary: 'تغییر نقش کاربر توسط مدیر' })
  async updateUserRole(
    @Param('phoneNumber') phoneNumber: string,
    @Body('role') role: string,
  ) {
    return this.authService.updateUserRole(phoneNumber, role);
  }
}
